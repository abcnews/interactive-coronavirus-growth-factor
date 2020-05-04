import React from "react";
import styles from "./styles.scss";
import {
  addGrowthFactor,
  growthFactorAccessor,
  dailyGrowthFactorMapper,
  getStorer,
  getAccessor,
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

export const Embed = ({
  jurisdiction,
  data,
  smoothing = defaultSmoothingPeriod,
  link = null,
  days = defaultDaysToShow,
  height = 300,
  innerheight = 60
}) => {
  const series = dataToSeries(data, smoothing);
  const currentGrowthFactor = growthFactorAccessor(series[series.length - 1]);
  const labelText = (
    <>
      {jurisdiction}'s current <br />
      growth factor is{" "}
    </>
  );

  return (
    <div
      className={styles.embed}
      style={{ backgroundColor: colours.embedBackground }}
    >
      <h1 className={styles.title}>
        To control the COVID-19 outbreak we need to keep growth factor{" "}
        <strong>below 1.0</strong>
      </h1>
      <CurrentLabel
        labelText={labelText}
        value={currentGrowthFactor}
        first="true"
      />
      <GrowthFactorChart
        data={series.slice(-days)}
        height={+height}
        innerHeight={+innerheight}
        innerHeightDomain={[0.9, 1.15]}
        shimColor={colours.embedShim}
        latest={getAvgNewCases(data, smoothing)}
      />
      <Extremes data={series} emphasise={true} className={styles.extremes} />
      {link ? (
        <a className={styles.more} href={link}>
          Find out more →
        </a>
      ) : null}
    </div>
  );
};
