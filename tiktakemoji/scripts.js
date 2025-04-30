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
    // First, build a directed graph of emoji compatibility
    const emojiGraph = buildEmojiGraph();
    
    // Find a valid grid
    const validGrid = findValidEmojiGrid(emojiGraph);
    
    if (validGrid) {
        gameState.rowEmojis = validGrid.rows;
        gameState.colEmojis = validGrid.cols;
        gameState.validCellCombinations = createValidCombinationsGrid(
            gameState.rowEmojis, 
            gameState.colEmojis
        );
    } else {
        console.error("Could not find a valid emoji grid");
        fallbackEmojiSelection();
    }
}

// Build a graph of emoji relationships
function buildEmojiGraph() {
    const graph = new Map();
    
    // First, extract all unique emojis
    const allEmojis = new Set();
    gameState.combinations.forEach(combo => {
        combo.tags.forEach(tag => allEmojis.add(tag));
    });
    
    // Initialize the graph with empty connections for each emoji
    allEmojis.forEach(emoji => {
        graph.set(emoji, { 
            connections: new Map(),
            connectionCount: 0 
        });
    });
    
    // Now fill in the connections (which emojis can connect with which others)
    gameState.combinations.forEach(combo => {
        if (combo.tags.length >= 2 && combo.valid.length >= 1) {
            // For each pair of tags, record their connection
            for (let i = 0; i < combo.tags.length; i++) {
                for (let j = i + 1; j < combo.tags.length; j++) {
                    const tag1 = combo.tags[i];
                    const tag2 = combo.tags[j];
                    
                    // Add connection from tag1 to tag2
                    if (!graph.get(tag1).connections.has(tag2)) {
                        graph.get(tag1).connections.set(tag2, new Set());
                    }
                    combo.valid.forEach(validEmoji => {
                        graph.get(tag1).connections.get(tag2).add(validEmoji);
                    });
                    graph.get(tag1).connectionCount += combo.valid.length;
                    
                    // Add connection from tag2 to tag1 (bidirectional)
                    if (!graph.get(tag2).connections.has(tag1)) {
                        graph.get(tag2).connections.set(tag1, new Set());
                    }
                    combo.valid.forEach(validEmoji => {
                        graph.get(tag2).connections.get(tag1).add(validEmoji);
                    });
                    graph.get(tag2).connectionCount += combo.valid.length;
                }
            }
        }
    });
    
    return graph;
}

// Find a valid emoji grid where every cell has at least one valid combination
function findValidEmojiGrid(emojiGraph) {
    // Sort emojis by their connection count (most connected first)
    const emojisByConnections = [...emojiGraph.entries()]
        .sort((a, b) => b[1].connectionCount - a[1].connectionCount)
        .map(entry => entry[0]);
    
    // Take the top 25 most connected emojis as candidates
    const candidates = emojisByConnections.slice(0, Math.min(25, emojisByConnections.length));
    
    // Try different combinations of rows and columns
    for (let attempt = 0; attempt < 100; attempt++) {
        const shuffledCandidates = shuffleArray([...candidates]);
        
        // Try to find three row emojis with good connectivity
        for (let rStart = 0; rStart < shuffledCandidates.length - 5; rStart += 3) {
            const potentialRows = shuffledCandidates.slice(rStart, rStart + 3);
            if (potentialRows.length < 3) continue; // Not enough candidates left
            
            // Find all emojis that connect with ALL row emojis
            const compatibleWithAllRows = findMutuallyCompatibleEmojis(potentialRows, emojiGraph);
            
            if (compatibleWithAllRows.length >= 3) {
                // We have enough column emojis that connect with all row emojis
                const potentialCols = shuffleArray(compatibleWithAllRows).slice(0, 3);
                
                // Verify that every cell in the grid has a valid combination
                if (verifyGridCompleteness(potentialRows, potentialCols, emojiGraph)) {
                    return {
                        rows: potentialRows,
                        cols: potentialCols
                    };
                }
            }
        }
    }
    
    return null; // No valid grid found
}

