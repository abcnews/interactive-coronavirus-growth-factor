import React from "react";
import { growthFactorFormatter } from "../utils";
import styles from "./styles.scss";
export const CurrentLabel = ({ labelText, value, primary = true }) => {
  const goodBadStyle = value < 1 ? styles.good : styles.bad;
  return (
    <p className={styles.current}>
      <span className={primary ? styles.primary : null}>{labelText}</span>
      <span className={`${styles.keyNumber} ${goodBadStyle}`}>
        {growthFactorFormatter(value)}
      </span>
    </p>
  );
};
