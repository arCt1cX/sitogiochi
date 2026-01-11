// Get language preference
function getLanguage() {
    return getUserLanguage(); // Use the main language utility function
}

// Theme definitions
const themes = [];
let currentTheme = null;

// Helper to create classic spectral themes (Hue varies by column)
function createClassicTheme(startHue) {
    return {
        type: 'classic',
        h: { start: startHue, end: startHue + 120, axis: 'col' },
        s: { start: 75, end: 100, axis: 'row' },
        l: { start: 75, end: 35, axis: 'row' }
    };
}

// 1. Classic Spectral Themes (Original 12)
const classicStartHues = [0, 30, 50, 80, 120, 160, 200, 220, 260, 280, 320, 350];
classicStartHues.forEach(hue => themes.push(createClassicTheme(hue)));

// 2. New Special Themes (Mixed Colors)
themes.push(
    // Orange -> Brown (Hue ~30. Sat decreases across cols. Light decreases across rows)
    {
        type: 'special',
        h: { start: 25, end: 35, axis: 'row' },
        s: { start: 95, end: 40, axis: 'col' },
        l: { start: 65, end: 25, axis: 'row' }
    },
    // Blue -> Gray (Hue ~220. Sat drops to 0 across cols)
    {
        type: 'special',
        h: { start: 220, end: 210, axis: 'col' },
        s: { start: 95, end: 0, axis: 'col' },
        l: { start: 60, end: 50, axis: 'row' }
    },
    // White -> Red (Sat increases row-wise. Light decreases col-wise)
    {
        type: 'special',
        h: { start: 0, end: 0, axis: 'col' },
        s: { start: 0, end: 100, axis: 'row' },
        l: { start: 98, end: 50, axis: 'col' }
    },
    // Lime -> Dark Forest (Green hue. Sat drops, Light drops deeply)
    {
        type: 'special',
        h: { start: 90, end: 120, axis: 'row' },
        s: { start: 90, end: 50, axis: 'col' },
        l: { start: 70, end: 15, axis: 'row' }
    },
    // Purple -> Black (Purple hue. Light drops to near 0)
    {
        type: 'special',
        h: { start: 270, end: 290, axis: 'col' },
        s: { start: 90, end: 30, axis: 'row' },
        l: { start: 60, end: 20, axis: 'col' }
    }
);

// Track current language
let currentLanguage = getLanguage();

// Game variables
let GRID_SIZE = 5; // Default grid size
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let targetCell = null;
let players = [];
let colorWord = ''; // Store the word describing the color

// DOM Elements
const gameSetupSection = document.getElementById('game-setup');
const targetRevealSection = document.getElementById('target-reveal');
const gamePlaySection = document.getElementById('game-play');
const gameResultSection = document.getElementById('game-result');
const startGameButton = document.getElementById('start-game');
const gotItButton = document.getElementById('got-it');
const addPlayerButton = document.getElementById('add-player');
const revealAnswerButton = document.getElementById('reveal-answer');
const playAgainButton = document.getElementById('play-again');
const colorGrid = document.getElementById('color-grid');
const resultGrid = document.getElementById('result-grid');
const playerInputsArea = document.getElementById('player-inputs');
const resultsList = document.getElementById('results-list');
const targetCellDisplay = document.getElementById('target-cell');
const targetCoordsDisplay = document.getElementById('target-coords');
const colorWordInput = document.getElementById('color-word');

// Game mode selection buttons
const mode5x5Button = document.getElementById('mode-5x5');
const mode10x10Button = document.getElementById('mode-10x10');

// Get all grid label containers
const gridLabelsRows = document.querySelectorAll('.grid-labels-row');
const gridLabelsCols = document.querySelectorAll('.grid-labels-col');

// Get language from our central language utility
function getCurrentLanguage() {
    return getLanguage();
}

// Update player labels based on current language
function updatePlayerLabels() {
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    // Update existing player labels
    const playerInputs = document.querySelectorAll('.player-input label');
    playerInputs.forEach((label, index) => {
        label.textContent = `${t.player} ${index + 1}: `;
    });
}

// Handle game mode selection
function selectGameMode(size) {
    // Update GRID_SIZE
    GRID_SIZE = size;

    // Update CSS variable
    document.documentElement.style.setProperty('--grid-size', GRID_SIZE);

    // Update grid labels
    updateGridLabels();

    // Update UI for selected mode
    if (size === 5) {
        mode5x5Button.classList.add('mode-selected');
        mode10x10Button.classList.remove('mode-selected');

        // Remove 10x10 grid class if exists
        document.querySelectorAll('.grid-container').forEach(container => {
            container.classList.remove('grid-size-10');
        });
    } else {
        mode10x10Button.classList.add('mode-selected');
        mode5x5Button.classList.remove('mode-selected');

        // Add 10x10 grid class for styling
        document.querySelectorAll('.grid-container').forEach(container => {
            container.classList.add('grid-size-10');
        });
    }
}

