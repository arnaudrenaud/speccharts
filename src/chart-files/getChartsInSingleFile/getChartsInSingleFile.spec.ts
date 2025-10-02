import path from "path";
import { getChartsInSingleFile } from "./getChartsInSingleFile";
import { GENERATED_BY_SPECCHARTS_LABEL } from "../constants";

describe("getChartsInSingleFile", () => {
  it("gathers charts in single Markdown file", () => {
    const SPEC_FILES_DIRECTORY = "src";
    const charts = [
      {
        specFile: {
          path: path.join(SPEC_FILES_DIRECTORY, "specFile1.ts"),
          content: "specFile1",
        },
        chart: "flowchart TD\nfirst chart…",
      },
      {
        specFile: {
          path: path.join(SPEC_FILES_DIRECTORY, "specFile2.ts"),
          content: "specFile2",
        },
        chart: "flowchart TD\nsecond chart…",
      },
    ];
    const result = getChartsInSingleFile(charts, "");
    expect(result).toEqual(`# speccharts

Jump to chart for each spec file:

<pre>└── src/<br />    ├── <a href="#src-specFile1ts">specFile1.ts</a><br />    └── <a href="#src-specFile2ts">specFile2.ts</a><br /></pre>

---

Spec file: <a id="src-specFile1ts"></a><a href="src/specFile1.ts">src/specFile1.ts</a>

\`\`\`mermaid
flowchart TD
first chart…
\`\`\`

---

Spec file: <a id="src-specFile2ts"></a><a href="src/specFile2.ts">src/specFile2.ts</a>

\`\`\`mermaid
flowchart TD
second chart…
\`\`\`

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`);
  });

  it("converts absolute paths to relative paths", () => {
    const SPEC_FILES_DIRECTORY_ABSOLUTE_DIRECTORY = "/my-repo/src";
    const OUTPUT_DIRECTORY_ABSOLUTE_DIRECTORY = "/my-repo";
    const charts = [
      {
        specFile: {
          path: path.join(
            SPEC_FILES_DIRECTORY_ABSOLUTE_DIRECTORY,
            "specFile.ts"
          ),
          content: "specFile",
        },
        chart: "flowchart TD\nfirst chart…",
      },
    ];

    const result = getChartsInSingleFile(
      charts,
      OUTPUT_DIRECTORY_ABSOLUTE_DIRECTORY
    );

    expect(result).toContain(
      `<pre>└── src/<br />    └── <a href="#src-specFilets">specFile.ts</a><br /></pre>`
    );
    expect(result).toContain(
      `<a id=\"src-specFilets\"></a><a href=\"src/specFile.ts\">src/specFile.ts</a>`
    );
  });
});
