import React from "react";
import { growthFactorFormatter } from "../../utils";
import { colours } from "../../constants";
import styles from "./styles.scss";

export const CurrentLabel = ({
  labelText,
  value,
  primary = true,
  first = false
}) => {
  const { goodText, badText } = colours;
  return (
    <div
      className={`${styles.current} ${primary ? styles.primary : null}  ${
        first ? styles.first : null
      }`}
    >
      <span>{labelText}</span>
      <span
        className={`${styles.keyNumber}`}
        style={{
          color:
            value === null
              ? "#a5b3b6"
              : +value.toFixed(2) < 1
              ? goodText
              : badText
        }}
      >
        {growthFactorFormatter(value)}
      </span>
    </div>
  );
};
