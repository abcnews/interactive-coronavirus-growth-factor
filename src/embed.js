import "regenerator-runtime/runtime.js";
import "core-js/features/symbol";
import "core-js/features/symbol/iterator";
import "./polyfills";

import { fetchAll } from "./data";
import {
  renderSmallMultiples,
  whenOdysseyLoaded,
  domready,
  renderEmbed
} from "./renderers";
import "./fonts.scss";

fetchAll().then(data =>
  domready(() => {
    renderSmallMultiples(data);
    renderEmbed(data);
  })
);
