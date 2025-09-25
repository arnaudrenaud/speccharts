import path from "path";

import { getChartsInSingleFile } from "../getChartsInSingleFile/getChartsInSingleFile";
import { getChartFileContent } from "../getChartFileContent";
import { SpecChart, File } from "../../types";

export const getChartFiles = (
  charts: SpecChart[],
  singleOutputFilePath?: string
): File[] => {
  return singleOutputFilePath
    ? [
        {
          path: singleOutputFilePath,
          content: getChartsInSingleFile(
            charts,
            path.dirname(singleOutputFilePath)
          ),
        },
      ]
    : charts.map(({ specFile, chart }) => ({
        path: path.join(
          path.dirname(specFile.path),
          `${path.basename(specFile.path)}.mmd`
        ),
        content: getChartFileContent(chart),
      }));
};
