import { getSpecTree } from "./getSpecTree";

describe("getTableSyntaxSpecTree", () => {
  const SPEC_FILE_PATH = `src/math.spec.ts`;

  describe("describe.each", () => {
    describe("when passed array of arrays", () => {
      it("returns node with type `table`, children with type `table-row`", () => {
        const result = getSpecTree({
          path: SPEC_FILE_PATH,
          content: `describe.each([
  [1, 2],
  [3, 4]
])("adds %d and %d", (a, b) => {
  it("works", () => {});
});`,
        });

        expect(result.children).toEqual([
          {
            type: "table",
            name: "adds %d and %d",
            tableData: [
              [1, 2],
              [3, 4],
            ],
            children: [
              {
                type: "table-row",
                name: "adds 1 and 2",
                children: [
                  { type: "table-cell", name: "adds ", isInterpolated: false },
                  { type: "table-cell", name: "1", isInterpolated: true },
                  { type: "table-cell", name: " and ", isInterpolated: false },
                  { type: "table-cell", name: "2", isInterpolated: true },
                ],
              },
              {
                type: "table-row",
                name: "adds 3 and 4",
                children: [
                  { type: "table-cell", name: "adds ", isInterpolated: false },
                  { type: "table-cell", name: "3", isInterpolated: true },
                  { type: "table-cell", name: " and ", isInterpolated: false },
                  { type: "table-cell", name: "4", isInterpolated: true },
                ],
              },
            ],
          },
        ]);
      });
    });

    describe("when passed table-like template literal", () => {
      it("returns node with type `table`, children with type `table-row`", () => {
        const result = getSpecTree({
          path: SPEC_FILE_PATH,
          content: `describe.each\`
  a | b
  \${1} | \${2}
  \${3} | \${4}
\`('adds $a and $b', ({ a, b }) => {
  it("works", () => {});
});`,
        });

        expect(result.children).toEqual([
          {
            type: "table",
            name: "adds $a and $b",
            tableData: [
              [1, 2],
              [3, 4],
            ],
            children: [
              {
                type: "table-row",
                name: "adds 1 and 2",
                children: [
                  { type: "table-cell", name: "adds ", isInterpolated: false },
                  { type: "table-cell", name: "1", isInterpolated: true },
                  { type: "table-cell", name: " and ", isInterpolated: false },
                  { type: "table-cell", name: "2", isInterpolated: true },
                ],
              },
              {
                type: "table-row",
                name: "adds 3 and 4",
                children: [
                  { type: "table-cell", name: "adds ", isInterpolated: false },
                  { type: "table-cell", name: "3", isInterpolated: true },
                  { type: "table-cell", name: " and ", isInterpolated: false },
                  { type: "table-cell", name: "4", isInterpolated: true },
                ],
              },
            ],
          },
        ]);
      });
    });
  });

  describe("test.each", () => {
    it("behaves like `describe.each`", () => {
      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content: `test.each([
  [1, 1, 2],
  [2, 3, 5]
])("adds %d and %d to get %d", (a, b, expected) => {});`,
      });

      expect(result.children).toEqual([
        {
          type: "table",
          name: "adds %d and %d to get %d",
          tableData: [
            [1, 1, 2],
            [2, 3, 5],
          ],
          children: [
            {
              type: "table-row",
              name: "adds 1 and 1 to get 2",
              children: [
                { type: "table-cell", name: "adds ", isInterpolated: false },
                { type: "table-cell", name: "1", isInterpolated: true },
                { type: "table-cell", name: " and ", isInterpolated: false },
                { type: "table-cell", name: "1", isInterpolated: true },
                { type: "table-cell", name: " to get ", isInterpolated: false },
                { type: "table-cell", name: "2", isInterpolated: true },
              ],
            },
            {
              type: "table-row",
              name: "adds 2 and 3 to get 5",
              children: [
                { type: "table-cell", name: "adds ", isInterpolated: false },
                { type: "table-cell", name: "2", isInterpolated: true },
                { type: "table-cell", name: " and ", isInterpolated: false },
                { type: "table-cell", name: "3", isInterpolated: true },
                { type: "table-cell", name: " to get ", isInterpolated: false },
                { type: "table-cell", name: "5", isInterpolated: true },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe("it.each", () => {
    it("behaves like `test.each`", () => {
      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content: `it.each([
  [1, 1, 2],
  [2, 3, 5]
])("adds %d and %d to get %d", (a, b, expected) => {});`,
      });

      expect(result.children).toEqual([
        {
          type: "table",
          name: "adds %d and %d to get %d",
          tableData: [
            [1, 1, 2],
            [2, 3, 5],
          ],
          children: [
            {
              type: "table-row",
              name: "adds 1 and 1 to get 2",
              children: [
                { type: "table-cell", name: "adds ", isInterpolated: false },
                { type: "table-cell", name: "1", isInterpolated: true },
                { type: "table-cell", name: " and ", isInterpolated: false },
                { type: "table-cell", name: "1", isInterpolated: true },
                { type: "table-cell", name: " to get ", isInterpolated: false },
                { type: "table-cell", name: "2", isInterpolated: true },
              ],
            },
            {
              type: "table-row",
              name: "adds 2 and 3 to get 5",
              children: [
                { type: "table-cell", name: "adds ", isInterpolated: false },
                { type: "table-cell", name: "2", isInterpolated: true },
                { type: "table-cell", name: " and ", isInterpolated: false },
                { type: "table-cell", name: "3", isInterpolated: true },
                { type: "table-cell", name: " to get ", isInterpolated: false },
                { type: "table-cell", name: "5", isInterpolated: true },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe("modifiers (only, skip, concurrent, failing)", () => {
    it.each([
      ["test.only.each"],
      ["test.skip.each"],
      ["test.concurrent.each"],
      ["test.concurrent.only.each"],
      ["test.concurrent.skip.each"],
      ["test.failing.each"],
      ["describe.only.each"],
      ["describe.skip.each"],
      ["it.only.each"],
      ["it.skip.each"],
    ])("ignores modifier in %s", (modifier) => {
      const isDescribe = modifier.startsWith("describe");
      const content = isDescribe
        ? `${modifier}([[1, 2]])("test %d and %d", (a, b) => { it("works", () => {}); });`
        : `${modifier}([[1, 2]])("test %d and %d", (a, b) => {});`;

      const result = getSpecTree({
        path: SPEC_FILE_PATH,
        content,
      });

      expect(result.children[0]).toMatchObject({
        type: "table",
        name: "test %d and %d",
        tableData: [[1, 2]],
      });
    });
  });

  describe("placeholders", () => {
    describe("when passed type-based placeholders in template string (%s, %d, %i, %f, %#, %%)", () => {
      it("returns values formatted according to type", () => {
        const result = getSpecTree({
          path: SPEC_FILE_PATH,
          content: `test.each([
  [1, 2, 3],
  [2, 3, 5]
])("Test %#: %d + %d = %d (100%% done)", (a, b, sum) => {});`,
        });

        expect(result.children[0].children).toEqual([
          {
            type: "table-row",
            name: "Test 0: 1 + 2 = 3 (100% done)",
            children: [
              { type: "table-cell", name: "Test 0: ", isInterpolated: false },
              { type: "table-cell", name: "1", isInterpolated: true },
              { type: "table-cell", name: " + ", isInterpolated: false },
              { type: "table-cell", name: "2", isInterpolated: true },
              { type: "table-cell", name: " = ", isInterpolated: false },
              { type: "table-cell", name: "3", isInterpolated: true },
              {
                type: "table-cell",
                name: " (100% done)",
                isInterpolated: false,
              },
            ],
          },
          {
            type: "table-row",
            name: "Test 1: 2 + 3 = 5 (100% done)",
            children: [
              { type: "table-cell", name: "Test 1: ", isInterpolated: false },
              { type: "table-cell", name: "2", isInterpolated: true },
              { type: "table-cell", name: " + ", isInterpolated: false },
              { type: "table-cell", name: "3", isInterpolated: true },
              { type: "table-cell", name: " = ", isInterpolated: false },
              { type: "table-cell", name: "5", isInterpolated: true },
              {
                type: "table-cell",
                name: " (100% done)",
                isInterpolated: false,
              },
            ],
          },
        ]);
      });
    });

    describe("when passed named variables in template string and argument (object)", () => {
      it("returns interpolated values", () => {
        const result = getSpecTree({
          path: SPEC_FILE_PATH,
          content: `test.each\`
  a | b | expected
  \${1} | \${2} | \${3}
  \${2} | \${3} | \${5}
\`('Case $#: $a + $b = $expected', ({ a, b, expected }) => {});`,
        });

        expect(result.children[0].children).toEqual([
          {
            type: "table-row",
            name: "Case 0: 1 + 2 = 3",
            children: [
              { type: "table-cell", name: "Case 0: ", isInterpolated: false },
              { type: "table-cell", name: "1", isInterpolated: true },
              { type: "table-cell", name: " + ", isInterpolated: false },
              { type: "table-cell", name: "2", isInterpolated: true },
              { type: "table-cell", name: " = ", isInterpolated: false },
              { type: "table-cell", name: "3", isInterpolated: true },
            ],
          },
          {
            type: "table-row",
            name: "Case 1: 2 + 3 = 5",
            children: [
              { type: "table-cell", name: "Case 1: ", isInterpolated: false },
              { type: "table-cell", name: "2", isInterpolated: true },
              { type: "table-cell", name: " + ", isInterpolated: false },
              { type: "table-cell", name: "3", isInterpolated: true },
              { type: "table-cell", name: " = ", isInterpolated: false },
              { type: "table-cell", name: "5", isInterpolated: true },
            ],
          },
        ]);
      });
    });

    describe("when passed empty strings in test values", () => {
      it("returns empty cells", () => {
        const result = getSpecTree({
          path: SPEC_FILE_PATH,
          content: `test.each([
["", ""],
["John", "J"]
])("Initials: %s → %s", (input, output) => {});`,
        });

        expect(result.children[0].children).toEqual([
          {
            type: "table-row",
            name: "Initials:  → ",
            children: [
              { type: "table-cell", name: "Initials: ", isInterpolated: false },
              { type: "table-cell", name: "", isInterpolated: true },
              { type: "table-cell", name: " → ", isInterpolated: false },
              { type: "table-cell", name: "", isInterpolated: true },
            ],
          },
          {
            type: "table-row",
            name: "Initials: John → J",
            children: [
              { type: "table-cell", name: "Initials: ", isInterpolated: false },
              { type: "table-cell", name: "John", isInterpolated: true },
              { type: "table-cell", name: " → ", isInterpolated: false },
              { type: "table-cell", name: "J", isInterpolated: true },
            ],
          },
        ]);
      });
    });
  });
});
