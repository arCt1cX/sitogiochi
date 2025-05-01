// TikTakEmoji Game Logic
let gameState = {
    filmsAndSeries: {}, // Store all entries from combinazioni_film_e_serie.json
    categories: {}, // Store all categories
    rowCategories: [], // 3 selected row categories
    rowCategoryValues: [], // 3 selected row category values
    colCategories: [], // 3 selected column categories
    colCategoryValues: [], // 3 selected column category values
    validCellCombinations: [], // 3x3 grid of valid film/series
    board: [
        ["", "", ""], 
        ["", "", ""], 
        ["", "", ""]
    ], // Current board state
    currentPlayer: "red", // "red" or "blue"
    selectedCell: null, // Currently selected cell {row, col}
    gameOver: false,
    cellOwners: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]
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

// Fetch film and series data and initialize game
async function fetchFilmsAndSeries() {
    try {
        const response = await fetch("combinazioni_film_e_serie.json");
        if (!response.ok) {
            throw new Error("Failed to fetch film and series data");
        }
        const data = await response.json();
        gameState.filmsAndSeries = data.entries;
        gameState.categories = data.categories;
        console.log("Loaded films and series:", gameState.filmsAndSeries.length);
        console.log("Loaded categories:", gameState.categories);
    } catch (error) {
        console.error("Error loading films and series:", error);
        gameState.filmsAndSeries = []; // Set empty array in case of error
        gameState.categories = {};
    }
}

// Initialize the game
document.addEventListener("DOMContentLoaded", async () => {
    await fetchFilmsAndSeries();
    
    // Check if there's a password saved in localStorage
    const savedPassword = localStorage.getItem("tiktakemoji_password");
    if (savedPassword === GAME_PASSWORD) {
        // If correct password is saved, skip to instructions
        showScreen("instructions");
    }
});

// Start a new game
function startGame() {
    // Only proceed if films and series are loaded
    if (gameState.filmsAndSeries.length === 0) {
        console.error("Cannot start game: films and series not loaded");
        return;
    }
    
    resetGameState();
    selectRandomCategories();
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
    
    // Reset cellOwners
    gameState.cellOwners = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    
    // Update player marker
    currentPlayerEl.textContent = "🔴";
    
    // Hide selection
    emojiSelection.classList.add("hidden");
    
    // Clear any win-cell classes
    const winCells = document.querySelectorAll('.win-cell');
    winCells.forEach(cell => {
        cell.classList.remove('win-cell');
    });
}

