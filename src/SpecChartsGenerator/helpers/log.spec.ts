import path from "path";
import { Logger } from "./log";
import { File } from "../../types";

describe("Logger", () => {
  let mockLog: jest.Mock;
  const workingDirectory = "/Users/test/project";

  beforeEach(() => {
    mockLog = jest.fn();
  });

  describe("logSpecFilesFound", () => {
    it("logs a single spec file with correct singular form", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const specFilePaths = [path.join(workingDirectory, "src/test.spec.ts")];

      logger.logSpecFilesFound(specFilePaths);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(/🔎 Found 1 spec file:\nsrc[/\\]test\.spec\.ts\n/);
    });

    it("logs multiple spec files with correct plural form", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const specFilePaths = [
        path.join(workingDirectory, "src/test1.spec.ts"),
        path.join(workingDirectory, "src/test2.spec.ts"),
        path.join(workingDirectory, "src/test3.spec.ts"),
      ];

      logger.logSpecFilesFound(specFilePaths);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(
        /🔎 Found 3 spec files:\nsrc[/\\]test1\.spec\.ts\nsrc[/\\]test2\.spec\.ts\nsrc[/\\]test3\.spec\.ts\n/
      );
    });

    it("converts absolute paths to relative paths", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const specFilePaths = [
        path.join(workingDirectory, "src/nested/deep/test.spec.ts"),
      ];

      logger.logSpecFilesFound(specFilePaths);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(
        /🔎 Found 1 spec file:\nsrc[/\\]nested[/\\]deep[/\\]test\.spec\.ts\n/
      );
    });

    it("uses process.cwd() as default working directory", () => {
      const logger = new Logger(mockLog);
      const cwd = process.cwd();
      const specFilePaths = [path.join(cwd, "test.spec.ts")];

      logger.logSpecFilesFound(specFilePaths);

      const call = mockLog.mock.calls[0][0];
      expect(call).toBe(`🔎 Found 1 spec file:\ntest.spec.ts\n`);
    });
  });

  describe("logChartFilesWritten", () => {
    it("logs a single chart file with correct singular form", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const filesWritten: File[] = [
        {
          path: path.join(workingDirectory, "src/chart.mmd"),
          content: "graph TD",
        },
      ];

      logger.logChartFilesWritten(filesWritten);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(/✏️ Wrote 1 chart file:\nsrc[/\\]chart\.mmd/);
    });

    it("logs multiple chart files with correct plural form", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const filesWritten: File[] = [
        {
          path: path.join(workingDirectory, "src/chart1.mmd"),
          content: "graph TD",
        },
        {
          path: path.join(workingDirectory, "src/chart2.mmd"),
          content: "graph TD",
        },
      ];

      logger.logChartFilesWritten(filesWritten);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(
        /✏️ Wrote 2 chart files:\nsrc[/\\]chart1\.mmd\nsrc[/\\]chart2\.mmd/
      );
    });

    it("converts absolute paths to relative paths", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const filesWritten: File[] = [
        {
          path: path.join(workingDirectory, "output/charts/spec.mmd"),
          content: "graph TD",
        },
      ];

      logger.logChartFilesWritten(filesWritten);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(
        /✏️ Wrote 1 chart file:\noutput[/\\]charts[/\\]spec\.mmd/
      );
    });
  });

  describe("logChartFilesRemoved", () => {
    it("does not log when no files are removed", () => {
      const logger = new Logger(mockLog, workingDirectory);

      logger.logChartFilesRemoved([]);

      expect(mockLog).not.toHaveBeenCalled();
    });

    it("logs a single removed file with correct singular form", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const paths = [path.join(workingDirectory, "src/old-chart.mmd")];

      logger.logChartFilesRemoved(paths);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(
        /🧹 Deleted 1 existing chart file:\nsrc[/\\]old-chart\.mmd\n/
      );
    });

    it("logs multiple removed files with correct plural form", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const paths = [
        path.join(workingDirectory, "src/old-chart1.mmd"),
        path.join(workingDirectory, "src/old-chart2.mmd"),
        path.join(workingDirectory, "src/old-chart3.mmd"),
      ];

      logger.logChartFilesRemoved(paths);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(
        /🧹 Deleted 3 existing chart files:\nsrc[/\\]old-chart1\.mmd\nsrc[/\\]old-chart2\.mmd\nsrc[/\\]old-chart3\.mmd\n/
      );
    });

    it("converts absolute paths to relative paths", () => {
      const logger = new Logger(mockLog, workingDirectory);
      const paths = [path.join(workingDirectory, "dist/generated/chart.mmd")];

      logger.logChartFilesRemoved(paths);

      const call = mockLog.mock.calls[0][0];
      expect(call).toMatch(
        /🧹 Deleted 1 existing chart file:\ndist[/\\]generated[/\\]chart\.mmd\n/
      );
    });
  });
});
