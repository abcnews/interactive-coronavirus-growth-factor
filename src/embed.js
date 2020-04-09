import React from "react";
import { render } from "react-dom";
import * as a2o from "@abcnews/alternating-case-to-object";
import { fetchCountryTotals } from "./utils";
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

    render(
      <Embed
        jurisdiction={props.embed || "Australia"}
        data={data.get(props.embed || "Australia")}
      />,
      mountEl
    );
  });

fetchCountryTotals({ includeLocal: false }).then(countryTotals =>
  domready(() => renderEmbed(countryTotals))
);
