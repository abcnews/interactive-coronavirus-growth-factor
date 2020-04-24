import * as a2o from "@abcnews/alternating-case-to-object";
import React from "react";
import { render } from "react-dom";
import { sum, min, max, pairs, ascending } from "d3-array";
import { csvParse } from "d3-dsv";
import {
  dataUrl,
  jurisdictionsOfInterest,
  localAcquisitionDataUrl
} from "./constants";
import { parse, parseISO } from "date-fns";
import { Embed } from "./components/Embed";

export const addNationalData = data => {
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

export const parseHybridData = data => {
  return data
    .reduce((acc, [jurisdiction, values]) => {
      const objs = Object.entries(values).map(([dateString, cumulative]) => {
        const date = parse(dateString, "yyyy-MM-dd", new Date());
        return { date, timestamp: date.getTime(), jurisdiction, cumulative };
      });
      return acc.concat(objs);
    }, [])
    .sort((a, b) => ascending(a.timestamp, b.timestamp));
};

export const calcNewCases = (d, i, arr) => ({
  ...d,
  added: i === 0 ? d.cumulative : d.cumulative - arr[i - 1].cumulative
});

export const calculateNewCases = groups => {
  const mod = new Map();
  groups.forEach((data, key) => {
    mod.set(key, data.map(calcNewCases));
  });
  return mod;
};
export const groupByJurisdiction = data => {
  const grouped = new Map();
  data.forEach(d => {
    let group = grouped.get(d.jurisdiction);
    if (group) {
      group.push(d);
    } else {
      grouped.set(d.jurisdiction, [d]);
    }
  });
  return grouped;
};

export const movingAverage = (
  data,
  smoothing = 1,
  accessor = d => d,
  storer = v => v
) =>
  data.reduce(
    (acc, d, i, arr) =>
      i < smoothing - 1
        ? acc
        : acc.concat(
            storer(
              arr
                .slice(i - smoothing + 1, i + 1)
                .reduce((t, d) => t + accessor(d), 0) / smoothing,
              d
            )
          ),
    []
  );

export const growthFactor = (data, accessor = d => d) =>
  pairs(data, (a, b) => ({
    ...b,
    growthFactor: accessor(a) < 5 ? null : accessor(b) / accessor(a)
  }));

export const growthFactorAccessor = d => d && d.growthFactor;
export const growthFactorFormatter = d => (d ? d.toFixed(2) : "-");

export const addGrowthFactor = (data, smoothing = 1) =>
  growthFactor(
    movingAverage(
      data,
      smoothing,
      d => d.added,
      (v, { date, cumulative, added }) => ({
        date,
        cumulative,
        new: added,
        added: v
      })
    ),
    d => d.added
  );

export const findGaps = data => {
  return pairs(
    pairs(data)
      .map(([a, b], i, arr) => {
        if (i === 0 && a.growthFactor === null) return "start";
        if (a.growthFactor !== null && b.growthFactor === null) return a;
        if (a.growthFactor === null && b.growthFactor !== null) return b;
        if (i === arr.length - 1 && b.growthFactor === null) return "end";
        return null;
      })
      .filter(d => d !== null)
  ).filter((d, i) => i % 2 === 0);
};

export const sanityChecks = data => {
  Array.from(groupByJurisdiction(data)).forEach(([jurisdiction, data]) => {
    const missing = findMissingDays(data);
    if (missing.length > 0) {
      console.error(`Missing days for ${jurisdiction}: ${missing.join(", ")}`);
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
};

export const jurisdictionName = name => {
  const map = new Map();
  map.set("Korea, South", "South Korea");
  map.set("US", "United States");
  return map.get(name) || name;
};

const mixinLocalAcquisitionData = data => {
  return fetch(localAcquisitionDataUrl)
    .then(res => res.json())
    .then(localAcquisitionsData =>
      data
        .concat(
          localAcquisitionsData.map(d => {
            const date = parseISO(d.date);
            const timestamp = +date;
            return { ...d, date, timestamp };
          })
        )
        .sort((a, b) => ascending(a.timestamp, b.timestamp))
    );
};

export const fetchCountryTotals = () =>
  fetch(dataUrl)
    .then(res => res.json())
    .then(Object.entries)
    .then(parseHybridData)
    .then(mixinLocalAcquisitionData)
    .then(groupByJurisdiction)
    .then(calculateNewCases)
    .catch(console.error);
