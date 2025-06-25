import { File } from "../types";
import { Generate } from "./Generate";

describe("Generate", () => {
  const SPEC_FILE_BASE_PATH = "math.spec.ts";
  const SPEC_FILE_FULL_PATH = `src/${SPEC_FILE_BASE_PATH}`;
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
          specFilesGlobPatterns: [SPEC_FILE_FULL_PATH],
          outputDirectoryPath: OUTPUT_DIRECTORY_PATH,
        })
      ).rejects.toEqual(
        new Error(
          `❌ Found no spec files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
        )
      );
    });
  });

  describe("when found at least one spec file", () => {
    it("writes chart file based on spec file", async () => {
      const writeFileMock = jest
        .fn()
        .mockImplementation(
          (file: File): Promise<File> => Promise.resolve(file)
        );

      const generate = Generate(
        async () => [SPEC_FILE_FULL_PATH],
        async (path) => {
          return {
            path,
            content: path === SPEC_FILE_FULL_PATH ? SPEC_FILE_CONTENT : "",
          };
        },
        writeFileMock
      );

      const actualResult = await generate({
        specFilesGlobPatterns: [SPEC_FILE_FULL_PATH],
        outputDirectoryPath: OUTPUT_DIRECTORY_PATH,
      });

      const expectedResult: File[] = [
        {
          path: `${OUTPUT_DIRECTORY_PATH}/${SPEC_FILE_BASE_PATH}.mmd`,
          content: `flowchart TD
title["**${SPEC_FILE_FULL_PATH}**"]
N0(["math"])
N1["add"]
N0 --> N1
N2(["adds two numbers"])
N1 --> N2`,
        },
      ];

      expect(actualResult).toEqual(expectedResult);

      expect(writeFileMock).toHaveBeenCalledTimes(1);
      expect(writeFileMock.mock.calls[0][0]).toEqual(expectedResult[0]);
    });
  });
});
