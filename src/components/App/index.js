import React, { useState, useEffect } from "react";
import styles from "./styles.scss";
import worm from "./worm.svg";
import { csvParse } from "d3-dsv";
import { parse, format } from "date-fns";
import { min, max, group, rollup, sum, ascending } from "d3-array";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  console.log("active, payload, label", active, payload, label);

  return active ? (
    <div className={styles.tooltipWrapper}>
      <strong>{`${format(payload[0].payload.date, "MMMM d")}`}</strong>
      <br />
      {`${(payload[0].value * 100).toFixed(1)}%`}
    </div>
  ) : null;
};

const calcGrowths = (n, i, arr) => {
  const one = arr[i - 1];
  const three = arr[i - 3];
  const five = arr[i - 5];

  return {
    ...n,
    g1: one ? Math.pow(n.cumulative / one.cumulative, 1 / 1) - 1 : null,
    g3: three ? Math.pow(n.cumulative / three.cumulative, 1 / 3) - 1 : null,
    g5: five ? Math.pow(n.cumulative / five.cumulative, 1 / 5) - 1 : null,
    gf1: one ? n.added / one.added : null
  };
};

const addGrowths = groups => {
  const keys = Array.from(groups.keys());
  const mod = new Map();
  keys.forEach(key => {
    const data = groups.get(key);
    mod.set(key, data.map(calcGrowths));
  });
  return mod;
};

const findMissingDays = d => {
  const minDay = min(d, d => d.timestamp);
  const maxDay = max(d, d => d.timestamp);
  const missing = [];

  for (var day = minDay; day <= maxDay; day += 3600 * 24 * 1000) {
    if (!d.filter(d => d.timestamp === day)) {
      missing.push(day);
    }
  }

  return missing;
};

const findMiscalculations = d => {
  const miscalculations = [];
  for (var i = 1; i < d.length; i++) {
    if (d[i - 1].cumulative + d[i].added !== d[i].cumulative) {
      miscalculations.push(d[i].date);
    }
  }
  return miscalculations;
};

// Trim the most recent day if it doesn't have figures for all jurisdictions.
const trimData = data => {
  const maxDay = max(data, d => d.timestamp);
  return data.filter(d => d.timestamp === maxDay).length < 8
    ? data.filter(d => d.timestamp !== maxDay)
    : data;
};

const addNationalData = data => {
  return data.concat(
    Array.from(
      rollup(
        data,
        v => sum(v, d => d.cumulative),
        d => d.timestamp
      )
    ).map((d, i, arr) => ({
      date: new Date(d[0]),
      timestamp: d[0],
      jurisdiction: "National",
      cumulative: d[1],
      added: (arr[i - 1] ? d[1] - arr[i - 1][1] : d[1]) || d[1]
    }))
  );
};

const groupByJurisdiction = data => group(data, d => d.jurisdiction);

const parseData = data => {
  return data
    .map(d => {
      const date = parse(d["Date announced"], "dd/MM/yyyy", new Date());
      return {
        date,
        timestamp: date.getTime(),
        jurisdiction: d["State/territory"],
        cumulative: +d["Cumulative confirmed"],
        added: +d["New cases"]
      };
    })
    .filter(d => d.cumulative > 0)
    .sort((a, b) => ascending(a.timestamp, b.timestamp));

  // Group and calculate growth rates
  // const grouped = group(
  //   [...parsed, ...national].map(d =>
  //     Object.assign(d, { growth: d.added / (d.cumulative - d.added) })
  //   ),
  //   d => d.jurisdiction
  // ).forEach(g => value.map(calcGrowths)]);
  //
  // console.log(findMissingDays(grouped.filter(d => d[0] === "NSW")[0][1]));
};

export default props => {
  const [data, setData] = useState(null);
  const [jurisdiction, setJurisdication] = useState("National");
  const selection = jurisdiction && data ? data.get(jurisdiction) : null;
  // Load data
  useEffect(() => {
    fetch(
      "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Daily%20Count%20States!A:E"
    )
      .then(res => res.text())
      .then(csvParse)
      .then(parseData)
      .then(trimData)
      .then(addNationalData)
      .then(groupByJurisdiction)
      .then(addGrowths)
      .then(setData);
  }, []);

  // Sanity check
  if (data) {
    console.log("data", data);
    Array.from(data).forEach(([jurisdiction, data]) => {
      const missing = findMissingDays(data);
      if (missing.length > 0) {
        console.error(
          `Missing days for ${jurisdiction}: ${missing.join(", ")}`
        );
      }

      const miscalculations = findMiscalculations(data);
      if (miscalculations.length > 0) {
        console.error(
          `Miscalculations for ${jurisdiction} on the following days: ${miscalculations.join(
            ", "
          )}`
        );
      }
    });
  }
  console.log("selection", selection);

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

  const averagingPeriod = "g5";

  return selection ? (
    <div className={styles.root}>
      <p className={styles.label}>Daily growth rate</p>
      <h1>
        {(selection[selection.length - 1][averagingPeriod] * 100).toFixed(1)}%
      </h1>
      <LineChart
        width={200}
        height={80}
        data={data.get(jurisdiction).filter(d => !!d[averagingPeriod])}
      >
        <Line
          type="monotone"
          dataKey={averagingPeriod}
          stroke="#8884d8"
          strokeWidth={1}
          dot={false}
        />
        <YAxis
          allowDataOverflow={true}
          tick={{ fontSize: "0.8rem" }}
          tickFormatter={d => `${(d * 100).toFixed(0)}%`}
          domain={[0, 0.3]}
          width={30}
          orientation="right"
        />

        <Tooltip content={<CustomTooltip />} />
      </LineChart>
      <img className={styles.worm} src={worm} />
    </div>
  ) : null;
};
