import React, { useState, useEffect } from "react";
import styles from "./styles.scss";
import worm from "./worm.svg";
import { csvParse } from "d3-dsv";
import { parse, format } from "date-fns";
import { min, max, group, rollup, sum, ascending, pairs } from "d3-array";
import { Embed } from "../Embed";
import { SmallMultiples } from "../SmallMultiples";
import {
  trimDsiData,
  findMissingDays,
  findMiscalculations,
  groupByJurisdiction,
  sanityChecks
} from "../../utils";

export default props => {
  const [data, setData] = useState(null);
  const [jurisdiction, setJurisdication] = useState("National");
  const [smoothingPeriod, setSmoothingPeriod] = useState(
    localStorage["smoothingPeriod"] || 1
  );
  const selectedJurisdiction =
    jurisdiction && data ? data.get(jurisdiction) : null;

  // Load data

  useEffect(() => {
    fetch("/data/hybrid-country-totals.json")
      .then(res => res.json())
      .then(parseHybridData)
      .then(groupByJurisdiction)
      .then(calculateNewCases)
      .then(setData);
  }, []);

  // Can't use this direct until we fill in missing dates.
  useEffect(() => {
    fetch(
      "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Daily%20Count%20States!A:E"
    )
      .then(res => res.text())
      .then(csvParse)
      .then(parseDsiData)
      .then(trimDsiData)
      .then(addNationalData)
      .then(groupByJurisdiction)
      .then(sanityChecks);
    // .then(console.log);
  }, []);

  console.log("data", data);

  const tabs = data ? (
    <ul className={styles.tabs}>
      {Array.from(data.keys()).map(jurisdiction => (
        <li
          className={styles.tab}
          key={jurisdiction}
          onClick={e => setJurisdication(jurisdiction)}
        >
          {jurisdiction}
        </li>
      ))}
    </ul>
  ) : null;

  const smoothingPeriodSelector = (
    <>
      <label htmlFor="smoothingPeriod">
        Smoothing period
        <input
          id="smoothingPeriod"
          type="range"
          value={smoothingPeriod}
          min={1}
          max={30}
          onChange={ev => {
            setSmoothingPeriod(ev.target.value);
            localStorage["smoothingPeriod"] = ev.target.value;
          }}
        />
      </label>
      <p>{smoothingPeriod}</p>
    </>
  );

  const old = data ? (
    <div className={styles.root}>
      {smoothingPeriodSelector}
      {[
        { title: "Daily growth rate", Component: JurisdictionGrowthRate },
        { title: "Daily growth factor", Component: JurisdictionGrowthFactor }
      ].map(({ title, Component }) => (
        <div key={title}>
          <h1>{title}</h1>
          <div className={styles.charts}>
            {Array.from(data).map(([jurisdiction, data]) => (
              <Component
                key={jurisdiction}
                name={jurisdiction}
                smoothing={smoothingPeriod}
                data={data}
              />
            ))}
          </div>
        </div>
      ))}

      <img className={styles.worm} src={worm} />
    </div>
  ) : null;

  return data ? (
    <>
      <h1>Embed</h1>
      <div style={{ margin: 10, maxWidth: 340 }}>
        <Embed jurisdiction="Australia" data={data.get("Australia")} />
      </div>

      <h1>Small multiples</h1>
      <div className={styles.charts}>
        {Array.from(data).map(([jurisdiction, data], i) => (
          <div key={jurisdiction} style={{ margin: 10, width: 300 }}>
            <SmallMultiples
              jurisdiction={jurisdiction}
              data={data}
              primary={i === 0}
            />
          </div>
        ))}
      </div>
    </>
  ) : null;
};
