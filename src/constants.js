export const dataUrl =
  "https://www.abc.net.au/dat/news/interactives/covid19-data/hybrid-country-totals.json";
// process.env.NODE_ENV === "development"
//   ? "/hybrid-country-totals.json"
//   : "https://www.abc.net.au/dat/news/interactives/covid19-data/hybrid-country-totals.json";

export const presets = {
  auus: {
    jurisdictions: ["Australia", "US"]
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
