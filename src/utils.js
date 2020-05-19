import { pairs, ascending } from "d3-array";
import {
  dataUrl,
  localAcquisitionDataUrl,
  australianDataUrl
} from "./constants";
import { csvParse } from "d3-dsv";

const identity = d => d;
const sumReducer = (t, d) => t + d;

export const getAccessor = key => d => d[key];
export const getStorer = key => (v, d) => ({ ...d, [key]: v });

export const addNationalData = data => {
  return data.concat(
    Array.from(
      rollup(
        data,
        v => v.map(d => d.cumulative).reduce(sumReducer),
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
        const [y, m, d] = dateString.split("-").map(d => +d);
        const date = new Date(y, m - 1, d);
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

const groupBy = accessor => data => {
  const grouped = new Map();
  data.forEach(d => {
    let group = grouped.get(accessor(d));
    if (group) {
      group.push(d);
    } else {
      grouped.set(accessor(d), [d]);
    }
  });
  return grouped;
};

export const groupByJurisdiction = groupBy(d => d.jurisdiction);

export const growthFactorAccessor = d => d && d.growthFactor;
export const growthFactorFormatter = d => (d ? d.toFixed(2) : "-");

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

export const jurisdictionName = name => {
  const map = new Map();
  map.set("Korea, South", "South Korea");
  map.set("US", "United States");
  return map.get(name) || name;
};

export const dailyGrowthFactorMapper = ({
  accessor = identity,
  storer = identity,
  smoothing = 1,
  viabilityThreshold = 1,
  daily = true
}) => (d, i, arr) => {
  // Can't calculate until we have smoothing * 2 days to work with
  if (i < smoothing * 2) {
    return storer(null, d);
  }

  // Get numerator and denominator
  const numerator = arr
    .slice(i + 1 - smoothing, i + 1)
    .map(accessor)
    .reduce(sumReducer);

  const denominator = arr
    .slice(i + 1 - smoothing * 2, i + 1 - smoothing)
    .map(accessor)
    .reduce(sumReducer);

  // Check for viability
  // Don't calculate a growth factor unless the denominator and numerator both reach a lowerBound
  if (numerator < viabilityThreshold || denominator < viabilityThreshold) {
    return storer(null, d);
  }

  // Make it daily
  const result = daily
    ? Math.pow(numerator / denominator, 1 / smoothing)
    : numerator / denominator;

  return storer(result, d);
};

const mixinLocalAcquisitionData = data => {
  return fetch(localAcquisitionDataUrl)
    .then(res => res.json())
    .then(localAcquisitionsData =>
      data
        .concat(
          localAcquisitionsData.map(data => {
            const [y, m, d] = data.date.split("-").map(d => +d);
            const date = new Date(y, m - 1, d);
            const timestamp = +date;
            return { ...data, date, timestamp };
          })
        )
        .sort((a, b) => ascending(a.timestamp, b.timestamp))
    );
};

const promiseChainSpy = d => {
  console.log(d);
  return d;
};

const groupByDate = groupBy(d => d["Date announced"]);

const mapMap = cb => map => {
  const newMap = new Map();
  let i = 0;
  map.forEach((data, key) => {
    newMap.set(key, cb(data, key, i++));
  });
  return newMap;
};

const mixinAustralianData = data => {
  return fetch(australianDataUrl)
    .then(res => res.text())
    .then(csvParse)
    .then(groupByDate)
    .then(
      mapMap((data, key, index) => {
        let incomplete = false;
        const added = data.reduce((total, d) => {
          const added = d["New cases"];
          if (added === "") {
            incomplete = true;
          }
          return total + +added;
        }, 0);
        return { incomplete, added };
      })
    )
    .then(auData => {
      const auDataArray = [];
      auData.forEach((added, key) => {
        const [d, m, y] = key.split("/").map(d => +d);
        const date = new Date(y, m - 1, d);
        auDataArray.push({
          added,
          date,
          jurisdiction: "Australia",
          timestamp: date.getTime()
        });
      });
      return data.set(
        "Australia",
        auDataArray
          .filter((d, i) => !d.added.incomplete || i > 0)
          .map(d => ({ ...d, added: d.added.added }))
          .reverse()
      );
    });
};

export const dataToSeries = (data, smoothing) => {
  const daily = true;
  const accessor = getAccessor("added");
  return data.map(
    dailyGrowthFactorMapper({
      smoothing,
      accessor,
      storer: getStorer("growthFactor"),
      daily
    })
  );
};

export const getAvgNewCases = (data, smoothing) => {
  return {
    avg: Math.round(
      data.slice(-smoothing).reduce((t, d) => t + d.added, 0) / smoothing,
      0
    ),
    days: smoothing
  };
};

export const formatNumber = n =>
  n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

export const fetchCountryTotals = () =>
  fetch(dataUrl)
    .then(res => res.json())
    .then(Object.entries)
    .then(parseHybridData)
    .then(groupByJurisdiction)
    .then(calculateNewCases)
    .then(mixinAustralianData)
    .catch(console.error);
