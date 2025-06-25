export function logTestFilesFound(testFilePaths: string[]) {
  console.log(
    `Found ${testFilePaths.length} test files:\n${testFilePaths.join("\n")}`
  );
}
