import { describe, it, expect } from 'vitest';
import { checkWin, isAdjacent, generateDailyGrid, swapTiles } from './grid';
import { COLOR } from '../constants';
import type { Grid } from '../types';

describe('isAdjacent', () => {
  it('returns true for horizontal neighbors', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true);
    expect(isAdjacent({ row: 2, col: 3 }, { row: 2, col: 2 })).toBe(true);
  });

  it('returns true for vertical neighbors', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(true);
    expect(isAdjacent({ row: 3, col: 2 }, { row: 2, col: 2 })).toBe(true);
  });

  it('returns false for diagonal neighbors', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(false);
  });

  it('returns false for distant tiles', () => {
    expect(isAdjacent({ row: 0, col: 0 }, { row: 0, col: 2 })).toBe(false);
    expect(isAdjacent({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(false);
  });

  it('returns false for same position', () => {
    expect(isAdjacent({ row: 2, col: 2 }, { row: 2, col: 2 })).toBe(false);
  });
});

describe('swapTiles', () => {
  it('swaps two tiles correctly', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.GREEN],
      [COLOR.BLUE, COLOR.YELLOW],
    ];

    const result = swapTiles(grid, { row: 0, col: 0 }, { row: 0, col: 1 });

    expect(result[0][0]).toBe(COLOR.GREEN);
    expect(result[0][1]).toBe(COLOR.RED);
    expect(result[1][0]).toBe(COLOR.BLUE);
    expect(result[1][1]).toBe(COLOR.YELLOW);
  });

  it('does not mutate the original grid', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.GREEN],
      [COLOR.BLUE, COLOR.YELLOW],
    ];
    const original = JSON.parse(JSON.stringify(grid));

    swapTiles(grid, { row: 0, col: 0 }, { row: 1, col: 1 });

    expect(grid).toEqual(original);
  });
});

describe('checkWin', () => {
  it('returns true when each color forms one connected group', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.RED, COLOR.GREEN],
      [COLOR.BLUE, COLOR.BLUE, COLOR.GREEN],
      [COLOR.YELLOW, COLOR.YELLOW, COLOR.GREEN],
    ];
    expect(checkWin(grid)).toBe(true);
  });

  it('returns true for a simple solved 2x2 grid', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.RED],
      [COLOR.GREEN, COLOR.GREEN],
    ];
    expect(checkWin(grid)).toBe(true);
  });

  it('returns false when a color has disconnected groups', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.GREEN],
      [COLOR.GREEN, COLOR.RED],
    ];
    expect(checkWin(grid)).toBe(false); // Both RED and GREEN have 2 separate groups
  });

  it('returns false when one color has multiple separate groups', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.GREEN, COLOR.RED],
      [COLOR.GREEN, COLOR.BLUE, COLOR.GREEN],
      [COLOR.RED, COLOR.GREEN, COLOR.RED],
    ];
    expect(checkWin(grid)).toBe(false); // RED has 4 separate groups
  });

  it('returns false when some colors are split into multiple groups', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.RED, COLOR.GREEN, COLOR.GREEN],
      [COLOR.RED, COLOR.BLUE, COLOR.BLUE, COLOR.GREEN],
      [COLOR.YELLOW, COLOR.BLUE, COLOR.YELLOW, COLOR.YELLOW],
      [COLOR.YELLOW, COLOR.YELLOW, COLOR.YELLOW, COLOR.BLUE],
    ];
    expect(checkWin(grid)).toBe(false); // BLUE has 2 separate groups
  });

  it('returns true when all colors form connected lines', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.RED, COLOR.RED],
      [COLOR.GREEN, COLOR.GREEN, COLOR.GREEN],
      [COLOR.BLUE, COLOR.BLUE, COLOR.BLUE],
    ];
    expect(checkWin(grid)).toBe(true);
  });

  it('returns true for complex but valid connected patterns', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.RED, COLOR.GREEN],
      [COLOR.RED, COLOR.GREEN, COLOR.GREEN],
      [COLOR.BLUE, COLOR.BLUE, COLOR.BLUE],
    ];
    expect(checkWin(grid)).toBe(true); // Each color forms one group
  });

  it('returns false when colors form L-shapes but are disconnected', () => {
    const grid: Grid = [
      [COLOR.RED, COLOR.GREEN, COLOR.GREEN],
      [COLOR.BLUE, COLOR.BLUE, COLOR.GREEN],
      [COLOR.BLUE, COLOR.RED, COLOR.RED],
    ];
    expect(checkWin(grid)).toBe(false); // RED has 2 groups
  });
});

describe('generateDailyGrid', () => {
  it('returns the same grid for the same date', () => {
    const date = new Date('2026-01-13');
    const grid1 = generateDailyGrid(date);
    const grid2 = generateDailyGrid(date);
    expect(grid1).toEqual(grid2);
  });

  it('returns different grids for different dates', () => {
    const grid1 = generateDailyGrid(new Date('2026-01-13'));
    const grid2 = generateDailyGrid(new Date('2026-01-14'));
    expect(grid1).not.toEqual(grid2);
  });

  it('generates a 4x4 grid', () => {
    const grid = generateDailyGrid(new Date());
    expect(grid.length).toBe(4);
    expect(grid[0].length).toBe(4);
  });

  it('only uses valid colors', () => {
    const grid = generateDailyGrid(new Date());
    const validColors = [COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.YELLOW];

    grid.forEach(row => {
      row.forEach(color => {
        expect(validColors).toContain(color);
      });
    });
  });
});