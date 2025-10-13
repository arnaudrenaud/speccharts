import ts from "typescript";

import { File, SpecNode, SpecTree } from "../../../types";
import {
  extractTableData,
  extractTemplateTableData,
  isJestTableExpression,
  isJestTemplateTableExpression,
  replacePlaceholders,
  replaceTemplatePlaceholders,
} from "./helpers/table-syntax";

function endsWithQuestionMark(text: string): boolean {
  return text.trim().endsWith("?");
}

const PARSED_EXPRESSIONS = [
  "describe",
  "it",
  "test",
  "describe.each",
  "test.each",
  "it.each",
];

function visit(specTree: SpecTree, node: ts.Node, parentDescribe?: SpecNode) {
  // Handle Jest template table syntax (describe.each`table`(name, callback))
  if (isJestTemplateTableExpression(node) && ts.isCallExpression(node)) {
    // For Jest template table syntax: test.each`table`(name, callback)
    // node.arguments contains [name, callback]
    // node.expression.template contains the template literal
    const [nameNode, callback] = node.arguments;
    const templateNode = ts.isTaggedTemplateExpression(node.expression)
      ? node.expression.template
      : null;
    if (
      templateNode &&
      nameNode &&
      callback &&
      ts.isStringLiteral(nameNode) &&
      ts.isFunctionLike(callback)
    ) {
      const { headers, data: tableData } =
        extractTemplateTableData(templateNode);
      const current: SpecNode = {
        type: "table",
        name: nameNode.text,
        tableData,
        children: [],
      };

      // Create leaf nodes for each table case
      tableData.forEach((row) => {
        const resolvedName = replaceTemplatePlaceholders(
          current.name,
          row,
          headers
        );
        const leafNode: SpecNode = {
          type: "behavior",
          name: resolvedName,
        };
        current.children!.push(leafNode);
      });

      // For table nodes, we don't process the callback body since we create leaf nodes for each table case
      // The callback body processing is handled by the regular Jest expression logic

      if (parentDescribe) {
        parentDescribe.children!.push(current);
      } else {
        specTree.children.push(current);
      }
    }
  }
  // Handle Jest table syntax (describe.each, test.each, it.each)
  else if (isJestTableExpression(node) && ts.isCallExpression(node)) {
    // For Jest table syntax: test.each(data)(name, callback)
    // node.arguments contains [name, callback]
    // node.expression.arguments contains [data]
    const [nameNode, callback] = node.arguments;
    const [tableNode] = ts.isCallExpression(node.expression)
      ? node.expression.arguments
      : [];
    if (
      tableNode &&
      nameNode &&
      callback &&
      ts.isStringLiteral(nameNode) &&
      ts.isFunctionLike(callback)
    ) {
      const tableData = extractTableData(tableNode);
      const current: SpecNode = {
        type: "table",
        name: nameNode.text,
        tableData,
        children: [],
      };

      // Create leaf nodes for each table case
      tableData.forEach((row) => {
        const resolvedName = replacePlaceholders(current.name, row);
        const leafNode: SpecNode = {
          type: "behavior",
          name: resolvedName,
        };
        current.children!.push(leafNode);
      });

      // For table nodes, we don't process the callback body since we create leaf nodes for each table case
      // The callback body processing is handled by the regular Jest expression logic

      if (parentDescribe) {
        parentDescribe.children!.push(current);
      } else {
        specTree.children.push(current);
      }
    }
  }
  // Handle regular Jest expressions (describe, it, test)
  else if (
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
