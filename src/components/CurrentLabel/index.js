import React from "react";
import { growthFactorFormatter } from "../../utils";
import styles from "./styles.scss";
export const CurrentLabel = ({
  labelText,
  value,
  primary = true,
  first = false
}) => {
  const goodBadStyle = value < 1 ? styles.good : styles.bad;
  return (
    <div
      className={`${styles.current} ${primary ? styles.primary : null}  ${
        first ? styles.first : null
      }`}
    >
      <span>{labelText}</span>
      <span className={`${styles.keyNumber} ${goodBadStyle}`}>
        {growthFactorFormatter(value)}
      </span>
    </div>
  );
};
