import { FileWithContent } from "../types";
import Generate from "./Generate";

describe("Generate", () => {
  it("writes chart file based on spec file", async () => {
    const SPEC_FILE_NAME = "math.spec.ts";
    const SPEC_FILE_CONTENT = `
      describe("math", () => {
        describe("add", () => {
          it("adds two numbers", () => {});
        });
      });
    `;

    const writeFileMock = jest.fn();

    const generate = Generate(
      async () => [SPEC_FILE_NAME],
      async (path) => {
        return {
          path,
          content: path === SPEC_FILE_NAME ? SPEC_FILE_CONTENT : "",
        };
      },
      writeFileMock
    );

    await generate({
      specFilePatterns: [SPEC_FILE_NAME],
    });

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledWith({
      path: `${SPEC_FILE_NAME}.mmd`,
      content: `flowchart TD
title["**src/math.spec.ts**"]
N0(["math"])
N1["add"]
N0 --> N1
N2(["adds two numbers"])
N1 --> N2
`,
    } as FileWithContent);
  });
});
