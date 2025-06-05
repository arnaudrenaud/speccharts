jest.mock("@/dependencies/ebx/ebx-client");
jest.mock("@/services/company/People/findPeopleByEmail");
jest.mock("@/dependencies/telemetry/log-events");
jest.mock("@/dependencies/email/sendErrorEmail");

describe("getEBXUser", () => {
  describe("is EBX client enabled?", () => {
    describe("no", () => {
      it("returns `null`", async () => {});
    });

    describe("yes", () => {
      describe("is EBX people store empty?", () => {
        describe("yes", () => {
          beforeEach(() => {});

          it("returns `null`", async () => {});

          describe("is `warnIfNotFound` enabled (default behavior)?", () => {
            describe("yes", () => {
              it("logs warning", async () => {});
            });

            describe("no", () => {
              it("does not log warning", async () => {});
            });
          });
        });

        describe("no", () => {
          describe("is user found?", () => {
            describe("no", () => {
              beforeEach(() => {});

              it("returns `null`", async () => {});

              describe("is `warnIfNotFound` enabled (default behavior)?", () => {
                describe("yes", () => {
                  it("logs warning", async () => {});
                });

                describe("no", () => {
                  it("does not log warning", async () => {});
                });
              });
            });

            describe("yes", () => {
              it("returns EBX user, with properties mapped to ThirdPartyUser", async () => {});
            });
          });
        });
      });
    });
  });
});
