export const dataUrl =
  process.env.NODE_ENV && false === "development"
    ? "/data/hybrid-country-totals.json"
    : "https://www.abc.net.au/dat/news/interactives/covid19-data/hybrid-country-totals.json";

export const localAcquisitionDataUrl =
  "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Source%20of%20infection!A:D";

export const storyUrl =
  "https://www.abc.net.au/news/2020-04-09/coronavirus-data-australia-growth-factor-covid-19/12132478";

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
    jurisdictions: [
      "Australia (community transmission)",
      "Australia (imported cases)"
    ]
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
  }
};

export const localAcquisitionsData = [
  {
    timestamp: 1585267200000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 2129
  },
  {
    timestamp: 1585267200000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 736
  },
  {
    timestamp: 1585267200000,
    jurisdiction: "Australia (unknown)",
    cumulative: 301
  },
  {
    timestamp: 1585353600000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 2456
  },
  {
    timestamp: 1585353600000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 922
  },
  {
    timestamp: 1585353600000,
    jurisdiction: "Australia (unknown)",
    cumulative: 257
  },
  {
    timestamp: 1585440000000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 2622
  },
  {
    timestamp: 1585440000000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1030
  },
  {
    timestamp: 1585440000000,
    jurisdiction: "Australia (unknown)",
    cumulative: 277
  },
  {
    timestamp: 1585526400000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 2870
  },
  {
    timestamp: 1585526400000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1143
  },
  {
    timestamp: 1585526400000,
    jurisdiction: "Australia (unknown)",
    cumulative: 232
  },
  {
    timestamp: 1585612800000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3126
  },
  {
    timestamp: 1585612800000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1261
  },
  {
    timestamp: 1585612800000,
    jurisdiction: "Australia (unknown)",
    cumulative: 170
  },
  {
    timestamp: 1585699200000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3278
  },
  {
    timestamp: 1585699200000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1357
  },
  {
    timestamp: 1585699200000,
    jurisdiction: "Australia (unknown)",
    cumulative: 225
  },
  {
    timestamp: 1585785600000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3462
  },
  {
    timestamp: 1585785600000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1472
  },
  {
    timestamp: 1585785600000,
    jurisdiction: "Australia (unknown)",
    cumulative: 199
  },
  {
    timestamp: 1585872000000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3586
  },
  {
    timestamp: 1585872000000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1593
  },
  {
    timestamp: 1585872000000,
    jurisdiction: "Australia (unknown)",
    cumulative: 171
  },
  {
    timestamp: 1585958400000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3691
  },
  {
    timestamp: 1585958400000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1723
  },
  {
    timestamp: 1585958400000,
    jurisdiction: "Australia (unknown)",
    cumulative: 130
  },
  {
    timestamp: 1586044800000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3765
  },
  {
    timestamp: 1586044800000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1802
  },
  {
    timestamp: 1586044800000,
    jurisdiction: "Australia (unknown)",
    cumulative: 120
  },
  {
    timestamp: 1586131200000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3839
  },
  {
    timestamp: 1586131200000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1884
  },
  {
    timestamp: 1586131200000,
    jurisdiction: "Australia (unknown)",
    cumulative: 72
  },
  {
    timestamp: 1586217600000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3880
  },
  {
    timestamp: 1586217600000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1940
  },
  {
    timestamp: 1586217600000,
    jurisdiction: "Australia (unknown)",
    cumulative: 88
  },
  {
    timestamp: 1586304000000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3924
  },
  {
    timestamp: 1586304000000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 1991
  },
  {
    timestamp: 1586304000000,
    jurisdiction: "Australia (unknown)",
    cumulative: 98
  },
  {
    timestamp: 1586390400000,
    jurisdiction: "Australia (imported cases)",
    cumulative: 3968
  },
  {
    timestamp: 1586390400000,
    jurisdiction: "Australia (community transmission)",
    cumulative: 2046
  },
  {
    timestamp: 1586390400000,
    jurisdiction: "Australia (unknown)",
    cumulative: 89
  }
];
