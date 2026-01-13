import { useState, useEffect } from 'react';
import type { Grid, Position, SwapAnimation } from './types';
import { generateDailyGrid, checkWin, isAdjacent, swapTiles } from './utils/grid';
import { saveGameState, loadGameState, getDateString } from './utils/storage';
import GridComponent from './components/GridComponent';

const App = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [selected, setSelected] = useState<Position | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isShowingEndModal, setIsShowingEndModal] = useState(false);
  const [animation, setAnimation] = useState<SwapAnimation | null>(null);
  const [initialGrid, setInitialGrid] = useState<Grid>([]);

  useEffect(() => {
    const today = new Date();
    const savedState = loadGameState();

    if (savedState) {
      // Restore saved game
      setGrid(savedState.grid);
      setMoves(savedState.moves);
      setIsComplete(savedState.completed);
      setIsShowingEndModal(savedState.completed);

      // If not completed, we need the initial grid for reset
      if (!savedState.completed) {
        const dailyGrid = generateDailyGrid(today);
        setInitialGrid(dailyGrid);
      }
    } else {
      // Start new game
      const dailyGrid = generateDailyGrid(today);
      setGrid(dailyGrid);
      setInitialGrid(dailyGrid);

      // Save initial state
      saveGameState({
        date: getDateString(today),
        completed: false,
        moves: 0,
        grid: dailyGrid,
      });
    }
  }, []);

  // Save state whenever grid or moves change
  useEffect(() => {
    if (grid.length > 0) {
      const today = new Date();
      saveGameState({
        date: getDateString(today),
        completed: isComplete,
        moves,
        grid,
      });
    }
  }, [grid, moves, isComplete]);

  const handleTileClick = (row: number, col: number) => {
    // Disable clicks if already won or animating
    if (isComplete || animation) return;

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
        setIsComplete(true);
        setIsShowingEndModal(true);
      }
    }, 150);

    setMoves(m => m + 1);
    setSelected(null);
  };

  const handleReset = () => {
    if (isComplete) return; // Can't reset after winning

    setGrid(initialGrid);
    setMoves(0);
    setSelected(null);

    // Save reset state
    const today = new Date();
    saveGameState({
      date: getDateString(today),
      completed: false,
      moves: 0,
      grid: initialGrid,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-6 sm:pt-12">
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
          disabled={isComplete}
        />

        {/* Reset Button */}
        {!isComplete && moves > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleReset}
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Reset Puzzle
            </button>
          </div>
        )}
      </div>

      {/* Win Modal */}
      {isShowingEndModal && (
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
              onClick={() => setIsShowingEndModal(false)}
              className="bg-slate-100 text-slate-700 text-sm sm:text-base px-6 py-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 transition-colors"
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