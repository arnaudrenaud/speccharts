# speccharts

Jump to chart for each spec file:

<pre>└── src/<br />    ├── SpecChartsGenerator/<br />    │   ├── <a href="#src-SpecChartsGenerator-SpecChartsGeneratorspects">SpecChartsGenerator.spec.ts</a><br />    │   └── core/<br />    │       ├── getChart/<br />    │       │   └── <a href="#src-SpecChartsGenerator-core-getChart-getChartspects">getChart.spec.ts</a><br />    │       └── getSpecTree/<br />    │           └── <a href="#src-SpecChartsGenerator-core-getSpecTree-getSpecTreespects">getSpecTree.spec.ts</a><br />    ├── generateLocalFileSystem/<br />    │   └── <a href="#src-generateLocalFileSystem-generateLocalFileSystemintegspects">generateLocalFileSystem.integ.spec.ts</a><br />    ├── cli/<br />    │   └── integ.spec/<br />    │       └── <a href="#src-cli-integspec-cliintegspects">cli.integ.spec.ts</a><br />    └── chart-files/<br />        ├── getChartFiles/<br />        │   └── <a href="#src-chart-files-getChartFiles-getChartFilesspects">getChartFiles.spec.ts</a><br />        └── getChartsInSingleFile/<br />            └── <a href="#src-chart-files-getChartsInSingleFile-getChartsInSingleFilespects">getChartsInSingleFile.spec.ts</a><br /></pre>

---

Spec file: <a id="src-SpecChartsGenerator-SpecChartsGeneratorspects"></a><a href="src/SpecChartsGenerator/SpecChartsGenerator.spec.ts">src/SpecChartsGenerator/SpecChartsGenerator.spec.ts</a>

```mermaid
flowchart TD
N0(["SpecChartsGenerator"])
N1["if found no spec files"]
N0 --> N1
N2(["throws"])
N1 --> N2
N3["if found at least one spec file"]
N0 --> N3
N4(["returns chart files based on spec files"])
N3 --> N4
```

---

Spec file: <a id="src-generateLocalFileSystem-generateLocalFileSystemintegspects"></a><a href="src/generateLocalFileSystem/generateLocalFileSystem.integ.spec.ts">src/generateLocalFileSystem/generateLocalFileSystem.integ.spec.ts</a>

```mermaid
flowchart TD
N0(["generateLocalFileSystem (integration tests)"])
N1["generateAndWriteToFiles"]
N0 --> N1
N2(["writes chart files next to spec files"])
N1 --> N2
N3["when \`singleOutputFilePath\` is provided"]
N1 --> N3
N4(["writes single Markdown file"])
N3 --> N4
N5["when \`deleteExistingCharts\` is true"]
N1 --> N5
N6(["deletes existing single output chart file"])
N5 --> N6
N7(["deletes existing multiple output chart files"])
N5 --> N7
N8(["does not delete files with extension other than .md or .mmd even when they contain the generated label"])
N5 --> N8
N9["generateAndWriteToStandardOutput"]
N0 --> N9
N10(["logs single Markdown file content to standard output"])
N9 --> N10
```

---

Spec file: <a id="src-cli-integspec-cliintegspects"></a><a href="src/cli/integ.spec/cli.integ.spec.ts">src/cli/integ.spec/cli.integ.spec.ts</a>

```mermaid
flowchart TD
N0(["speccharts CLI (integration tests)"])
N1["when passed \`--single-output-file\`"]
N0 --> N1
N2(["writes a single Markdown file with all charts"])
N1 --> N2
N3["when passed \`--multiple-output-files\`"]
N0 --> N3
N4(["writes Mermaid files next to spec files and prints command header"])
N3 --> N4
N5["when passed \`--multiple-output-files\` and \`--delete-existing-charts\`"]
N0 --> N5
N6(["removes existing chart files before writing new ones"])
N5 --> N6
N7["when passed both \`--single-output-file\` and \`--multiple-output-files\`"]
N0 --> N7
N8(["exits with an error without writing files"])
N7 --> N8
N9["when passed no output flag"]
N0 --> N9
N10(["prints a single Markdown document to stdout"])
N9 --> N10
N11["when passed \`--delete-existing-charts\` without an output flag"]
N0 --> N11
N12(["exits with an error"])
N11 --> N12
```

---

Spec file: <a id="src-chart-files-getChartFiles-getChartFilesspects"></a><a href="src/chart-files/getChartFiles/getChartFiles.spec.ts">src/chart-files/getChartFiles/getChartFiles.spec.ts</a>

```mermaid
flowchart TD
N0(["getChartFiles"])
N1(["returns one Mermaid file per chart next to corresponding spec file"])
N0 --> N1
N2["if \`singleOutputFilePath\` is provided"]
N0 --> N2
N3(["returns one Markdown file gathering all charts at the specified path"])
N2 --> N3
```

---

Spec file: <a id="src-chart-files-getChartsInSingleFile-getChartsInSingleFilespects"></a><a href="src/chart-files/getChartsInSingleFile/getChartsInSingleFile.spec.ts">src/chart-files/getChartsInSingleFile/getChartsInSingleFile.spec.ts</a>

```mermaid
flowchart TD
N0(["getChartsInSingleFile"])
N1(["gathers charts in single Markdown file"])
N0 --> N1
```

---

Spec file: <a id="src-SpecChartsGenerator-core-getChart-getChartspects"></a><a href="src/SpecChartsGenerator/core/getChart/getChart.spec.ts">src/SpecChartsGenerator/core/getChart/getChart.spec.ts</a>

```mermaid
flowchart TD
N0(["getChart"])
N1(["returns a Mermaid flowchart with stadium-shaped node for root and leaves, rectangle node for cases, edge between each case and its children"])
N0 --> N1
N2["if spec tree contains nodes with type \`question\`, \`answer\`"]
N0 --> N2
N3(["returns a Mermaid flowchart with rhombus-shaped node for question, answer as edge label instead of node"])
N2 --> N3
N4["if spec tree contains nodes with type \`table\`"]
N0 --> N4
N5(["returns a Mermaid flowchart with table node rendered as leaf containing formatted table data"])
N4 --> N5
```

---

Spec file: <a id="src-SpecChartsGenerator-core-getSpecTree-getSpecTreespects"></a><a href="src/SpecChartsGenerator/core/getSpecTree/getSpecTree.spec.ts">src/SpecChartsGenerator/core/getSpecTree/getSpecTree.spec.ts</a>

```mermaid
flowchart TD
N0(["getSpecTree"])
N1(["returns a spec tree"])
N0 --> N1
N2["if case node label ends with a question mark"]
N0 --> N2
N3(["returns case node with type \`question\`, children with type \`answer\`"])
N2 --> N3
N4["Jest table syntax"]
N0 --> N4
N5(["parses test.each with array table data"])
N4 --> N5
N6(["parses describe.each with mixed data types"])
N4 --> N6
N7(["parses it.each with single values"])
N4 --> N7
N8(["parses nested describe.each within regular describe"])
N4 --> N8
```

<!-- ✴ Generated by speccharts v0.3.1 ✴ https://github.com/arnaudrenaud/speccharts -->
