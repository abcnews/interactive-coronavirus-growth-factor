import React from "react";
import styles from "./styles.scss";
import { format } from "date-fns";

export const GrowthRateTooltip = ({ active, payload, label }) => {
  return active ? (
    <div className={styles.tooltipWrapper}>
      <strong>{`${format(payload[0].payload.date, "MMMM d")}`}</strong>
      <br />
      {`${(payload[0].value * 100).toFixed(1)}%`}
    </div>
  ) : null;
};

export const GrowthFactorTooltip = ({ active, payload, label }) => {
  return active && !!payload[0] ? (
    <div className={styles.tooltipWrapper}>
      <strong>{`${format(payload[0].payload.date, "MMMM d")}`}</strong>
      <br />
      {`${payload[0].value.toFixed(2)}`}
    </div>
  ) : null;
};
