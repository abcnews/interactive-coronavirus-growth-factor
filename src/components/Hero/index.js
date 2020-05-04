import React from "react";
import styles from "./styles.scss";
import {
  growthFactorAccessor,
  dailyGrowthFactorMapper,
  getAccessor,
  getStorer,
  dataToSeries,
  getAvgNewCases
} from "../../utils";
import {
  colours,
  defaultDaysToShow,
  defaultSmoothingPeriod,
  defaultInnerHeight,
  defaultInnerHeightDomain
} from "../../constants";
import { GrowthFactorChart } from "../Charts";
import { Extremes } from "../Extremes";
import { CurrentLabel } from "../CurrentLabel";

export const Hero = ({
  data,
  smoothing = defaultSmoothingPeriod,
  days = defaultDaysToShow,
  innerHeight = defaultInnerHeight
}) => {
  const series = dataToSeries(data, smoothing);
  const currentGrowthFactor = growthFactorAccessor(series[series.length - 1]);
  const labelText = (
    <>
      Australia's current <br />
      growth factor is{" "}
    </>
  );

  return (
    <div className={styles.hero}>
      <CurrentLabel
        labelText={labelText}
        value={currentGrowthFactor}
        first={true}
      />
      <GrowthFactorChart
        data={series.slice(-days)}
        innerHeight={innerHeight}
        innerHeightDomain={defaultInnerHeightDomain}
        shimColor={colours.shim}
        latest={getAvgNewCases(data, smoothing)}
      />
      <Extremes data={series} className={styles.extremes} emphasise={true} />
    </div>
  );
};
