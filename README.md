# speccharts

Based on test files in your source code, generate diagrams that reveal your application specs.

From this spec file:

```ts
describe("setUserAsAdmin", () => {
  describe("when authenticated user is not admin", () => {
    it("throws exception RESOURCE_FORBIDDEN_OR_NONEXISTENT", async () => {
      // …
    });
  });

  describe("when authenticated user is admin", () => {
    describe("when UPN does not match any user in database", () => {
      describe("when user not found in EBX", () => {
        it("throws error", async () => {
          // …
        });
      });

      describe("when user found in EBX", () => {
        it("creates user from EBX and set as admin in database", async () => {
          // …
        });
      });
    });

    describe("when email address matches a user in database", () => {
      describe("when user already has admin role", () => {
        it("throws exception USER_ALREADY_ADMIN", async () => {
          // …
        });
      });

      describe("when user does not have any admin role", () => {
        it("sets user as admin in database, does not call EBX", async () => {
          // …
        });
      });
    });
  });
});
```

…get this Mermaid flowchart ([show as plain text](https://github.com/arnaudrenaud/speccharts/blob/main/speccharts/setUserAsAdmin.spec.ts.mmd?short_path=37f24c6)):

```mermaid
flowchart TD
title["**example-test-suites/setUserAsAdmin.spec.ts**"]
N0(["setUserAsAdmin"])
N1["when authenticated user is not admin"]
N0 --> N1
N2(["throws exception"])
N1 --> N2
N3["when authenticated user is admin"]
N0 --> N3
N4["when email matches no user in database"]
N3 --> N4
N5["when user not found in ERP"]
N4 --> N5
N6(["throws exception"])
N5 --> N6
N7["when user found in ERP"]
N4 --> N7
N8(["creates user from ERP, sets as admin in database"])
N7 --> N8
N9["when email matches user in database"]
N3 --> N9
N10["when user already has admin role"]
N9 --> N10
N11(["throws exception"])
N10 --> N11
N12["when user has no admin role"]
N9 --> N12
N13(["sets as admin in database, does not call ERP"])
N12 --> N13
```

## Command-line interface

```sh
npx speccharts -i "src/**/*.{spec,test}.{ts,tsx}" -o speccharts
```

Output:

```
🔎 Found 3 spec files:
src/app/page.spec.tsx
src/services/Service.spec.ts
src/e2e/index.e2e.spec.ts

✏️ Wrote 3 chart files:
speccharts/page.spec.tsx
speccharts/Service.spec.ts
speccharts/index.e2e.spec.ts
```
