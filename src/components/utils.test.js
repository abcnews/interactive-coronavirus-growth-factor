import { movingAverage, growthRate } from "./utils";

describe("growthRate", () => {
  test("single period", () => {
    expect(growthRate([100, 110])).toEqual([Math.pow(110 / 100, 1) - 1]);
  });
  test("multiple periods", () => {
    expect(growthRate([100, 0, 110], 2)).toEqual([
      Math.pow(110 / 100, 1 / 2) - 1
    ]);
  });
  test("negative growth", () => {
    expect(growthRate([100, 90])).toEqual([Math.pow(90 / 100, 1) - 1]);
  });

  test("accessor", () => {
    expect(growthRate([{ v: 100 }, { v: 110 }], 1, d => d.v)).toEqual([
      Math.pow(110 / 100, 1) - 1
    ]);
  });
  test("storer with preserved object values", () => {
    expect(
      growthRate(
        [
          { i: "a", v: 100 },
          { i: "b", v: 110 }
        ],
        1,
        d => d.v,
        (v, d) => ({ ...d, v })
      )
    ).toEqual([{ i: "b", v: Math.pow(110 / 100, 1) - 1 }]);
  });
});

describe("movingAverage", () => {
  test("simple moving average", () => {
    expect(movingAverage([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    expect(movingAverage([1, 2, 3, 4, 5], 2)).toEqual([1.5, 2.5, 3.5, 4.5]);
    expect(movingAverage([1, 2, 3, 4, 5], 3)).toEqual([2, 3, 4]);
  });

  test("negative values", () => {
    expect(movingAverage([1, 2, 3, 4, -5], 3)).toEqual([2, 3, 2 / 3]);
  });

  test("accessor", () => {
    expect(
      movingAverage(
        [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }],
        3,
        d => d.val
      )
    ).toEqual([2, 3, 4]);
  });

  test("storer", () => {
    expect(
      movingAverage([1, 2, 3, 4, 5], 3, undefined, d => ({ val: d }))
    ).toEqual([{ val: 2 }, { val: 3 }, { val: 4 }]);
  });

  test("storer with preserved object values", () => {
    expect(
      movingAverage(
        [
          { val: 1, i: "a" },
          { val: 2, i: "b" },
          { val: 3, i: "c" },
          { val: 4, i: "d" },
          { val: 5, i: "e" }
        ],
        3,
        d => d.val,
        (v, d) => ({ ...d, val: v })
      )
    ).toEqual([
      { val: 2, i: "c" },
      { val: 3, i: "d" },
      { val: 4, i: "e" }
    ]);
  });
});
