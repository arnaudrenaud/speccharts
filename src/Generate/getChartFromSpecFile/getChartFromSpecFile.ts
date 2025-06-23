import { File, SpecChart } from "../../types";
import { getSpecTree } from "../getSpecTree/getSpecTree";
import { getChart } from "../getChart/getChart";

export const getChartFromSpecFile = (specFile: File): SpecChart => {
  return {
    specFile,
    chart: getChart(getSpecTree(specFile)),
  };
};
