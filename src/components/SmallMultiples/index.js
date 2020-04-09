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
  primary = false
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
      />
      <GrowthFactorChart
        data={series.slice(-30)}
        innerHeightDomain={[0.7, 2]}
        height={300}
      />
      <Extremes deempphasise={true} data={series} />
    </div>
  );
};

export const SmallMultiples = ({ preset, data }) => {
  const config = presets[preset];
  return config ? (
    <div className={styles.smallMultipes}>
      {Array.from(data)
        .filter(([jurisdiction]) => config.jurisdictions.includes(jurisdiction))
        .map(([jurisdiction, data], i) => (
          <SingleJurisdiction
            jurisdiction={jurisdiction}
            data={data}
            primary={i === 0}
          />
        ))}
    </div>
  ) : null;
};
