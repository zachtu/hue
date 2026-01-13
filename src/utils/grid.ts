import type { Grid, Position, Color } from '../types';
import { COLORS, GRID_SIZE } from '../constants';

/**
 * Simple seeded random number generator
 */
function seededRandom(seed: number) {
  let current = seed;
  return function () {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
}

/**
 * Generates a deterministic grid based on a date
 */
export function generateDailyGrid(date: Date): Grid {
  // Use day since epoch as seed
  const seed = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const random = seededRandom(seed);

  const grid: Grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () =>
      COLORS[Math.floor(random() * COLORS.length)]
    )
  );

  return grid;
}

/**
 * Checks if two positions are adjacent (horizontally or vertically)
 */
export function isAdjacent(a: Position, b: Position): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

/**
 * Swaps two tiles in the grid and returns a new grid
 */
export function swapTiles(grid: Grid, pos1: Position, pos2: Position): Grid {
  const newGrid = grid.map(row => [...row]);
  const temp = newGrid[pos1.row][pos1.col];
  newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
  newGrid[pos2.row][pos2.col] = temp;
  return newGrid;
}

/**
 * Counts the number of connected groups for a specific color using DFS
 */
function countColorGroups(grid: Grid, color: Color): number {
  const size = grid.length;
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  let groupCount = 0;

  const dfs = (row: number, col: number) => {
    if (row < 0 || row >= size || col < 0 || col >= size) return;
    if (visited[row][col] || grid[row][col] !== color) return;

    visited[row][col] = true;

    // Visit all 4 adjacent cells
    dfs(row - 1, col);
    dfs(row + 1, col);
    dfs(row, col - 1);
    dfs(row, col + 1);
  };

  // Find all groups of this color
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!visited[row][col] && grid[row][col] === color) {
        dfs(row, col);
        groupCount++;
      }
    }
  }

  return groupCount;
}

/**
 * Checks if the puzzle is solved
 * Win condition: Each color must form exactly one connected group
 */
export function checkWin(grid: Grid): boolean {
  const size = grid.length;

  // Get all unique colors in the grid
  const uniqueColors = new Set<Color>();
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      uniqueColors.add(grid[row][col]);
    }
  }

  // Check that each color forms exactly one group
  for (const color of uniqueColors) {
    if (countColorGroups(grid, color) !== 1) {
      return false;
    }
  }

  return true;
}