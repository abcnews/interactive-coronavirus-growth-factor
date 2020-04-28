import React from "react";
import styles from "./styles.scss";
import {
  growthFactorAccessor,
  jurisdictionName,
  filterByJurisdiction,
  dailyGrowthFactorMapper,
  getAccessor,
  getStorer,
  dataToSeries
} from "../../utils";
import {
  presets,
  colours,
  defaultDaysToShow,
  defaultSmoothingPeriod,
  defaultInnerHeight,
  defaultInnerHeightDomain
} from "../../constants";
import { ascending } from "d3-array";
import { GrowthFactorChart } from "../Charts";
import { Extremes } from "../Extremes";
import { CurrentLabel } from "../CurrentLabel";

const SingleJurisdiction = ({
  jurisdiction,
  data,
  smoothing = defaultSmoothingPeriod,
  primary = false,
  first = false,
  days = defaultDaysToShow
}) => {
  const series = dataToSeries(data, smoothing);

  const currentGrowthFactor = growthFactorAccessor(series[series.length - 1]);
  const labelText = (
    <>
      current daily
      <br />
      growth factor:
    </>
  );

  return (
    <div
      className={styles.chart}
      style={{ backgroundColor: colours.background }}
    >
      <h1 className={styles.title}>{jurisdictionName(jurisdiction)}</h1>
      <CurrentLabel
        labelText={labelText}
        value={currentGrowthFactor}
        primary={primary}
        first={first}
      />
      <GrowthFactorChart
        data={series.slice(-days)}
        innerHeightDomain={defaultInnerHeightDomain}
        height={150}
        shimColor={colours.shim}
      />
      <Extremes deempphasise={true} data={series} />
    </div>
  );
};

export const SmallMultiples = ({ preset, data, days }) => {
  const config = presets[preset];
  const dataArr = [];
  data.forEach((jurisdictionData, jurisdiction) =>
    dataArr.push([jurisdiction, jurisdictionData])
  );
  return config ? (
    <div className={styles.smallMultipes}>
      {dataArr
        .filter(
          config.jurisdictions
            ? ([jurisdiction]) => config.jurisdictions.includes(jurisdiction)
            : () => true
        )
        .sort(([a], [b]) =>
          ascending(
            jurisdictionName(a).toLowerCase(),
            jurisdictionName(b).toLowerCase()
          )
        )
        .map(([jurisdiction, data], i) => (
          <SingleJurisdiction
            key={jurisdiction}
            jurisdiction={jurisdiction}
            data={data}
            first={i === 0}
            primary={false}
            days={days}
          />
        ))}
    </div>
  ) : null;
};
