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

  describe("if spec has more than one `describe` block at root-level", () => {
    it("returns a spec tree made of the same number of spec trees", () => {
      const SPEC_FILE_CONTENT = `describe("math operations", () => {
  it("adds two numbers", () => {
    expect(1 + 1).toEqual(2);
  });
});

describe("string operations", () => {
  it("concatenates strings", () => {
    expect("hello" + "world").toEqual("helloworld");
  });
});

describe("array operations", () => {
  it("filters array elements", () => {
    expect([1, 2, 3].filter(x => x > 1)).toEqual([2, 3]);
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

  describe("Jest template string table syntax", () => {
    it("parses test.each with template string table", () => {
      const SPEC_FILE_CONTENT = `test.each\`
    inputA | inputB | expected
    \${1}   | \${1}   | \${2}
    \${2}   | \${3}   | \${5}
  \`('should return $expected if input is $inputA and $inputB', ({ inputA, inputB, expected }) => {
    expect(inputA + inputB).toBe(expected);
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
            name: "should return $expected if input is $inputA and $inputB",
            tableData: [
              [1, 1, 2],
              [2, 3, 5],
            ],
            children: [
              {
                type: "behavior",
                name: "should return 2 if input is 1 and 1",
              },
              {
                type: "behavior",
                name: "should return 5 if input is 2 and 3",
              },
            ],
          },
        ],
      });
    });

    it("parses describe.each with template string table and mixed data types", () => {
      const SPEC_FILE_CONTENT = `describe.each\`
    description      | a  | b  | expected
    \${"positive"}   | \${1} | \${1} | \${2}
    \${"negative"}   | \${-1} | \${-1} | \${-2}
    \${"zero"}       | \${0} | \${0} | \${0}
  \`('addition with $description', ({ description, a, b, expected }) => {
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
            name: "addition with $description",
            tableData: [
              ["positive", 1, 1, 2],
              ["negative", -1, -1, -2],
              ["zero", 0, 0, 0],
            ],
            children: [
              {
                type: "behavior",
                name: "addition with positive",
              },
              {
                type: "behavior",
                name: "addition with negative",
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

    it("parses it.each with template string table and boolean values", () => {
      const SPEC_FILE_CONTENT = `it.each\`
    value   | expected
    \${true} | \${true}
    \${false} | \${false}
  \`('should return $expected for $value', ({ value, expected }) => {
    expect(value).toBe(expected);
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
            name: "should return $expected for $value",
            tableData: [
              [true, true],
              [false, false],
            ],
            children: [
              {
                type: "behavior",
                name: "should return true for true",
              },
              {
                type: "behavior",
                name: "should return false for false",
              },
            ],
          },
        ],
      });
    });

    it("parses nested describe.each with template string within regular describe", () => {
      const SPEC_FILE_CONTENT = `describe("math operations", () => {
  describe.each\`
    a | b
    \${1} | \${2}
    \${3} | \${4}
  \`('adds $a and $b', ({ a, b }) => {
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
                name: "adds $a and $b",
                tableData: [
                  [1, 2],
                  [3, 4],
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
                ],
              },
            ],
          },
        ],
      });
    });

    it("parses template string table with null and undefined values", () => {
      const SPEC_FILE_CONTENT = `test.each\`
    value      | expected
    \${null}    | \${null}
    \${undefined} | \${undefined}
  \`('should handle $value', ({ value, expected }) => {
    expect(value).toBe(expected);
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
            name: "should handle $value",
            tableData: [
              [null, null],
              [undefined, undefined],
            ],
            children: [
              {
                type: "behavior",
                name: "should handle null",
              },
              {
                type: "behavior",
                name: "should handle undefined",
              },
            ],
          },
        ],
      });
    });
  });
});
