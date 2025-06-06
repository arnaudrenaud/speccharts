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

function endsWithQuestionMark(text: string): boolean {
  return text.trim().endsWith("?");
}

function generateMermaidFlowchart(result: FileResult): string {
  let lines: string[] = [`%% ${result.name}`, "flowchart TD"];
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
    const label = escapeMermaidLabelMarkdown(node.name);

    nodes.push(
      `${thisId}${
        endsWithQuestionMark(label) ? `{"${label}"}` : `(["${label}"])`
      }`
    );

    if (parentId) {
      nodes.push(`${parentId} --> ${thisId}`);
    }

    if (node.children) {
      for (const child of node.children) {
        // Custom rule:
        if (
          endsWithQuestionMark(node.name) &&
          child.type === "describe" &&
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

  for (const child of result.children) {
    walk(child, null, lines);
  }

  return lines.join("\n");
}

const mermaidCode = generateMermaidFlowchart(result);
console.log(mermaidCode);
