import "regenerator-runtime/runtime.js";
import "core-js/features/symbol";
import "./polyfills";
import React from "react";
import { render } from "react-dom";
import * as a2o from "@abcnews/alternating-case-to-object";
import { fetchCountryTotals } from "./utils";
import { SmallMultiples } from "./components/SmallMultiples";
import { Hero } from "./components/Hero";
import { presets, colours } from "./constants";
import "./fonts.scss";

const whenOdysseyLoaded = new Promise(resolve =>
  window.__ODYSSEY__
    ? resolve(window.__ODYSSEY__)
    : window.addEventListener("odyssey:api", () => resolve(window.__ODYSSEY__))
);

const renderSmallMultiples = data =>
  [
    ...document.querySelectorAll(
      `a[id^=growthfactorgraphicPRESET],a[name^=growthfactorgraphicPRESET]`
    )
  ].map(anchorEl => {
    const props = a2o(
      anchorEl.getAttribute("id") || anchorEl.getAttribute("name")
    );
    const mountEl = document.createElement("div");

    mountEl.className = "u-pull";

    Object.keys(props).forEach(
      propName => (mountEl.dataset[propName] = props[propName])
    );
    anchorEl.parentElement.insertBefore(mountEl, anchorEl);
    anchorEl.parentElement.removeChild(anchorEl);

    if (props.preset === "hero") {
      render(
        <Hero jurisdiction="Australia" data={data.get("Australia")} />,
        mountEl
      );
    } else {
      render(<SmallMultiples {...props} data={data} />, mountEl);
    }
  });

Promise.all([fetchCountryTotals(), whenOdysseyLoaded]).then(([countryTotals]) =>
  renderSmallMultiples(countryTotals)
);

document.documentElement.style.setProperty("--bg", colours.background);
