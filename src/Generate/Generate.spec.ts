import { SpecChart } from "./types";
import { Generate } from "./Generate";
import { Logger } from "./helpers/log";

class MockLogger extends Logger {
  logSpecFilesFound = jest.fn();
  logChartFilesWritten = jest.fn();

  constructor() {
    super(jest.fn());
  }
}

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

  describe("if found no spec files", () => {
    it("throws", async () => {
      const mockLogger = new MockLogger();
      const generate = Generate(async () => [], jest.fn(), mockLogger);

      return expect(
        generate({
          inputFilePatterns: [SPEC_FILE_PATH],
        })
      ).rejects.toEqual(
        new Error(
          `❌ Found no spec files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
        )
      );
    });
  });

  describe("if found at least one spec file", () => {
    it("returns chart file based on spec file", async () => {
      const mockLogger = new MockLogger();
      const generate = Generate(
        async () => [SPEC_FILE_PATH],
        async (path) => {
          return {
            path,
            content: path === SPEC_FILE_PATH ? SPEC_FILE_CONTENT : "",
          };
        },
        mockLogger
      );

      const actualResult = await generate({
        inputFilePatterns: [SPEC_FILE_PATH],
      });

      const expectedResult: SpecChart[] = [
        {
          specFile: {
            path: SPEC_FILE_PATH,
            content: SPEC_FILE_CONTENT,
          },
          chart: `flowchart TD
title["**${SPEC_FILE_PATH}**"]
N0(["math"])
N1["add"]
N0 --> N1
N2(["adds two numbers"])
N1 --> N2`,
        },
      ];

      expect(mockLogger.logSpecFilesFound).toHaveBeenCalledTimes(1);
      expect(mockLogger.logSpecFilesFound).toHaveBeenCalledWith([
        SPEC_FILE_PATH,
      ]);

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
