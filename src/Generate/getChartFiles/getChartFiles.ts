import path from "path";

import { SpecChart, FileWithContent } from "../../types";

export const getChartFiles = (charts: SpecChart[]): FileWithContent[] => {
  return charts.map(({ specFile, chart }) => ({
    path: `${path.basename(specFile.path)}.mmd`,
    content: chart,
  }));
};
