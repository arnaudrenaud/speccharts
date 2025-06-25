import path from "path";

import { SpecChart, File } from "../../types";

export const getChartFiles = (
  charts: SpecChart[],
  outputDirectoryPath: string
): File[] => {
  return charts.map(({ specFile, chart }) => ({
    path: `${path.join(outputDirectoryPath, path.basename(specFile.path))}.mmd`,
    content: chart,
  }));
};
