import { Project, Node } from "ts-morph";

const project = new Project();
const sourceFile = project.addSourceFileAtPath("src/index.spec.ts");

function visit(
  node: Node,
  parentId?: string
): { type: string; content: string; children: any } {
  // If it's a call expression, check what function is being called
  if (Node.isCallExpression(node)) {
    const expr = node.getExpression();
    const functionName = expr.getText();

    if (functionName === "describe" || functionName === "it") {
      const content = node.getArguments()[0].getText();

      // Recurse into the function body if it's an arrow/function expression
      const args = node.getArguments();

      const lastArg = args[args.length - 1];
      if (Node.isArrowFunction(lastArg) || Node.isFunctionExpression(lastArg)) {
        visit(lastArg.getBody());
      }

      return {
        type: functionName === "describe" ? "case" : "behavior",
        content,
        children: node.forEachChild(visit),
      };
    }
  } else {
    // Recurse into children
    return node.forEachChild(visit);
  }
}

console.log(visit(sourceFile));