// Initialize the game
function init() {
    // Set default game mode (5x5)
    selectGameMode(5);

    // Check for language changes
    setInterval(() => {
        const newLanguage = getLanguage();
        if (newLanguage !== currentLanguage) {
            currentLanguage = newLanguage;
            applyGameTranslations();
            updatePlayerLabels(); // Update player labels if they exist
        }
    }, 1000);

    // Add event listeners for mode selection
    mode5x5Button.addEventListener('click', () => selectGameMode(5));
    mode10x10Button.addEventListener('click', () => selectGameMode(10));

    // Add event listener for the color word input
    colorWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGotIt();
        }
    });

    // Update the got-it button click handler
    gotItButton.addEventListener('click', handleGotIt);

    resetGame();
}

// Update grid coordinate labels based on grid size
function updateGridLabels() {
    // Update column labels (A, B, C, ...)
    gridLabelsRows.forEach(container => {
        // Clear existing labels except the empty corner
        const emptyCorner = container.querySelector('.empty-corner');
        container.innerHTML = '';
        container.appendChild(emptyCorner);

        // Add column labels
        for (let i = 0; i < GRID_SIZE; i++) {
            const label = document.createElement('div');
            label.classList.add('col-label');
            label.textContent = COLUMN_LABELS[i];
            container.appendChild(label);
        }
    });

    // Update row labels (1, 2, 3, ...)
    gridLabelsCols.forEach(container => {
        container.innerHTML = '';

        // Add row labels
        for (let i = 0; i < GRID_SIZE; i++) {
            const label = document.createElement('div');
            label.classList.add('row-label');
            label.textContent = i + 1;
            container.appendChild(label);
        }
    });
}

// Start the game
function startGame() {
    // Pick a random theme
    const randomThemeIndex = Math.floor(Math.random() * themes.length);
    currentTheme = themes[randomThemeIndex];

    // Generate target cell (random row and column)
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    targetCell = { row, col };

    // Show target reveal to first player
    showTargetReveal();
}

// Show the target cell to the first player
function showTargetReveal() {
    // Update the target reveal screen
    const cellCoords = `${COLUMN_LABELS[targetCell.col]}${targetCell.row + 1}`;
    targetCoordsDisplay.textContent = cellCoords;

    // Set the target cell color
    const cellColor = getColorForCell(targetCell.row, targetCell.col);
    targetCellDisplay.style.backgroundColor = cellColor;

    // Set the input placeholder based on language
    const lang = getCurrentLanguage();
    if (lang === 'it') {
        colorWordInput.placeholder = "Scrivi una parola per descrivere questo colore...";
    } else {
        colorWordInput.placeholder = "Type a word to describe this color...";
    }

    // Hide setup screen, show target reveal
    gameSetupSection.classList.add('hidden');
    targetRevealSection.classList.remove('hidden');
}

// Show the game play screen with full grid
function showGamePlay() {
    // Hide target reveal, show game play
    targetRevealSection.classList.add('hidden');
    gamePlaySection.classList.remove('hidden');

    // Clear any previous players
    players = [];
    playerInputsArea.innerHTML = '';

    // Generate the full color grid
    generateColorGrid(colorGrid);

    // Display the color word over the grid
    displayColorWord();

    // Add two players by default
    addPlayer();
    addPlayer();
}

// Generate the color grid
function generateColorGrid(gridElement) {
    gridElement.innerHTML = '';

    // Create cells
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');

            // Get color for this cell position
            const cellColor = getColorForCell(row, col);
            cell.style.backgroundColor = cellColor;

            // Add coordinates label for the results grid only
            if (gridElement === resultGrid) {
                // Highlight the target cell in the results grid
                if (row === targetCell.row && col === targetCell.col) {
                    cell.classList.add('target');
                }
            }

            gridElement.appendChild(cell);
        }
    }
}

