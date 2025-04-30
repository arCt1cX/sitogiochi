// TikTakEmoji Game Logic
let gameState = {
    combinations: [], // Store all combinations from combinations.json
    rowEmojis: [], // 3 selected row emojis
    colEmojis: [], // 3 selected column emojis
    validCellCombinations: [], // 3x3 grid of valid emoji combinations
    board: [
        ["", "", ""], 
        ["", "", ""], 
        ["", "", ""]
    ], // Current board state
    currentPlayer: "red", // "red" or "blue"
    selectedCell: null, // Currently selected cell {row, col}
    gameOver: false
};

// Password for accessing the game
const GAME_PASSWORD = "lurag";

// DOM Elements
const gameScreens = {
    password: document.getElementById("password-screen"),
    instructions: document.getElementById("instructions-screen"),
    game: document.getElementById("game-screen"),
    winner: document.getElementById("winner-screen")
};

const gameBoard = document.getElementById("game-board");
const currentPlayerEl = document.getElementById("current-player");
const emojiSelection = document.getElementById("emoji-selection");
const emojiOptions = document.getElementById("emoji-options");
const winnerPlayer = document.getElementById("winner-player");
const passwordInput = document.getElementById("password-input");
const passwordError = document.getElementById("password-error");

// Event Listeners
document.getElementById("submit-password").addEventListener("click", checkPassword);
document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("new-game").addEventListener("click", resetGame);
document.getElementById("play-again").addEventListener("click", resetGame);

// Add event listener for Enter key on password input
passwordInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        checkPassword();
    }
});

// Check if the entered password is correct
function checkPassword() {
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === GAME_PASSWORD) {
        // Password is correct, show instructions screen
        showScreen("instructions");
        // Clear the password input
        passwordInput.value = "";
        // Hide the error message
        passwordError.classList.add("hidden");
    } else {
        // Password is incorrect, show error
        passwordError.classList.remove("hidden");
    }
}

// Fetch combinations.json and initialize game
async function fetchCombinations() {
    try {
        const response = await fetch("combinations.json");
        if (!response.ok) {
            throw new Error("Failed to fetch combinations data");
        }
        gameState.combinations = await response.json();
        console.log("Loaded combinations:", gameState.combinations.length);
    } catch (error) {
        console.error("Error loading combinations:", error);
        gameState.combinations = []; // Set empty array in case of error
    }
}

// Initialize the game
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCombinations();
    
    // Check if there's a password saved in localStorage
    const savedPassword = localStorage.getItem("tiktakemoji_password");
    if (savedPassword === GAME_PASSWORD) {
        // If correct password is saved, skip to instructions
        showScreen("instructions");
    }
});

// Start a new game
function startGame() {
    // Only proceed if combinations are loaded
    if (gameState.combinations.length === 0) {
        console.error("Cannot start game: combinations not loaded");
        return;
    }
    
    resetGameState();
    selectRandomEmojis();
    createGameBoard();
    
    // Show game screen
    showScreen("game");
}

// Reset the game state
function resetGameState() {
    gameState.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    gameState.currentPlayer = "red";
    gameState.selectedCell = null;
    gameState.gameOver = false;
    
    // Update player marker
    currentPlayerEl.textContent = "🔴";
    
    // Hide emoji selection
    emojiSelection.classList.add("hidden");
}

// Reset the game (new board)
function resetGame() {
    resetGameState();
    selectRandomEmojis();
    createGameBoard();
    showScreen("game");
}

// Show a specific screen
function showScreen(screenName) {
    // Hide all screens
    Object.values(gameScreens).forEach(screen => {
        screen.classList.remove("active");
    });
    
    // Show the selected screen
    gameScreens[screenName].classList.add("active");
    
    // If showing the instructions or game screen, save the password
    if (screenName === "instructions" || screenName === "game") {
        localStorage.setItem("tiktakemoji_password", GAME_PASSWORD);
    }
}

