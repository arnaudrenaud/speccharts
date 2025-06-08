import ts from "typescript";
import path from "path";
import fs from "fs";
import glob from "fast-glob";

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

function parseTestFile(sourceCode: string, fileName: string): FileResult {
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

function escapeMermaidLabelMarkdown(text: string): string {
  return text.replace(/`/g, "\\`");
}

function endsWithQuestionMark(text: string): boolean {
  return text.trim().endsWith("?");
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
    const label = escapeMermaidLabelMarkdown(node.name);

    nodes.push(
      `${thisId}${
        endsWithQuestionMark(label)
          ? `{"${label}"}`
          : node.type === "describe" && parentId
          ? `["${label}"]`
          : `(["${label}"])`
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

  // Add standalone title node
  lines.push(`title["**${escapeMermaidLabelMarkdown(result.name)}**"]`);

  for (const child of result.children) {
    walk(child, null, lines);
  }

  return lines.join("\n");
}

async function runOnAllTests(rootDir: string = ".") {
  const patterns = ["src/**/*.spec.{ts,tsx,js,jsx}"];
  const entries = await glob(patterns, { cwd: rootDir, absolute: true });

  for (const fileName of entries) {
    try {
      const parsed = parseTestFile(
        fs.readFileSync(fileName).toString(),
        path.relative(rootDir, fileName)
      );
      const mermaid = generateMermaidFlowchart(parsed);
      const mmdPath = `${fileName}.mmd`;
      fs.writeFileSync(mmdPath, mermaid, "utf8");
      console.log(
        `✅ ${path.relative(rootDir, fileName)} → ${path.relative(
          rootDir,
          mmdPath
        )}`
      );
    } catch (err) {
      console.error(`❌ Failed to process ${fileName}`, err);
    }
  }
}

runOnAllTests();
