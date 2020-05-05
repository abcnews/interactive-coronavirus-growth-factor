import "regenerator-runtime/runtime.js";
import "core-js/features/symbol";
import "core-js/features/symbol/iterator";
import "./polyfills";

import * as a2o from "@abcnews/alternating-case-to-object";
import { fetchCountryTotals } from "./utils";
import {
  renderSmallMultiples,
  whenOdysseyLoaded,
  domready,
  renderEmbed
} from "./renderers";
import "./fonts.scss";

fetchCountryTotals().then(countryTotals =>
  domready(() => {
    renderSmallMultiples(countryTotals);
    renderEmbed(countryTotals);
  })
);