// Select random emojis for rows and columns
function selectRandomEmojis() {
    // Build a tag frequency map to help with selection
    const tagFrequency = new Map();
    gameState.combinations.forEach(combo => {
        combo.tags.forEach(tag => {
            tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
        });
    });
    
    // Convert to array and sort by frequency (most frequent first)
    const sortedTags = [...tagFrequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
    
    // Select initial candidate emojis (from the most frequent ones)
    const candidateTags = sortedTags.slice(0, Math.min(20, sortedTags.length));
    
    // Repeatedly try to find a valid combination of row and column emojis
    let validSetFound = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!validSetFound && attempts < maxAttempts) {
        attempts++;
        
        // Randomly select 6 emojis from the candidates
        const selectedEmojis = shuffleArray([...candidateTags]).slice(0, 6);
        const potentialRows = selectedEmojis.slice(0, 3);
        const potentialCols = selectedEmojis.slice(3, 6);
        
        // Check if this selection creates a valid grid
        if (isValidEmojiGrid(potentialRows, potentialCols)) {
            gameState.rowEmojis = potentialRows;
            gameState.colEmojis = potentialCols;
            
            // Create the grid of valid combinations
            gameState.validCellCombinations = createValidCombinationsGrid(
                gameState.rowEmojis, 
                gameState.colEmojis
            );
            
            validSetFound = true;
        }
    }
    
    if (!validSetFound) {
        console.error("Could not find a valid emoji grid after", maxAttempts, "attempts");
        // Fallback to a simple selection if no valid grid is found
        fallbackEmojiSelection();
    }
}

// Check if a set of row and column emojis creates a valid grid
function isValidEmojiGrid(rowEmojis, colEmojis) {
    // For each row and column intersection, check if there is at least one valid combination
    for (let r = 0; r < rowEmojis.length; r++) {
        for (let c = 0; c < colEmojis.length; c++) {
            const validOptions = findValidCombinations(rowEmojis[r], colEmojis[c]);
            if (validOptions.length === 0) {
                return false; // This cell has no valid options
            }
        }
    }
    return true;
}

// Fallback emoji selection if no valid grid is found
function fallbackEmojiSelection() {
    // Get all unique tags from the combinations
    const allTags = new Set();
    gameState.combinations.forEach(combo => {
        combo.tags.forEach(tag => allTags.add(tag));
    });
    
    // Filter combinations with at least 2 valid options
    const viableCombos = gameState.combinations.filter(combo => combo.valid.length >= 1);
    
    // Select random combinations
    const selectedCombos = shuffleArray(viableCombos).slice(0, 9);
    
    // Extract row and column tags
    const selectedTags = new Set();
    selectedCombos.forEach(combo => {
        combo.tags.forEach(tag => selectedTags.add(tag));
    });
    
    // Ensure we have at least 6 tags
    if (selectedTags.size < 6) {
        // Add more random tags if needed
        const additionalTags = shuffleArray([...allTags])
            .filter(tag => !selectedTags.has(tag))
            .slice(0, 6 - selectedTags.size);
        
        additionalTags.forEach(tag => selectedTags.add(tag));
    }
    
    // Select 3 for rows and 3 for columns
    const selectedTagsArray = shuffleArray([...selectedTags]);
    gameState.rowEmojis = selectedTagsArray.slice(0, 3);
    gameState.colEmojis = selectedTagsArray.slice(3, 6);
    
    // Create the combinations grid (some cells might be empty)
    gameState.validCellCombinations = createValidCombinationsGrid(
        gameState.rowEmojis, 
        gameState.colEmojis
    );
}

// Create the grid of valid combinations
function createValidCombinationsGrid(rowEmojis, colEmojis) {
    const grid = [];
    
    for (let r = 0; r < rowEmojis.length; r++) {
        const row = [];
        for (let c = 0; c < colEmojis.length; c++) {
            const validOptions = findValidCombinations(rowEmojis[r], colEmojis[c]);
            row.push(validOptions);
        }
        grid.push(row);
    }
    
    return grid;
}

