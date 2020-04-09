import * as a2o from "@abcnews/alternating-case-to-object";
import React from "react";
import { render } from "react-dom";
import { sum, min, max, pairs, rollups, ascending } from "d3-array";
import { csvParse } from "d3-dsv";
import {
  dataUrl,
  jurisdictionsOfInterest,
  localAcquisitionDataUrl
} from "./constants";
import { parse } from "date-fns";
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
  const keys = Array.from(groups.keys());
  const mod = new Map();
  keys.forEach(key => {
    const data = groups.get(key);
    mod.set(key, data.map(calcNewCases));
  });
  return mod;
};

export const parseDsiData = data => {
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

export const findMissingDays = d => {
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

export const findMiscalculations = d => {
  const miscalculations = [];
  for (var i = 1; i < d.length; i++) {
    if (d[i - 1].cumulative + d[i].added !== d[i].cumulative) {
      miscalculations.push(d[i].date);
    }
  }
  return miscalculations;
};

// Trim the most recent day if it doesn't have figures for all jurisdictions.
export const trimDsiData = data => {
  const maxDay = max(data, d => d.timestamp);
  return data.filter(d => d.timestamp === maxDay).length < 8
    ? data.filter(d => d.timestamp !== maxDay)
    : data;
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

export const growthRate = (
  data,
  period = 1,
  accessor = d => d,
  storer = v => v
) =>
  data.reduce(
    (acc, d, i, arr) =>
      i < period
        ? acc
        : acc.concat(
            storer(
              Math.pow(accessor(d) / accessor(arr[i - period]), 1 / period) - 1,
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

export const renderGraphics = data =>
  [
    ...document.querySelectorAll(
      `a[id^=growthfactorgraphicPRESET],a[name^=growthfactorgraphicPRESET]`
    )
  ].map(anchorEl => {
    const props = a2o(
      anchorEl.getAttribute("id") || anchorEl.getAttribute("name")
    );
    const mountEl = document.createElement("div");

    mountEl.className = "u-pull";

    Object.keys(props).forEach(
      propName => (mountEl.dataset[propName] = props[propName])
    );
    anchorEl.parentElement.insertBefore(mountEl, anchorEl);
    anchorEl.parentElement.removeChild(anchorEl);

    render(
      <Embed jurisdiction="Australia" data={data.get("Australia")} />,
      mountEl
    );
  });

const parseLocalAcquisitionData = data => {
  const test = data
    .map(d => {
      const date = parse(d["Date"], "dd/MM/yyyy", new Date());
      return {
        date,
        timestamp: date.getTime(),
        jurisdiction: d["State/territory"],
        cumulative: +d["Cumulative cases"],
        mode: d["Mode of transmission (Origins)"]
      };
    })
    .filter(d => d.jurisdiction === "AUS")
    .sort((a, b) => ascending(a.timestamp, b.timestamp));

  const rolled = rollups(
    test,
    v => sum(v, d => d.cumulative),
    d => +d.date,
    d => {
      let key = "unknown";
      switch (d.mode) {
        case "Overseas":
          key = "Australia (imported)";
          break;
        case "Local - known link":
        case "Local - unknown link":
        case "Local - unknown link, travelled interstate":
          key = "Australia (local transmission)";
          break;
      }
      return key;
    }
  );

  return rolled.reduce((acc, [timestamp, data]) => {
    return acc.concat(
      data.map(([jurisdiction, cumulative]) => ({
        date: new Date(timestamp),
        timestamp,
        jurisdiction,
        cumulative
      }))
    );
  }, []);
};

export const fetchLocalAcquisitionData = () =>
  fetch(localAcquisitionDataUrl)
    .then(res => res.text())
    .then(csvParse);

const mixinLocalAcquisitionData = data => {
  return fetchLocalAcquisitionData()
    .then(parseLocalAcquisitionData)
    .then(lad =>
      data.concat(lad).sort((a, b) => ascending(a.timestamp, b.timestamp))
    );
};

export const fetchCountryTotals = ({ includeLocal = false } = {}) =>
  fetch(dataUrl)
    .then(res => res.json())
    .then(Object.entries)
    .then(parseHybridData)
    .then(includeLocal ? mixinLocalAcquisitionData : d => d)
    .then(groupByJurisdiction)
    .then(calculateNewCases);
