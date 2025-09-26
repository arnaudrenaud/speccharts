import { glob } from "fast-glob";
import fsExtra from "fs-extra";
import path from "path";

import { GENERATED_BY_SPECCHARTS_IDENTIFIER } from "../../chart-files/constants";

const COMMENT_PREFIXES = [
  `%% ${GENERATED_BY_SPECCHARTS_IDENTIFIER}`,
  `<!-- ${GENERATED_BY_SPECCHARTS_IDENTIFIER}`,
];

const DEFAULT_IGNORE_GLOBS = ["node_modules/**", ".git/**"];

function containsGeneratedLabel(content: string): boolean {
  if (!content.includes(GENERATED_BY_SPECCHARTS_IDENTIFIER)) {
    return false;
  }

  return COMMENT_PREFIXES.some((marker) => content.includes(marker));
}

export async function deleteGeneratedChartFiles(): Promise<string[]> {
  const candidatePaths = await glob("**/*", {
    cwd: process.cwd(),
    dot: true,
    onlyFiles: true,
    absolute: true,
    followSymbolicLinks: false,
    ignore: DEFAULT_IGNORE_GLOBS,
  });

  const removedPaths: string[] = [];

  for (const filePath of candidatePaths) {
    let content: string;
    try {
      content = await fsExtra.readFile(filePath, "utf8");
    } catch (error) {
      // Ignore files that cannot be read as text (binary or permission issues).
      continue;
    }

    if (!containsGeneratedLabel(content)) {
      continue;
    }

    await fsExtra.remove(filePath);

    const relativePath = path.relative(process.cwd(), filePath);
    removedPaths.push(relativePath || filePath);
  }

  return removedPaths;
}
