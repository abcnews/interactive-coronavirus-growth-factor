import { csvParse } from "d3-dsv";
import { ascending } from "d3-array";
import {
  dataUrl,
  localAcquisitionDataUrl,
  australianDataUrl
} from "./constants";

import {
  parseHybridData,
  groupByJurisdiction,
  groupByDate,
  calculateNewCases,
  mapMap
} from "./utils";

// These functions fetch data from various sources and transform them to a consistent
// format usable in these interactives. Here's the format:

// Map([
//   [
//     "Jurisdiction Name",
//     [
//       {
//         date: "2019-12-31T00:00:00.000Z",
//         timestamp: 1577750400000,
//         jurisdiction: "Jurisdiction Name",
//         cumulative: 27,
//         added: 27
//       }
//     ]
//   ]
// ]);
//
// Promises are returned.

const fetchInternationalData = () => {
  return fetch(dataUrl)
    .then(res => res.json())
    .then(Object.entries)
    .then(parseHybridData)
    .then(groupByJurisdiction)
    .then(calculateNewCases)
    .then(data => {
      data.delete("Australia");
      return data;
    })
    .catch(console.error);
};

const fetchInfectionSourceData = () => {
  return fetch(localAcquisitionDataUrl)
    .then(res => res.json())
    .then(localAcquisitionsData =>
      localAcquisitionsData
        .map(data => {
          const [y, m, d] = data.date.split("-").map(d => +d);
          const date = new Date(y, m - 1, d);
          const timestamp = +date;
          return { ...data, date, timestamp };
        })
        .sort((a, b) => ascending(a.timestamp, b.timestamp))
    )
    .then(groupByJurisdiction)
    .then(calculateNewCases)
    .catch(console.error);
};

const fetchAustralianData = () => {
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
      return new Map([
        [
          "Australia",
          auDataArray
            .filter((d, i) => !d.added.incomplete || i > 0)
            .map(d => ({ ...d, added: d.added.added }))
            .reverse()
        ]
      ]);
    })
    .catch(console.error);
};

// Functions below here take the above functions and combine the results

// Take multiple data fetching functions and combine results
const fetchData = (...args) =>
  Promise.all(args.map(fn => fn())).then(
    maps => new Map([].concat(...maps.map(m => [...m])))
  );

// Fetch all the data we have
export const fetchAll = () =>
  fetchData(
    fetchInternationalData,
    fetchAustralianData,
    fetchInfectionSourceData
  );

// Fetch all country level data
export const fetchAllCountries = () =>
  fetchData(fetchInternationalData, fetchAustralianData);

// Fetch all Australian data
export const fetchAllAustralia = () =>
  fetchData(fetchAustralianData, fetchInfectionSourceData);

// Fetch just Australia
export const fetchAustralia = fetchAustralianData;
