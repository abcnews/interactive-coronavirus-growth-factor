import React from "react";
import styles from "./styles.scss";
import {
  addGrowthFactor,
  growthFactorAccessor,
  jurisdictionName
} from "../utils";
import { GrowthFactorChart } from "../Charts";
import { Extremes } from "../Extremes";
import { CurrentLabel } from "../CurrentLabel";

export const SmallMultiples = ({ jurisdiction, data, smoothing = 5 }) => {
  const series = addGrowthFactor(data, smoothing);
  const currentGrowthFactor = growthFactorAccessor(series[series.length - 1]);
  const labelText = (
    <>
      current daily
      <br />
      growth factor:
    </>
  );

  return (
    <div className={styles.chart}>
      <h1 className={styles.title}>{jurisdictionName(jurisdiction)}</h1>
      <CurrentLabel labelText={labelText} value={currentGrowthFactor} />
      <GrowthFactorChart data={series.slice(-30)} />
      <Extremes data={series} />
    </div>
  );
};
