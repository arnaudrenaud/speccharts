import ts from "typescript";
import fs from "fs";

type NodeResult = {
  type: "describe" | "it";
  name: string;
  children?: NodeResult[];
};

type FileResult = {
  type: "file";
  name: string;
  children: NodeResult[];
};

function parseTestStructure(sourceCode: string, fileName: string): FileResult {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const result: FileResult = {
    type: "file",
    name: fileName,
    children: [],
  };

  function visit(node: ts.Node, parentDescribe?: NodeResult) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      (node.expression.text === "describe" || node.expression.text === "it")
    ) {
      const [nameNode, callback] = node.arguments;
      if (ts.isStringLiteral(nameNode) && ts.isFunctionLike(callback)) {
        const current: NodeResult = {
          type: node.expression.text as "describe" | "it",
          name: nameNode.text,
        };

        if (current.type === "describe") {
          current.children = [];
          const body = callback.body;
          if (body && ts.isBlock(body)) {
            body.statements.forEach((stmt) => visit(stmt, current));
          }
        }

        if (parentDescribe) {
          parentDescribe.children!.push(current);
        } else {
          result.children.push(current);
        }
      }
    } else {
      ts.forEachChild(node, (child) => visit(child, parentDescribe));
    }
  }

  visit(sourceFile);

  return result;
}

const SOURCE_FILE_PATH = "src/getEBXUser.spec.ts";
const result = parseTestStructure(
  fs.readFileSync(SOURCE_FILE_PATH).toString(),
  SOURCE_FILE_PATH
);

function escapeMermaidLabelMarkdown(text: string): string {
  return text.replace(/`/g, "\\`");
}
function generateMermaidFlowchart(result: FileResult): string {
  let lines: string[] = ["flowchart TD"];

  let nodeId = 0;
  function getNodeId() {
    return `N${nodeId++}`;
  }

  function walk(
    node: NodeResult,
    parentId: string | null,
    nodes: string[]
  ): string {
    const thisId = getNodeId();
    const label = `${node.type}: ${escapeMermaidLabelMarkdown(node.name)}`;

    nodes.push(`${thisId}["${label}"]`);
    if (parentId) {
      nodes.push(`${parentId} --> ${thisId}`);
    }

    if (node.children) {
      for (const child of node.children) {
        walk(child, thisId, nodes);
      }
    }

    return thisId;
  }

  const rootId = getNodeId();
  lines.push(`${rootId}["file: ${result.name}"]`);

  for (const child of result.children) {
    walk(child, rootId, lines);
  }

  return lines.join("\n");
}

const mermaidCode = generateMermaidFlowchart(result);
console.log(mermaidCode);
