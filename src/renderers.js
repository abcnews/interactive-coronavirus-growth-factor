import React from "react";
import { render } from "react-dom";
import * as a2o from "@abcnews/alternating-case-to-object";
import { SmallMultiples } from "./components/SmallMultiples";
import { Hero } from "./components/Hero";
import { Embed } from "./components/Embed";
import { storyUrl } from "./constants";
import "./fonts.scss";

export const domready = fn => {
  /in/.test(document.readyState) ? setTimeout(() => domready(fn), 9) : fn();
};

export const renderEmbed = data =>
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
        {...props}
        jurisdiction={jurisdiction}
        data={data.get(jurisdiction)}
        link={props.link == false ? null : storyUrl}
      />,
      mountEl
    );
  });

export const whenOdysseyLoaded = new Promise(resolve =>
  window.__ODYSSEY__
    ? resolve(window.__ODYSSEY__)
    : window.addEventListener("odyssey:api", () => resolve(window.__ODYSSEY__))
);

export const renderSmallMultiples = data =>
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
