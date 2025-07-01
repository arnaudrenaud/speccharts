import { getSpecTree } from "./getSpecTree";

describe("getSpecTree", () => {
  const TEST_FILE_PATH = `src/math.spec.ts`;

  it("returns a spec tree", () => {
    const TEST_FILE_CONTENT = `describe("math", () => {
  describe("add", () => {
    it("adds two numbers", () => {
      expect(1 + 1).toEqual(2);
    });
  });

  describe("multiply", () => {
    it("multiplies two numbers", () => {
      expect(1 * 1).toEqual(1);
    });
  });
});`;

    const result = getSpecTree({
      path: TEST_FILE_PATH,
      content: TEST_FILE_CONTENT,
    });

    expect(result).toEqual({
      name: TEST_FILE_PATH,
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
      const TEST_FILE_CONTENT = `describe("division", () => {
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
        path: TEST_FILE_PATH,
        content: TEST_FILE_CONTENT,
      });

      expect(result).toEqual({
        name: TEST_FILE_PATH,
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
});
