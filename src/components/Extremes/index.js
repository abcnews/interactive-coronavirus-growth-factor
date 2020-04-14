import React from "react";
import { growthFactorAccessor, growthFactorFormatter } from "../../utils";
import { format } from "date-fns";
import { least, greatest } from "d3-array";
import { colours } from "../../constants";
import styles from "./styles.scss";

const Extreme = ({ data, label, color }) =>
  growthFactorAccessor(data) ? (
    <dl style={{ color }}>
      <dt>{label}</dt>
      <dd>
        <strong>{growthFactorFormatter(data.growthFactor)}</strong>{" "}
        {format(data.date, "MMM do")}
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
