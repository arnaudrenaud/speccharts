import { SpecChart } from "../types";
import { GENERATED_BY_SPECCHARTS_LABEL } from "./constants";

function buildFileTree(paths: string[]): any {
  const root: any = {};
  for (const path of paths) {
    const parts = path.split(/[\\/]/);
    let node = root;
    for (const part of parts) {
      if (!node[part]) node[part] = {};
      node = node[part];
    }
  }
  return root;
}

function renderTree(node: any, prefix = ""): string {
  const entries = Object.keys(node);
  return entries
    .map((key, idx) => {
      const isLast = idx === entries.length - 1;
      const branch = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      const children = renderTree(node[key], nextPrefix);
      return prefix + branch + key + (children ? "\n" + children : "");
    })
    .join("\n");
}

function getTreeText(charts: SpecChart[]): string {
  return `Below is a visual tree of the source files represented in this document:\n
\`\`\`
${renderTree(buildFileTree(charts.map((c: any) => c.specFile.path || "")))}
\`\`\`
`;
}

export function gatherChartsInMarkdown(charts: SpecChart[]): string {
  return `# speccharts

  ${getTreeText(charts)}

${charts
  .map(({ chart }) => `\`\`\`mermaid\n${chart}\n\`\`\``)
  .join("\n\n---\n\n")}

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`;
}
