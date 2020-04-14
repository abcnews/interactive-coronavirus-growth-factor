import React from "react";
import styles from "./styles.scss";
import { addGrowthFactor, growthFactorAccessor } from "../../utils";
import { GrowthFactorChart } from "../Charts";
import { Extremes } from "../Extremes";
import { CurrentLabel } from "../CurrentLabel";
import { colours } from "../../constants";

export const Embed = ({ jurisdiction, data, smoothing = 5, link = null }) => {
  const series = addGrowthFactor(data, smoothing);
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
        data={series.slice(-30)}
        height={200}
        innerHeight={60}
        shimColor={colours.embedShim}
      />
      <Extremes data={series} emphasise={true} className={styles.extremes} />
      {link ? (
        <a className={styles.more} href={link}>
          Find out more
        </a>
      ) : null}
    </div>
  );
};
