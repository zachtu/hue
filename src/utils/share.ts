import type { Grid, Color } from '../types';
import { COLOR } from '../constants';
import { getDateString } from './storage';

/**
 * Maps colors to emoji squares
 */
const colorToEmoji: Record<Color, string> = {
    [COLOR.RED]: '🟥',
    [COLOR.GREEN]: '🟩',
    [COLOR.BLUE]: '🟦',
    [COLOR.YELLOW]: '🟨',
};

/**
 * Gets the puzzle number (days since launch)
 */
function getPuzzleNumber(date: Date): number {
    const launchDate = new Date('2026-01-13'); // Today's date as launch
    const diffTime = date.getTime() - launchDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
}

/**
 * Generates shareable text with the grid visualization
 */
export function generateShareText(grid: Grid, moves: number, date: Date): string {
    const puzzleNumber = getPuzzleNumber(date);

    // Convert grid to emoji
    const gridEmoji = grid
        .map(row => row.map(color => colorToEmoji[color]).join(''))
        .join('\n');

    return `Hue #${puzzleNumber}\n✅ Solved in ${moves} moves\n\n${gridEmoji}`;
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}