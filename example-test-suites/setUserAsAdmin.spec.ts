describe("setUserAsAdmin", () => {
  describe("when authenticated user is not admin", () => {
    it("throws exception", async () => {
      // …
    });
  });

  describe("when authenticated user is admin", () => {
    describe("when email matches no user in database", () => {
      describe("when user not found in ERP", () => {
        it("throws exception", async () => {
          // …
        });
      });

      describe("when user found in ERP", () => {
        it("creates user from ERP, sets as admin in database", async () => {
          // …
        });
      });
    });

    describe("when email matches user in database", () => {
      describe("when user already has admin role", () => {
        it("throws exception", async () => {
          // …
        });
      });

      describe("when user has no admin role", () => {
        it("sets as admin in database, does not call ERP", async () => {
          // …
        });
      });
    });
  });
});
