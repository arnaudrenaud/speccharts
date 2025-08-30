import path from "path";

import { SpecChart, File } from "../types";
import { gatherChartsInMarkdown } from "./gatherChartsInMarkdown";

export const getChartFiles = (
  charts: SpecChart[],
  outputDirectoryPath: string,
  { singleOutputFile }: { singleOutputFile: boolean }
): File[] => {
  if (singleOutputFile) {
    return [
      {
        path: `${outputDirectoryPath}/speccharts.md`,
        content: gatherChartsInMarkdown(charts),
      },
    ];
  } else {
    return charts.map(({ testFile, chart }) => ({
      path: `${path.join(
        outputDirectoryPath,
        path.basename(testFile.path)
      )}.mmd`,
      content: chart,
    }));
  }
};
