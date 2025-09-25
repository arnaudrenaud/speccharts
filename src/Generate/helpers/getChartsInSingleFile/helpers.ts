import { SpecChart } from "../../types";
import { Tree } from "./getChartsInSingleFile";

/**
 * Generates a URL-friendly HTML local anchor string from a file path by sanitizing it.
 * Replaces path separators (backslashes and forward slashes) with dashes
 * and removes any characters that are not alphanumeric, underscores, or dashes.
 * @param {string} path - The file path to convert into an anchor.
 * @returns {string} The sanitized anchor string suitable for use in HTML anchors.
 */
export function generateHTMLLocalAnchor(path: string): string {
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
        ? `<a href="#${generateHTMLLocalAnchor(
            currentPath.join("/")
          )}">${key}</a>`
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

/**
 * Generates an HTML string containing a tree representation of spec file paths with clickable links.
 * Each file path is converted into a local anchor link to jump to chart.
 * @param {SpecChart[]} charts - Array of spec charts containing file information.
 * @returns {string} HTML string with <pre> tags containing the formatted tree.
 * @example
 * getTreeText(["src/main.ts", "src/utils.ts"])
 * // returns markup which renders to:
 * // └── src
 * //     ├── main.ts
 * //     └── utils.ts
 */
export function getTreeText(charts: SpecChart[]): string {
  return `<pre>${renderTreeWithLinks(
    buildFileTree(charts.map(({ specFile: { path } }) => path))
  )}</pre>`;
}
