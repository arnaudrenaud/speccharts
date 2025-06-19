import ts from "typescript";

import { FileWithContent, SpecNode, SpecTree } from "../../types";

function visit(specTree: SpecTree, node: ts.Node, parentDescribe?: SpecNode) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    (node.expression.text === "describe" || node.expression.text === "it")
  ) {
    const [nameNode, callback] = node.arguments;
    if (ts.isStringLiteral(nameNode) && ts.isFunctionLike(callback)) {
      const current: SpecNode = {
        type: node.expression.text as "describe" | "it",
        name: nameNode.text,
      };

      if (current.type === "describe") {
        current.children = [];
        const body = callback.body;
        if (body && ts.isBlock(body)) {
          body.statements.forEach((stmt) => visit(specTree, stmt, current));
        }
      }

      if (parentDescribe) {
        parentDescribe.children!.push(current);
      } else {
        specTree.children.push(current);
      }
    }
  } else {
    ts.forEachChild(node, (child) => visit(specTree, child, parentDescribe));
  }
}

export const getSpecTree = (specFile: FileWithContent): SpecTree => {
  const sourceFile = ts.createSourceFile(
    specFile.path,
    specFile.content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const specTree = {
    name: specFile.path,
    children: [],
  };

  visit(specTree, sourceFile);

  return specTree;
};
