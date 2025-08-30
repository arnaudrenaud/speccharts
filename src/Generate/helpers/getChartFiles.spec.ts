import { gatherChartsInMarkdown } from "./gatherChartsInMarkdown";
import { getChartFiles } from "./getChartFiles";

describe("getChartFiles", () => {
  const CHARTS = [
    {
      testFile: { path: "testFile1.ts", content: "testFile1" },
      chart: "flowchart TD\nfirst chart…",
    },
    {
      testFile: { path: "testFile2.ts", content: "testFile2" },
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
          path: `outputDirectoryPath/${CHARTS[0].testFile.path}.mmd`,
          content: CHARTS[0].chart,
        },
        {
          path: `outputDirectoryPath/${CHARTS[1].testFile.path}.mmd`,
          content: CHARTS[1].chart,
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
          content: gatherChartsInMarkdown(CHARTS),
        },
      ]);
    });
  });
});