// Find valid combinations for a pair of emojis
function findValidCombinations(emoji1, emoji2) {
    // Look for combinations containing both emojis in their tags
    const matchingCombos = gameState.combinations.filter(combo => {
        return combo.tags.includes(emoji1) && combo.tags.includes(emoji2);
    });
    
    // Extract all valid options
    const validOptions = [];
    matchingCombos.forEach(combo => {
        validOptions.push(...combo.valid);
    });
    
    // Return unique valid options
    return [...new Set(validOptions)];
}

// Create the game board
function createGameBoard() {
    gameBoard.innerHTML = "";
    
    // Create the corner cell (empty)
    const cornerCell = document.createElement("div");
    cornerCell.className = "header-cell corner-cell";
    gameBoard.appendChild(cornerCell);
    
    // Create column headers
    for (let c = 0; c < gameState.colEmojis.length; c++) {
        const colHeader = document.createElement("div");
        colHeader.className = "header-cell";
        colHeader.textContent = gameState.colEmojis[c];
        gameBoard.appendChild(colHeader);
    }
    
    // Create rows with headers and cells
    for (let r = 0; r < gameState.rowEmojis.length; r++) {
        // Row header
        const rowHeader = document.createElement("div");
        rowHeader.className = "header-cell";
        rowHeader.textContent = gameState.rowEmojis[r];
        gameBoard.appendChild(rowHeader);
        
        // Create cells for this row
        for (let c = 0; c < gameState.colEmojis.length; c++) {
            const cell = document.createElement("div");
            cell.className = "board-cell";
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            // Add emoji text if a move has been made
            if (gameState.board[r][c]) {
                cell.textContent = gameState.board[r][c];
                // Add player marker class
                if (gameState.board[r][c] !== "") {
                    const cellState = getCellState(r, c);
                    if (cellState) {
                        cell.classList.add(`${cellState}-player`);
                    }
                }
            }
            
            // Add click event
            cell.addEventListener("click", () => handleCellClick(r, c));
            
            gameBoard.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(row, col) {
    // Ignore clicks if game is over
    if (gameState.gameOver) return;
    
    // Ignore clicks on cells that already have a move
    if (gameState.board[row][col] !== "") return;
    
    // Store the selected cell
    gameState.selectedCell = { row, col };
    
    // Show emoji selection with valid options
    showEmojiOptions(row, col);
}

// Show emoji options for the selected cell
function showEmojiOptions(row, col) {
    const validOptions = gameState.validCellCombinations[row][col];
    
    // Clear previous options
    emojiOptions.innerHTML = "";
    
    // No valid options for this cell
    if (validOptions.length === 0) {
        const messageEl = document.createElement("p");
        messageEl.textContent = "No valid emojis for this combination!";
        emojiOptions.appendChild(messageEl);
        return;
    }
    
    // Create emoji options
    validOptions.forEach(emoji => {
        const emojiEl = document.createElement("div");
        emojiEl.className = "emoji-option";
        emojiEl.textContent = emoji;
        emojiEl.addEventListener("click", () => makeMove(emoji));
        emojiOptions.appendChild(emojiEl);
    });
    
    // Show the selection
    emojiSelection.classList.remove("hidden");
}

// Make a move
function makeMove(emoji) {
    const { row, col } = gameState.selectedCell;
    
    // Update the board state
    gameState.board[row][col] = emoji;
    
    // Set cell ownership based on current player
    setCellState(row, col, gameState.currentPlayer);
    
    // Hide emoji selection
    emojiSelection.classList.add("hidden");
    
    // Update the board UI
    createGameBoard();
    
    // Check for win or draw
    if (checkWin()) {
        endGame(false);
        return;
    }
    
    if (checkDraw()) {
        endGame(true);
        return;
    }
    
    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === "red" ? "blue" : "red";
    
    // Update current player UI
    currentPlayerEl.textContent = gameState.currentPlayer === "red" ? "🔴" : "🔵";
}

// Set the state of a cell (which player owns it)
function setCellState(row, col, player) {
    // We'll use a parallel array to track cell ownership
    // This works because the emoji in the board might not be directly related to the player
    if (!gameState.cellOwners) {
        gameState.cellOwners = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    }
    
    gameState.cellOwners[row][col] = player;
}

// Get the state of a cell (which player owns it)
function getCellState(row, col) {
    if (!gameState.cellOwners) return null;
    return gameState.cellOwners[row][col];
}

// Check if there's a winner
function checkWin() {
    if (!gameState.cellOwners) return false;
    
    const currentPlayer = gameState.currentPlayer;
    
    // Check rows
    for (let r = 0; r < 3; r++) {
        if (
            gameState.cellOwners[r][0] === currentPlayer &&
            gameState.cellOwners[r][1] === currentPlayer &&
            gameState.cellOwners[r][2] === currentPlayer
        ) {
            highlightWinningCells([
                { row: r, col: 0 },
                { row: r, col: 1 },
                { row: r, col: 2 }
            ]);
            return true;
        }
    }
    
    // Check columns
    for (let c = 0; c < 3; c++) {
        if (
            gameState.cellOwners[0][c] === currentPlayer &&
            gameState.cellOwners[1][c] === currentPlayer &&
            gameState.cellOwners[2][c] === currentPlayer
        ) {
            highlightWinningCells([
                { row: 0, col: c },
                { row: 1, col: c },
                { row: 2, col: c }
            ]);
            return true;
        }
    }
    
    // Check diagonals
    if (
        gameState.cellOwners[0][0] === currentPlayer &&
        gameState.cellOwners[1][1] === currentPlayer &&
        gameState.cellOwners[2][2] === currentPlayer
    ) {
        highlightWinningCells([
            { row: 0, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 2 }
        ]);
        return true;
    }
    
    if (
        gameState.cellOwners[0][2] === currentPlayer &&
        gameState.cellOwners[1][1] === currentPlayer &&
        gameState.cellOwners[2][0] === currentPlayer
    ) {
        highlightWinningCells([
            { row: 0, col: 2 },
            { row: 1, col: 1 },
            { row: 2, col: 0 }
        ]);
        return true;
    }
    
    return false;
}

// Highlight winning cells
function highlightWinningCells(cells) {
    cells.forEach(cell => {
        const cellEl = document.querySelector(
            `.board-cell[data-row="${cell.row}"][data-col="${cell.col}"]`
        );
        if (cellEl) {
            cellEl.classList.add("win-cell");
        }
    });
}

// Check for a draw
function checkDraw() {
    // Check if all cells are filled
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (gameState.board[r][c] === "") {
                return false;
            }
        }
    }
    
    return true;
}

// End the game
function endGame(isDraw) {
    gameState.gameOver = true;
    
    if (isDraw) {
        // Show draw message
        document.getElementById("winnerTitle").textContent = 
            getTranslation("drawText");
        document.getElementById("winnerText").style.display = "none";
        winnerPlayer.style.display = "none";
    } else {
        // Show winner
        document.getElementById("winnerTitle").textContent = 
            getTranslation("winnerTitle");
        document.getElementById("winnerText").style.display = "inline";
        winnerPlayer.style.display = "inline";
        winnerPlayer.textContent = gameState.currentPlayer === "red" ? "🔴" : "🔵";
    }
    
    // Show winner screen after a delay
    setTimeout(() => {
        showScreen("winner");
    }, 1000);
}

// Utility function to shuffle an array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Helper function to get translations
function getTranslation(key) {
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];
    return translations[key] || key;
} 