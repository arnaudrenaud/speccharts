import path from "path";

import { SpecChart } from "../types";
import { GENERATED_BY_SPECCHARTS_LABEL } from "./constants";

type Tree = { [key: string]: Tree | {} };

function generateAnchor(path: string): string {
  return path.replace(/[\\/]/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
}

function buildFileTree(paths: string[]): Tree {
  const root: Tree = {};
  for (const path of paths) {
    const parts = path.split(/[\\/]/);
    let node: Tree | {} = root;
    for (const part of parts) {
      if (!(node as any)[part]) (node as any)[part] = {};
      node = (node as any)[part];
    }
  }
  return root;
}

function renderTreeWithLinks(
  node: Tree,
  fullPath: string[] = [],
  prefix = ""
): string {
  const entries = Object.keys(node);
  return entries
    .map((key, idx) => {
      const isLast = idx === entries.length - 1;
      const branch = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      const currentPath = [...fullPath, key];
      const isFile = Object.keys(node[key]).length === 0;
      const display = isFile
        ? `<a href="#${generateAnchor(currentPath.join("/"))}">${key}</a>`
        : key;
      let result = `${prefix}${branch}${display}<br />`;
      if (!isFile) {
        result += renderTreeWithLinks(
          node[key] as Tree,
          currentPath,
          nextPrefix
        );
      }
      return result;
    })
    .join("");
}

function getTreeText(charts: SpecChart[], outputDirectoryPath: string): string {
  const filePaths = charts.map(
    (c: SpecChart) => path.relative(outputDirectoryPath, c.specFile.path) || ""
  );
  return `<pre><code>${renderTreeWithLinks(
    buildFileTree(filePaths)
  )}</code></pre>`;
}

export function gatherChartsInMarkdown(
  charts: SpecChart[],
  outputDirectoryPath: string
): string {
  return `# speccharts

Jump to chart for each spec file:
${getTreeText(charts, outputDirectoryPath)}

${charts
  .map(({ specFile, chart }) => {
    const relativePath = path.relative(outputDirectoryPath, specFile.path);
    const anchor = generateAnchor(relativePath);
    return `<a id="${anchor}"></a><a href="${relativePath}">${specFile.path}</a>\n\n\`\`\`mermaid\n${chart}\n\`\`\``;
  })
  .join("\n\n---\n\n")}

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`;
}
