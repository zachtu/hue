import type { Color, Position, SwapAnimation } from "../types";

type TileProps = {
  color: Color;
  position: Position;
  selected: Position | null;
  animation: SwapAnimation | null;
  onClick: (row: number, col: number) => void;
  disabled?: boolean;
};

const Tile = ({ color, position, selected, animation, onClick, disabled = false }: TileProps) => {
  const isSelected =
    selected?.row === position.row && selected?.col === position.col;

  const isMoving = animation && (
    (animation.a.from.row === position.row && animation.a.from.col === position.col) ||
    (animation.b.from.row === position.row && animation.b.from.col === position.col)
  );

  return (
    <button
      onClick={() => !disabled && onClick(position.row, position.col)}
      className={`
        aspect-square rounded-md sm:rounded-lg transition-transform active:scale-95
        ${isSelected && !animation
          ? 'scale-95 ring-3 sm:ring-4 ring-white/60 ring-inset'
          : !disabled && 'hover:scale-105'
        }
        ${disabled ? 'cursor-default opacity-90' : 'cursor-pointer'}
        touch-manipulation
      `}
      style={{
        backgroundColor: color,
        visibility: isMoving ? 'hidden' : 'visible',
      }}
      disabled={disabled}
      aria-label={`Tile at row ${position.row}, column ${position.col}`}
    />
  );
};

export default Tile;