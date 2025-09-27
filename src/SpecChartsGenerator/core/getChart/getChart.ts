import { SpecNode, SpecTree } from "../../../types";

function escapeMermaidLabelMarkdown(text: string): string {
  return text.replace(/`/g, "\\`").replace(/"/g, "&quot");
}

export const getChart = (specTree: SpecTree): string => {
  let lines: string[] = ["flowchart TD"];
  let nodeId = 0;

  function getNodeId() {
    return `N${nodeId++}`;
  }

  function formatTableAsHTML(children: any[]): string {
    if (!children || children.length === 0) {
      return "<table><tr><td>• No test cases</td></tr></table>";
    }

    const tableRows = children
      .map((child) => {
        const escapedName = escapeMermaidLabelMarkdown(child.name);
        return `<tr><td>• ${escapedName}</td></tr>`;
      })
      .join("");

    return `<table>${tableRows}</table>`;
  }

  function walk(
    node: SpecNode,
    parentId: string | null,
    nodes: string[]
  ): string {
    const thisId = getNodeId();

    // Handle table nodes specially - render as simple cell with HTML table
    if (node.tableData) {
      const tableContent = node.children
        ? formatTableAsHTML(node.children)
        : "<table><tr><td>• No test cases</td></tr></table>";
      const cellLabel = escapeMermaidLabelMarkdown(tableContent);
      nodes.push(`${thisId}(["${cellLabel}"])`);

      if (parentId) {
        nodes.push(`${parentId} --> ${thisId}`);
      }

      return thisId;
    }

    const label = escapeMermaidLabelMarkdown(node.name);

    nodes.push(
      `${thisId}${
        node.type === "question"
          ? `{"${label}"}`
          : node.type === "case" && parentId
          ? `["${label}"]`
          : `(["${label}"])`
      }`
    );

    if (parentId) {
      nodes.push(`${parentId} --> ${thisId}`);
    }

    // Skip processing children for table nodes since they're rendered as leaves
    if (node.children && !node.tableData) {
      for (const child of node.children) {
        if (
          node.type === "question" &&
          child.type === "answer" &&
          child.children
        ) {
          for (const grandchild of child.children) {
            const grandchildId = walk(grandchild, null, nodes);
            const edgeLabel = escapeMermaidLabelMarkdown(child.name);
            nodes.push(`${thisId} -- ${edgeLabel} --> ${grandchildId}`);
          }
        } else {
          walk(child, thisId, nodes);
        }
      }
    }

    return thisId;
  }

  // Add standalone title node
  lines.push(`title["**${escapeMermaidLabelMarkdown(specTree.name)}**"]`);

  for (const child of specTree.children) {
    walk(child, null, lines);
  }

  return lines.join("\n");
};
