describe("getUser", () => {
  describe("is store available?", () => {
    describe("no", () => {
      it("returns `null`", async () => {});
    });

    describe("yes", () => {
      describe("is user found?", () => {
        describe("no", () => {
          it("returns `null`", async () => {});

          describe("`warnIfNotFound`?", () => {
            describe("yes", () => {
              it("logs warning", async () => {});
            });

            describe("no", () => {
              it("does not log warning", async () => {});
            });
          });
        });

        describe("yes", () => {
          it("returns user", async () => {});
        });
      });
    });
  });
});