// Helper: Linear Interpolation
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Get color for a specific cell position using the current theme
function getColorForCell(row, col) {
    if (!currentTheme) return 'black';

    const max = GRID_SIZE - 1;

    // Helper to calculate a component value based on its axis definition
    const getComponentValue = (compDef) => {
        let t = 0;
        if (compDef.axis === 'col') t = col / max;
        else if (compDef.axis === 'row') t = row / max;
        // else axis is undefined or different, allow t=0

        // Handle "Classic" 10x10 stretching for Hue
        let end = compDef.end;
        if (currentTheme.type === 'classic' && compDef === currentTheme.h && GRID_SIZE === 10) {
            end = compDef.start + 180; // Extend hue range for 10x10 in classic mode
        }

        return lerp(compDef.start, end, t);
    };

    const h = getComponentValue(currentTheme.h) % 360;
    const s = getComponentValue(currentTheme.s);
    const l = getComponentValue(currentTheme.l);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Add a new player input
function addPlayer() {
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    const playerCount = players.length + 1;

    // Create a player object
    players.push({
        name: `${t.player} ${playerCount}`,
        guess: null
    });

    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-input');

    const playerLabel = document.createElement('label');
    playerLabel.textContent = `${t.player} ${playerCount}: `;

    const playerInput = document.createElement('input');
    playerInput.type = 'text';
    playerInput.maxLength = GRID_SIZE < 10 ? 2 : 3; // Allow for coordinates like "J10"
    playerInput.placeholder = 'A1';
    playerInput.dataset.playerIndex = players.length - 1;

    playerInput.addEventListener('input', (e) => {
        const index = parseInt(e.target.dataset.playerIndex);
        players[index].guess = e.target.value.toUpperCase();
    });

    playerDiv.appendChild(playerLabel);
    playerDiv.appendChild(playerInput);

    playerInputsArea.appendChild(playerDiv);
}

// Reveal the answer and show results
function revealAnswer() {
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    generateColorGrid(resultGrid);

    // Clear previous results
    resultsList.innerHTML = '';

    // Parse all guesses
    players.forEach(player => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        // Get the correct cell coordinates
        const correctCoords = `${COLUMN_LABELS[targetCell.col]}${targetCell.row + 1}`;

        if (!player.guess) {
            resultItem.textContent = `${player.name}: ${t.invalidGuess}`;
            resultItem.classList.add('invalid');
        }
        else if (player.guess === correctCoords) {
            resultItem.textContent = `${player.name}: ${t.correctGuess}`;
            resultItem.classList.add('correct');
        }
        else {
            resultItem.textContent = `${player.name}: ${player.guess} - ${t.incorrectGuess} ${correctCoords}`;
            resultItem.classList.add('incorrect');
        }

        resultsList.appendChild(resultItem);
    });

    // Show result screen
    gamePlaySection.classList.add('hidden');
    gameResultSection.classList.remove('hidden');
}

// Display the color word over the grid
function displayColorWord() {
    // Get the container for the displayed word
    const wordContainer = document.getElementById('displayed-word-container');

    // Clear any existing content
    wordContainer.innerHTML = '';

    // Create and display the new word
    const wordDisplay = document.createElement('div');
    wordDisplay.classList.add('displayed-word');
    wordDisplay.textContent = `"${colorWord}"`;
    wordContainer.appendChild(wordDisplay);
}

// Handle the "Got it" button click
function handleGotIt() {
    // Get the word from the input
    colorWord = colorWordInput.value.trim();

    // If no word was entered, use a default message based on language
    if (!colorWord) {
        const lang = getCurrentLanguage();
        if (lang === 'it') {
            colorWord = "Colore Segreto";
        } else {
            colorWord = "Secret Color";
        }
    }

    // Show the game play screen
    showGamePlay();
}

// Reset game to initial state
function resetGame() {
    // Clear the color word
    colorWord = '';
    colorWordInput.value = '';

    // Remove any displayed word
    const displayedWord = document.querySelector('.displayed-word');
    if (displayedWord) {
        displayedWord.remove();
    }

    // Clear all sections
    targetCellDisplay.style.backgroundColor = '';
    targetCoordsDisplay.textContent = '';
    colorGrid.innerHTML = '';
    resultGrid.innerHTML = '';
    playerInputsArea.innerHTML = '';
    resultsList.innerHTML = '';

    // Reset variables
    targetCell = null;
    players = [];

    // Show setup screen
    gameSetupSection.classList.remove('hidden');
    targetRevealSection.classList.add('hidden');
    gamePlaySection.classList.add('hidden');
    gameResultSection.classList.add('hidden');
}

// Event listeners
startGameButton.addEventListener('click', startGame);
gotItButton.addEventListener('click', handleGotIt);
addPlayerButton.addEventListener('click', addPlayer);
revealAnswerButton.addEventListener('click', revealAnswer);
playAgainButton.addEventListener('click', resetGame);

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', init); 