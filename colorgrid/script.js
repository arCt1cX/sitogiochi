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
let GRID_SIZE = 5; // Default grid size
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let targetCell = null;
let players = []; // Array of { name: "Name", score: 0, id: 0 }
let startingHue = 0; // Randomized for each game
const HUE_RANGE = 120; // Further increased range for more distinct colors
let colorWord = ''; // Store the word describing the color

// Turn-based state
let currentRound = 0; // 0 to players.length - 1
let viewerIndex = 0; // Index of the player who knows the secret
let guessingQueue = []; // Array of player indices waiting to guess
let currentGuesserIndex = -1; // Active guesser
let roundGuesses = {}; // { playerIndex: {row, col} }
let selectedCell = null; // { row, col } currently selected by guesser

// DOM Elements
const gameSetupSection = document.getElementById('game-setup');
const targetRevealSection = document.getElementById('target-reveal');
const gamePlaySection = document.getElementById('game-play');
const gameResultSection = document.getElementById('game-result'); // Ensure this ID exists or use generic result section
const startGameButton = document.getElementById('start-game');
const gotItButton = document.getElementById('got-it');
const confirmGuessButton = document.getElementById('confirm-guess');
const playAgainButton = document.getElementById('play-again'); // In results section
const colorGrid = document.getElementById('color-grid');
const targetCellDisplay = document.getElementById('target-cell');
const targetCoordsDisplay = document.getElementById('target-coords');
const colorWordInput = document.getElementById('color-word');
const playerCountInput = document.getElementById('player-count');
const playerNamesContainer = document.getElementById('player-names-container');
const turnInfo = document.getElementById('turnInfo');
const turnInstruction = document.getElementById('turnInstruction');

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
            updateDynamicText();
        }
    }, 1000);

    // Add event listeners for mode selection
    mode5x5Button.addEventListener('click', () => selectGameMode(5));
    mode10x10Button.addEventListener('click', () => selectGameMode(10));

    // Player count change listener
    playerCountInput.addEventListener('change', updatePlayerNameInputs);
    playerCountInput.addEventListener('input', updatePlayerNameInputs);

    // Initial player inputs generation
    updatePlayerNameInputs();

    // Add event listener for the color word input
    colorWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGotIt();
        }
    });

    // Button listeners
    startGameButton.addEventListener('click', validateAndStartGame);
    gotItButton.addEventListener('click', handleGotIt);
    confirmGuessButton.addEventListener('click', confirmGuess);

    // Handle result buttons if they exist
    const nextRoundBtn = document.createElement('button');
    nextRoundBtn.id = 'next-round-btn';
    nextRoundBtn.className = 'btn';
    nextRoundBtn.textContent = 'Next Round'; // Placeholder, will be translated
    nextRoundBtn.addEventListener('click', nextRound);

    // Check if we need to append it somewhere or if there is already a results structure
    // We'll reuse game-result section but dynamically populate it
    if (!document.getElementById('next-round-btn')) {
        // Create a wrapper or just append to results list
    }
}

function updateDynamicText() {
    // Re-render UI text based on current state (e.g. turn info)
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    if (!gamePlaySection.classList.contains('hidden') && currentGuesserIndex !== -1) {
        turnInfo.textContent = `${t.turnOf} ${players[currentGuesserIndex].name}`;
        turnInstruction.textContent = t.clickInstruction;
    }
}

