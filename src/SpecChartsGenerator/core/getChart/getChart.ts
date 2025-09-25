import { SpecNode, SpecTree } from "@/types";

function escapeMermaidLabelMarkdown(text: string): string {
  return text.replace(/`/g, "\\`").replace(/"/g, "&quot");
}

export const getChart = (specTree: SpecTree): string => {
  let lines: string[] = ["flowchart TD"];
  let nodeId = 0;

  function getNodeId() {
    return `N${nodeId++}`;
  }

  function walk(
    node: SpecNode,
    parentId: string | null,
    nodes: string[]
  ): string {
    const thisId = getNodeId();
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

    if (node.children) {
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
