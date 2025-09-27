// Example Jest table syntax for testing
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

  it.each(["first test case", "second test case", "third test case"])(
    "handles %s",
    (testCase) => {
      expect(testCase).toBeDefined();
    }
  );
});
