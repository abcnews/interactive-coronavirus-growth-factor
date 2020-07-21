import React from "react";
import { render } from "react-dom";
import * as a2o from "@abcnews/alternating-case-to-object";
import { SmallMultiples } from "./components/SmallMultiples";
import { Hero } from "./components/Hero";
import { Embed } from "./components/Embed";
import { EmbedContainer } from "@abcnews/story-lab-component-library";
import { storyUrl } from "./constants";
import "./fonts.scss";

export const domready = fn => {
  /in/.test(document.readyState) ? setTimeout(() => domready(fn), 9) : fn();
};

export const whenOdysseyLoaded = new Promise(resolve =>
  window.__ODYSSEY__
    ? resolve(window.__ODYSSEY__)
    : window.addEventListener("odyssey:api", () => resolve(window.__ODYSSEY__))
);

const selectors = ["growthfactorgraphicEMBED", "growthfactorgraphicPRESET"];

export const renderGraphic = data =>
  [
    ...document.querySelectorAll(
      selectors.map(s => `[id^=${s}],[name^=${s}]`).join(",")
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

    if (anchorEl.tagName === "DIV") {
      anchorEl.appendChild(mountEl);
    } else {
      anchorEl.parentElement.insertBefore(mountEl, anchorEl);
      anchorEl.parentElement.removeChild(anchorEl);
    }

    if (props.preset) {
      if (props.preset === "hero") {
        render(
          <Hero jurisdiction="Australia" data={data.get("Australia")} />,
          mountEl
        );
      } else {
        render(<SmallMultiples {...props} data={data} />, mountEl);
      }
    } else if (props.embed) {
      let jurisdictions = {};
      data.forEach((data, key) => {
        jurisdictions[key.toLowerCase().replace(/[^a-z]/g, "")] = key;
      });

      const jurisdiction = props.jurisdiction
        ? jurisdictions[props.jurisdiction]
        : jurisdictions["australia"];

      if (props.embed === "full" || props.embed === "right") {
        render(
          <EmbedContainer embed={props.embed}>
            <Embed
              {...props}
              jurisdiction={jurisdiction}
              data={data.get(jurisdiction)}
              link={props.link == false ? null : storyUrl}
            />
          </EmbedContainer>,
          mountEl
        );
      } else {
        render(
          <Embed
            {...props}
            jurisdiction={jurisdiction}
            data={data.get(jurisdiction)}
            link={props.link == false ? null : storyUrl}
          />,
          mountEl
        );
      }
    }
  });
