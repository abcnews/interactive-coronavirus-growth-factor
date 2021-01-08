import React from "react";
import { render } from "react-dom";
import * as a2o from "@abcnews/alternating-case-to-object";
import { SmallMultiples } from "./components/SmallMultiples";
import { Hero } from "./components/Hero";
import { Embed } from "./components/Embed";
import { EmbedContainer } from "@abcnews/story-lab-component-library";
import { storyUrl } from "./constants";
import { getMountValue, selectMounts } from "@abcnews/mount-utils";
import "./fonts.scss";

export const domready = fn => {
  /in/.test(document.readyState) ? setTimeout(() => domready(fn), 9) : fn();
};

export const whenOdysseyLoaded = new Promise(resolve =>
  window.__ODYSSEY__
    ? resolve(window.__ODYSSEY__)
    : window.addEventListener("odyssey:api", () => resolve(window.__ODYSSEY__))
);

export const renderGraphic = data => {
  const jurisdictions = new Map();
  data.forEach((data, key) => {
    jurisdictions.set(key.toLowerCase().replace(/[^a-z]/g, ""), key);
  });

  selectMounts("growthfactorgraphic").map(mountEl => {
    const props = a2o(getMountValue(mountEl));

    const jurisdiction = props.jurisdiction
      ? jurisdictions.get(props.jurisdiction)
      : jurisdictions.get("australia");

    // Render a hero graphic
    if (props.preset && props.preset === "hero") {
      return render(
        <Hero jurisdiction={jurisdiction} data={data.get(jurisdiction)} />,
        mountEl
      );
    }

    // Render small multiples presets
    if (props.preset) {
      mountEl.classList.add("u-pull");
      return render(<SmallMultiples {...props} data={data} />, mountEl);
    }

    // Render embeds
    if (props.embed) {
      return render(
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
    }
  });
};