// Reset the game (new board)
function resetGame() {
    resetGameState();
    selectRandomCategories();
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

// Select random categories for rows and columns
function selectRandomCategories() {
    // Get all category types
    const categoryTypes = Object.keys(gameState.categories);
    
    // Randomly select 3 different category types
    const shuffledCategoryTypes = shuffleArray([...categoryTypes]);
    const selectedCategoryTypes = shuffledCategoryTypes.slice(0, 3);
    
    // 1. First select random row category values from 3 random categories
    gameState.rowCategories = [...selectedCategoryTypes];
    gameState.rowCategoryValues = gameState.rowCategories.map(category => {
        const values = gameState.categories[category];
        return values[Math.floor(Math.random() * values.length)];
    });
    
    // 2. Now select column categories (also 3 different categories)
    // We'll use different categories if possible, or reuse if necessary
    let remainingCategoryTypes = shuffleArray([...categoryTypes]);
    gameState.colCategories = [];
    gameState.colCategoryValues = [];
    
    // For each column position, find a valid category and value
    for (let col = 0; col < 3; col++) {
        let validCategoryFound = false;
        
        // Try each available category
        for (let i = 0; i < remainingCategoryTypes.length; i++) {
            const categoryType = remainingCategoryTypes[i];
            
            // Skip if this category is already used for columns
            if (gameState.colCategories.includes(categoryType)) {
                continue;
            }
            
            const categoryValues = gameState.categories[categoryType];
            // Shuffle the values to try them in random order
            const shuffledValues = shuffleArray([...categoryValues]);
            
            // Try each value from this category
            for (const value of shuffledValues) {
                // Check if this value works with all rows
                let validForAllRows = true;
                
                for (let row = 0; row < 3; row++) {
                    const rowCategory = gameState.rowCategories[row];
                    const rowValue = gameState.rowCategoryValues[row];
                    
                    // Check if there's at least one film/series matching both criteria
                    const matchExists = gameState.filmsAndSeries.some(entry => 
                        entry[rowCategory] === rowValue && 
                        entry[categoryType] === value
                    );
                    
                    if (!matchExists) {
                        validForAllRows = false;
                        break;
                    }
                }
                
                if (validForAllRows) {
                    // We found a valid category and value for this column
                    gameState.colCategories[col] = categoryType;
                    gameState.colCategoryValues[col] = value;
                    validCategoryFound = true;
                    break;
                }
            }
            
            if (validCategoryFound) {
                break;
            }
        }
        
        // If no valid category was found, try a different approach
        if (!validCategoryFound) {
            // Pick a random category that's not already in columns
            let availableCategories = categoryTypes.filter(cat => !gameState.colCategories.includes(cat));
            if (availableCategories.length === 0) {
                // If all categories are used, just pick any category
                availableCategories = [...categoryTypes];
            }
            
            const categoryType = availableCategories[Math.floor(Math.random() * availableCategories.length)];
            gameState.colCategories[col] = categoryType;
            
            // Now find a value that works with at least one row
            const categoryValues = gameState.categories[categoryType];
            let valueFound = false;
            
            for (const value of shuffleArray([...categoryValues])) {
                // Check if this value works with at least one row
                for (let row = 0; row < 3; row++) {
                    const rowCategory = gameState.rowCategories[row];
                    const rowValue = gameState.rowCategoryValues[row];
                    
                    // Check if there's at least one film/series matching both criteria
                    const matchExists = gameState.filmsAndSeries.some(entry => 
                        entry[rowCategory] === rowValue && 
                        entry[categoryType] === value
                    );
                    
                    if (matchExists) {
                        gameState.colCategoryValues[col] = value;
                        valueFound = true;
                        break;
                    }
                }
                
                if (valueFound) break;
            }
            
            // If still no value found, pick a random one and adjust the rows
            if (!valueFound) {
                const randomValue = categoryValues[Math.floor(Math.random() * categoryValues.length)];
                gameState.colCategoryValues[col] = randomValue;
                
                // For each row, try to find a value that works with this column
                for (let row = 0; row < 3; row++) {
                    const rowCategory = gameState.rowCategories[row];
                    
                    // Find all entries that match the column value
                    const matchingEntries = gameState.filmsAndSeries.filter(
                        entry => entry[categoryType] === randomValue
                    );
                    
                    if (matchingEntries.length > 0) {
                        // Get all possible values for this row category
                        const possibleValues = [...new Set(
                            matchingEntries.map(entry => entry[rowCategory])
                        )];
                        
                        if (possibleValues.length > 0) {
                            // Select a random value from the possibilities
                            gameState.rowCategoryValues[row] = 
                                possibleValues[Math.floor(Math.random() * possibleValues.length)];
                        }
                    }
                }
            }
        }
    }
    
    // Create the valid combinations grid
    createValidCombinationsGrid();
}

// Create a grid of valid film/series combinations
function createValidCombinationsGrid() {
    gameState.validCellCombinations = [];
    
    for (let row = 0; row < 3; row++) {
        const rowCombinations = [];
        
        for (let col = 0; col < 3; col++) {
            const rowCategory = gameState.rowCategories[row];
            const rowValue = gameState.rowCategoryValues[row];
            const colCategory = gameState.colCategories[col];
            const colValue = gameState.colCategoryValues[col];
            
            // Find all films/series that match both the row and column criteria
            const validEntries = gameState.filmsAndSeries.filter(entry => 
                entry[rowCategory] === rowValue && 
                entry[colCategory] === colValue
            );
            
            rowCombinations.push(validEntries);
        }
        
        gameState.validCellCombinations.push(rowCombinations);
    }
    
    // Debug - log the valid combinations count for each cell
    console.log("Valid combinations per cell:");
    for (let row = 0; row < 3; row++) {
        let rowLog = "";
        for (let col = 0; col < 3; col++) {
            rowLog += `[${gameState.validCellCombinations[row][col].length}] `;
        }
        console.log(rowLog);
    }
}

// Create the game board UI
function createGameBoard() {
    // Clear the game board
    gameBoard.innerHTML = "";
    
    // Create the header row for column categories
    const headerRow = document.createElement("div");
    headerRow.className = "board-row header-row";
    
    // Add empty cell for top-left corner
    const cornerCell = document.createElement("div");
    cornerCell.className = "board-cell corner-cell";
    headerRow.appendChild(cornerCell);
    
    // Add column category cells
    for (let col = 0; col < 3; col++) {
        const categoryCell = document.createElement("div");
        categoryCell.className = "board-cell category-cell";
        categoryCell.textContent = `${gameState.colCategories[col]}: ${gameState.colCategoryValues[col]}`;
        headerRow.appendChild(categoryCell);
    }
    
    gameBoard.appendChild(headerRow);
    
    // Create the main board rows
    for (let row = 0; row < 3; row++) {
        const boardRow = document.createElement("div");
        boardRow.className = "board-row";
        
        // Add row category cell
        const rowCategoryCell = document.createElement("div");
        rowCategoryCell.className = "board-cell category-cell";
        rowCategoryCell.textContent = `${gameState.rowCategories[row]}: ${gameState.rowCategoryValues[row]}`;
        boardRow.appendChild(rowCategoryCell);
        
        // Add game cells
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement("div");
            cell.className = "board-cell game-cell";
            cell.setAttribute("data-row", row);
            cell.setAttribute("data-col", col);
            
            // Add click event
            cell.addEventListener("click", () => handleCellClick(row, col));
            
            // If there's already a piece in this cell, show it
            if (gameState.board[row][col]) {
                const marker = document.createElement("div");
                marker.className = `player-marker ${gameState.cellOwners[row][col]}`;
                marker.textContent = gameState.board[row][col];
                cell.appendChild(marker);
            }
            
            boardRow.appendChild(cell);
        }
        
        gameBoard.appendChild(boardRow);
    }
    
    // Add grid lines with CSS
    gameBoard.classList.add("tic-tac-toe-grid");
}

