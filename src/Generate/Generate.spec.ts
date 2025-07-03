import { File } from "./types";
import { Generate } from "./Generate";
import { logTestFilesFound, logChartFilesWritten } from "./helpers/log";

jest.mock("./helpers/log");

describe("Generate", () => {
  const TEST_FILE_BASE_NAME = "math.spec.ts";
  const TEST_FILE_PATH = `src/${TEST_FILE_BASE_NAME}`;
  const TEST_FILE_CONTENT = `
      describe("math", () => {
        describe("add", () => {
          it("adds two numbers", () => {});
        });
      });
    `;

  const OUTPUT_DIRECTORY_PATH = "speccharts";

  describe("if found no test files", () => {
    it("throws", async () => {
      const generate = Generate(async () => [], jest.fn(), jest.fn());

      return expect(
        generate({
          testFilesGlobPatterns: [TEST_FILE_PATH],
          outputDirectoryPath: OUTPUT_DIRECTORY_PATH,
        })
      ).rejects.toEqual(
        new Error(
          `❌ Found no test files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
        )
      );
    });
  });

  describe("if found at least one test file", () => {
    it("writes chart file based on test file", async () => {
      const writeFileMock = jest
        .fn()
        .mockImplementation(
          (file: File): Promise<File> => Promise.resolve(file)
        );

      const generate = Generate(
        async () => [TEST_FILE_PATH],
        async (path) => {
          return {
            path,
            content: path === TEST_FILE_PATH ? TEST_FILE_CONTENT : "",
          };
        },
        writeFileMock
      );

      const actualResult = await generate({
        testFilesGlobPatterns: [TEST_FILE_PATH],
        outputDirectoryPath: OUTPUT_DIRECTORY_PATH,
      });

      const expectedResult: File[] = [
        {
          path: `${OUTPUT_DIRECTORY_PATH}/${TEST_FILE_BASE_NAME}.mmd`,
          content: `flowchart TD
title["**${TEST_FILE_PATH}**"]
N0(["math"])
N1["add"]
N0 --> N1
N2(["adds two numbers"])
N1 --> N2`,
        },
      ];

      expect(logTestFilesFound).toHaveBeenCalledTimes(1);
      expect(logTestFilesFound).toHaveBeenCalledWith([TEST_FILE_PATH]);

      expect(actualResult).toEqual(expectedResult);

      expect(writeFileMock).toHaveBeenCalledTimes(1);
      expect(writeFileMock.mock.calls[0][0]).toEqual(expectedResult[0]);

      expect(logChartFilesWritten).toHaveBeenCalledTimes(1);
      expect(logChartFilesWritten).toHaveBeenCalledWith(expectedResult);
    });
  });
});
