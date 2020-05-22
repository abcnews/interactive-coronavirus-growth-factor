import "./polyfills";

import { fetchAll } from "./data";
import { renderGraphic, domready } from "./renderers";
import "./fonts.scss";

fetchAll().then(data =>
  domready(() => {
    renderGraphic(data);
  })
);
