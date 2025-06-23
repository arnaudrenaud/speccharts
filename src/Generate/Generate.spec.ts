import { File } from "../types";
import Generate from "./Generate";

describe("Generate", () => {
  it("writes chart file based on spec file", async () => {
    const SPEC_FILE_BASE_PATH = "math.spec.ts";
    const SPEC_FILE_FULL_PATH = `src/${SPEC_FILE_BASE_PATH}`;
    const SPEC_FILE_CONTENT = `
      describe("math", () => {
        describe("add", () => {
          it("adds two numbers", () => {});
        });
      });
    `;

    const writeFileMock = jest.fn();

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

    const expectedResult: File = {
      path: `${SPEC_FILE_BASE_PATH}.mmd`,
      content: `flowchart TD
title["**${SPEC_FILE_FULL_PATH}**"]
N0(["math"])
N1["add"]
N0 --> N1
N2(["adds two numbers"])
N1 --> N2`,
    };

    const actualResult = await generate({
      specFilePatterns: [SPEC_FILE_FULL_PATH],
    });

    expect(actualResult).toEqual(expectedResult);

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock.mock.calls[0][0]).toMatchObject(expectedResult);
  });
});
