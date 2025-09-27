import ts from "typescript";

import { File, SpecNode, SpecTree } from "../../../types";

function endsWithQuestionMark(text: string): boolean {
  return text.trim().endsWith("?");
}

const PARSED_EXPRESSIONS = ["describe", "it", "test"];

function visit(specTree: SpecTree, node: ts.Node, parentDescribe?: SpecNode) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    PARSED_EXPRESSIONS.includes(node.expression.text)
  ) {
    const [nameNode, callback] = node.arguments;
    if (ts.isStringLiteral(nameNode) && ts.isFunctionLike(callback)) {
      const current: SpecNode = {
        type:
          node.expression.text === "describe"
            ? endsWithQuestionMark(nameNode.text)
              ? "question"
              : parentDescribe?.type === "question"
              ? "answer"
              : "case"
            : "behavior",
        name: nameNode.text,
      };

      if (["case", "question", "answer"].includes(current.type)) {
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

export const getSpecTree = (testFile: File): SpecTree => {
  const sourceFile = ts.createSourceFile(
    testFile.path,
    testFile.content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const specTree = {
    name: testFile.path,
    children: [],
  };

  visit(specTree, sourceFile);

  return specTree;
};
