function sum(a: number, b: number): number {
  return a + b;
}

describe("Sum", () => {
  it("returns the sum of two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
