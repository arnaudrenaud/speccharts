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
});
