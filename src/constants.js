export const dataUrl =
  process.env.NODE_ENV === "development"
    ? "/data/hybrid-country-totals.json"
    : "https://www.abc.net.au/dat/news/interactives/covid19-data/hybrid-country-totals.json";

export const localAcquisitionDataUrl =
  "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Source%20of%20infection!A:D";

export const presets = {
  local: {
    jurisdictions: ["Australia (local spread)", "Australia (imported)"]
  },
  all: {},
  world: {
    jurisdictions: [
      "Angola",
      "China",
      "US",
      "United Kingdom",
      "Denmark",
      "New Zealand",
      "Spain",
      "Japan",
      "Korea, South"
    ]
  }
};

export const localAcquisitionsData = [
  {
    timestamp: 1585267200000,
    jurisdiction: "Australia (imported)",
    cumulative: 2129
  },
  {
    timestamp: 1585267200000,
    jurisdiction: "Australia (local spread)",
    cumulative: 736
  },
  {
    timestamp: 1585267200000,
    jurisdiction: "Australia (unknown)",
    cumulative: 301
  },
  {
    timestamp: 1585353600000,
    jurisdiction: "Australia (imported)",
    cumulative: 2456
  },
  {
    timestamp: 1585353600000,
    jurisdiction: "Australia (local spread)",
    cumulative: 922
  },
  {
    timestamp: 1585353600000,
    jurisdiction: "Australia (unknown)",
    cumulative: 257
  },
  {
    timestamp: 1585440000000,
    jurisdiction: "Australia (imported)",
    cumulative: 2622
  },
  {
    timestamp: 1585440000000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1030
  },
  {
    timestamp: 1585440000000,
    jurisdiction: "Australia (unknown)",
    cumulative: 277
  },
  {
    timestamp: 1585526400000,
    jurisdiction: "Australia (imported)",
    cumulative: 2870
  },
  {
    timestamp: 1585526400000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1143
  },
  {
    timestamp: 1585526400000,
    jurisdiction: "Australia (unknown)",
    cumulative: 232
  },
  {
    timestamp: 1585612800000,
    jurisdiction: "Australia (imported)",
    cumulative: 3126
  },
  {
    timestamp: 1585612800000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1261
  },
  {
    timestamp: 1585612800000,
    jurisdiction: "Australia (unknown)",
    cumulative: 170
  },
  {
    timestamp: 1585699200000,
    jurisdiction: "Australia (imported)",
    cumulative: 3278
  },
  {
    timestamp: 1585699200000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1357
  },
  {
    timestamp: 1585699200000,
    jurisdiction: "Australia (unknown)",
    cumulative: 225
  },
  {
    timestamp: 1585785600000,
    jurisdiction: "Australia (imported)",
    cumulative: 3462
  },
  {
    timestamp: 1585785600000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1472
  },
  {
    timestamp: 1585785600000,
    jurisdiction: "Australia (unknown)",
    cumulative: 199
  },
  {
    timestamp: 1585872000000,
    jurisdiction: "Australia (imported)",
    cumulative: 3586
  },
  {
    timestamp: 1585872000000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1593
  },
  {
    timestamp: 1585872000000,
    jurisdiction: "Australia (unknown)",
    cumulative: 171
  },
  {
    timestamp: 1585958400000,
    jurisdiction: "Australia (imported)",
    cumulative: 3691
  },
  {
    timestamp: 1585958400000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1723
  },
  {
    timestamp: 1585958400000,
    jurisdiction: "Australia (unknown)",
    cumulative: 130
  },
  {
    timestamp: 1586044800000,
    jurisdiction: "Australia (imported)",
    cumulative: 3765
  },
  {
    timestamp: 1586044800000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1802
  },
  {
    timestamp: 1586044800000,
    jurisdiction: "Australia (unknown)",
    cumulative: 120
  },
  {
    timestamp: 1586131200000,
    jurisdiction: "Australia (imported)",
    cumulative: 3839
  },
  {
    timestamp: 1586131200000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1884
  },
  {
    timestamp: 1586131200000,
    jurisdiction: "Australia (unknown)",
    cumulative: 72
  },
  {
    timestamp: 1586217600000,
    jurisdiction: "Australia (imported)",
    cumulative: 3880
  },
  {
    timestamp: 1586217600000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1940
  },
  {
    timestamp: 1586217600000,
    jurisdiction: "Australia (unknown)",
    cumulative: 88
  },
  {
    timestamp: 1586304000000,
    jurisdiction: "Australia (imported)",
    cumulative: 3924
  },
  {
    timestamp: 1586304000000,
    jurisdiction: "Australia (local spread)",
    cumulative: 1991
  },
  {
    timestamp: 1586304000000,
    jurisdiction: "Australia (unknown)",
    cumulative: 98
  },
  {
    timestamp: 1586390400000,
    jurisdiction: "Australia (imported)",
    cumulative: 3968
  },
  {
    timestamp: 1586390400000,
    jurisdiction: "Australia (local spread)",
    cumulative: 2046
  },
  {
    timestamp: 1586390400000,
    jurisdiction: "Australia (unknown)",
    cumulative: 89
  }
];
