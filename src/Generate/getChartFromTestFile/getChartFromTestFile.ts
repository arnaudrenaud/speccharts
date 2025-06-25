import { File, SpecChart } from "../../types";
import { getSpecTree } from "../getSpecTree/getSpecTree";
import { getChart } from "../getChart/getChart";

export const getChartFromTestFile = (testFile: File): SpecChart => {
  return {
    testFile,
    chart: getChart(getSpecTree(testFile)),
  };
};
