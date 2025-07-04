import fsExtra from "fs-extra";
import path from "path";
import { generateLocalFileSystem } from "./generateLocalFileSystem";

const TEST_FILES_DIRECTORY = ".tmp.src";
const OUTPUT_DIRECTORY = ".tmp.speccharts";

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(TEST_FILES_DIRECTORY);
  await fsExtra.remove(OUTPUT_DIRECTORY);
};

jest.mock("./helpers/log");

describe("generateLocalFileSystem", () => {
  const TEST_FILE_NAME_1 = "index.spec.ts";
  const TEST_FILE_NAME_2 = "index.test.ts";

  beforeEach(async () => {
    await cleanUpLocalFileSystem();

    await fsExtra.outputFile(
      path.join(TEST_FILES_DIRECTORY, TEST_FILE_NAME_1),
      `describe("some test suite", () => {
  it("works", () => {});
});`
    );
    await fsExtra.outputFile(
      path.join(TEST_FILES_DIRECTORY, TEST_FILE_NAME_2),
      `describe("some other test suite", () => {
  it("works too", () => {});
});`
    );
  });

  afterAll(cleanUpLocalFileSystem);

  it("reads test files from glob pattern, writes chart files to output directory", async () => {
    await generateLocalFileSystem({
      testFilesGlobPatterns: [
        `${TEST_FILES_DIRECTORY}/**/*.spec.ts`,
        `${TEST_FILES_DIRECTORY}/**/*.test.ts`,
      ],
      outputDirectoryPath: OUTPUT_DIRECTORY,
    });

    const filesInOutputDirectory = await fsExtra.readdir(OUTPUT_DIRECTORY);
    expect(filesInOutputDirectory).toHaveLength(2);

    const chart1FileName = filesInOutputDirectory[0];
    expect(chart1FileName).toEqual(`${TEST_FILE_NAME_1}.mmd`);

    const chart1FileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chart1FileName))
    ).toString();
    expect(chart1FileContent).toEqual(`flowchart TD
title[\"**${TEST_FILES_DIRECTORY}/${TEST_FILE_NAME_1}**\"]
N0([\"some test suite\"])
N1([\"works\"])
N0 --> N1`);

    const chart2FileName = filesInOutputDirectory[1];
    expect(chart2FileName).toEqual(`${TEST_FILE_NAME_2}.mmd`);

    const chart2FileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chart2FileName))
    ).toString();
    expect(chart2FileContent).toEqual(`flowchart TD
title[\"**${TEST_FILES_DIRECTORY}/${TEST_FILE_NAME_2}**\"]
N0([\"some other test suite\"])
N1([\"works too\"])
N0 --> N1`);
  });
});
