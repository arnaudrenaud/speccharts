function sum(a: number, b: number): number {
  return a + b;
}

sum(1, 2);

describe("Sum", () => {
  it("returns the sum of two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });

  it("does not crash", () => {
    expect(sum(1, 2)).not.toThrow();
  });
});
