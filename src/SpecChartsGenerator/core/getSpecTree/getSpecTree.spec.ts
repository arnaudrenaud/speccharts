import { getSpecTree } from "./getSpecTree";

describe("getSpecTree", () => {
  const SPEC_FILE_PATH = `src/math.spec.ts`;

  it("returns a spec tree", () => {
    const SPEC_FILE_CONTENT = `describe("math", () => {
  describe("add", () => {
    it("adds two numbers", () => {
      expect(1 + 1).toEqual(2);
    });
  });

  describe("multiply", () => {
    test("multiplies two numbers", () => {
      expect(1 * 1).toEqual(1);
    });
  });
});`;

    const result = getSpecTree({
      path: SPEC_FILE_PATH,
      content: SPEC_FILE_CONTENT,
    });

    expect(result).toEqual({
      name: SPEC_FILE_PATH,
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
    });
  });

  describe("if case node label ends with a question mark", () => {
    it("returns case node with type `question`, children with type `answer`", () => {
      const SPEC_FILE_CONTENT = `describe("division", () => {
  describe("is divider 0?", () => {
    describe("yes", () => {
      it("returns NaN", () => {});
    });

    describe("no", () => {
      it("returns division", () => {});
    });
  });
});
`;

      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content: SPEC_FILE_CONTENT,
      });

      expect(result).toEqual({
        name: SPEC_FILE_PATH,
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
      });
    });
  });

  describe("Jest table syntax", () => {
    it("parses test.each with array table data", () => {
      const SPEC_FILE_CONTENT = `test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3]
])("adds %d and %d to get %d", (a, b, expected) => {
  expect(a + b).toBe(expected);
});`;

      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content: SPEC_FILE_CONTENT,
      });

      expect(result).toEqual({
        name: SPEC_FILE_PATH,
        children: [
          {
            type: "table",
            name: "adds %d and %d to get %d",
            tableData: [
              [1, 1, 2],
              [1, 2, 3],
              [2, 1, 3],
            ],
            children: [
              {
                type: "behavior",
                name: "adds 1 and 1 to get 2",
              },
              {
                type: "behavior",
                name: "adds 1 and 2 to get 3",
              },
              {
                type: "behavior",
                name: "adds 2 and 1 to get 3",
              },
            ],
          },
        ],
      });
    });

    it("parses describe.each with mixed data types", () => {
      const SPEC_FILE_CONTENT = `describe.each([
  ["positive numbers", 1, 1, 2],
  ["negative numbers", -1, -1, -2],
  ["zero", 0, 0, 0]
])("addition with %s", (description, a, b, expected) => {
  it(\`should add \${description}\`, () => {
    expect(a + b).toBe(expected);
  });
});`;

      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content: SPEC_FILE_CONTENT,
      });

      expect(result).toEqual({
        name: SPEC_FILE_PATH,
        children: [
          {
            type: "table",
            name: "addition with %s",
            tableData: [
              ["positive numbers", 1, 1, 2],
              ["negative numbers", -1, -1, -2],
              ["zero", 0, 0, 0],
            ],
            children: [
              {
                type: "behavior",
                name: "addition with positive numbers",
              },
              {
                type: "behavior",
                name: "addition with negative numbers",
              },
              {
                type: "behavior",
                name: "addition with zero",
              },
            ],
          },
        ],
      });
    });

    it("parses it.each with single values", () => {
      const SPEC_FILE_CONTENT = `it.each([
  "first case",
  "second case", 
  "third case"
])("handles %s", (caseName) => {
  expect(caseName).toBeDefined();
});`;

      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content: SPEC_FILE_CONTENT,
      });

      expect(result).toEqual({
        name: SPEC_FILE_PATH,
        children: [
          {
            type: "table",
            name: "handles %s",
            tableData: ["first case", "second case", "third case"],
            children: [
              {
                type: "behavior",
                name: "handles first case",
              },
              {
                type: "behavior",
                name: "handles second case",
              },
              {
                type: "behavior",
                name: "handles third case",
              },
            ],
          },
        ],
      });
    });

    it("parses nested describe.each within regular describe", () => {
      const SPEC_FILE_CONTENT = `describe("math operations", () => {
  describe.each([
    [1, 2],
    [3, 4],
    [5, 6]
  ])("adds %d and %d", (a, b) => {
    it("returns the sum", () => {
      expect(a + b).toBe(a + b);
    });
  });
});`;

      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content: SPEC_FILE_CONTENT,
      });

      expect(result).toEqual({
        name: SPEC_FILE_PATH,
        children: [
          {
            type: "case",
            name: "math operations",
            children: [
              {
                type: "table",
                name: "adds %d and %d",
                tableData: [
                  [1, 2],
                  [3, 4],
                  [5, 6],
                ],
                children: [
                  {
                    type: "behavior",
                    name: "adds 1 and 2",
                  },
                  {
                    type: "behavior",
                    name: "adds 3 and 4",
                  },
                  {
                    type: "behavior",
                    name: "adds 5 and 6",
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });
});
