// Game variables
const GRID_SIZE = 5;
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let targetCell = null;
let players = [];
let startingHue = 0; // Randomized for each game
const HUE_RANGE = 120; // Further increased range for more distinct colors

// Italian translations for color names
const NATURAL_COLOR_BASES = [
    { hue: 0, name: "Rosso" },         // Red (apples, strawberries)
    { hue: 30, name: "Arancione" },    // Orange (oranges, pumpkins)
    { hue: 50, name: "Giallo" },       // Yellow (bananas, lemons)
    { hue: 80, name: "Lime" },         // Lime/Yellow-Green (limes, leaves)
    { hue: 120, name: "Verde" },       // Green (grass, leaves)
    { hue: 160, name: "Turchese" },    // Teal (turquoise, some ocean water)
    { hue: 200, name: "Azzurro" },     // Sky Blue (clear sky)
    { hue: 220, name: "Blu" },         // Blue (blueberries, jeans)
    { hue: 260, name: "Viola" },       // Purple (grapes, lavender)
    { hue: 280, name: "Magenta" },     // Magenta (some flowers)
    { hue: 320, name: "Rosa" },        // Pink (pink flowers, cotton candy)
    { hue: 350, name: "Fucsia" }       // Rose/Dark Pink (roses)
];

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

// Event Listeners
startGameButton.addEventListener('click', startGame);
gotItButton.addEventListener('click', showGamePlay);
addPlayerButton.addEventListener('click', addPlayer);
revealAnswerButton.addEventListener('click', revealAnswer);
playAgainButton.addEventListener('click', resetGame);

// Initialize the game
function init() {
    document.documentElement.style.setProperty('--grid-size', GRID_SIZE);
    
    // Update grid labels based on GRID_SIZE
    updateGridLabels();
    
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
    // Pick a random natural color base from our predefined list
    const randomColorIndex = Math.floor(Math.random() * NATURAL_COLOR_BASES.length);
    startingHue = NATURAL_COLOR_BASES[randomColorIndex].hue;
    
    // Generate and show the target cell
    targetCell = {
        row: Math.floor(Math.random() * GRID_SIZE),
        col: Math.floor(Math.random() * GRID_SIZE)
    };
    
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
    const playerNumber = players.length + 1;
    const playerName = `Giocatore ${playerNumber}`;
    
    players.push({
        name: playerName,
        guess: null
    });
    
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-input');
    
    const label = document.createElement('label');
    label.textContent = `${playerName}: `;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'B3';
    input.setAttribute('data-player', playerNumber - 1);
    input.maxLength = 2;
    input.addEventListener('change', function() {
        const playerIndex = parseInt(this.getAttribute('data-player'));
        players[playerIndex].guess = this.value.toUpperCase();
    });
    
    playerDiv.appendChild(label);
    playerDiv.appendChild(input);
    playerInputsArea.appendChild(playerDiv);
}

// Reveal the answer and show results
function revealAnswer() {
    // Generate result grid with coordinates
    generateColorGrid(resultGrid);
    
    // Show results for each player
    resultsList.innerHTML = '';
    const targetCoords = `${COLUMN_LABELS[targetCell.col]}${targetCell.row + 1}`;
    
    players.forEach(player => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('results-item');
        
        if (player.guess === targetCoords) {
            resultItem.classList.add('correct');
            resultItem.textContent = `${player.name}: Corretto! (${player.guess})`;
        } else {
            resultItem.classList.add('incorrect');
            resultItem.textContent = `${player.name}: Sbagliato! Ha indovinato ${player.guess || 'niente'}`;
        }
        
        resultsList.appendChild(resultItem);
    });
    
    // Hide game play, show results
    gamePlaySection.classList.add('hidden');
    gameResultSection.classList.remove('hidden');
}

// Reset the game to initial state
function resetGame() {
    gameResultSection.classList.add('hidden');
    gameSetupSection.classList.remove('hidden');
}

// Initialize the game on load
window.addEventListener('DOMContentLoaded', init); 