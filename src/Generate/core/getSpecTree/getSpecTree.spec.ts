import { getSpecTree } from "./getSpecTree";

describe("getSpecTree", () => {
  const TEST_FILE_PATH = `src/math.spec.ts`;
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

  it("returns a spec tree", () => {
    expect(
      getSpecTree({ path: TEST_FILE_PATH, content: TEST_FILE_CONTENT })
    ).toEqual({
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
    });
  });
});
