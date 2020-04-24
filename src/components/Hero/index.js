import React from "react";
import styles from "./styles.scss";
import { addGrowthFactor, growthFactorAccessor } from "../../utils";
import { GrowthFactorChart } from "../Charts";
import { Extremes } from "../Extremes";
import { CurrentLabel } from "../CurrentLabel";
import { colours } from "../../constants";

export const Hero = ({ data, smoothing = 5, days = 35, innerHeight = 100 }) => {
  const series = addGrowthFactor(data, smoothing);
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
        shimColor={colours.shim}
      />
      <Extremes data={series} className={styles.extremes} emphasise={true} />
    </div>
  );
};
