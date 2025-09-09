import fsExtra from "fs-extra";
import path from "path";
import { generateLocalFileSystem } from "./generateLocalFileSystem";
import { GENERATED_BY_SPECCHARTS_LABEL } from "./helpers/constants";

const SPEC_FILES_DIRECTORY = ".tmp.src";
const OUTPUT_DIRECTORY = ".tmp.speccharts";

const cleanUpLocalFileSystem = async () => {
  await fsExtra.remove(SPEC_FILES_DIRECTORY);
  await fsExtra.remove(OUTPUT_DIRECTORY);
};

jest.mock("./helpers/log");

describe("generateLocalFileSystem", () => {
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

  it("reads spec files from glob pattern, writes chart files to output directory", async () => {
    await generateLocalFileSystem({
      inputFilePatterns: [
        `${SPEC_FILES_DIRECTORY}/**/*.spec.ts`,
        `${SPEC_FILES_DIRECTORY}/**/*.test.ts`,
      ],
      outputDirectoryPath: OUTPUT_DIRECTORY,
      singleOutputFile: false,
    });

    const filesInOutputDirectory = await fsExtra.readdir(OUTPUT_DIRECTORY);
    expect(filesInOutputDirectory).toHaveLength(2);

    const chart1FileName = filesInOutputDirectory[0];
    expect(chart1FileName).toEqual(`${SPEC_FILE_NAME_1}.mmd`);

    const chart1FileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chart1FileName))
    ).toString();
    expect(chart1FileContent).toEqual(`flowchart TD
title[\"**${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_1}**\"]
N0([\"some test suite\"])
N1([\"works\"])
N0 --> N1

%% ${GENERATED_BY_SPECCHARTS_LABEL}
`);

    const chart2FileName = filesInOutputDirectory[1];
    expect(chart2FileName).toEqual(`${SPEC_FILE_NAME_2}.mmd`);

    const chart2FileContent = (
      await fsExtra.readFile(path.join(OUTPUT_DIRECTORY, chart2FileName))
    ).toString();
    expect(chart2FileContent).toEqual(`flowchart TD
title[\"**${SPEC_FILES_DIRECTORY}/${SPEC_FILE_NAME_2}**\"]
N0([\"some other test suite\"])
N1([\"works too\"])
N0 --> N1

%% ${GENERATED_BY_SPECCHARTS_LABEL}
`);
  });
});
