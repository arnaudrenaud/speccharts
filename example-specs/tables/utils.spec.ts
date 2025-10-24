describe("getInitials", () => {
  test.each([
    ["empty name", "no initials", "", ""],
    ["one-word name", "one initial", "John", "J"],
    ["two-word name", "two initials", "John Doe", "JD"],
    ["lowercase name", "two initials", "john doe", "JD"],
    ["three-word name", "three initials", "John Steve Doe", "JSD"],
    ["four-word name", "three initials", "John Steve Doe Barry", "JSD"],
  ])("%s → %s: %p → %p", (name, behavior, input, output) => {
    // expect(getInitials(input)).toEqual(output);
  });
});
