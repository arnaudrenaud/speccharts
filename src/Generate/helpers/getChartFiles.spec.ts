import { getChartsInSingleFile } from "./getChartsInSingleFile/getChartsInSingleFile";
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

  describe("if `outputFilePath` is provided", () => {
    it("returns one Markdown file gathering all charts at the specified path", () => {
      const outputFilePath = "output.md";
      const result = getChartFiles(CHARTS, outputFilePath);

      expect(result).toEqual([
        {
          path: outputFilePath,
          content: getChartsInSingleFile(CHARTS, "."),
        },
      ]);
    });
  });

  describe("if `outputFilePath` is not provided", () => {
    it("returns one Mermaid file per chart next to spec file", () => {
      const result = getChartFiles(CHARTS);

      expect(result).toEqual([
        {
          path: `specFile1.ts.mmd`,
          content: getChartFileContent(CHARTS[0].chart),
        },
        {
          path: `specFile2.ts.mmd`,
          content: getChartFileContent(CHARTS[1].chart),
        },
      ]);
    });
  });
});
