import "regenerator-runtime/runtime.js";
import "core-js/features/symbol";
import "./polyfills";

import { fetchAll } from "./data";
import { renderSmallMultiples, whenOdysseyLoaded } from "./renderers";
import { colours } from "./constants";
import "./fonts.scss";

Promise.all([fetchAll(), whenOdysseyLoaded]).then(([data]) =>
  renderSmallMultiples(data)
);

document.documentElement.style.setProperty("--bg", colours.background);
