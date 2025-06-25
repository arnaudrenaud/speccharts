import { File, SpecChart } from "../../types";
import { getSpecTree } from "../core/getSpecTree/getSpecTree";
import { getChart } from "../core/getChart/getChart";

export const getChartFromTestFile = (testFile: File): SpecChart => {
  return {
    testFile,
    chart: getChart(getSpecTree(testFile)),
  };
};
