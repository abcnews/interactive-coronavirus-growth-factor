export const dataUrl =
  process.env.NODE_ENV === "development"
    ? "/data/hybrid-country-totals.json"
    : "https://www.abc.net.au/dat/news/interactives/covid19-data/hybrid-country-totals.json";

export const jurisdictionsOfInterest = [
  "Australia",
  "China",
  "US",
  "United Kingdom",
  "Denmark",
  "Sweden",
  "Spain",
  "Japan",
  "Korea, South"
];
