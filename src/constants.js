export const dataUrl =
  process.env.NODE_ENV === "development"
    ? "/data/hybrid-country-totals.json"
    : "https://www.abc.net.au/dat/news/interactives/covid19-data/hybrid-country-totals.json";

export const localAcquisitionDataUrl =
  process.env.NODE_ENV === "development"
    ? "/data/dsi-local-acquisition.json"
    : "https://www.abc.net.au/dat/news/interactives/covid19-data/dsi-local-acquisition.json";

export const australianDataUrl =
  "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Daily%20Count%20States!A:E";

export const storyUrl =
  "https://www.abc.net.au/news/2020-04-09/coronavirus-data-australia-growth-factor-covid-19/12132478";

export const defaultDaysToShow = 45;
export const defaultSmoothingPeriod = 7;
export const defaultInnerHeight = 100;
export const defaultInnerHeightDomain = [0.85, 1.2];
export const colours = {
  background: "rgb(243, 252, 252)",
  shim: "rgba(243, 252, 252, 0.75)",
  embedBackground: "rgb(233, 247, 247)",
  embedShim: "rgba(233, 247, 247, 0.75)",
  good: "#159f8c",
  bad: "#EA526F",
  goodText: "#159f8c",
  badText: "#cc365b"
};

export const presets = {
  local: {
    jurisdictions: ["Australia (local spread)", "Australia (imported)"]
  },
  all: {},
  world: {
    jurisdictions: [
      "US",
      "Spain",
      "Italy",
      "Germany",
      "France",
      "China",
      "Iran",
      "United Kingdom",
      "Turkey",
      "Belgium",
      "Switzerland",
      "Netherlands",
      "Canada",
      "Brazil",
      "Portugal",
      "Austria",
      "Korea, South",
      "Russia",
      "New Zealand",
      "Indonesia",
      "Israel",
      "Sweden",
      "Ireland",
      "Norway"
    ]
  },
  stuu: {
    jurisdictions: ["US", "United Kingdom", "Turkey", "Switzerland"]
  },
  rsss: {
    jurisdictions: ["Spain", "Korea, South", "Russia", "Sweden"]
  },
  nnnp: {
    jurisdictions: ["Netherlands", "Portugal", "New Zealand", "Norway"]
  },
  iiii: {
    jurisdictions: ["Iran", "Ireland", "Israel", "Italy"]
  },
  cfgi: {
    jurisdictions: ["Germany", "France", "China", "Indonesia"]
  },
  abbc: {
    jurisdictions: ["Belgium", "Canada", "Brazil", "Austria"]
  },
  states: {
    jurisdictions: ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]
  }
};

export const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
