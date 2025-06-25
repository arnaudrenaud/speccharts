import fsExtra from "fs-extra";
import path from "path";
import { generateLocalFileSystem } from "./generateLocalFileSystem";

const TEST_FILES_DIRECTORY = ".tmp.src";
const OUTPUT_DIRECTORY = ".tmp.speccharts";

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(TEST_FILES_DIRECTORY);
  await fsExtra.remove(OUTPUT_DIRECTORY);
};

describe("generateLocalFileSystem", () => {
  const testFile1 = "index1.spec.ts";
  const testFile2 = "index2.spec.ts";

  beforeEach(async () => {
    await cleanUpLocalFileSystem();

    await fsExtra.outputFile(
      path.join(TEST_FILES_DIRECTORY, testFile1),
      `describe("index 1", () => {
  it("works", () => {});
});`
    );
    await fsExtra.outputFile(
      path.join(TEST_FILES_DIRECTORY, testFile2),
      `describe("index 2", () => {
  it("works too", () => {});
});`
    );
  });

  afterAll(cleanUpLocalFileSystem);

  it("reads test files from glob pattern, writes chart files to output directory", async () => {
    await generateLocalFileSystem({
      testFilesGlobPatterns: [`${TEST_FILES_DIRECTORY}/**/*.spec.ts`],
      outputDirectoryPath: OUTPUT_DIRECTORY,
    });

    const filesInOutputDirectory = await fsExtra.readdir(OUTPUT_DIRECTORY);
    expect(filesInOutputDirectory).toHaveLength(2);

    const chart1FileName = filesInOutputDirectory[0];
    expect(chart1FileName).toEqual("index1.spec.ts.mmd");

    const chart1FileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chart1FileName))
    ).toString();
    expect(chart1FileContent).toEqual(`flowchart TD
title[\"**${TEST_FILES_DIRECTORY}/index1.spec.ts**\"]
N0([\"index 1\"])
N1([\"works\"])
N0 --> N1`);

    const chart2FileName = filesInOutputDirectory[1];
    expect(chart2FileName).toEqual("index2.spec.ts.mmd");

    const chart2FileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chart2FileName))
    ).toString();
    expect(chart2FileContent).toEqual(`flowchart TD
title[\"**${TEST_FILES_DIRECTORY}/index2.spec.ts**\"]
N0([\"index 2\"])
N1([\"works too\"])
N0 --> N1`);
  });
});
