import { GRID_SIZE } from "../constants";
import type { MovingTile } from "../types";

type AnimatedTileProps = {
  tile: MovingTile;
};

const AnimatedTile = ({ tile }: AnimatedTileProps) => {
  // Gap size in rem - matches the grid gap
  const gapSize = 0.375; // 1.5 on mobile (gap-1.5)

  return (
    <div
      className="absolute aspect-square rounded-md sm:rounded-lg pointer-events-none"
      style={{
        backgroundColor: tile.color,
        width: `calc((100% - ${GRID_SIZE - 1} * ${gapSize}rem) / ${GRID_SIZE})`,
        left: `calc(${tile.from.col} * (100% / ${GRID_SIZE}) + ${tile.from.col} * ${gapSize}rem)`,
        top: `calc(${tile.from.row} * (100% / ${GRID_SIZE}) + ${tile.from.row} * ${gapSize}rem)`,
        transform: tile.moving
          ? `translate(${(tile.to.col - tile.from.col) * 100}%, ${(tile.to.row - tile.from.row) * 100}%)`
          : 'translate(0, 0)',
        transition: tile.moving ? 'transform 0.15s ease-out' : 'none',
      }}
    />
  );
};

export default AnimatedTile;