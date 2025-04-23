// Get language preference
function getLanguage() {
    return getUserLanguage(); // Use the main language utility function
}

// Color translations
const colorTranslations = {
    en: [
        { hue: 0, name: "Red" },
        { hue: 30, name: "Orange" },
        { hue: 50, name: "Yellow" },
        { hue: 80, name: "Lime" },
        { hue: 120, name: "Green" },
        { hue: 160, name: "Teal" },
        { hue: 200, name: "Sky Blue" },
        { hue: 220, name: "Blue" },
        { hue: 260, name: "Purple" },
        { hue: 280, name: "Magenta" },
        { hue: 320, name: "Pink" },
        { hue: 350, name: "Rose" }
    ],
    it: [
        { hue: 0, name: "Rosso" },
        { hue: 30, name: "Arancione" },
        { hue: 50, name: "Giallo" },
        { hue: 80, name: "Lime" },
        { hue: 120, name: "Verde" },
        { hue: 160, name: "Turchese" },
        { hue: 200, name: "Azzurro" },
        { hue: 220, name: "Blu" },
        { hue: 260, name: "Viola" },
        { hue: 280, name: "Magenta" },
        { hue: 320, name: "Rosa" },
        { hue: 350, name: "Fucsia" }
    ]
};

// Track current language
let currentLanguage = getLanguage();

// Game variables
const GRID_SIZE = 5;
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let targetCell = null;
let players = [];
let startingHue = 0; // Randomized for each game
const HUE_RANGE = 120; // Further increased range for more distinct colors

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

// Initialize the game
function init() {
    document.documentElement.style.setProperty('--grid-size', GRID_SIZE);
    
    // Update grid labels based on GRID_SIZE
    updateGridLabels();
    
    // Check for language changes
    setInterval(() => {
        const newLanguage = getLanguage();
        if (newLanguage !== currentLanguage) {
            currentLanguage = newLanguage;
            applyGameTranslations();
            updatePlayerLabels(); // Update player labels if they exist
        }
    }, 1000);
    
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
    // Use the color bases for current language
    const lang = getCurrentLanguage();
    const colorBases = colorTranslations[lang] || colorTranslations['en'];
    
    // Pick a random natural color base
    const randomBaseIndex = Math.floor(Math.random() * colorBases.length);
    startingHue = colorBases[randomBaseIndex].hue;
    
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

// Get color for a specific cell position using natural colors
function getColorForCell(row, col) {
    // Calculate hue - with increased range for better differentiation
    const hueStep = HUE_RANGE / (GRID_SIZE - 1);
    const hue = (startingHue + col * hueStep) % 360;
    
    // Even more distinct saturation steps
    // From 60% to 95% with larger steps
    const saturation = 60 + (35 * row / (GRID_SIZE - 1));
    
    // More distinct lightness steps
    // From 85% down to 35% with bigger steps between rows
    const lightness = 85 - (50 * row / (GRID_SIZE - 1));
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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
    playerLabel.htmlFor = `player${playerCount}`;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'B3';
    input.classList.add('coord-input');
    input.dataset.playerIndex = players.length - 1;
    
    input.addEventListener('change', function() {
        const playerIndex = parseInt(this.dataset.playerIndex);
        players[playerIndex].guess = this.value.trim().toUpperCase();
    });
    
    playerDiv.appendChild(playerLabel);
    playerDiv.appendChild(input);
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

// Reset game to initial state
function resetGame() {
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

// Event Listeners
startGameButton.addEventListener('click', startGame);
gotItButton.addEventListener('click', showGamePlay);
addPlayerButton.addEventListener('click', addPlayer);
revealAnswerButton.addEventListener('click', revealAnswer);
playAgainButton.addEventListener('click', resetGame);

// Initialize on load
document.addEventListener('DOMContentLoaded', init); 