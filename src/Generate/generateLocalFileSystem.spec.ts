import fsExtra from "fs-extra";
import path from "path";
import { generateLocalFileSystem } from "./generateLocalFileSystem";

const SPEC_FILES_DIRECTORY = ".test.local-file-system.src";
const OUTPUT_DIRECTORY = ".test.slocal-file-system.speccharts";

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(SPEC_FILES_DIRECTORY);
  await fsExtra.remove(OUTPUT_DIRECTORY);
};

describe("generateLocalFileSystem", () => {
  const specFile1 = "index1.spec.ts";
  const specFile2 = "index2.spec.ts";

  beforeEach(async () => {
    await cleanUpLocalFileSystem();

    await fsExtra.outputFile(
      path.join(SPEC_FILES_DIRECTORY, specFile1),
      `describe("index 1", () => {
  it("works", () => {});
});`
    );
    await fsExtra.outputFile(
      path.join(SPEC_FILES_DIRECTORY, specFile2),
      `describe("index 2", () => {
  it("works too", () => {});
});`
    );
  });

  afterAll(cleanUpLocalFileSystem);

  it("reads spec files from glob pattern, writes chart files to output directory", async () => {
    await generateLocalFileSystem({
      specFilesGlobPatterns: [`${SPEC_FILES_DIRECTORY}/**/*.spec.ts`],
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
title[\"**.test.local-file-system.src/index1.spec.ts**\"]
N0([\"index 1\"])
N1([\"works\"])
N0 --> N1`);

    const chart2FileName = filesInOutputDirectory[1];
    expect(chart2FileName).toEqual("index2.spec.ts.mmd");

    const chart2FileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chart2FileName))
    ).toString();
    expect(chart2FileContent).toEqual(`flowchart TD
title[\"**.test.local-file-system.src/index2.spec.ts**\"]
N0([\"index 2\"])
N1([\"works too\"])
N0 --> N1`);
  });
});
