import "regenerator-runtime/runtime.js";
import "core-js/features/symbol";
import "core-js/features/symbol/iterator";
import "./polyfills";
import React from "react";
import { render } from "react-dom";
import * as a2o from "@abcnews/alternating-case-to-object";
import { fetchCountryTotals } from "./utils";
import { storyUrl } from "./constants";
import { Embed } from "./components/Embed";

const domready = fn => {
  /in/.test(document.readyState) ? setTimeout(() => domready(fn), 9) : fn();
};

const renderEmbed = data =>
  [
    ...document.querySelectorAll(
      `a[id^=growthfactorgraphicEMBED],a[name^=growthfactorgraphicEMBED]`
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

    let jurisdictions = {};
    data.forEach((data, key) => {
      jurisdictions[key.toLowerCase().replace(/\s/g, "")] = key;
    });

    const jurisdiction = props.embed ? jurisdictions[props.embed] : "Australia";

    render(
      <Embed
        smoothing={props.smoothing || 5}
        limit={props.limit || 30}
        jurisdiction={jurisdiction}
        data={data.get(jurisdiction)}
        link={storyUrl}
      />,
      mountEl
    );
  });

fetchCountryTotals().then(countryTotals =>
  domready(() => renderEmbed(countryTotals))
);
