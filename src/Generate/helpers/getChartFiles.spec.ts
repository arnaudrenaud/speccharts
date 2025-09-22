import { gatherChartsInMarkdown } from "./gatherChartsInMarkdown/gatherChartsInMarkdown";
import { getChartFiles } from "./getChartFiles";
import { getChartFileContent } from "./getChartFileContent";

describe("getChartFiles", () => {
  const CHARTS = [
    {
      specFile: { path: "specFile1.ts", content: "specFile1" },
      chart: "flowchart TD\nfirst chart…",
    },
    {
      specFile: { path: "specFile2.ts", content: "specFile2" },
      chart: "flowchart TD\nsecond chart…",
    },
  ];

  describe("if `singleOutputFile` is false", () => {
    it("returns one Mermaid file per chart", () => {
      const result = getChartFiles(CHARTS, "outputDirectoryPath", {
        singleOutputFile: false,
      });

      expect(result).toEqual([
        {
          path: `outputDirectoryPath/${CHARTS[0].specFile.path}.mmd`,
          content: getChartFileContent(CHARTS[0].chart),
        },
        {
          path: `outputDirectoryPath/${CHARTS[1].specFile.path}.mmd`,
          content: getChartFileContent(CHARTS[1].chart),
        },
      ]);
    });
  });

  describe("if `singleOutputFile` is true", () => {
    it("returns one Markdown file gathering all charts", () => {
      const result = getChartFiles(CHARTS, "outputDirectoryPath", {
        singleOutputFile: true,
      });

      expect(result).toEqual([
        {
          path: "outputDirectoryPath/speccharts.md",
          content: gatherChartsInMarkdown(CHARTS, "outputDirectoryPath"),
        },
      ]);
    });
  });
});
