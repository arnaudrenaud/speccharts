import { SpecTree } from "../../../types";
import { getChart } from "./getChart";

describe("getChart", () => {
  it("returns a Mermaid flowchart with spec name as title, stadium-shaped node for root and leaves, rectangle node for cases, edge between each case and its children", () => {
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
title["**src/math.spec.ts**"]
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
});
