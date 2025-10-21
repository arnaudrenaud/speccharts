describe("sendRequest", () => {
  describe("when server responds", () => {
    describe("with success status", () => {
      describe("when body valid JSON", () => {
        it("returns parsed body", async () => {});
      });

      describe("when body invalid JSON", () => {
        it("throws MALFORMED_RESPONSE", async () => {});
      });
    });

    describe("with error status", () => {
      describe("when error message matches known exception", () => {
        it("re-throws exception", async () => {});
      });

      describe("when error message unknown", () => {
        describe("when status 4xx", () => {
          it("throws MALFORMED_REQUEST", async () => {});
        });

        describe("when status 5xx", () => {
          it("throws INTERNAL_SERVER_ERROR", async () => {});
        });
      });
    });
  });

  describe("when server does not respond", () => {
    it("throws SERVER_TIMEOUT", async () => {});
  });
});
