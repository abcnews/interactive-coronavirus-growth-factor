import React from "react";
import { growthFactorAccessor, growthFactorFormatter } from "../../utils";
import { least, greatest } from "d3-array";
import { colours, shortMonths } from "../../constants";
import styles from "./styles.scss";
const getGetOrdinal = n => {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const formatDate = date =>
  `${shortMonths[date.getMonth()]} ${getGetOrdinal(date.getDate())}`;
const Extreme = ({ data, label, color }) =>
  growthFactorAccessor(data) ? (
    <dl style={{ color }}>
      <dt>{label}</dt>
      <dd>
        <strong>{growthFactorFormatter(data.growthFactor)}</strong>{" "}
        {formatDate(data.date)}
      </dd>
    </dl>
  ) : null;

export const Extremes = ({ data, className, emphasise }) => {
  const series = data.filter(d => !!d.growthFactor);
  const low = least(series, growthFactorAccessor);
  const high = greatest(series, growthFactorAccessor);
  const extremes = [
    [high, "Highest"],
    [low, "Lowest"]
  ];
  return (
    <div className={`${styles.extremes} ${className}`}>
      {extremes.map(([data, label], i) => (
        <Extreme
          data={data}
          label={label}
          color={
            emphasise
              ? data.growthFactor > 1
                ? colours.badText
                : colours.goodText
              : "inherit"
          }
          key={i}
        />
      ))}
    </div>
  );
};
