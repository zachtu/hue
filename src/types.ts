import type { COLORS } from "./constants";

export type Color = typeof COLORS[number];

export type Position = {
  row: number;
  col: number;
};

export type Grid = Color[][];

export type MovingTile = {
  from: Position;
  to: Position;
  color: Color;
  moving: boolean;
};

export type SwapAnimation = {
  a: MovingTile;
  b: MovingTile;
};