// Find emojis that are compatible with all emojis in the given set
function findMutuallyCompatibleEmojis(emojiSet, emojiGraph) {
    // Start with all emojis
    const allEmojis = [...emojiGraph.keys()];
    
    // Filter to those that connect with all emojis in the set
    return allEmojis.filter(emoji => {
        // Skip emojis that are already in the set
        if (emojiSet.includes(emoji)) return false;
        
        // Check that this emoji connects with every emoji in the set
        return emojiSet.every(setEmoji => {
            const connections = emojiGraph.get(setEmoji).connections;
            return connections.has(emoji) && connections.get(emoji).size > 0;
        });
    });
}

// Verify that every cell in the grid has at least one valid combination
function verifyGridCompleteness(rows, cols, emojiGraph) {
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
            const row = rows[r];
            const col = cols[c];
            
            // Check if this pair has a valid connection
            const rowNode = emojiGraph.get(row);
            if (!rowNode.connections.has(col) || rowNode.connections.get(col).size === 0) {
                return false; // No valid options for this cell
            }
        }
    }
    return true;
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
    const rowEmoji = gameState.rowEmojis[row];
    const colEmoji = gameState.colEmojis[col];
    
    // Clear previous options
    emojiOptions.innerHTML = "";
    
    // Add context about the connection
    const contextEl = document.createElement("p");
    contextEl.className = "connection-context";
    contextEl.innerHTML = `${rowEmoji} + ${colEmoji}`;
    emojiOptions.appendChild(contextEl);
    
    // No valid options for this cell
    if (validOptions.length === 0) {
        const messageEl = document.createElement("p");
        messageEl.className = "no-options-message";
        messageEl.textContent = getTranslation("noValidEmojis");
        emojiOptions.appendChild(messageEl);
        
        // Add a close button
        const closeButton = document.createElement("button");
        closeButton.className = "btn secondary-btn";
        closeButton.textContent = getTranslation("closeText");
        closeButton.addEventListener("click", () => {
            emojiSelection.classList.add("hidden");
        });
        emojiOptions.appendChild(closeButton);
        
        // Show the selection
        emojiSelection.classList.remove("hidden");
        return;
    }
    
    // Create emoji options
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "emoji-options-grid";
    
    validOptions.forEach(emoji => {
        const emojiEl = document.createElement("div");
        emojiEl.className = "emoji-option";
        emojiEl.textContent = emoji;
        emojiEl.title = `${rowEmoji} + ${colEmoji} → ${emoji}`;
        emojiEl.addEventListener("click", () => makeMove(emoji));
        optionsContainer.appendChild(emojiEl);
    });
    
    emojiOptions.appendChild(optionsContainer);
    
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

// Improved fallback emoji selection if no valid grid is found
function fallbackEmojiSelection() {
    console.log("Using fallback emoji selection");
    
    // More aggressive approach: pre-compute all valid pairs
    const validPairs = [];
    
    gameState.combinations.forEach(combo => {
        if (combo.tags.length >= 2 && combo.valid.length >= 1) {
            // For each pair of tags, record that they connect
            for (let i = 0; i < combo.tags.length; i++) {
                for (let j = i + 1; j < combo.tags.length; j++) {
                    validPairs.push({
                        emoji1: combo.tags[i],
                        emoji2: combo.tags[j],
                        validOptions: combo.valid
                    });
                }
            }
        }
    });
    
    // Sort by number of valid options (pairs with more options first)
    validPairs.sort((a, b) => b.validOptions.length - a.validOptions.length);
    
    // Systematically try to build a grid by selecting from top pairs
    for (let attempt = 0; attempt < 50; attempt++) {
        // Shuffle the top 50 pairs
        const shuffledPairs = shuffleArray(validPairs.slice(0, Math.min(50, validPairs.length)));
        
        // Extract unique emojis from these pairs
        const uniqueEmojis = new Set();
        shuffledPairs.forEach(pair => {
            uniqueEmojis.add(pair.emoji1);
            uniqueEmojis.add(pair.emoji2);
        });
        
        if (uniqueEmojis.size >= 6) {
            // Use these emojis to create a grid
            const emojiArray = shuffleArray([...uniqueEmojis]);
            const rows = emojiArray.slice(0, 3);
            const cols = emojiArray.slice(3, 6);
            
            // Check if this creates a valid grid
            const allValid = rows.every(row => {
                return cols.every(col => {
                    const validOptions = findValidCombinations(row, col);
                    return validOptions.length > 0;
                });
            });
            
            if (allValid) {
                gameState.rowEmojis = rows;
                gameState.colEmojis = cols;
                gameState.validCellCombinations = createValidCombinationsGrid(rows, cols);
                return;
            }
        }
    }
    
    // Last resort: create a grid with guaranteed connections
    constructForcedValidGrid();
}

