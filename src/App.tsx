import { useState, useEffect } from 'react';
import type { Grid, Position, SwapAnimation } from './types';
import { generateDailyGrid, checkWin, isAdjacent, swapTiles } from './utils/grid';
import GridComponent from './components/GridComponent';

const App = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [selected, setSelected] = useState<Position | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [animation, setAnimation] = useState<SwapAnimation | null>(null);

  useEffect(() => {
    const today = new Date();
    const dailyGrid = generateDailyGrid(today);
    setGrid(dailyGrid);
    setIsWon(checkWin(dailyGrid));
  }, []);

  const handleTileClick = (row: number, col: number) => {
    if (isWon || animation) return;

    const clickedPos: Position = { row, col };

    if (selected && selected.row === clickedPos.row && selected.col === clickedPos.col) {
      setSelected(null);
      return;
    }

    if (!selected) {
      setSelected(clickedPos);
      return;
    }

    if (!isAdjacent(selected, clickedPos)) {
      setSelected(clickedPos);
      return;
    }

    const colorA = grid[selected.row][selected.col];
    const colorB = grid[clickedPos.row][clickedPos.col];

    setAnimation({
      a: { from: selected, to: clickedPos, color: colorA, moving: false },
      b: { from: clickedPos, to: selected, color: colorB, moving: false },
    });

    requestAnimationFrame(() => {
      setAnimation(anim =>
        anim ? {
          a: { ...anim.a, moving: true },
          b: { ...anim.b, moving: true }
        } : null
      );
    });

    setTimeout(() => {
      const newGrid = swapTiles(grid, selected, clickedPos);
      setGrid(newGrid);
      setAnimation(null);

      if (checkWin(newGrid)) {
        setIsWon(true);
      }
    }, 150);

    setMoves(m => m + 1);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 sm:pt-12">
      {/* Header */}
      <div className="w-full max-w-md mb-4 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center mb-1">
          hue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 text-center mb-2 sm:mb-3">
          Connect all tiles of the same color
        </p>
        <div className="text-center">
          <span className="text-xs sm:text-sm text-slate-600">
            Moves: <span className="font-semibold text-slate-900">{moves}</span>
          </span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-3 sm:p-4">
        <GridComponent
          grid={grid}
          selected={selected}
          animation={animation}
          onTileClick={handleTileClick}
        />
      </div>

      {/* Win Modal */}
      {isWon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-sm text-center">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎉</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Complete!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
              You solved today's puzzle in <span className="font-bold text-slate-900">{moves}</span> moves
            </p>
            <button
              onClick={() => setIsWon(false)}
              className="bg-slate-900 text-white text-sm sm:text-base px-6 py-2 rounded-lg hover:bg-slate-800 active:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;