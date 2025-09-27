import ts from "typescript";

import { File, SpecNode, SpecTree } from "../../../types";

function endsWithQuestionMark(text: string): boolean {
  return text.trim().endsWith("?");
}

function extractTableData(tableNode: ts.Node): unknown[] {
  if (ts.isArrayLiteralExpression(tableNode)) {
    return tableNode.elements.map((element) => {
      if (ts.isArrayLiteralExpression(element)) {
        return element.elements.map((el) => {
          if (ts.isStringLiteral(el)) return el.text;
          if (ts.isNumericLiteral(el)) return Number(el.text);
          if (
            ts.isPrefixUnaryExpression(el) &&
            el.operator === ts.SyntaxKind.MinusToken &&
            ts.isNumericLiteral(el.operand)
          ) {
            return Number(el.operand.text) * -1;
          }
          if (el.kind === ts.SyntaxKind.TrueKeyword) return true;
          if (el.kind === ts.SyntaxKind.FalseKeyword) return false;
          if (el.kind === ts.SyntaxKind.NullKeyword) return null;
          if (el.kind === ts.SyntaxKind.UndefinedKeyword) return undefined;
          return el.getText();
        });
      }
      if (ts.isStringLiteral(element)) return element.text;
      if (ts.isNumericLiteral(element)) return Number(element.text);
      if (
        ts.isPrefixUnaryExpression(element) &&
        element.operator === ts.SyntaxKind.MinusToken &&
        ts.isNumericLiteral(element.operand)
      ) {
        return Number(element.operand.text) * -1;
      }
      if (element.kind === ts.SyntaxKind.TrueKeyword) return true;
      if (element.kind === ts.SyntaxKind.FalseKeyword) return false;
      if (element.kind === ts.SyntaxKind.NullKeyword) return null;
      if (element.kind === ts.SyntaxKind.UndefinedKeyword) return undefined;
      return element.getText();
    });
  }
  return [];
}

function replacePlaceholders(template: string, values: any): string {
  // Handle single values (not arrays)
  if (!Array.isArray(values)) {
    return template.replace(/%[sdio]/, String(values));
  }

  let result = template;
  let valueIndex = 0;

  // Replace placeholders with actual values
  result = result.replace(/%[sdio]/g, () => {
    if (valueIndex < values.length) {
      const value = values[valueIndex++];
      return String(value);
    }
    return `%s`; // Keep placeholder if no more values
  });

  return result;
}

function isJestTableExpression(node: ts.Node): boolean {
  if (ts.isCallExpression(node)) {
    // Handle Jest table syntax: test.each(data)(name, callback)
    if (ts.isCallExpression(node.expression)) {
      const innerCall = node.expression;
      if (ts.isPropertyAccessExpression(innerCall.expression)) {
        const object = innerCall.expression.expression;
        const property = innerCall.expression.name;
        return (
          ts.isIdentifier(object) &&
          ts.isIdentifier(property) &&
          ["describe", "test", "it"].includes(object.text) &&
          property.text === "each"
        );
      }
    }
    // Handle direct property access: test.each
    if (ts.isPropertyAccessExpression(node.expression)) {
      const object = node.expression.expression;
      const property = node.expression.name;
      return (
        ts.isIdentifier(object) &&
        ts.isIdentifier(property) &&
        ["describe", "test", "it"].includes(object.text) &&
        property.text === "each"
      );
    }
  }
  return false;
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
  // Handle Jest table syntax (describe.each, test.each, it.each)
  if (isJestTableExpression(node) && ts.isCallExpression(node)) {
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
