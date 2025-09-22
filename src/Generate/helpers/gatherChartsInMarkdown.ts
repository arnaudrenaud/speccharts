import { SpecChart } from "../types";
import { GENERATED_BY_SPECCHARTS_LABEL } from "./constants";

function generateAnchor(path: string): string {
  return path.replace(/[\\/]/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
}

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

function renderTreeWithLinks(
  node: any,
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
        result += renderTreeWithLinks(node[key], currentPath, nextPrefix);
      }
      return result;
    })
    .join("");
}

function getTreeText(charts: SpecChart[]): string {
  const filePaths = charts.map((c: any) => c.specFile.path || "");
  return `<pre><code>${renderTreeWithLinks(
    buildFileTree(filePaths)
  )}</code></pre>`;
}

export function gatherChartsInMarkdown(charts: SpecChart[]): string {
  return `# speccharts

Jump to chart for spec file:
${getTreeText(charts)}

${charts
  .map(({ specFile, chart }) => {
    const anchor = generateAnchor(specFile.path);
    return `<a id="${anchor}"></a><a href="${specFile.path}">${specFile.path}</a>\n\n\`\`\`mermaid\n${chart}\n\`\`\``;
  })
  .join("\n\n---\n\n")}

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`;
}
