import fsExtra from "fs-extra";
import path from "path";
import { generateLocalFileSystem } from "./generateLocalFileSystem";

const SPEC_FILES_DIRECTORY = ".test.local-file-system.src";
const OUTPUT_DIRECTORY = ".test.slocal-file-system.peccharts";

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(SPEC_FILES_DIRECTORY);
  await fsExtra.remove(OUTPUT_DIRECTORY);
};

describe("generateLocalFileSystem", () => {
  beforeEach(async () => {
    await cleanUpLocalFileSystem();

    await fsExtra.outputFile(
      path.join(SPEC_FILES_DIRECTORY, "index.spec.ts"),
      `describe("index", () => {
  it("works", () => {});
});`
    );
  });

  afterAll(cleanUpLocalFileSystem);

  it("reads spec files from glob pattern, writes chart files to output directory", async () => {
    await generateLocalFileSystem({
      specFilesPathPatterns: [`${SPEC_FILES_DIRECTORY}/**/*.spec.ts`],
      outputDirectoryPath: OUTPUT_DIRECTORY,
    });

    const filesInOutputDirectory = await fsExtra.readdir(OUTPUT_DIRECTORY);
    expect(filesInOutputDirectory).toHaveLength(1);

    const chartFileName = filesInOutputDirectory[0];
    expect(chartFileName).toEqual("index.spec.ts.mmd");

    const chartFileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chartFileName))
    ).toString();
    expect(chartFileContent).toEqual(`flowchart TD
title[\"**.test.local-file-system.src/index.spec.ts**\"]
N0([\"index\"])
N1([\"works\"])
N0 --> N1`);
  });
});
