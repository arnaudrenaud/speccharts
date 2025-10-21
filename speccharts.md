# speccharts

Jump to chart for each spec file:

<pre>└── src/<br />    ├── SpecChartsGenerator/<br />    │   ├── <a href="#src-SpecChartsGenerator-SpecChartsGeneratorspects">SpecChartsGenerator.spec.ts</a><br />    │   ├── core/<br />    │   │   ├── getChart/<br />    │   │   │   └── <a href="#src-SpecChartsGenerator-core-getChart-getChartspects">getChart.spec.ts</a><br />    │   │   └── getSpecTree/<br />    │   │       ├── <a href="#src-SpecChartsGenerator-core-getSpecTree-getSpecTreespects">getSpecTree.spec.ts</a><br />    │   │       └── <a href="#src-SpecChartsGenerator-core-getSpecTree-getTableSyntaxSpecTreespects">getTableSyntaxSpecTree.spec.ts</a><br />    │   └── helpers/<br />    │       └── <a href="#src-SpecChartsGenerator-helpers-logspects">log.spec.ts</a><br />    ├── chart-files/<br />    │   ├── getChartFiles/<br />    │   │   └── <a href="#src-chart-files-getChartFiles-getChartFilesspects">getChartFiles.spec.ts</a><br />    │   └── getChartsInSingleFile/<br />    │       └── <a href="#src-chart-files-getChartsInSingleFile-getChartsInSingleFilespects">getChartsInSingleFile.spec.ts</a><br />    ├── cli/<br />    │   └── integ.spec/<br />    │       └── <a href="#src-cli-integspec-cliintegspects">cli.integ.spec.ts</a><br />    └── generateLocalFileSystem/<br />        └── <a href="#src-generateLocalFileSystem-generateLocalFileSystemintegspects">generateLocalFileSystem.integ.spec.ts</a><br /></pre>

---

Spec file: <a id="src-SpecChartsGenerator-SpecChartsGeneratorspects" href="src/SpecChartsGenerator/SpecChartsGenerator.spec.ts">src/SpecChartsGenerator/SpecChartsGenerator.spec.ts</a>

```mermaid
flowchart TD
N0(["SpecChartsGenerator"])
N1["if found no spec files"]
N0 --> N1
N2(["throws"])
N1 --> N2
N3["if found at least one spec file"]
N0 --> N3
N4(["returns charts based on spec files, alphabetically sorted by spec file path"])
N3 --> N4
```

---

