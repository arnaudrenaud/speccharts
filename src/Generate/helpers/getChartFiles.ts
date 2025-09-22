import path from "path";

import { SpecChart, File } from "../types";
import { gatherChartsInMarkdown } from "./gatherChartsInMarkdown";
import { getChartFileContent } from "./getChartFileContent";

export const getChartFiles = (
  charts: SpecChart[],
  outputDirectoryPath: string,
  { singleOutputFile }: { singleOutputFile: boolean }
): File[] => {
  if (singleOutputFile) {
    return [
      {
        path: `${outputDirectoryPath}/speccharts.md`,
        content: gatherChartsInMarkdown(charts, outputDirectoryPath),
      },
    ];
  } else {
    return charts.map(({ specFile, chart }) => ({
      path: `${path.join(
        outputDirectoryPath,
        path.basename(specFile.path)
      )}.mmd`,
      content: getChartFileContent(chart),
    }));
  }
};
