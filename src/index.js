import "regenerator-runtime/runtime.js";
import "core-js/features/symbol";
import "./polyfills";

import { fetchCountryTotals } from "./utils";
import { renderSmallMultiples, whenOdysseyLoaded } from "./renderers";
import { colours } from "./constants";
import "./fonts.scss";

Promise.all([fetchCountryTotals(), whenOdysseyLoaded]).then(([countryTotals]) =>
  renderSmallMultiples(countryTotals)
);

document.documentElement.style.setProperty("--bg", colours.background);
