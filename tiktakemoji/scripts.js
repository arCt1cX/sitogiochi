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

// Select random categories for rows and columns with guaranteed valid combinations
function selectRandomCategories() {
    // Get all category types
    const categoryTypes = Object.keys(gameState.categories);
    
    // We'll keep trying until we find a valid set of categories and values
    let validSetFound = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 100; // Prevent infinite loops
    
    while (!validSetFound && attempts < MAX_ATTEMPTS) {
        attempts++;
        try {
            // Start fresh with each attempt
            gameState.rowCategories = [];
            gameState.rowCategoryValues = [];
            gameState.colCategories = [];
            gameState.colCategoryValues = [];
            
            // STEP 1: Select row categories (3 different category types)
            const shuffledCategoryTypes = shuffleArray([...categoryTypes]);
            gameState.rowCategories = shuffledCategoryTypes.slice(0, 3);
            
            // STEP 2: Find valid values for row categories first
            // We need to ensure these values have possible combinations with other categories
            for (let row = 0; row < 3; row++) {
                const rowCategory = gameState.rowCategories[row];
                const possibleValues = gameState.categories[rowCategory];
                
                // Find values that have matches with at least 3 other category types
                const validValues = [];
                
                for (const value of possibleValues) {
                    // Find all entries matching this row category value
                    const matchingEntries = gameState.filmsAndSeries.filter(
                        entry => entry[rowCategory] === value
                    );
                    
                    // Count how many different category types have matches with this value
                    const categoryMatches = new Set();
                    for (const entry of matchingEntries) {
                        for (const catType of categoryTypes) {
                            if (catType !== rowCategory) {
                                categoryMatches.add(catType);
                            }
                        }
                    }
                    
                    // Only include values that match with at least 3 other category types
                    if (categoryMatches.size >= 3) {
                        validValues.push(value);
                    }
                }
                
                // If no valid values found, throw error to try again
                if (validValues.length === 0) {
                    throw new Error("No valid row values found");
                }
                
                // Select a random valid value for this row
                gameState.rowCategoryValues[row] = validValues[Math.floor(Math.random() * validValues.length)];
            }
            
            // STEP 3: Find valid column categories and values
            // We need categories where each value works with ALL row categories
            const remainingCats = categoryTypes.filter(cat => !gameState.rowCategories.includes(cat));
            const shuffledRemaining = shuffleArray([...remainingCats]);
            
            // Try to find 3 different column categories
            for (let col = 0; col < 3; col++) {
                let colCatFound = false;
                
                // Try each category
                for (let i = 0; i < shuffledRemaining.length; i++) {
                    const colCategory = shuffledRemaining[i];
                    
                    // Skip if already used for another column
                    if (gameState.colCategories.includes(colCategory)) {
                        continue;
                    }
                    
                    // Find values that work with ALL rows
                    const validColValues = [];
                    const colValues = gameState.categories[colCategory];
                    
                    for (const colValue of colValues) {
                        let worksWithAllRows = true;
                        
                        // Check against each row
                        for (let row = 0; row < 3; row++) {
                            const rowCategory = gameState.rowCategories[row];
                            const rowValue = gameState.rowCategoryValues[row];
                            
                            // Check if there's at least one film/series with this combination
                            const matchExists = gameState.filmsAndSeries.some(entry => 
                                entry[rowCategory] === rowValue && 
                                entry[colCategory] === colValue
                            );
                            
                            if (!matchExists) {
                                worksWithAllRows = false;
                                break;
                            }
                        }
                        
                        if (worksWithAllRows) {
                            validColValues.push(colValue);
                        }
                    }
                    
                    // If we found valid values for this category
                    if (validColValues.length > 0) {
                        gameState.colCategories[col] = colCategory;
                        gameState.colCategoryValues[col] = validColValues[Math.floor(Math.random() * validColValues.length)];
                        colCatFound = true;
                        break;
                    }
                }
                
                // If we couldn't find a new category, try reusing row categories
                if (!colCatFound) {
                    const unusedRowCats = gameState.rowCategories.filter(cat => !gameState.colCategories.includes(cat));
                    
                    for (const rowCat of unusedRowCats) {
                        const validColValues = [];
                        const colValues = gameState.categories[rowCat];
                        
                        for (const colValue of colValues) {
                            let worksWithAllRows = true;
                            
                            // Check against each row
                            for (let row = 0; row < 3; row++) {
                                const rowCategory = gameState.rowCategories[row];
                                const rowValue = gameState.rowCategoryValues[row];
                                
                                // Skip self-comparison (same category and value)
                                if (rowCategory === rowCat && rowValue === colValue) {
                                    continue;
                                }
                                
                                // Check if there's at least one film/series with this combination
                                const matchExists = gameState.filmsAndSeries.some(entry => 
                                    entry[rowCategory] === rowValue && 
                                    entry[rowCat] === colValue
                                );
                                
                                if (!matchExists) {
                                    worksWithAllRows = false;
                                    break;
                                }
                            }
                            
                            if (worksWithAllRows) {
                                validColValues.push(colValue);
                            }
                        }
                        
                        // If we found valid values for this category
                        if (validColValues.length > 0) {
                            gameState.colCategories[col] = rowCat;
                            gameState.colCategoryValues[col] = validColValues[Math.floor(Math.random() * validColValues.length)];
                            colCatFound = true;
                            break;
                        }
                    }
                }
                
                // If we still couldn't find a valid category, throw error to try again
                if (!colCatFound) {
                    throw new Error("No valid column category found");
                }
            }
            
            // If we got here, we have a valid set
            validSetFound = true;
            
        } catch (error) {
            console.log("Attempt failed:", error.message, "Trying again...");
            // Continue to next attempt
        }
    }
    
    if (!validSetFound) {
        console.error("Failed to find valid category combinations after", MAX_ATTEMPTS, "attempts");
        
        // Fallback to very basic selection as a last resort
        lastResortCategorySelection();
    } else {
        console.log("Found valid category combinations after", attempts, "attempts");
    }
    
    // Create the valid combinations grid
    createValidCombinationsGrid();
    
    // Validate all cells have valid combinations
    validateAllCellsHaveCombinations();
}

