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

  function renderTableSubgraph(
    node: SpecNode,
    parentId: string,
    nodes: string[]
  ): string {
    const subgraphId = `subgraph_${getNodeId()}`;
    const tableTitle = escapeMermaidLabelMarkdown(node.name);

    nodes.push(`subgraph ${subgraphId}["${tableTitle}"]`);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child, index) => {
        const cellId = getNodeId();
        const cellLabel = escapeMermaidLabelMarkdown(child.name);
        nodes.push(`  ${cellId}(["${cellLabel}"])`);
      });
    } else {
      const emptyId = getNodeId();
      nodes.push(`  ${emptyId}(["No test cases"])`);
    }

    nodes.push(`end`);

    // Connect parent to subgraph
    if (parentId) {
      nodes.push(`${parentId} --> ${subgraphId}`);
    }

    return subgraphId;
  }

  function walk(
    node: SpecNode,
    parentId: string | null,
    nodes: string[]
  ): string {
    const thisId = getNodeId();

    // Handle table nodes specially - render as subgraph with individual cells
    if (node.tableData) {
      return renderTableSubgraph(node, parentId || "", nodes);
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
