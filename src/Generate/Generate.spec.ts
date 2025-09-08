import { File } from "./types";
import { Generate } from "./Generate";
import { logSpecFilesFound, logChartFilesWritten } from "./helpers/log";

jest.mock("./helpers/log");

describe("Generate", () => {
  const SPEC_FILE_BASE_NAME = "math.spec.ts";
  const SPEC_FILE_PATH = `src/${SPEC_FILE_BASE_NAME}`;
  const SPEC_FILE_CONTENT = `
      describe("math", () => {
        describe("add", () => {
          it("adds two numbers", () => {});
        });
      });
    `;

  const OUTPUT_DIRECTORY_PATH = "speccharts";

  describe("if found no spec files", () => {
    it("throws", async () => {
      const generate = Generate(async () => [], jest.fn(), jest.fn());

      return expect(
        generate({
          inputFilePatterns: [SPEC_FILE_PATH],
          outputDirectoryPath: OUTPUT_DIRECTORY_PATH,
          singleOutputFile: false,
        })
      ).rejects.toEqual(
        new Error(
          `❌ Found no spec files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
        )
      );
    });
  });

  describe("if found at least one spec file", () => {
    it("writes chart file based on spec file", async () => {
      const writeFileMock = jest
        .fn()
        .mockImplementation(
          (file: File): Promise<File> => Promise.resolve(file)
        );

      const generate = Generate(
        async () => [SPEC_FILE_PATH],
        async (path) => {
          return {
            path,
            content: path === SPEC_FILE_PATH ? SPEC_FILE_CONTENT : "",
          };
        },
        writeFileMock
      );

      const actualResult = await generate({
        inputFilePatterns: [SPEC_FILE_PATH],
        outputDirectoryPath: OUTPUT_DIRECTORY_PATH,
        singleOutputFile: false,
      });

      const expectedResult: File[] = [
        {
          path: `${OUTPUT_DIRECTORY_PATH}/${SPEC_FILE_BASE_NAME}.mmd`,
          content: `flowchart TD
title["**${SPEC_FILE_PATH}**"]
N0(["math"])
N1["add"]
N0 --> N1
N2(["adds two numbers"])
N1 --> N2`,
        },
      ];

      expect(logSpecFilesFound).toHaveBeenCalledTimes(1);
      expect(logSpecFilesFound).toHaveBeenCalledWith([SPEC_FILE_PATH]);

      expect(actualResult).toEqual(expectedResult);

      expect(writeFileMock).toHaveBeenCalledTimes(1);
      expect(writeFileMock.mock.calls[0][0]).toEqual(expectedResult[0]);

      expect(logChartFilesWritten).toHaveBeenCalledTimes(1);
      expect(logChartFilesWritten).toHaveBeenCalledWith(expectedResult);
    });
  });
});
