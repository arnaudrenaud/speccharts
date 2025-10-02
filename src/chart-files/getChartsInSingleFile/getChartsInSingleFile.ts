import { GENERATED_BY_SPECCHARTS_LABEL } from "../constants";
import { getTreeText, generateHTMLLocalAnchor } from "./helpers";
import { SpecChart } from "../../types";
import { getRelativePath } from "./getRelativePath";

export type Tree = { [key: string]: Tree | {} };

function getChartsWithRelativePath(
  charts: SpecChart[],
  outputDirectoryPath: string
) {
  return charts.map(({ specFile, chart }) => ({
    specFile: {
      ...specFile,
      path: getRelativePath(outputDirectoryPath, specFile),
    },
    chart,
  }));
}

export function getChartsInSingleFile(
  charts: SpecChart[],
  outputDirectoryPath: string
): string {
  const chartsWithRelativePaths = getChartsWithRelativePath(
    charts,
    outputDirectoryPath
  );

  return `# speccharts

Jump to chart for each spec file:

${getTreeText(chartsWithRelativePaths)}

---

${chartsWithRelativePaths
  .map(({ specFile, chart }) => {
    return `Spec file: <a id="${generateHTMLLocalAnchor(
      specFile.path
    )}"></a><a href="${specFile.path}">${
      specFile.path
    }</a>\n\n\`\`\`mermaid\n${chart}\n\`\`\``;
  })
  .join("\n\n---\n\n")}

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`;
}