// Update player name inputs based on count
function updatePlayerNameInputs() {
    const count = parseInt(playerCountInput.value);
    const currentInputs = playerNamesContainer.querySelectorAll('.player-name-input');
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    // If we have more inputs than needed, remove them
    if (currentInputs.length > count) {
        for (let i = count; i < currentInputs.length; i++) {
            currentInputs[i].remove();
        }
    }
    // If we have fewer, add them
    else if (currentInputs.length < count) {
        for (let i = currentInputs.length; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'player-name-input';

            const label = document.createElement('label');
            label.textContent = `${i + 1}.`;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${t.player} ${i + 1}`;
            input.dataset.index = i;

            div.appendChild(label);
            div.appendChild(input);
            playerNamesContainer.appendChild(div);
        }
    }
}


function validateAndStartGame() {
    const inputs = playerNamesContainer.querySelectorAll('input');
    const tempPlayers = [];
    let valid = true;

    inputs.forEach((input, index) => {
        let name = input.value.trim();
        if (!name) {
            const lang = getCurrentLanguage();
            const t = gameTranslations[lang] || gameTranslations['en'];
            name = `${t.player} ${index + 1}`;
        }
        tempPlayers.push({ name: name, score: 0, id: index });
    });

    if (valid) {
        players = tempPlayers;
        currentRound = 0;
        // Randomize first viewer
        viewerIndex = Math.floor(Math.random() * players.length);

        startRound();
    }
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

// Start a new round
function startRound() {
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];
    const colorBases = colorTranslations[lang] || colorTranslations['en'];

    // Pick a random natural color base
    const randomBaseIndex = Math.floor(Math.random() * colorBases.length);
    startingHue = colorBases[randomBaseIndex].hue;

    // Generate target cell (random row and column)
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    targetCell = { row, col };

    // Reset round state
    roundGuesses = {};
    colorWord = '';

    // Show target reveal to viewer
    showTargetReveal();
}

function showTargetReveal() {
    // Update the target reveal screen
    const cellCoords = `${COLUMN_LABELS[targetCell.col]}${targetCell.row + 1}`;

    // Changing the structure: "Name ricorda questa cella!" instead of "Ricorda questa cella!"
    // We need to target the h2
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    // We update the remembering title with player name
    const rememberTitle = document.getElementById('rememberCell');
    if (lang === 'it') {
        rememberTitle.textContent = `${players[viewerIndex].name} ricorda questa cella!`;
    } else {
        rememberTitle.textContent = `${players[viewerIndex].name} remember this cell!`;
    }

    // The coords text should be just the coords
    targetCoordsDisplay.textContent = cellCoords;

    // Set the target cell color
    const cellColor = getColorForCell(targetCell.row, targetCell.col);
    targetCellDisplay.style.backgroundColor = cellColor;

    // Set input placeholder
    colorWordInput.value = '';
    colorWordInput.placeholder = lang === 'it'
        ? "Scrivi una parola per descrivere questo colore..."
        : "Type a word to describe this color...";

    // Hide other sections, show target reveal
    gameSetupSection.classList.add('hidden');
    gamePlaySection.classList.add('hidden');
    gameResultSection.classList.add('hidden'); // Assuming generic result section
    targetRevealSection.classList.remove('hidden');
}


// Handle the "Got it" button click
function handleGotIt() {
    colorWord = colorWordInput.value.trim();
    if (!colorWord) {
        const lang = getCurrentLanguage();
        colorWord = lang === 'it' ? "Colore Segreto" : "Secret Color";
    }

    startGuessingPhase();
}

function startGuessingPhase() {
    // Create queue of guessers (everyone except viewer)
    guessingQueue = players.filter((p, i) => i !== viewerIndex).map(p => p.id);

    // Shuffle queue
    for (let i = guessingQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [guessingQueue[i], guessingQueue[j]] = [guessingQueue[j], guessingQueue[i]];
    }

    nextGuesser();
}

function nextGuesser() {
    if (guessingQueue.length === 0) {
        showRoundResults();
        return;
    }

    // Get next player ID
    const nextPlayerId = guessingQueue.pop();
    // Find index in players array
    currentGuesserIndex = players.findIndex(p => p.id === nextPlayerId);

    showGamePlay();
}

function showGamePlay() {
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    targetRevealSection.classList.add('hidden');
    gamePlaySection.classList.remove('hidden');

    // Update Turn Info
    turnInfo.textContent = `${t.turnOf} ${players[currentGuesserIndex].name}`;
    turnInstruction.textContent = t.clickInstruction;

    // Display word
    const wordContainer = document.getElementById('displayed-word-container');
    wordContainer.innerHTML = '';
    const wordDisplay = document.createElement('div');
    wordDisplay.classList.add('displayed-word');
    wordDisplay.textContent = `"${colorWord}"`;
    wordContainer.appendChild(wordDisplay);

    // Generate Grid
    generateColorGrid(colorGrid, true);

    // Hide confirm button until selection
    confirmGuessButton.classList.add('hidden');
    selectedCell = null;
}

function generateColorGrid(gridElement, interactive) {
    gridElement.innerHTML = '';

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');

            const cellColor = getColorForCell(row, col);
            cell.style.backgroundColor = cellColor;

            if (interactive) {
                cell.addEventListener('click', () => handleCellClick(row, col, cell));
            }

            gridElement.appendChild(cell);
        }
    }
}

function handleCellClick(row, col, cellElement) {
    // Deselect previous
    const previousSelected = document.querySelectorAll('.grid-cell.selected');
    previousSelected.forEach(el => el.classList.remove('selected'));

    // Select new
    cellElement.classList.add('selected');
    selectedCell = { row, col };

    confirmGuessButton.classList.remove('hidden');
}

function confirmGuess() {
    if (!selectedCell) return;

    // Save guess
    roundGuesses[currentGuesserIndex] = selectedCell;

    // Next player
    nextGuesser();
}

function showRoundResults() {
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    gamePlaySection.classList.add('hidden');

    const resultGrid = document.getElementById('result-grid') || document.createElement('div');

    gameResultSection.classList.remove('hidden');

    // Generate result grid
    generateResultGrid(document.getElementById('result-grid'));

    // Calculate scores and list
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    // Show the correct answer explicitly - ABOVE GRID
    const correctCoords = `${COLUMN_LABELS[targetCell.col]}${targetCell.row + 1}`;

    // Check if we have a container for the answer, or create/reset it
    let answerContainer = document.getElementById('answer-display-container');
    if (!answerContainer) {
        answerContainer = document.createElement('div');
        answerContainer.id = 'answer-display-container';
        // Insert after title (first child is h2)
        const title = gameResultSection.querySelector('h2');
        title.insertAdjacentElement('afterend', answerContainer);
    }

    // Style and Content
    answerContainer.style.marginBottom = '15px';
    answerContainer.style.fontSize = '1.2em';
    answerContainer.style.color = '#fff';
    answerContainer.innerHTML = `<strong>${t.theCellWas} ${correctCoords}</strong>`;

    let exactMatches = 0;

    // Process Guessers
    players.forEach((player, index) => {
        if (index === viewerIndex) return; // Skip viewer in list for now

        const guess = roundGuesses[index];
        let points = 0;
        let resultType = 'incorrect';

        if (guess) {
            // Exact match
            if (guess.row === targetCell.row && guess.col === targetCell.col) {
                points = 3;
                exactMatches++;
                resultType = 'correct';
            }
            // Adjacent match (Up, Down, Left, Right)
            else if (Math.abs(guess.row - targetCell.row) + Math.abs(guess.col - targetCell.col) === 1) {
                points = 1;
                resultType = 'almost'; // distinct class if we want, or just incorrect style with points
            }
        }

        if (points > 0) {
            player.score += points;
        }

        const item = document.createElement('div');
        // If 3 points correct, if 1 point maybe yellow/orange? let's stick to simple correct/incorrect styling for now
        // or add 'almost' styling. Let's make adjacent look slightly positive or just text diff
        item.className = 'results-item ' + (points === 3 ? 'correct' : (points === 1 ? 'correct' : 'incorrect'));
        // Note definition of 'correct' class is green border. Adjacent gets green border too? 
        // Or maybe modify style. Let's keep green for positive points.

        const guessStr = guess ? `${COLUMN_LABELS[guess.col]}${guess.row + 1}` : t.notSelected;

        let resultText = t.wrong;
        if (points === 3) resultText = t.correct;
        else if (points === 1) resultText = "Vicino!"; // Fixed duplicate (+1)

        item.textContent = `${player.name}: ${guessStr} - ${resultText} (+${points})`;
        resultsList.appendChild(item);
    });

    // Guide Points: 1 point for every person who guessed EXACTLY right
    const guidePoints = exactMatches;
    players[viewerIndex].score += guidePoints;

    const viewerItem = document.createElement('div');
    viewerItem.className = 'results-item ' + (guidePoints > 0 ? 'correct' : 'incorrect');
    viewerItem.textContent = `${players[viewerIndex].name} (${t.viewer}): +${guidePoints} pt`;
    resultsList.prepend(viewerItem);

    // Button handling
    const oldPlayAgain = document.getElementById('play-again');
    if (oldPlayAgain) oldPlayAgain.remove();

    // Clear any previous action container if it exists, or create a new one/clear it
    let actionContainer = gameResultSection.querySelector('.action-container');
    if (!actionContainer) {
        actionContainer = document.createElement('div');
        actionContainer.className = 'action-container';
        actionContainer.style.display = 'flex';
        actionContainer.style.justifyContent = 'center';
        actionContainer.style.marginTop = '20px';
        gameResultSection.appendChild(actionContainer);
    }
    actionContainer.innerHTML = ''; // Clear previous buttons

    currentRound++;

    if (currentRound < players.length) {
        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-round-btn';
        nextBtn.className = 'btn';
        nextBtn.textContent = t.nextRound;
        nextBtn.onclick = () => {
            // Next viewer
            viewerIndex = (viewerIndex + 1) % players.length;
            startRound();
        };
        actionContainer.appendChild(nextBtn);
    } else {
        const endBtn = document.createElement('button');
        endBtn.className = 'btn';
        endBtn.textContent = t.gameOver;
        endBtn.onclick = showFinalScores;
        actionContainer.appendChild(endBtn);
    }
}

function generateResultGrid(gridElement) {
    gridElement.innerHTML = '';
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');

            const cellColor = getColorForCell(row, col);
            cell.style.backgroundColor = cellColor;

            if (row === targetCell.row && col === targetCell.col) {
                cell.classList.add('target');
            }
            gridElement.appendChild(cell);
        }
    }
}

function showFinalScores() {
    const lang = getCurrentLanguage();
    const t = gameTranslations[lang] || gameTranslations['en'];

    // Sort players by score
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = `<h3>${t.finalScores}</h3>`;

    sortedPlayers.forEach(p => {
        const item = document.createElement('div');
        item.className = 'results-item';
        // Highlight winner
        if (p.score === sortedPlayers[0].score) {
            item.style.backgroundColor = '#27ae60';
            item.style.fontWeight = 'bold';
            item.style.transform = 'scale(1.05)';
        } else {
            item.style.backgroundColor = '#2c2c2c';
        }

        item.textContent = `${p.name}: ${p.score} pts`;
        resultsList.appendChild(item);
    });

    // Hide grid and other round elements
    const gridContainer = gameResultSection.querySelector('.grid-container');
    if (gridContainer) gridContainer.classList.add('hidden');

    // Hide the round answer info if present
    const answerContainer = document.getElementById('answer-display-container');
    if (answerContainer) answerContainer.classList.add('hidden');

    const actionContainer = gameResultSection.querySelector('.action-container');
    if (actionContainer) actionContainer.innerHTML = '';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.textContent = t.newGame;
    restartBtn.onclick = () => {
        window.location.reload();
    };
    actionContainer.appendChild(restartBtn);
}


// Get color for a specific cell position using natural colors
function getColorForCell(row, col) {
    // For 10x10 grid, adjust the hue range to ensure more distinct colors
    const effectiveHueRange = GRID_SIZE === 10 ? 180 : HUE_RANGE;

    // Calculate hue with appropriate range for grid size
    const hueStep = effectiveHueRange / (GRID_SIZE - 1);
    const hue = (startingHue + col * hueStep) % 360;

    // Adjust saturation steps based on grid size
    // From 60% to 95% with appropriate steps
    const saturation = 60 + (35 * row / (GRID_SIZE - 1));

    // Adjust lightness steps based on grid size
    // From 85% down to 35% with appropriate steps
    const lightness = 85 - (50 * row / (GRID_SIZE - 1));

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', init);