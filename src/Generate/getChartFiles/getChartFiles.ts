import path from "path";

import { SpecChart, File } from "../../types";

export const getChartFiles = (charts: SpecChart[]): File[] => {
  return charts.map(({ specFile, chart }) => ({
    path: `${path.basename(specFile.path)}.mmd`,
    content: chart,
  }));
};
