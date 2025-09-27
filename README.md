# speccharts [![Published on NPM](https://img.shields.io/npm/v/speccharts)](https://www.npmjs.com/package/speccharts)

Based on test suites in your source code, generate diagrams that reveal your application specs.

From this spec file:

```ts
describe("setUserAsAdmin", () => {
  describe("when authenticated user is not admin", () => {
    it("throws exception", () => {
      // …
    });
  });

  describe("when authenticated user is admin", () => {
    describe("when email matches no user in database", () => {
      describe("when user not found in ERP", () => {
        it("throws exception", () => {
          // …
        });
      });

      describe("when user found in ERP", () => {
        it("creates user from ERP, sets as admin in database", () => {
          // …
        });
      });
    });

    describe("when email matches user in database", () => {
      describe("when user already has admin role", () => {
        it("throws exception", () => {
          // …
        });
      });

      describe("when user has no admin role", () => {
        it("sets as admin in database, does not call ERP", () => {
          // …
        });
      });
    });
  });
});
```

…get this Mermaid flowchart:

```mermaid
flowchart TD
title["**example-test-suites/setUserAsAdmin.spec.ts**"]
N0(["setUserAsAdmin"])
N1["when authenticated user is not admin"]
N0 --> N1
N2(["throws exception"])
N1 --> N2
N3["when authenticated user is admin"]
N0 --> N3
N4["when email matches no user in database"]
N3 --> N4
N5["when user not found in ERP"]
N4 --> N5
N6(["throws exception"])
N5 --> N6
N7["when user found in ERP"]
N4 --> N7
N8(["creates user from ERP, sets as admin in database"])
N7 --> N8
N9["when email matches user in database"]
N3 --> N9
N10["when user already has admin role"]
N9 --> N10
N11(["throws exception"])
N10 --> N11
N12["when user has no admin role"]
N9 --> N12
N13(["sets as admin in database, does not call ERP"])
N12 --> N13
```

## Principle

Test suites tend to become less legible as they grow. At some point, you wonder where a new test belongs or if a case might not be already covered.
These problems are only bound to increase with the advent of AI agents that contribute code you never wrote.

speccharts reads your test files and generates Mermaid flowcharts that give a bird's eye view of test suites. `describe` blocks render as nodes, `it` and `test` blocks render as leaves.

## Why the Mermaid format

Mermaid is a plain text representation of diagrams.

Mermaid files (typically `.mmd`) can be:

- viewed on GitHub (native Mermaid rendering)
- viewed in your IDE (see [Mermaid Preview](https://marketplace.visualstudio.com/items?itemName=vstirbu.vscode-mermaid-preview) for Visual Studio Code)
- viewed on GitBook, Notion, or Confluence
- exported as images using Mermaid CLI
- embedded in Markdown documentation

## Command-line interface

### Generate multiple chart files

```sh
npx speccharts -i "src/**/*.{spec,test}.{ts,tsx}" --multiple-output-files
```

This creates a `.mmd` file next to each spec file:

```
src/
├── services/
│   ├── UserService.spec.ts
│   └── UserService.spec.ts.mmd  ← Generated
└── admin/
    ├── setUserAsAdmin.spec.ts
    └── setUserAsAdmin.spec.ts.mmd  ← Generated
```

### Generate a single Markdown file compiling all charts

```sh
npx speccharts -i "src/**/*.{spec,test}.{ts,tsx}" --single-output-file speccharts.md
```

### Write Markdown chart compilation to standard output (no files created)

```sh
npx speccharts -i "src/**/*.{spec,test}.{ts,tsx}"
```

### Delete existing charts before generating new ones

```sh
npx speccharts -i "src/**/*.{spec,test}.{ts,tsx}" --multiple-output-files --delete-existing-charts
```

## Programmatic API

```ts
import { SpecChartsGenerator } from "speccharts";

const generator = new SpecChartsGenerator();
const charts = await generator.generate({
  inputFilePatterns: ["src/**/*.spec.ts"],
});

// charts is an array of { specFile: File, chart: string }
charts.forEach(({ specFile, chart }) => {
  console.log(`Chart for ${specFile.path}:`);
  console.log(chart);
});
```

## Other specification formats supported

### Question marks in spec files

### Jest table syntax

```ts
describe("math operations", () => {
  describe.each([
    [1, 2, 3],
    [4, 5, 9],
    [0, 0, 0],
  ])("addition: %d + %d = %d", (a, b, expected) => {
    it("should add numbers correctly", () => {
      expect(a + b).toBe(expected);
    });
  });

  test.each([
    ["positive", 5, 3, 2],
    ["negative", -5, -3, -2],
    ["zero", 0, 0, 0],
  ])("subtraction with %s numbers: %d - %d = %d", (type, a, b, expected) => {
    expect(a - b).toBe(expected);
  });
});
```

## Use cases

- **Documentation**: Generate visual documentation of use cases that non-tech collaborators can understand
- **Code reviews**: Help reviewers understand complex test scenarios at a glance
- **Onboarding**: Help new team members understand the application behavior through test structure
- **Testing strategy**: Visualize test organization and identify gaps in test coverage

## Supported test frameworks

- Jest (primary support)
- Compatible with any testing framework that uses `describe`/`it` or `describe`/`test` syntax

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