// Handle click on a game cell
function handleCellClick(row, col) {
    // Ignore clicks if game is over or cell is already filled
    if (gameState.gameOver || gameState.board[row][col] !== "") {
        return;
    }
    
    // Set the selected cell
    gameState.selectedCell = { row, col };
    
    // Show the film/series selection
    showTitleOptions(row, col);
}

// Show options for film/series titles that can be placed in the selected cell
function showTitleOptions(row, col) {
    // Get the valid entries for this cell
    const validEntries = gameState.validCellCombinations[row][col];
    
    if (validEntries.length === 0) {
        console.error("No valid entries for this cell");
        return;
    }
    
    // Clear previous options
    emojiOptions.innerHTML = "";
    
    // Create option for each valid entry
    validEntries.forEach(entry => {
        const option = document.createElement("div");
        option.className = "option";
        option.textContent = entry.title;
        option.addEventListener("click", () => makeMove(entry.title));
        emojiOptions.appendChild(option);
    });
    
    // Update the title for selection
    document.getElementById("selectEmojiText").textContent = "Select a matching title:";
    
    // Show the selection panel
    emojiSelection.classList.remove("hidden");
}

// Make a move with the selected film/series title
function makeMove(title) {
    if (!gameState.selectedCell) {
        return;
    }
    
    const { row, col } = gameState.selectedCell;
    
    // Place the title on the board
    gameState.board[row][col] = title;
    gameState.cellOwners[row][col] = gameState.currentPlayer;
    
    // Update the UI
    const cell = document.querySelector(`.game-cell[data-row="${row}"][data-col="${col}"]`);
    
    // Clear any previous content
    cell.innerHTML = "";
    
    // Add the marker with the title
    const marker = document.createElement("div");
    marker.className = `player-marker ${gameState.currentPlayer}`;
    marker.textContent = title;
    cell.appendChild(marker);
    
    // Hide the selection panel
    emojiSelection.classList.add("hidden");
    gameState.selectedCell = null;
    
    // Check for win
    if (checkWin()) {
        gameState.gameOver = true;
        endGame(false);
        return;
    }
    
    // Check for draw
    if (checkDraw()) {
        gameState.gameOver = true;
        endGame(true);
        return;
    }
    
    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === "red" ? "blue" : "red";
    currentPlayerEl.textContent = gameState.currentPlayer === "red" ? "🔴" : "🔵";
}

