import ts from "typescript";

// Handle table-like syntax for test cases: https://jestjs.io/docs/api#describeeachtablename-fn-timeout

export function extractTableData(tableNode: ts.Node): unknown[] {
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

export function extractTemplateTableData(templateNode: ts.Node): {
  headers: string[];
  data: unknown[];
} {
  if (ts.isTemplateExpression(templateNode)) {
    // Parse template string table format:
    // inputA | inputB | expected
    // ${1}   | ${1}   | ${2}
    // ${2}   | ${3}   | ${5}

    const templateText = templateNode.getText();
    // Remove the backticks and split by lines
    const cleanText = templateText.replace(/^`|`$/g, "");
    const lines = cleanText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) return { headers: [], data: [] };

    // Extract headers from first line
    const headerLine = lines[0];
    const headers = headerLine.split("|").map((col) => col.trim());

    // Skip header line (first line with column names)
    const dataLines = lines.slice(1);

    const data = dataLines.map((line) => {
      // Split by | and extract values from ${...} expressions
      const columns = line.split("|").map((col) => col.trim());

      return columns.map((column) => {
        // Extract value from ${value} format
        const match = column.match(/\$\{([^}]+)\}/);
        if (match) {
          const value = match[1].trim();

          // Try to parse as number
          if (!isNaN(Number(value))) {
            return Number(value);
          }

          // Try to parse as boolean
          if (value === "true") return true;
          if (value === "false") return false;

          // Try to parse as null/undefined
          if (value === "null") return null;
          if (value === "undefined") return undefined;

          // Return as string (remove quotes if present)
          return value.replace(/^["']|["']$/g, "");
        }

        // If no ${} pattern, return the column as-is
        return column.replace(/^["']|["']$/g, "");
      });
    });

    return { headers, data };
  }

  return { headers: [], data: [] };
}

export function replacePlaceholders(
  template: string,
  values: any,
  index?: number
): string {
  // Handle single values (not arrays)
  if (!Array.isArray(values)) {
    return template.replace(/%[sdiofpj]/, (match) => {
      if (match === "%p" || match === "%j") {
        return formatValue(values, match);
      }
      return String(values);
    });
  }

  let result = template;
  let valueIndex = 0;

  // First pass: replace %% with a placeholder to avoid replacing it
  result = result.replace(/%%/g, "\x00PERCENT\x00");

  // Replace %# with index
  if (index !== undefined) {
    result = result.replace(/%#/g, String(index));
  }

  // Replace placeholders with actual values
  result = result.replace(/%([sdiofpj])/g, (match, formatter) => {
    if (valueIndex < values.length) {
      const value = values[valueIndex++];
      return formatValue(value, `%${formatter}`);
    }
    return match; // Keep placeholder if no more values
  });

  // Restore %% as single %
  result = result.replace(/\x00PERCENT\x00/g, "%");

  return result;
}

function formatValue(value: any, formatter: string): string {
  switch (formatter) {
    case "%s":
      return String(value);
    case "%d":
    case "%i":
      return String(Math.floor(Number(value)));
    case "%f":
      return String(Number(value));
    case "%o":
      return String(value);
    case "%j":
      return JSON.stringify(value);
    case "%p":
      // Pretty-format: similar to %j but more readable
      // For objects/arrays, use JSON with indentation; for primitives, use toString
      if (value === null) return "null";
      if (value === undefined) return "undefined";
      if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    default:
      return String(value);
  }
}

export function replaceTemplatePlaceholders(
  template: string,
  values: any,
  headers?: string[],
  index?: number
): string {
  // Handle single values (not arrays)
  if (!Array.isArray(values)) {
    return template.replace(/\$[a-zA-Z_$][a-zA-Z0-9_$]*/g, String(values));
  }

  let result = template;

  // Replace $# with index
  if (index !== undefined) {
    result = result.replace(/\$#/g, String(index));
  }

  // If we have headers, map placeholder names to values
  if (headers && headers.length > 0) {
    result = result.replace(
      /\$([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      (match, placeholderName) => {
        const headerIndex = headers.findIndex(
          (header) => header.trim() === placeholderName
        );
        if (headerIndex >= 0 && headerIndex < values.length) {
          return String(values[headerIndex]);
        }
        return match; // Keep original placeholder if not found
      }
    );
  } else {
    // Fallback to positional replacement
    let valueIndex = 0;
    result = result.replace(/\$[a-zA-Z_$][a-zA-Z0-9_$]*/g, () => {
      if (valueIndex < values.length) {
        const value = values[valueIndex++];
        return String(value);
      }
      return `$placeholder`; // Keep placeholder if no more values
    });
  }

  return result;
}

// Helper function to find the base Jest function (test, describe, or it) in a property chain
function getBaseJestFunction(expr: ts.Expression): string | null {
  if (ts.isIdentifier(expr)) {
    return ["describe", "test", "it"].includes(expr.text) ? expr.text : null;
  }
  if (ts.isPropertyAccessExpression(expr)) {
    return getBaseJestFunction(expr.expression);
  }
  return null;
}

// Helper function to check if 'each' is in the property chain
function hasEachProperty(expr: ts.Expression): boolean {
  if (ts.isPropertyAccessExpression(expr)) {
    if (ts.isIdentifier(expr.name) && expr.name.text === "each") {
      return true;
    }
    return hasEachProperty(expr.expression);
  }
  return false;
}

export function isJestTableExpression(node: ts.Node): boolean {
  if (ts.isCallExpression(node)) {
    // Handle Jest table syntax: test.each(data)(name, callback)
    // or test.only.each(data)(name, callback)
    // or test.concurrent.only.each(data)(name, callback)
    if (ts.isCallExpression(node.expression)) {
      const innerCall = node.expression;
      if (ts.isPropertyAccessExpression(innerCall.expression)) {
        const baseFunction = getBaseJestFunction(innerCall.expression);
        const hasEach = hasEachProperty(innerCall.expression);
        return baseFunction !== null && hasEach;
      }
    }
    // Handle direct property access: test.each
    if (ts.isPropertyAccessExpression(node.expression)) {
      const baseFunction = getBaseJestFunction(node.expression);
      const hasEach = hasEachProperty(node.expression);
      return baseFunction !== null && hasEach;
    }
  }
  return false;
}

export function isJestTemplateTableExpression(node: ts.Node): boolean {
  if (ts.isCallExpression(node)) {
    // Handle Jest template table syntax: test.each`table`(name, callback)
    // or test.only.each`table`(name, callback)
    // or test.concurrent.only.each`table`(name, callback)
    // The expression is a tagged template literal: test.each`table`
    if (ts.isTaggedTemplateExpression(node.expression)) {
      const taggedTemplate = node.expression;
      if (ts.isPropertyAccessExpression(taggedTemplate.tag)) {
        const baseFunction = getBaseJestFunction(taggedTemplate.tag);
        const hasEach = hasEachProperty(taggedTemplate.tag);
        return baseFunction !== null && hasEach;
      }
    }
  }
  return false;
}

export type TemplateSegment = {
  value: string;
  isInterpolated: boolean;
};

// Parse template string with placeholders into segments
// Example: "adds %d and %d" with values [1, 2] becomes [{ value: "adds ", isInterpolated: false }, { value: "1", isInterpolated: true }, ...]
export function parseTemplateIntoSegments(
  template: string,
  values: any,
  index?: number
): TemplateSegment[] {
  const segments: TemplateSegment[] = [];

  if (!Array.isArray(values)) {
    values = [values];
  }

  let result = template;
  let valueIndex = 0;

  // First pass: replace %% with a placeholder to avoid replacing it
  result = result.replace(/%%/g, "\x00PERCENT\x00");

  // Replace %# with index
  if (index !== undefined) {
    result = result.replace(/%#/g, String(index));
  }

  // Split by placeholders and track both text and values
  const parts = result.split(/(%[sdiofpj])/);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part.match(/^%[sdiofpj]$/)) {
      // This is a placeholder - replace with actual value
      if (valueIndex < values.length) {
        const value = values[valueIndex++];
        const formatted = formatValue(value, part);
        // Always push, even if empty string
        segments.push({ value: formatted, isInterpolated: true });
      }
    } else if (part) {
      // This is literal text - restore %% as single %
      const restored = part.replace(/\x00PERCENT\x00/g, "%");
      segments.push({ value: restored, isInterpolated: false });
    }
  }

  return segments;
}

// Parse template string with named placeholders into segments
// Example: "adds $a and $b" with values [1, 2] and headers ["a", "b"] becomes [{ value: "adds ", isInterpolated: false }, { value: "1", isInterpolated: true }, ...]
export function parseTemplateIntoSegmentsWithHeaders(
  template: string,
  values: any,
  headers?: string[],
  index?: number
): TemplateSegment[] {
  const segments: TemplateSegment[] = [];

  if (!Array.isArray(values)) {
    values = [values];
  }

  let result = template;

  // Replace $# with index
  if (index !== undefined) {
    result = result.replace(/\$#/g, String(index));
  }

  // Split by placeholders and track both text and values
  const parts = result.split(/(\$[a-zA-Z_$][a-zA-Z0-9_$]*)/);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part.match(/^\$[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
      // This is a placeholder - replace with actual value
      const placeholderName = part.slice(1); // Remove $

      if (headers && headers.length > 0) {
        const headerIndex = headers.findIndex(
          (header) => header.trim() === placeholderName
        );
        if (headerIndex >= 0 && headerIndex < values.length) {
          const value = String(values[headerIndex]);
          // Always push, even if empty string
          segments.push({ value, isInterpolated: true });
        }
      }
    } else if (part) {
      // This is literal text
      segments.push({ value: part, isInterpolated: false });
    }
  }

  return segments;
}
