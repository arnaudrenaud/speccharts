import fsExtra from "fs-extra";
import path from "path";
import {
  generateAndWriteToFiles,
  generateAndWriteToStandardOutput,
} from "./generateLocalFileSystem";
import { standardOutputLogger } from "./helpers/standardOutputLogger";
import { getCurrentDirectory } from "./helpers/getCurrentDirectory";
import { GENERATED_BY_SPECCHARTS_LABEL } from "../chart-files/constants";

jest.mock("./helpers/standardOutputLogger");
jest.mock("./helpers/getCurrentDirectory");

const SPEC_FILES_DIRECTORY = "src";

const INPUT_FILE_PATTERNS = [
  `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
  `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
];

const TEST_TMP_ROOT_DIR = path.join(__dirname, ".tmp.local-fs-tests");
const SPEC_FILES_DIRECTORY_FULL_PATH = path.join(
  TEST_TMP_ROOT_DIR,
  SPEC_FILES_DIRECTORY
);
const SINGLE_OUTPUT_FILE = path.join(TEST_TMP_ROOT_DIR, "speccharts.md");

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(TEST_TMP_ROOT_DIR);
};

describe("generateLocalFileSystem (integration tests)", () => {
  const SPEC_FILE_NAME_1 = "index.spec.ts";
  const SPEC_FILE_NAME_2 = "index.test.ts";

  beforeEach(async () => {
    // Avoid deleting actual spec chart files
    (getCurrentDirectory as jest.Mock).mockReturnValue(TEST_TMP_ROOT_DIR);

    await cleanUpLocalFileSystem();

    await fsExtra.outputFile(
      path.join(SPEC_FILES_DIRECTORY_FULL_PATH, SPEC_FILE_NAME_1),
      `describe("some test suite", () => {
  it("works", () => {});
});`
    );
    await fsExtra.outputFile(
      path.join(SPEC_FILES_DIRECTORY_FULL_PATH, SPEC_FILE_NAME_2),
      `describe("some other test suite", () => {
  it("works too", () => {});
});`
    );

    (standardOutputLogger.log as jest.Mock) = jest.fn();
  });

  afterAll(async () => {
    await cleanUpLocalFileSystem();
  });

  describe("generateAndWriteToFiles", () => {
    it("writes chart files next to spec files", async () => {
      await generateAndWriteToFiles({
        inputFilePatterns: INPUT_FILE_PATTERNS,
      });

      const chart1Path = path.join(
        TEST_TMP_ROOT_DIR,
        "src",
        `${SPEC_FILE_NAME_1}.mmd`
      );
      const chart2Path = path.join(
        TEST_TMP_ROOT_DIR,
        "src",
        `${SPEC_FILE_NAME_2}.mmd`
      );

      expect(await fsExtra.pathExists(chart1Path)).toBe(true);
      expect(await fsExtra.pathExists(chart2Path)).toBe(true);

      const chart1Content = (await fsExtra.readFile(chart1Path)).toString();
      expect(chart1Content).toContain(`some test suite`);

      const chart2Content = (await fsExtra.readFile(chart2Path)).toString();
      expect(chart2Content).toContain(`some other test suite`);
    });

    describe("when `singleOutputFilePath` is provided", () => {
      it("writes single Markdown file", async () => {
        await generateAndWriteToFiles({
          inputFilePatterns: INPUT_FILE_PATTERNS,
          singleOutputFilePath: SINGLE_OUTPUT_FILE,
        });

        const singleOutputPath = path.join(TEST_TMP_ROOT_DIR, "speccharts.md");
        expect(await fsExtra.pathExists(singleOutputPath)).toBe(true);
        const fileContent = (
          await fsExtra.readFile(singleOutputPath)
        ).toString();

        expect(fileContent).toContain("spec.ts");
        expect(fileContent).toContain("test.ts");
        expect(fileContent).toContain("some test suite");
        expect(fileContent).toContain("some other test suite");
      });
    });

    describe("when `deleteExistingCharts` is true", () => {
      it("deletes existing single output chart file", async () => {
        await fsExtra.outputFile(
          SINGLE_OUTPUT_FILE,
          `# existing charts\n<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->\n`
        );

        await generateAndWriteToFiles({
          inputFilePatterns: INPUT_FILE_PATTERNS,
          deleteExistingCharts: true,
        });

        expect(await fsExtra.pathExists(SINGLE_OUTPUT_FILE)).toBe(false);
      });

      it("deletes existing multiple output chart files", async () => {
        const staleChartPath = path.join(
          TEST_TMP_ROOT_DIR,
          "src",
          "stale-chart.mmd"
        );

        await fsExtra.outputFile(
          staleChartPath,
          `graph TD;\n%% ${GENERATED_BY_SPECCHARTS_LABEL}\n`
        );

        await generateAndWriteToFiles({
          inputFilePatterns: [`src/index.spec.ts`, `src/index.test.ts`],
          deleteExistingCharts: true,
        });

        expect(await fsExtra.pathExists(staleChartPath)).toBe(false);
      });

      it("does not delete files with extension other than .md or .mmd even when they contain the generated label", async () => {
        const textFilePath = path.join(
          TEST_TMP_ROOT_DIR,
          "src",
          "stale-chart.txt"
        );

        await fsExtra.outputFile(
          textFilePath,
          `graph TD;\n%% ${GENERATED_BY_SPECCHARTS_LABEL}\n`
        );

        await generateAndWriteToFiles({
          inputFilePatterns: INPUT_FILE_PATTERNS,
          deleteExistingCharts: true,
        });

        expect(await fsExtra.pathExists(textFilePath)).toBe(true);
      });
    });
  });

  describe("generateAndWriteToStandardOutput", () => {
    it("logs single Markdown file content to standard output", async () => {
      await generateAndWriteToStandardOutput({
        inputFilePatterns: INPUT_FILE_PATTERNS,
      });

      expect(standardOutputLogger.log).toHaveBeenCalledTimes(1);
      const logArgument = (standardOutputLogger.log as jest.Mock).mock
        .lastCall[0];
      expect(logArgument).toContain("spec.ts");
      expect(logArgument).toContain("test.ts");
      expect(logArgument).toContain("some test suite");
      expect(logArgument).toContain("some other test suite");
    });
  });
});
