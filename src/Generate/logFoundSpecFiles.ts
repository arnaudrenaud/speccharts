export function logFoundSpecFiles(specFilePaths: string[]) {
  console.log(
    `Found ${specFilePaths.length} spec files:\n${specFilePaths.join("\n")}`
  );
}
