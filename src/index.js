import "./polyfills";

import { fetchAll } from "./data";
import { renderGraphic, whenOdysseyLoaded } from "./renderers";
import { colours } from "./constants";
import "./fonts.scss";

Promise.all([fetchAll(), whenOdysseyLoaded]).then(([data]) =>
  renderGraphic(data)
);

document.documentElement.style.setProperty("--bg", colours.background);
