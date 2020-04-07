import React from "react";
import styles from "./styles.scss";
import { addGrowthFactor, growthFactorAccessor } from "../utils";
import { GrowthFactorChart } from "../Charts";
import { Extremes } from "../Extremes";
import { CurrentLabel } from "../CurrentLabel";

export const Embed = ({ jurisdiction, data, smoothing = 5 }) => {
  const series = addGrowthFactor(data, smoothing);
  const currentGrowthFactor = growthFactorAccessor(series[series.length - 1]);
  const labelText = (
    <>
      {jurisdiction}'s current <br />
      growth factor is{" "}
    </>
  );
  return (
    <div className={styles.embed}>
      <h1 className={styles.title}>
        We need to keep growth factor <strong>below 1.0</strong> to stop the
        exponential growth of COVID-19 cases
      </h1>
      <CurrentLabel labelText={labelText} value={currentGrowthFactor} />
      <GrowthFactorChart data={series.slice(-30)} />
      <Extremes data={series} className={styles.extremes} />
      <a className={styles.more} href="">
        Find out more
      </a>
      <footer className={styles.footer}>
        <p>
          A dotted grey line ( ) indicates that no data was available. There are
          numerous success stories you will hear about businesses making it good
          on the internet.
        </p>
      </footer>
    </div>
  );
};
