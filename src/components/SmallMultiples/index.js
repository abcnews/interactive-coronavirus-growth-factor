import React from "react";
import styles from "./styles.scss";
import {
  addGrowthFactor,
  growthFactorAccessor,
  jurisdictionName,
  filterByJurisdiction
} from "../../utils";
import { GrowthFactorChart } from "../Charts";
import { Extremes } from "../Extremes";
import { CurrentLabel } from "../CurrentLabel";
import { presets } from "../../constants";

export const SingleJurisdiction = ({
  jurisdiction,
  data,
  smoothing = 5,
  primary = false,
  first = false,
  limit = 30
}) => {
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
      <CurrentLabel
        labelText={labelText}
        value={currentGrowthFactor}
        primary={primary}
        first={first}
      />
      <GrowthFactorChart
        data={series.slice(-limit)}
        innerHeightDomain={[0.7, 2]}
        height={150}
      />
      <Extremes deempphasise={true} data={series} />
    </div>
  );
};

export const SmallMultiples = ({ preset, data, limit }) => {
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
        .map(([jurisdiction, data], i) => (
          <SingleJurisdiction
            key={jurisdiction}
            jurisdiction={jurisdiction}
            data={data}
            first={i === 0}
            primary={false}
            limit={limit}
          />
        ))}
    </div>
  ) : null;
};
