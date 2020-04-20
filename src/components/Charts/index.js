import React, { useState, useMemo } from "react";
import styles from "./styles.scss";
import {
  movingAverage,
  growthRate,
  findGaps,
  growthFactorFormatter
} from "../../utils";
import { pairs, extent, min, bisector } from "d3-array";
import useDimensions from "react-use-dimensions";
import { line, curveMonotoneX } from "d3-shape";
import { scaleLinear, scaleTime } from "d3-scale";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { colours } from "../../constants";

export const GrowthFactorChart = ({
  data,
  height = 160,
  innerHeight = 50,
  innerHeightDomain,
  shimColor
}) => {
  const [ref, { x, y, width: chartWidth }] = useDimensions();
  const width = chartWidth ? chartWidth - 30 : 1;
  const [svgRef, svgDimensions] = useDimensions();
  const [highlight, setHighlight] = useState(null);
  const uid = useMemo(() => uuid(), [data]);
  const currentColour =
    +data[data.length - 1].growthFactor.toFixed(2) < 1
      ? colours.good
      : colours.bad;
  const xDomain = extent(data, d => d.date);
  const xRange = [0, width];
  const yDomain = innerHeightDomain || [
    Math.max(
      0,
      min(data, d => d.growthFactor)
    ),
    Math.max(data[data.length - 1].growthFactor, 1.5)
  ];

  const yRange = [height, height - innerHeight];

  const xScale = scaleTime()
    .domain(xDomain)
    .range(xRange);
  const yScale = scaleLinear()
    .domain(yDomain)
    .range(yRange);
  const bisectDate = bisector(d => d.date).left;

  const gaps = findGaps(data).map(([a, b]) => {
    return {
      x1: xScale(a === "start" ? data[0].date : a.date),
      x2: xScale(b === "end" ? data[data.length - 1].date : b.date),
      y1: yScale(a === "start" ? b.growthFactor : a.growthFactor),
      y2: yScale(b === "end" ? a.growthFactor : b.growthFactor)
    };
  });

  const path = line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.growthFactor))
    .defined(d => d.growthFactor !== null)
    .curve(curveMonotoneX);
  return (
    <div
      ref={ref}
      style={{
        height: innerHeight,
        position: "relative",
        marginBottom: "1.1em",
        zIndex: highlight ? 4 : 1
      }}
    >
      <svg
        className={`${styles.svg} ${highlight ? styles.hovered : ""}`}
        width={width + 30}
        height={height + 30}
        ref={svgRef}
        onPointerMove={ev =>
          setHighlight(
            data[
              bisectDate(data, xScale.invert(ev.clientX - svgDimensions.x - 15))
            ]
          )
        }
        onPointerOut={() => setHighlight(null)}
      >
        <g transform={`matrix(1, 0, 0, 1, 15, 15)`}>
          <mask id={`bad-${uid}`}>
            <rect
              x={xRange[0] - 10}
              y={0}
              width={width + 20}
              height={yScale(1)}
              fill="white"
            />
          </mask>
          <mask id={`good-${uid}`}>
            <rect
              x={xRange[0] - 10}
              y={yScale(1)}
              width={width + 20}
              height={yScale(1)}
              fill="white"
            />
          </mask>
          <path
            d={path(data)}
            fill="none"
            stroke={colours.bad}
            strokeWidth="2"
            mask={`url(#bad-${uid})`}
          />

          <path
            d={path(data)}
            fill="none"
            stroke={colours.good}
            strokeWidth="2"
            mask={`url(#good-${uid})`}
          />

          {gaps.map((pos, i) => (
            <line {...pos} key={`gap${i}`} className={styles.gap} />
          ))}

          <line
            className={styles.tick}
            x1={width}
            y1={height + 15}
            x2={width}
            y2={height + 5}
          />
          <line
            className={styles.tick}
            x1={0}
            y1={height + 15}
            x2={0}
            y2={height + 5}
          />
          <line
            x1={xScale(xDomain[1])}
            x2={xScale(xDomain[1])}
            y1={yScale(data[data.length - 1].growthFactor) - 7}
            y2={Math.min(
              yScale(data[data.length - 1].growthFactor) - 7,
              height - innerHeight + 15
            )}
            stroke={currentColour}
          />
          {highlight && highlight.growthFactor ? (
            <line
              className={styles.tick}
              x1={xScale(highlight.date)}
              x2={xScale(highlight.date)}
              y1={yScale(highlight.growthFactor) + 5}
              y2={yScale(highlight.growthFactor) + 15}
            />
          ) : null}
          <circle
            r="3"
            cx={xScale(xDomain[1])}
            cy={yScale(data[data.length - 1].growthFactor)}
            fill={currentColour}
          />
        </g>
      </svg>
      <div
        className={styles.tickLabel}
        style={{ left: 15, transform: "translate(-50%)" }}
      >
        {format(xDomain[0], "MMM d")}
      </div>
      <div
        className={styles.tickLabel}
        style={{ right: 15, transform: "translate(50%)" }}
      >
        {format(xDomain[1], "MMM d")}
      </div>
      {highlight && highlight.growthFactor ? (
        <div
          className={styles.tooltip}
          style={{
            backgroundColor: shimColor,
            bottom: height - yScale(highlight.growthFactor) - 30,
            left: xScale(highlight.date) + 15,
            transform: "translate(-50%)"
          }}
        >
          <span>{format(highlight.date, "MMM d")}</span>
          <span>{growthFactorFormatter(highlight.growthFactor)}</span>
        </div>
      ) : null}
    </div>
  );
};