// Set the state of a cell
function setCellState(row, col, player) {
    gameState.cellOwners[row][col] = player;
}

// Get the state of a cell
function getCellState(row, col) {
    return gameState.cellOwners[row][col];
}

// Check if a player has won
function checkWin() {
    // Check rows
    for (let row = 0; row < 3; row++) {
        if (
            getCellState(row, 0) !== "" &&
            getCellState(row, 0) === getCellState(row, 1) &&
            getCellState(row, 0) === getCellState(row, 2)
        ) {
            highlightWinningCells([
                { row, col: 0 },
                { row, col: 1 },
                { row, col: 2 }
            ]);
            return true;
        }
    }
    
    // Check columns
    for (let col = 0; col < 3; col++) {
        if (
            getCellState(0, col) !== "" &&
            getCellState(0, col) === getCellState(1, col) &&
            getCellState(0, col) === getCellState(2, col)
        ) {
            highlightWinningCells([
                { row: 0, col },
                { row: 1, col },
                { row: 2, col }
            ]);
            return true;
        }
    }
    
    // Check diagonals
    if (
        getCellState(0, 0) !== "" &&
        getCellState(0, 0) === getCellState(1, 1) &&
        getCellState(0, 0) === getCellState(2, 2)
    ) {
        highlightWinningCells([
            { row: 0, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 2 }
        ]);
        return true;
    }
    
    if (
        getCellState(0, 2) !== "" &&
        getCellState(0, 2) === getCellState(1, 1) &&
        getCellState(0, 2) === getCellState(2, 0)
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

// Highlight the winning cells
function highlightWinningCells(cells) {
    cells.forEach(({ row, col }) => {
        const cell = document.querySelector(`.game-cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add("win-cell");
    });
}

// Check if the game is a draw
function checkDraw() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (gameState.board[row][col] === "") {
                return false;
            }
        }
    }
    return true;
}

// End the game
function endGame(isDraw) {
    if (isDraw) {
        document.getElementById("winnerTitle").textContent = getTranslation("draw");
        document.getElementById("winnerText").textContent = getTranslation("noWinner");
        winnerPlayer.textContent = "";
    } else {
        document.getElementById("winnerTitle").textContent = getTranslation("gameOver");
        document.getElementById("winnerText").textContent = getTranslation("winner");
        winnerPlayer.textContent = gameState.currentPlayer === "red" ? "🔴" : "🔵";
    }
    
    // Show the winner screen after a short delay
    setTimeout(() => {
        showScreen("winner");
    }, 1000);
}

// Helper function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Get translation based on current language
function getTranslation(key) {
    const currentLang = getCurrentLanguage();
    return translations[currentLang][key] || key;
} 