import { gatherChartsInMarkdown } from "./gatherChartsInMarkdown";
import { GENERATED_BY_SPECCHARTS_LABEL } from "./constants";

describe("gatherChartsInMarkdown", () => {
  it("gathers charts in Markdown", () => {
    const charts = [
      {
        specFile: { path: "specFile1.ts", content: "specFile1" },
        chart: "flowchart TD\nfirst chart…",
      },
      {
        specFile: { path: "specFile2.ts", content: "specFile2" },
        chart: "flowchart TD\nsecond chart…",
      },
    ];
    const result = gatherChartsInMarkdown(charts);
    expect(result).toEqual(`# speccharts

Jump to chart for spec file:
<pre><code>├── <a href="#specFile1ts">specFile1.ts</a><br />└── <a href="#specFile2ts">specFile2.ts</a><br /></code></pre>

<a id="specFile1ts"></a><a href="specFile1.ts">specFile1.ts</a>

\`\`\`mermaid
flowchart TD
first chart…
\`\`\`

---

<a id="specFile2ts"></a><a href="specFile2.ts">specFile2.ts</a>

\`\`\`mermaid
flowchart TD
second chart…
\`\`\`

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`);
  });
});
