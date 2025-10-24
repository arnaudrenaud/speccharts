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
      return "<table><tr><td style='padding-inline: 0.5rem'>No test cases</td></tr></table>";
    }

    const tableRows = children
      .map((row, rowIndex) => {
        // Determine vertical padding based on row position (row-level concern)
        const isFirstRow = rowIndex === 0;
        const isLastRow = rowIndex === children.length - 1;

        // Build row style conditionally (only include non-zero padding)
        const rowStyles: string[] = [];
        if (!isFirstRow) rowStyles.push("padding-top: 0.5rem");
        if (!isLastRow) rowStyles.push("padding-bottom: 0.5rem");
        const rowStyle =
          rowStyles.length > 0 ? ` style='${rowStyles.join("; ")}'` : "";

        // Horizontal padding is cell-level concern
        const cellStyle = " style='padding-inline: 0.5rem'";
        const cellStyleMonospace =
          " style='font-family: monospace; padding-inline: 0.5rem'";

        // If the row has table-cell children, render them as individual <td> elements
        if (row.children && row.children.length > 0) {
          const cells = row.children
            .map((cell: any) => {
              const escapedContent = escapeMermaidLabelMarkdown(cell.name);
              // Apply monospace font to interpolated values
              const style = cell.isInterpolated
                ? cellStyleMonospace
                : cellStyle;
              return `<td${style}>${escapedContent}</td>`;
            })
            .join("");
          return `<tr${rowStyle}>${cells}</tr>`;
        }
        // Fallback for old format (backwards compatibility)
        const escapedName = escapeMermaidLabelMarkdown(row.name);
        return `<tr${rowStyle}><td${cellStyle}>• ${escapedName}</td></tr>`;
      })
      .join("");

    return `<table style='text-align: left;'>${tableRows}</table>`;
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
      nodes.push(`${thisId}("${cellLabel}")`);

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

  for (const child of specTree.children) {
    walk(child, null, lines);
  }

  return lines.join("\n");
};
