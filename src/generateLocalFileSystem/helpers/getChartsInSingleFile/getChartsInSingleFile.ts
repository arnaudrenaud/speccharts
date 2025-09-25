import path from "path";

import { SpecChart } from "@/types";
import { GENERATED_BY_SPECCHARTS_LABEL } from "../constants";
import { getTreeText, generateHTMLLocalAnchor } from "./helpers";

export type Tree = { [key: string]: Tree | {} };

export function getChartsInSingleFile(
  charts: SpecChart[],
  outputDirectoryPath: string
): string {
  return `# speccharts

Jump to chart for each spec file:

${getTreeText(charts)}

---

${charts
  .map(({ specFile, chart }) => {
    const relativePath = path.relative(outputDirectoryPath, specFile.path);
    return `Spec file: <a id="${generateHTMLLocalAnchor(
      specFile.path
    )}"></a><a href="${relativePath}">${
      specFile.path
    }</a>\n\n\`\`\`mermaid\n${chart}\n\`\`\``;
  })
  .join("\n\n---\n\n")}

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`;
}
