export const dataUrl =
  process.env.NODE_ENV === "development"
    ? "/data/hybrid-country-totals.json"
    : "https://www.abc.net.au/dat/news/interactives/covid19-data/hybrid-country-totals.json";

export const localAcquisitionDataUrl =
  "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Source%20of%20infection!A:D";

export const presets = {
  local: {
    jurisdictions: ["Australia", "Australia (local transmission)"]
  },
  world: {
    jurisdictions: [
      "Australia",
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