// Last resort selection method
function lastResortCategorySelection() {
    // This is a simplified selection just to prevent the game from crashing
    console.warn("Using last resort category selection");
    
    // Get the most common categories in the database
    const categoryCounts = {};
    
    // Count occurrences of each category value in the database
    gameState.filmsAndSeries.forEach(entry => {
        Object.keys(entry).forEach(category => {
            if (category !== 'title' && category !== 'type') {
                const value = entry[category];
                if (!categoryCounts[category]) {
                    categoryCounts[category] = {};
                }
                if (!categoryCounts[category][value]) {
                    categoryCounts[category][value] = 0;
                }
                categoryCounts[category][value]++;
            }
        });
    });
    
    // Find the categories with the most variety
    const categoryTypesByPopularity = Object.keys(categoryCounts)
        .map(cat => ({
            category: cat,
            valueCount: Object.keys(categoryCounts[cat]).length,
            totalCount: Object.values(categoryCounts[cat]).reduce((sum, count) => sum + count, 0)
        }))
        .sort((a, b) => b.totalCount - a.totalCount);
    
    // Select the 3 most common categories for rows
    gameState.rowCategories = categoryTypesByPopularity.slice(0, 3).map(item => item.category);
    
    // For each row category, find the most common values
    gameState.rowCategoryValues = gameState.rowCategories.map(category => {
        const valueCounts = categoryCounts[category];
        const mostCommonValue = Object.keys(valueCounts)
            .sort((a, b) => valueCounts[b] - valueCounts[a])[0];
        return mostCommonValue;
    });
    
    // Select different categories for columns (if possible)
    const remainingCategories = categoryTypesByPopularity
        .filter(item => !gameState.rowCategories.includes(item.category))
        .map(item => item.category);
    
    gameState.colCategories = remainingCategories.length >= 3 
        ? remainingCategories.slice(0, 3) 
        : [...remainingCategories, ...gameState.rowCategories].slice(0, 3);
    
    // For each column, select common values with row combinations
    gameState.colCategoryValues = gameState.colCategories.map(colCategory => {
        const valueCounts = categoryCounts[colCategory];
        // Get top 5 most common values
        const commonValues = Object.keys(valueCounts)
            .sort((a, b) => valueCounts[b] - valueCounts[a])
            .slice(0, 5);
        
        // Find first value that works with all rows or return most common
        for (const value of commonValues) {
            let worksWithAllRows = true;
            for (let row = 0; row < gameState.rowCategories.length; row++) {
                const rowCategory = gameState.rowCategories[row];
                const rowValue = gameState.rowCategoryValues[row];
                
                const matchExists = gameState.filmsAndSeries.some(entry => 
                    entry[rowCategory] === rowValue && 
                    entry[colCategory] === value
                );
                
                if (!matchExists) {
                    worksWithAllRows = false;
                    break;
                }
            }
            
            if (worksWithAllRows) {
                return value;
            }
        }
        
        // If no good match, just return the most common value
        return commonValues[0];
    });
}

// Validate that all cells have valid combinations
function validateAllCellsHaveCombinations() {
    // Check every cell in the grid
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const validEntries = gameState.validCellCombinations[row][col];
            
            if (validEntries.length === 0) {
                console.error(`No valid entries for cell [${row},${col}] with categories:`, {
                    row: `${gameState.rowCategories[row]}: ${gameState.rowCategoryValues[row]}`,
                    col: `${gameState.colCategories[col]}: ${gameState.colCategoryValues[col]}`
                });
            }
        }
    }
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
    
    // Create the corner cell (top-left empty cell)
    const cornerCell = document.createElement("div");
    cornerCell.className = "board-cell corner-cell";
    gameBoard.appendChild(cornerCell);
    
    // Create column header cells
    for (let col = 0; col < 3; col++) {
        const categoryCell = document.createElement("div");
        categoryCell.className = "board-cell category-cell";
        categoryCell.textContent = `${gameState.colCategories[col]}: ${gameState.colCategoryValues[col]}`;
        gameBoard.appendChild(categoryCell);
    }
    
    // Create rows with row headers and game cells
    for (let row = 0; row < 3; row++) {
        // Row header
        const rowCategoryCell = document.createElement("div");
        rowCategoryCell.className = "board-cell category-cell";
        rowCategoryCell.textContent = `${gameState.rowCategories[row]}: ${gameState.rowCategoryValues[row]}`;
        gameBoard.appendChild(rowCategoryCell);
        
        // Game cells for this row
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
            
            gameBoard.appendChild(cell);
        }
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