// Construct a grid by forcing valid combinations
function constructForcedValidGrid() {
    console.log("Constructing a forced valid grid");
    
    // Extract all unique tags and their valid combinations
    const tagMap = new Map();
    gameState.combinations.forEach(combo => {
        combo.tags.forEach(tag => {
            if (!tagMap.has(tag)) {
                tagMap.set(tag, new Set());
            }
        });
    });
    
    // Find combinations with at least 2 valid options
    const goodCombos = gameState.combinations.filter(combo => 
        combo.tags.length >= 2 && combo.valid.length >= 1
    );
    
    if (goodCombos.length < 9) {
        // Not enough good combinations, pick some tags anyway
        const allTags = [...tagMap.keys()];
        const randomTags = shuffleArray(allTags);
        gameState.rowEmojis = randomTags.slice(0, 3);
        gameState.colEmojis = randomTags.slice(3, 6);
    } else {
        // Try to build a grid manually from good combinations
        const selectedCombos = shuffleArray(goodCombos).slice(0, 9);
        const rows = new Set();
        const cols = new Set();
        
        // Extract unique tags for rows and columns
        selectedCombos.forEach(combo => {
            // Add the first tag to rows if we need more
            if (rows.size < 3 && !cols.has(combo.tags[0])) {
                rows.add(combo.tags[0]);
            }
            // Add the second tag to cols if we need more
            if (cols.size < 3 && !rows.has(combo.tags[1])) {
                cols.add(combo.tags[1]);
            }
        });
        
        // Fill in if needed
        const allTags = [...tagMap.keys()];
        const extraTags = shuffleArray(allTags.filter(tag => !rows.has(tag) && !cols.has(tag)));
        
        while (rows.size < 3) rows.add(extraTags.pop());
        while (cols.size < 3) cols.add(extraTags.pop());
        
        gameState.rowEmojis = [...rows];
        gameState.colEmojis = [...cols];
    }
    
    gameState.validCellCombinations = createValidCombinationsGrid(
        gameState.rowEmojis, 
        gameState.colEmojis
    );
    
    // Force at least one valid option per cell
    forceCellValidity();
}

// Force each cell to have at least one valid option
function forceCellValidity() {
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (gameState.validCellCombinations[r][c].length === 0) {
                // This cell has no valid options - force one
                const randomEmoji = getRandomEmoji();
                console.log(`Forcing emoji ${randomEmoji} for cell (${r},${c})`);
                
                // Add a new combination to the game state
                gameState.combinations.push({
                    tags: [gameState.rowEmojis[r], gameState.colEmojis[c]],
                    valid: [randomEmoji]
                });
                
                // Update the cell's valid combinations
                gameState.validCellCombinations[r][c] = [randomEmoji];
            }
        }
    }
}

// Get a random emoji for forced combinations
function getRandomEmoji() {
    const commonEmojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", 
                         "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗"];
    return commonEmojis[Math.floor(Math.random() * commonEmojis.length)];
} 