Spec file: <a id="src-SpecChartsGenerator-core-getChart-getChartspects" href="src/SpecChartsGenerator/core/getChart/getChart.spec.ts">src/SpecChartsGenerator/core/getChart/getChart.spec.ts</a>

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
N5(["returns a Mermaid flowchart with table node rendered as round-corner rectangle leaf containing formatted table data"])
N4 --> N5
N6["if spec tree has multiple root-level nodes with type \`case\`"]
N0 --> N6
N7(["returns a multiple-flowchart Mermaid document, one for each root-level case"])
N6 --> N7
```

---

Spec file: <a id="src-SpecChartsGenerator-core-getSpecTree-getSpecTreespects" href="src/SpecChartsGenerator/core/getSpecTree/getSpecTree.spec.ts">src/SpecChartsGenerator/core/getSpecTree/getSpecTree.spec.ts</a>

```mermaid
flowchart TD
N0(["getSpecTree"])
N1(["returns a spec tree"])
N0 --> N1
N2["if case node label ends with a question mark"]
N0 --> N2
N3(["returns case node with type \`question\`, children with type \`answer\`"])
N2 --> N3
N4["if spec has more than one \`describe\` block at root-level"]
N0 --> N4
N5(["returns a spec tree made of the same number of spec trees"])
N4 --> N5
```

---

Spec file: <a id="src-SpecChartsGenerator-core-getSpecTree-getTableSyntaxSpecTreespects" href="src/SpecChartsGenerator/core/getSpecTree/getTableSyntaxSpecTree.spec.ts">src/SpecChartsGenerator/core/getSpecTree/getTableSyntaxSpecTree.spec.ts</a>

```mermaid
flowchart TD
N0(["getTableSyntaxSpecTree"])
N1["describe.each"]
N0 --> N1
N2["when passed array of arrays"]
N1 --> N2
N3(["returns node with type \`table\`, children with type \`behavior\`"])
N2 --> N3
N4["when passed table-like template literal"]
N1 --> N4
N5(["returns node with type \`table\`, children with type \`behavior\`"])
N4 --> N5
N6["test.each"]
N0 --> N6
N7(["behaves like \`describe.each\`"])
N6 --> N7
N8["it.each"]
N0 --> N8
N9(["behaves like \`test.each\`"])
N8 --> N9
N10["modifiers (only, skip, concurrent, failing)"]
N0 --> N10
N11("<table><tr><td>• ignores modifier in test.only.each</td></tr><tr><td>• ignores modifier in test.skip.each</td></tr><tr><td>• ignores modifier in test.concurrent.each</td></tr><tr><td>• ignores modifier in test.concurrent.only.each</td></tr><tr><td>• ignores modifier in test.concurrent.skip.each</td></tr><tr><td>• ignores modifier in test.failing.each</td></tr><tr><td>• ignores modifier in describe.only.each</td></tr><tr><td>• ignores modifier in describe.skip.each</td></tr><tr><td>• ignores modifier in it.only.each</td></tr><tr><td>• ignores modifier in it.skip.each</td></tr></table>")
N10 --> N11
N12["placeholders"]
N0 --> N12
N13["when passed type-based placeholders in template string (%s, %d, %i, %f, %#, %%)"]
N12 --> N13
N14(["returns values formatted according to type"])
N13 --> N14
N15["when passed named variables in template string and argument (object)"]
N12 --> N15
N16(["returns interpolated values"])
N15 --> N16
```

---

Spec file: <a id="src-SpecChartsGenerator-helpers-logspects" href="src/SpecChartsGenerator/helpers/log.spec.ts">src/SpecChartsGenerator/helpers/log.spec.ts</a>

```mermaid
flowchart TD
N0(["Logger"])
N1["logSpecFilesFound"]
N0 --> N1
N2(["logs a single spec file with correct singular form"])
N1 --> N2
N3(["logs multiple spec files with correct plural form"])
N1 --> N3
N4(["converts absolute paths to relative paths"])
N1 --> N4
N5(["uses process.cwd() as default working directory"])
N1 --> N5
N6["logChartFilesWritten"]
N0 --> N6
N7(["logs a single chart file with correct singular form"])
N6 --> N7
N8(["logs multiple chart files with correct plural form"])
N6 --> N8
N9(["converts absolute paths to relative paths"])
N6 --> N9
N10["logChartFilesDeleted"]
N0 --> N10
N11(["does not log when no files are deleted"])
N10 --> N11
N12(["logs a single deleted file with correct singular form"])
N10 --> N12
N13(["logs multiple deleted files with correct plural form"])
N10 --> N13
N14(["converts absolute paths to relative paths"])
N10 --> N14
```

---

Spec file: <a id="src-chart-files-getChartFiles-getChartFilesspects" href="src/chart-files/getChartFiles/getChartFiles.spec.ts">src/chart-files/getChartFiles/getChartFiles.spec.ts</a>

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

Spec file: <a id="src-chart-files-getChartsInSingleFile-getChartsInSingleFilespects" href="src/chart-files/getChartsInSingleFile/getChartsInSingleFile.spec.ts">src/chart-files/getChartsInSingleFile/getChartsInSingleFile.spec.ts</a>

```mermaid
flowchart TD
N0(["getChartsInSingleFile"])
N1(["gathers charts in single Markdown file"])
N0 --> N1
N2(["converts absolute paths to relative paths"])
N0 --> N2
```

---

Spec file: <a id="src-cli-integspec-cliintegspects" href="src/cli/integ.spec/cli.integ.spec.ts">src/cli/integ.spec/cli.integ.spec.ts</a>

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
N6(["deletes existing chart files before writing new ones"])
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

Spec file: <a id="src-generateLocalFileSystem-generateLocalFileSystemintegspects" href="src/generateLocalFileSystem/generateLocalFileSystem.integ.spec.ts">src/generateLocalFileSystem/generateLocalFileSystem.integ.spec.ts</a>

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

<!-- ✴ Generated by speccharts v0.4.5 ✴ https://github.com/arnaudrenaud/speccharts -->
