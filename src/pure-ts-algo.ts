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

const SOURCE_FILE_PATH = "src/index.spec.ts";
const result = parseTestStructure(
  fs.readFileSync(SOURCE_FILE_PATH).toString(),
  SOURCE_FILE_PATH
);

console.log(JSON.stringify(result, null, 2));
