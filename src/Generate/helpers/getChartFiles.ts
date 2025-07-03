import path from "path";

import { SpecChart, File } from "../types";

export const getChartFiles = (
  charts: SpecChart[],
  outputDirectoryPath: string
): File[] => {
  return charts.map(({ testFile, chart }) => ({
    path: `${path.join(outputDirectoryPath, path.basename(testFile.path))}.mmd`,
    content: chart,
  }));
};
