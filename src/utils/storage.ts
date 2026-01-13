import type { Grid } from '../types';

export interface GameState {
    date: string;
    completed: boolean;
    moves: number;
    grid: Grid;
}

const STORAGE_KEY = 'hue-game-state';

/**
 * Gets the date string in YYYY-MM-DD format
 */
export function getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Saves the current game state to localStorage
 */
export function saveGameState(state: GameState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save game state:', error);
    }
}

/**
 * Loads the game state from localStorage
 */
export function loadGameState(): GameState | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const state = JSON.parse(stored) as GameState;

        // Check if it's today's puzzle
        const today = getDateString(new Date());
        if (state.date !== today) {
            // Old puzzle, clear it
            clearGameState();
            return null;
        }

        return state;
    } catch (error) {
        console.error('Failed to load game state:', error);
        return null;
    }
}

/**
 * Clears the game state from localStorage
 */
export function clearGameState(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear game state:', error);
    }
}