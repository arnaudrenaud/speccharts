describe("getInitials", () => {
  test.each([
    ["empty name", "no initials", "", ""],
    ["one-word name", "one initial", "John", "J"],
    ["two-word name", "two initials", "John Doe", "JD"],
    ["lowercase name", "two initials", "john doe", "JD"],
    ["three-word name", "three initials", "John Steve Doe", "JSD"],
    ["four-word name", "three initials", "John Steve Doe Barry", "JSD"],
  ])("%s -> %s (%p -> %p)", (name, behavior, input, output) => {
    // expect(getInitials(input)).toEqual(output);
  });
});

describe("getTimeElapsed", () => {
  test.each([
    [
      "same dates",
      "no time elapsed",
      new Date("2025-11-01T12:00:00Z"),
      new Date("2025-11-01T12:00:00Z"),
      "no time elapsed",
    ],
    [
      "one-hour difference",
      "one hour",
      new Date("2025-11-01T12:00:00Z"),
      new Date("2025-11-01T13:00:00Z"),
      "an hour ago",
    ],
    [
      "one-day difference",
      "one day",
      new Date("2025-11-01T12:00:00Z"),
      new Date("2025-11-02T12:00:00Z"),
      "a day ago",
    ],
    [
      "two-day difference",
      "two days",
      new Date("2025-11-01T12:00:00Z"),
      new Date("2025-11-03T12:00:00Z"),
      "2 days ago",
    ],
  ])("%s -> %s (%p, %p -> %p)", (name, behavior, arg1, arg2, output) => {
    // expect(getTimeElapsed(arg1, arg2)).toEqual(output);
  });
});
