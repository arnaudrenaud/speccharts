import { SpecTree } from "../../../types";
import { getChart } from "./getChart";

describe("new spec", () => {
  it("works", () => {});
});

describe("getChart", () => {
  it("returns a Mermaid flowchart with stadium-shaped node for root and leaves, rectangle node for cases, edge between each case and its children", () => {
    const SPEC_TREE: SpecTree = {
      name: "src/math.spec.ts",
      children: [
        {
          type: "case",
          name: "math",
          children: [
            {
              type: "case",
              name: "add",
              children: [{ name: "adds two numbers", type: "behavior" }],
            },
            {
              type: "case",
              name: "multiply",
              children: [
                {
                  name: "multiplies two numbers",
                  type: "behavior",
                },
              ],
            },
          ],
        },
      ],
    };

    const result = getChart(SPEC_TREE);

    expect(result).toEqual(`flowchart TD
N0(["math"])
N1["add"]
N0 --> N1
N2(["adds two numbers"])
N1 --> N2
N3["multiply"]
N0 --> N3
N4(["multiplies two numbers"])
N3 --> N4`);
  });

  describe("if spec tree contains nodes with type `question`, `answer`", () => {
    it("returns a Mermaid flowchart with rhombus-shaped node for question, answer as edge label instead of node", () => {
      const SPEC_TREE: SpecTree = {
        name: "src/math.spec.ts",
        children: [
          {
            type: "case",
            name: "division",
            children: [
              {
                type: "question",
                name: "is divider 0?",
                children: [
                  {
                    type: "answer",
                    name: "yes",
                    children: [{ type: "behavior", name: "returns NaN" }],
                  },
                  {
                    type: "answer",
                    name: "no",
                    children: [{ type: "behavior", name: "returns division" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = getChart(SPEC_TREE);

      expect(result).toEqual(`flowchart TD
N0(["division"])
N1{"is divider 0?"}
N0 --> N1
N2(["returns NaN"])
N1 -- yes --> N2
N3(["returns division"])
N1 -- no --> N3`);
    });
  });

  describe("if spec tree contains nodes with type `table`", () => {
    it("returns a Mermaid flowchart with table node rendered as leaf containing formatted table data", () => {
      const SPEC_TREE: SpecTree = {
        name: "src/math.spec.ts",
        children: [
          {
            type: "case",
            name: "math operations",
            children: [
              {
                type: "table",
                name: "addition: %d + %d = %d",
                tableData: [
                  [1, 2, 3],
                  [4, 5, 9],
                  [0, 0, 0],
                ],
                children: [
                  { type: "behavior", name: "adds 1 and 1 to get 2" },
                  { type: "behavior", name: "adds 1 and 2 to get 3" },
                  { type: "behavior", name: "adds 2 and 1 to get 3" },
                ],
              },
              {
                type: "table",
                name: "handles %s",
                tableData: ["first case", "second case", "third case"],
                children: [
                  { type: "behavior", name: "handles first case" },
                  { type: "behavior", name: "handles second case" },
                  { type: "behavior", name: "handles third case" },
                ],
              },
            ],
          },
        ],
      };

      const result = getChart(SPEC_TREE);

      expect(result).toEqual(`flowchart TD
N0(["math operations"])
N1(["<table><tr><td>• adds 1 and 1 to get 2</td></tr><tr><td>• adds 1 and 2 to get 3</td></tr><tr><td>• adds 2 and 1 to get 3</td></tr></table>"])
N0 --> N1
N2(["<table><tr><td>• handles first case</td></tr><tr><td>• handles second case</td></tr><tr><td>• handles third case</td></tr></table>"])
N0 --> N2`);
    });
  });

  describe("if spec tree has multiple root-level nodes with type `case`", () => {
    it("returns a multiple-flowchart Mermaid document, one for each root-level case", () => {
      const SPEC_TREE: SpecTree = {
        name: "src/math.spec.ts",
        children: [
          {
            type: "case",
            name: "math operations",
            children: [
              {
                type: "behavior",
                name: "adds two numbers",
              },
            ],
          },
          {
            type: "case",
            name: "string operations",
            children: [
              {
                type: "behavior",
                name: "concatenates strings",
              },
            ],
          },
          {
            type: "case",
            name: "array operations",
            children: [
              {
                type: "behavior",
                name: "filters array elements",
              },
            ],
          },
        ],
      };

      const result = getChart(SPEC_TREE);

      expect(result).toEqual(`flowchart TD
N0(["math operations"])
N1(["adds two numbers"])
N0 --> N1
N2(["string operations"])
N3(["concatenates strings"])
N2 --> N3
N4(["array operations"])
N5(["filters array elements"])
N4 --> N5`);
    });
  });
});
