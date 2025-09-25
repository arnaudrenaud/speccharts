import fsExtra from "fs-extra";
import path from "path";
import {
  generateAndWriteToFiles,
  generateAndWriteToStandardOutput,
} from "./generateLocalFileSystem";

const SPEC_FILES_DIRECTORY = ".tmp.src";
const OUTPUT_DIRECTORY = ".tmp.speccharts";

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(SPEC_FILES_DIRECTORY);
  await fsExtra.remove(OUTPUT_DIRECTORY);
};

jest.mock("../Generate/helpers/log");

describe("generateAndWriteToFiles", () => {
  const SPEC_FILE_NAME_1 = "index.spec.ts";
  const SPEC_FILE_NAME_2 = "index.test.ts";

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
  });

  afterAll(cleanUpLocalFileSystem);

  describe("when outputFilePath is not provided", () => {
    it("writes chart files next to spec files", async () => {
      await generateAndWriteToFiles({
        inputFilePatterns: [
          `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
          `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
        ],
      });

      // Check that files were written
      const chart1Path = `${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_1}.mmd`;
      const chart2Path = `${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_2}.mmd`;

      expect(await fsExtra.pathExists(chart1Path)).toBe(true);
      expect(await fsExtra.pathExists(chart2Path)).toBe(true);

      const chart1Content = (await fsExtra.readFile(chart1Path)).toString();
      expect(chart1Content).toContain(
        `title[\"**${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_1}**\"]`
      );

      const chart2Content = (await fsExtra.readFile(chart2Path)).toString();
      expect(chart2Content).toContain(
        `title[\"**${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_2}**\"]`
      );
    });
  });

  describe("when outputFilePath is provided", () => {
    it("writes single Markdown file", async () => {
      const outputFilePath = ".tmp.output.md";
      await generateAndWriteToFiles({
        inputFilePatterns: [
          `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
          `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
        ],
        singleOutputFilePath: outputFilePath,
      });

      expect(await fsExtra.pathExists(outputFilePath)).toBe(true);
      const content = (await fsExtra.readFile(outputFilePath)).toString();
      expect(content).toContain("# speccharts");
      expect(content).toContain("some test suite");
      expect(content).toContain("some other test suite");
    });
  });
});

describe("generateAndWriteToStandardOutput", () => {
  const SPEC_FILE_NAME_1 = "index.spec.ts";
  const SPEC_FILE_NAME_2 = "index.test.ts";

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
  });

  afterAll(cleanUpLocalFileSystem);

  it("logs Markdown content to stdout", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await generateAndWriteToStandardOutput({
      inputFilePatterns: [
        `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
        `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
      ],
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedContent = consoleSpy.mock.calls[0][0];
    expect(loggedContent).toContain("# speccharts");
    expect(loggedContent).toContain("some test suite");
    expect(loggedContent).toContain("some other test suite");

    consoleSpy.mockRestore();
  });
});
