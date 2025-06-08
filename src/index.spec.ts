// this function declaration should be ignored in result
function sum(a: number, b: number): number {
  return a + b;
}

// this function call should be ignored in result
sum(1, 2);

describe("Sum", () => {
  describe("does it do it?", () => {
    describe("yes", () => {
      it("does this", () => {});
    });

    describe("no", () => {
      it("does that", () => {});
    });
  });

  describe("when passed two numbers", () => {
    it("returns the sum of two numbers", () => {
      expect(sum(1, 2)).toBe(3);
    });

    it("does not crash", () => {
      expect(() => sum(1, 2)).not.toThrow();
    });
  });
});
