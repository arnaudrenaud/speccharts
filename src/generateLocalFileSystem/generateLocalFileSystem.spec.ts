import fsExtra from "fs-extra";
import path from "path";
import {
  generateAndWriteToFiles,
  generateAndWriteToStandardOutput,
} from "./generateLocalFileSystem";
import { standardOutputLogger } from "./standardOutputLogger";

jest.mock("./standardOutputLogger");

const SPEC_FILES_DIRECTORY = ".tmp.src";
const SINGLE_OUTPUT_FILE = ".tmp.speccharts.md";

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(SPEC_FILES_DIRECTORY);
  await fsExtra.remove(SINGLE_OUTPUT_FILE);
};

describe("generateLocalFileSystem", () => {
  const SPEC_FILE_NAME_1 = "index.spec.ts";
  const SPEC_FILE_NAME_2 = "index.test.ts";

  let logMock: jest.Mock;

  beforeEach(async () => {
    await cleanUpLocalFileSystem();

    await fsExtra.outputFile(
      path.join(SPEC_FILES_DIRECTORY, SPEC_FILE_NAME_1),
      `describe("some test suite", () => {
  it("works", () => {});
});`
    );
    await fsExtra.outputFile(
      path.join(SPEC_FILES_DIRECTORY, SPEC_FILE_NAME_2),
      `describe("some other test suite", () => {
  it("works too", () => {});
});`
    );

    (standardOutputLogger.log as jest.Mock) = jest.fn();
  });

  afterAll(cleanUpLocalFileSystem);

  describe("generateAndWriteToFiles", () => {
    it("writes chart files next to spec files", async () => {
      await generateAndWriteToFiles({
        inputFilePatterns: [
          `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
          `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
        ],
      });

      const chart1Path = `${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_1}.mmd`;
      const chart2Path = `${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_2}.mmd`;

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
          inputFilePatterns: [
            `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
            `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
          ],
          singleOutputFilePath: SINGLE_OUTPUT_FILE,
        });

        expect(await fsExtra.pathExists(SINGLE_OUTPUT_FILE)).toBe(true);
        const fileContent = (
          await fsExtra.readFile(SINGLE_OUTPUT_FILE)
        ).toString();
        expect(fileContent).toContain("spec.ts");
        expect(fileContent).toContain("test.ts");
        expect(fileContent).toContain("some test suite");
        expect(fileContent).toContain("some other test suite");
      });
    });
  });

  describe("generateAndWriteToStandardOutput", () => {
    it("logs single Markdown file content to standard output", async () => {
      await generateAndWriteToStandardOutput({
        inputFilePatterns: [
          `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
          `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
        ],
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
