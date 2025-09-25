import { File, SpecChart } from "../../types";
import { getSpecTree } from "../core/getSpecTree/getSpecTree";
import { getChart } from "../core/getChart/getChart";

export const getChartFromSpecFile = (specFile: File): SpecChart => {
  return {
    specFile,
    chart: getChart(getSpecTree(specFile)),
  };
};
