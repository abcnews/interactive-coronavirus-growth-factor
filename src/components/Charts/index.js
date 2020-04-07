import React, { useState, useMemo } from "react";
import styles from "./styles.scss";
import { GrowthRateTooltip, GrowthFactorTooltip } from "../Tooltips";
import { movingAverage, growthRate, findGaps } from "../utils";
import { pairs, extent, min, bisector } from "d3-array";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import useDimensions from "react-use-dimensions";
import { line, curveMonotoneX } from "d3-shape";
import { scaleLinear, scaleTime } from "d3-scale";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";

export const GrowthFactorChart = ({ data }) => {
  const [ref, { x, y, width: chartWidth }] = useDimensions();
  const width = chartWidth - 30;
  const [svgRef, svgDimensions] = useDimensions();
  const [highlight, setHighlight] = useState(null);
  const uid = useMemo(() => uuid(), [data]);
  const good = "#159f8c";
  const bad = "#cc365b";
  const currentColour = data[data.length - 1].growthFactor < 1 ? good : bad;
  const height = 200;
  const chartHeight = 50;
  const xDomain = extent(data, d => d.date);
  const xRange = [0, width];
  const yDomain = [0.7, 1.5];

  // const yDomain = [
  //   Math.max(
  //     0,
  //     min(data, d => d.growthFactor)
  //   ),
  //   Math.max(data[data.length - 1].growthFactor, 1.5)
  // ];

  const yRange = [height, height - chartHeight];

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
        height: chartHeight,
        position: "relative",
        marginBottom: "1.1em",
        zIndex: highlight ? 4 : 1
      }}
    >
      <svg
        className={`${styles.svg} ${highlight ? styles.hovered : ""}`}
        width={width + 30}
        height={height + 30}
        style={{ bottom: 0, left: 0 }}
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
        <g style={{ transform: "translate(15px, 15px)" }}>
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
            stroke={bad}
            strokeWidth="2"
            mask={`url(#bad-${uid})`}
          />

          <path
            d={path(data)}
            fill="none"
            stroke={good}
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
            y1={yScale(data[data.length - 1].growthFactor) - 7}
            y2={height - chartHeight}
            x2={xScale(xDomain[1])}
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
            bottom: height - yScale(highlight.growthFactor) - 30,
            left: xScale(highlight.date) + 15,
            transform: "translate(-50%)"
          }}
        >
          <span>{format(highlight.date, "MMM d")}</span>
          <span>{highlight.growthFactor.toFixed(2)}</span>
        </div>
      ) : null}
    </div>
  );
};

export const JurisdictionGrowthRate = ({ name, data, smoothing }) => {
  const series = growthRate(
    data,
    smoothing,
    d => d.cumulative,
    (v, d) => ({ ...d, growthRate: v })
  );
  const currentGrowthRate = series[series.length - 1].growthRate;
  return (
    <div className={styles.chart}>
      <p className={styles.label}>{name}</p>
      <h1 className={styles.currentValue}>
        {(currentGrowthRate * 100).toFixed(1)}%
      </h1>
      <LineChart width={200} height={80} data={series}>
        <Line
          type="monotone"
          dataKey="growthRate"
          stroke="#8884d8"
          strokeWidth={1}
          dot={false}
        />
        <YAxis
          allowDataOverflow={true}
          tick={{ fontSize: "0.8rem" }}
          tickFormatter={d => `${(d * 100).toFixed(0)}%`}
          domain={[-0.1, 0.5]}
          width={30}
          orientation="right"
        />

        <Tooltip content={<GrowthRateTooltip />} />
      </LineChart>
    </div>
  );
};

export const JurisdictionGrowthFactor = ({ name, data, smoothing }) => {
  const series = pairs(
    movingAverage(
      data,
      smoothing,
      d => d.added,
      (v, d) => ({ ...d, added: v })
    ),
    (a, b) => ({
      ...b,
      growthFactor: b.added < 2 ? null : b.added / a.added
    })
  );
  const currentGrowthFactor = series[series.length - 1].growthFactor;
  return (
    <div className={styles.chart}>
      <p className={styles.label}>{name}</p>
      <h1 className={styles.currentValue}>
        {currentGrowthFactor ? currentGrowthFactor.toFixed(2) : "unknown"}
      </h1>
      <LineChart width={200} height={80} data={series}>
        <Line
          type="monotone"
          dataKey="growthFactor"
          stroke="#8884d8"
          strokeWidth={1}
          dot={false}
        />
        <YAxis
          allowDataOverflow={true}
          tick={{ fontSize: "0.8rem" }}
          tickFormatter={d => `${d.toFixed(0)}`}
          domain={[0, 2]}
          width={30}
          orientation="right"
        />

        <Tooltip content={<GrowthFactorTooltip />} />
      </LineChart>
    </div>
  );
};
