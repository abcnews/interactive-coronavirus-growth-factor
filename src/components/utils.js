import { min, max, pairs, group } from "d3-array";

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

export const groupByJurisdiction = data => group(data, d => d.jurisdiction);

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
