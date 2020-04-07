import React, { useState, useEffect } from "react";
import styles from "./styles.scss";
import { pairs, least, greatest } from "d3-array";
import { addGrowthFactor } from "../utils";
import { format } from "date-fns";
import { GrowthFactorChart } from "../Charts";

export const Embed = ({ jurisdiction, data }) => {
  const smoothing = 5;
  const series = addGrowthFactor(data, smoothing);
  const low = least(
    series.filter(d => !!d.growthFactor),
    d => d.growthFactor
  );
  const high = greatest(
    series.filter(d => !!d.growthFactor),
    d => d.growthFactor
  );
  const currentGrowthFactor = series[series.length - 1].growthFactor;
  return (
    <div className={styles.embed}>
      <h1>
        We need to keep growth factor <strong>below 1.0</strong> to stop the
        exponential growth of COVID-19 cases
      </h1>
      <p className={styles.current}>
        <span>
          {jurisdiction}'s current <br />
          growth factor is{" "}
        </span>
        <span
          className={`${styles.keyNumber} ${
            currentGrowthFactor < 1 ? styles.good : styles.bad
          }`}
        >
          {currentGrowthFactor ? currentGrowthFactor.toFixed(2) : "?"}
        </span>
      </p>
      <GrowthFactorChart data={series.slice(-30)} />
      <div className={styles.highLow}>
        {high ? (
          <dl className={styles.high}>
            <dt>Highest</dt>
            <dd>
              <strong>{high.growthFactor.toFixed(2)}</strong>{" "}
              {format(high.date, "MMM do")}
            </dd>
          </dl>
        ) : null}
        {low ? (
          <dl className={styles.low}>
            <dt>Lowest</dt>
            <dd>
              <strong>{low.growthFactor.toFixed(2)}</strong>{" "}
              {format(low.date, "MMM do")}
            </dd>
          </dl>
        ) : null}
      </div>
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
