export const BASE_XP = 10; // XP required for the first level
export const SCALE_FACTOR = 5; // Determines how fast XP requirements grow

export default function getXpStats(xp: number) {
	// Helper function to calculate XP required for a specific level
	const xpForLevel = (level: number) => BASE_XP + level ** 2 * SCALE_FACTOR;

	// Calculate the current level and the XP requirements
	let currentLevel = 0;
	let xpForCurrentLevel = 0;
	let xpForNextLevel = xpForLevel(1);

	while (xp >= xpForNextLevel) {
		currentLevel++;
		xpForCurrentLevel = xpForNextLevel;
		xpForNextLevel = xpForLevel(currentLevel + 1);
	}

	const progressToNextLevel =
		(xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel);

	return {
		currentLevel,
		xpForNextLevel,
		progressToNextLevel,
	};
}

export function calculateXpForLevel(level: number): number {
	return BASE_XP + level ** 2 * SCALE_FACTOR;
}
