import { SpecTree } from "../../../types";
import { getChart } from "./getChart";

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
    it("returns a Mermaid flowchart with table node rendered as round-corner rectangle leaf containing formatted table data", () => {
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
                  [1, 1, 2],
                  [1, 2, 3],
                  [2, 1, 3],
                ],
                children: [
                  {
                    type: "table-row",
                    name: "addition: 1 + 1 = 2",
                    children: [
                      {
                        type: "table-cell",
                        name: "addition: ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "1", isInterpolated: true },
                      {
                        type: "table-cell",
                        name: " + ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "1", isInterpolated: true },
                      {
                        type: "table-cell",
                        name: " = ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "2", isInterpolated: true },
                    ],
                  },
                  {
                    type: "table-row",
                    name: "addition: 1 + 2 = 3",
                    children: [
                      {
                        type: "table-cell",
                        name: "addition: ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "1", isInterpolated: true },
                      {
                        type: "table-cell",
                        name: " + ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "2", isInterpolated: true },
                      {
                        type: "table-cell",
                        name: " = ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "3", isInterpolated: true },
                    ],
                  },
                  {
                    type: "table-row",
                    name: "addition: 2 + 1 = 3",
                    children: [
                      {
                        type: "table-cell",
                        name: "addition: ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "2", isInterpolated: true },
                      {
                        type: "table-cell",
                        name: " + ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "1", isInterpolated: true },
                      {
                        type: "table-cell",
                        name: " = ",
                        isInterpolated: false,
                      },
                      { type: "table-cell", name: "3", isInterpolated: true },
                    ],
                  },
                ],
              },
              {
                type: "table",
                name: "handles %s",
                tableData: ["first case", "second case", "third case"],
                children: [
                  {
                    type: "table-row",
                    name: "handles first case",
                    children: [
                      {
                        type: "table-cell",
                        name: "handles ",
                        isInterpolated: false,
                      },
                      {
                        type: "table-cell",
                        name: "first case",
                        isInterpolated: true,
                      },
                    ],
                  },
                  {
                    type: "table-row",
                    name: "handles second case",
                    children: [
                      {
                        type: "table-cell",
                        name: "handles ",
                        isInterpolated: false,
                      },
                      {
                        type: "table-cell",
                        name: "second case",
                        isInterpolated: true,
                      },
                    ],
                  },
                  {
                    type: "table-row",
                    name: "handles third case",
                    children: [
                      {
                        type: "table-cell",
                        name: "handles ",
                        isInterpolated: false,
                      },
                      {
                        type: "table-cell",
                        name: "third case",
                        isInterpolated: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = getChart(SPEC_TREE);

      expect(result).toEqual(`flowchart TD
N0(["math operations"])
N1("<table style='text-align: left;'><tr style='padding-bottom: 0.5rem'><td style='padding-inline: 0.5rem'>addition: </td><td style='font-family: monospace; padding-inline: 0.5rem'>1</td><td style='padding-inline: 0.5rem'> + </td><td style='font-family: monospace; padding-inline: 0.5rem'>1</td><td style='padding-inline: 0.5rem'> = </td><td style='font-family: monospace; padding-inline: 0.5rem'>2</td></tr><tr style='padding-top: 0.5rem; padding-bottom: 0.5rem'><td style='padding-inline: 0.5rem'>addition: </td><td style='font-family: monospace; padding-inline: 0.5rem'>1</td><td style='padding-inline: 0.5rem'> + </td><td style='font-family: monospace; padding-inline: 0.5rem'>2</td><td style='padding-inline: 0.5rem'> = </td><td style='font-family: monospace; padding-inline: 0.5rem'>3</td></tr><tr style='padding-top: 0.5rem'><td style='padding-inline: 0.5rem'>addition: </td><td style='font-family: monospace; padding-inline: 0.5rem'>2</td><td style='padding-inline: 0.5rem'> + </td><td style='font-family: monospace; padding-inline: 0.5rem'>1</td><td style='padding-inline: 0.5rem'> = </td><td style='font-family: monospace; padding-inline: 0.5rem'>3</td></tr></table>")
N0 --> N1
N2("<table style='text-align: left;'><tr style='padding-bottom: 0.5rem'><td style='padding-inline: 0.5rem'>handles </td><td style='font-family: monospace; padding-inline: 0.5rem'>first case</td></tr><tr style='padding-top: 0.5rem; padding-bottom: 0.5rem'><td style='padding-inline: 0.5rem'>handles </td><td style='font-family: monospace; padding-inline: 0.5rem'>second case</td></tr><tr style='padding-top: 0.5rem'><td style='padding-inline: 0.5rem'>handles </td><td style='font-family: monospace; padding-inline: 0.5rem'>third case</td></tr></table>")
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
