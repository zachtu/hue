import { GRID_SIZE } from "../constants";
import type { Grid, Position, SwapAnimation } from "../types";
import AnimatedTile from "./AnimatedTile";
import Tile from "./Tile";

type GridProps = {
  grid: Grid;
  selected: Position | null;
  animation: SwapAnimation | null;
  onTileClick: (row: number, col: number) => void;
};

const GridComponent = ({ grid, selected, animation, onTileClick }: GridProps) => {
  if (grid.length === 0) return null;

  return (
    <div
      className="relative grid gap-1.5 sm:gap-2"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        width: 'min(85vw, 420px)',
        maxWidth: '420px',
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            color={color}
            position={{ row: rowIndex, col: colIndex }}
            selected={selected}
            animation={animation}
            onClick={onTileClick}
          />
        ))
      )}

      {animation &&
        Object.values(animation).map((tile, i) => <AnimatedTile key={i} tile={tile} />)}
    </div>
  );
};

export default GridComponent;