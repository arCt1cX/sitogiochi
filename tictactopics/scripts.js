// TicTacTopics Game Logic
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
    ],
    selectedTopic: null, // Currently selected topic
    preventInteraction: false // Flag to prevent interactions during animations/messages
};

// Ensure getCurrentLanguage is defined regardless of script loading order
if (typeof getCurrentLanguage !== 'function') {
    // Fallback implementation of getCurrentLanguage
    function getCurrentLanguage() {
        // Try from URL
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && (langParam === 'en' || langParam === 'it')) {
            return langParam;
        }
        
        // Check browser language
        const preferredLang = navigator.language || navigator.userLanguage;
        if (preferredLang && preferredLang.startsWith('it')) {
            return 'it';
        }
        
        // Default to English
        return 'en';
    }
}

// Password for accessing the game
const GAME_PASSWORD = "lurag";

// DOM Elements
const gameScreens = {
    password: document.getElementById("password-screen"),
    instructions: document.getElementById("instructions-screen"),
    topicSelection: document.getElementById("topic-selection-screen"),
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
document.getElementById("go-to-topics").addEventListener("click", showTopicSelection);
document.getElementById("new-game").addEventListener("click", resetGame);
document.getElementById("end-game").addEventListener("click", declareGameDraw);

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

// Fetch data for the selected topic
async function fetchTopicData(topicId) {
    try {
        // Get current language and use the appropriate file
        const lang = window.getCurrentLanguage();
        
        // Choose the appropriate JSON file based on the topic
        let jsonFile;
        if (topicId === 'movies-tv') {
            jsonFile = lang === 'en' ? "movies_tv_en.json" : "movies_tv.json";
        } else if (topicId === 'songs') {
            jsonFile = lang === 'en' ? "songs_en.json" : "songs.json";
        } else if (topicId === 'video-games') {
            jsonFile = lang === 'en' ? "video_games_en.json" : "video_games.json";
        } else {
            // Default to movies-tv
            jsonFile = lang === 'en' ? "movies_tv_en.json" : "movies_tv.json";
        }
        
        // For backward compatibility, check for the old filename too
        let response = await fetch(jsonFile);
        if (!response.ok) {
            // Try the old filename pattern
            const oldJsonFile = lang === 'en' ? "combinazioni_film_e_serie_en.json" : "combinazioni_film_e_serie.json";
            response = await fetch(oldJsonFile);
            
            if (!response.ok) {
                // If English file fails to load, try to fall back to Italian
                if (lang === 'en') {
                    console.warn(`${jsonFile} not found, falling back to Italian`);
                    const fallbackResponse = await fetch("combinazioni_film_e_serie.json");
                    if (!fallbackResponse.ok) {
                        throw new Error(`Failed to fetch data for topic: ${topicId}`);
                    }
                    const fallbackData = await fallbackResponse.json();
                    gameState.filmsAndSeries = fallbackData.entries;
                    gameState.categories = fallbackData.categories;
                } else {
                    throw new Error(`Failed to fetch data for topic: ${topicId}`);
                }
            } else {
                const data = await response.json();
                gameState.filmsAndSeries = data.entries;
                gameState.categories = data.categories;
            }
        } else {
            const data = await response.json();
            gameState.filmsAndSeries = data.entries;
            gameState.categories = data.categories;
        }
        
        console.log(`Loaded data for ${topicId}:`, gameState.filmsAndSeries.length);
        console.log("Loaded categories:", gameState.categories);
    } catch (error) {
        console.error(`Error loading data for ${topicId}:`, error);
        gameState.filmsAndSeries = []; // Set empty array in case of error
        gameState.categories = {};
    }
}

// Initialize the game
document.addEventListener("DOMContentLoaded", async () => {
    await fetchTopicData('movies-tv');
    
    // Check if there's a password saved in localStorage
    const savedPassword = localStorage.getItem("tictactopics_password");
    if (savedPassword === GAME_PASSWORD) {
        // If correct password is saved, skip to instructions
        showScreen("instructions");
    }
});

// Show topic selection screen
function showTopicSelection() {
    showScreen("topicSelection");
    
    // Update translations for topic selection
    document.getElementById("topicSelectionTitle").textContent = window.getTranslation("topicSelectionTitle");
    document.getElementById("moviesTVTitle").textContent = window.getTranslation("moviesTVTitle");
    document.getElementById("moviesTVDesc").textContent = window.getTranslation("moviesTVDesc");
    document.getElementById("videoGamesTitle").textContent = window.getTranslation("videoGamesTitle");
    document.getElementById("songsTitle").textContent = window.getTranslation("songsTitle");
    document.getElementById("comingSoonText").textContent = window.getTranslation("comingSoonText");
    document.getElementById("comingSoonText2").textContent = window.getTranslation("comingSoonText");
    
    // Add click event to topic cards
    const topicCards = document.querySelectorAll(".topic-card:not(.coming-soon)");
    topicCards.forEach(card => {
        card.addEventListener("click", function() {
            // Set selected topic in gameState
            gameState.selectedTopic = this.dataset.topic;
            
            // Visual indication of selection
            document.querySelectorAll(".topic-card").forEach(c => c.classList.remove("selected"));
            this.classList.add("selected");
            
            // Start game with selected topic after a short delay
            setTimeout(() => {
                startGame();
            }, 500);
        });
    });
}

// Start a new game
async function startGame() {
    // Load data for the selected topic
    await fetchTopicData(gameState.selectedTopic);
    
    // Only proceed if data is loaded
    if (gameState.filmsAndSeries.length === 0) {
        console.error(`Cannot start game: data for ${gameState.selectedTopic} not loaded`);
        alert("Could not load data for the selected topic. Please try again.");
        return;
    }
    
    resetGameState();
    selectRandomCategories();
    createGameBoard();
    
    // Hide new game button until the game is over
    document.getElementById("new-game").style.display = "none";
    
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
    
    // Reset preventInteraction flag
    gameState.preventInteraction = false;
    
    // Get current language and player text
    const lang = window.getCurrentLanguage();
    const player1Text = lang === 'en' ? "Player 1" : "Giocatore 1";
    
    // Update player marker
    currentPlayerEl.textContent = player1Text;
    currentPlayerEl.className = "player-marker red";
    currentPlayerEl.style.display = ""; // Show player marker again
    
    // Reset player turn text
    document.getElementById("playerTurnText").textContent = window.getTranslation("playerTurnText");
    
    // Hide selection
    emojiSelection.classList.add("hidden");
    
    // Show the end game button and hide new game button
    document.getElementById("end-game").style.display = "";
    document.getElementById("new-game").style.display = "none";
    
    // Clear any win-cell classes
    const winCells = document.querySelectorAll('.win-cell');
    winCells.forEach(cell => {
        cell.classList.remove('win-cell');
    });
    
    // Remove game result message if it exists
    const resultElement = document.getElementById("game-result");
    if (resultElement) {
        resultElement.remove();
    }
}

// Reset the game and go back to topic selection
function resetGame() {
    // If we're currently in the winner screen, go back to topic selection
    if (gameState.gameOver) {
        gameState.gameOver = false;
        showTopicSelection();
    } else {
        // If we're in the game screen, just confirm the user wants to end the current game
        if (confirm(window.getTranslation ? window.getTranslation("confirmEndGame") : "Are you sure you want to end the current game?")) {
            showTopicSelection();
        }
    }
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
        localStorage.setItem("tictactopics_password", GAME_PASSWORD);
    }
}

// Select random categories for rows and columns with guaranteed valid combinations
function selectRandomCategories() {
    // Get all category types
    const categoryTypes = Object.keys(gameState.categories);
    
    // Ensure we have at least 6 category types
    if (categoryTypes.length < 6) {
        console.error("Not enough category types to create a game with different row and column categories");
        return;
    }
    
    // We'll keep trying until we find a valid set of categories and values
    let validSetFound = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 300; // Increased max attempts to give it more chances to find valid combinations
    
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
                // that are not row categories
                const validValues = [];
                
                for (const value of possibleValues) {
                    // Find all entries matching this row category value
                    const matchingEntries = gameState.filmsAndSeries.filter(entry => {
                        if (!entry[rowCategory]) return false;
                        
                        // Check if entry matches the row category value
                        let matches = false;
                        if (Array.isArray(entry[rowCategory])) {
                            matches = entry[rowCategory].some(val => 
                                String(val).toLowerCase() === String(value).toLowerCase()
                            );
                        } else {
                            matches = String(entry[rowCategory]).toLowerCase() === String(value).toLowerCase();
                        }
                        
                        // Special handling for 'tipo' category
                        if (rowCategory === 'tipo') {
                            matches = String(entry.tipo).toLowerCase() === String(value).toLowerCase();
                        }
                        
                        return matches;
                    });
                    
                    // Count how many different category types have matches with this value
                    // Only count categories that are not already used as row categories
                    const categoryMatches = new Set();
                    for (const entry of matchingEntries) {
                        for (const catType of categoryTypes) {
                            if (!gameState.rowCategories.includes(catType)) {
                                categoryMatches.add(catType);
                            }
                        }
                    }
                    
                    // Only include values that match with at least 3 other category types
                    // that are not row categories
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
            // IMPORTANT: Only use categories that are NOT row categories
            const remainingCats = categoryTypes.filter(cat => !gameState.rowCategories.includes(cat));
            
            // If we don't have at least 3 remaining categories, try again
            if (remainingCats.length < 3) {
                throw new Error("Not enough remaining categories");
            }
            
            const shuffledRemaining = shuffleArray([...remainingCats]);
            
            // Try to find 3 different column categories
            for (let col = 0; col < 3; col++) {
                let colCatFound = false;
                
                // Try each non-row category
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
                            const matchExists = gameState.filmsAndSeries.some(entry => {
                                if (!entry[rowCategory] || !entry[colCategory]) return false;
                                
                                // Check row match
                                let rowMatches = false;
                                if (Array.isArray(entry[rowCategory])) {
                                    rowMatches = entry[rowCategory].some(val => 
                                        String(val).toLowerCase() === String(rowValue).toLowerCase()
                                    );
                                } else {
                                    rowMatches = String(entry[rowCategory]).toLowerCase() === String(rowValue).toLowerCase();
                                }
                                
                                // Check column match
                                let colMatches = false;
                                if (Array.isArray(entry[colCategory])) {
                                    colMatches = entry[colCategory].some(val => 
                                        String(val).toLowerCase() === String(colValue).toLowerCase()
                                    );
                                } else {
                                    colMatches = String(entry[colCategory]).toLowerCase() === String(colValue).toLowerCase();
                                }
                                
                                // Special handling for 'tipo' category (Film or Serie TV)
                                if (rowCategory === 'tipo' || colCategory === 'tipo') {
                                    // Make sure the entry type actually matches what's expected
                                    if (rowCategory === 'tipo') {
                                        rowMatches = String(entry.tipo).toLowerCase() === String(rowValue).toLowerCase();
                                    }
                                    if (colCategory === 'tipo') {
                                        colMatches = String(entry.tipo).toLowerCase() === String(colValue).toLowerCase();
                                    }
                                }
                                
                                return rowMatches && colMatches;
                            });
                            
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
                
                // If we couldn't find a valid category, try again with a different set
                if (!colCatFound) {
                    throw new Error("No valid column category found");
                }
            }
            
            // Create the valid combinations grid
            createValidCombinationsGrid();
            
            // Validate all cells have valid combinations
            const allCellsHaveCombinations = validateAllCellsHaveCombinations(false); // Pass false to not show alert
            
            if (!allCellsHaveCombinations) {
                throw new Error("Some cells have no valid combinations");
            }
            
            // Check if the grid has too many low-diversity rows
            let lowDiversityRows = 0;
            for (let row = 0; row < 3; row++) {
                // Check how many unique answers exist across this row
                const uniqueAnswersInRow = new Set();
                for (let col = 0; col < 3; col++) {
                    const titles = gameState.validCellCombinations[row][col].map(entry => entry.title);
                    titles.forEach(title => uniqueAnswersInRow.add(title));
                }
                
                // Find how many answers are common to all cells in the row
                const commonAnswers = findCommonAnswers(row);
                
                // If most answers are common (>75% overlap) and we have 3 or fewer unique answers
                // consider this a low-diversity row
                if (uniqueAnswersInRow.size <= 3 && 
                    commonAnswers.length > 0 && 
                    commonAnswers.length >= uniqueAnswersInRow.size * 0.75) {
                    lowDiversityRows++;
                }
            }
            
            // If more than 1 row has low diversity, try again
            if (lowDiversityRows > 1) {
                throw new Error(`Too many low-diversity rows: ${lowDiversityRows}`);
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
        alert("Unable to generate a valid game board. Please try again.");
        return;
    } else {
        console.log("Found valid category combinations after", attempts, "attempts");
    }
    
    // Already created the valid combinations grid in the validation step
    
    // Validate all cells have valid combinations - this time with alert
    validateAllCellsHaveCombinations(true);
}

// Validate that all cells have valid combinations
function validateAllCellsHaveCombinations(showAlert = true) {
    // Check every cell in the grid
    let allValid = true;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const validEntries = gameState.validCellCombinations[row][col];
            
            if (validEntries.length === 0) {
                console.error(`No valid entries for cell [${row},${col}] with categories:`, {
                    row: `${gameState.rowCategories[row]}: ${gameState.rowCategoryValues[row]}`,
                    col: `${gameState.colCategories[col]}: ${gameState.colCategoryValues[col]}`
                });
                allValid = false;
            }
        }
    }
    
    if (!allValid && showAlert) {
        console.error("Game board contains empty cells. Try generating a new board.");
        alert("Some cells have no valid combinations. Please start a new game.");
    }
    
    return allValid;
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
            const validEntries = gameState.filmsAndSeries.filter(entry => {
                // Handle the case where entry[category] might be undefined
                if (!entry[rowCategory] || !entry[colCategory]) {
                    return false;
                }
                
                // Check if the entry matches the row category value
                let rowMatches = false;
                if (Array.isArray(entry[rowCategory])) {
                    // For arrays, check if the array includes the exact value (case insensitive)
                    rowMatches = entry[rowCategory].some(value => 
                        String(value).toLowerCase() === String(rowValue).toLowerCase()
                    );
                } else {
                    // For strings, directly compare
                    rowMatches = String(entry[rowCategory]).toLowerCase() === String(rowValue).toLowerCase();
                }
                
                // Check if the entry matches the column category value
                let colMatches = false;
                if (Array.isArray(entry[colCategory])) {
                    // For arrays, check if the array includes the exact value (case insensitive)
                    colMatches = entry[colCategory].some(value => 
                        String(value).toLowerCase() === String(colValue).toLowerCase()
                    );
                } else {
                    // For strings, directly compare
                    colMatches = String(entry[colCategory]).toLowerCase() === String(colValue).toLowerCase();
                }
                
                // Special handling for 'tipo' category (Film or Serie TV) to fix filtering bug
                if (rowCategory === 'tipo' || colCategory === 'tipo') {
                    // Make sure the entry type actually matches what's expected
                    if (rowCategory === 'tipo') {
                        rowMatches = String(entry.tipo).toLowerCase() === String(rowValue).toLowerCase();
                    }
                    if (colCategory === 'tipo') {
                        colMatches = String(entry.tipo).toLowerCase() === String(colValue).toLowerCase();
                    }
                }
                
                return rowMatches && colMatches;
            });
            
            rowCombinations.push(validEntries);
        }
        
        gameState.validCellCombinations.push(rowCombinations);
    }
    
    // Check for diversity within rows
    checkAndEnsureDiversity();
    
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

// This function checks if cells in a row have exactly the same options and tries to diversify
function checkAndEnsureDiversity() {
    for (let row = 0; row < 3; row++) {
        // First check if this row has very few options overall
        const totalUniqueAnswers = new Set();
        for (let col = 0; col < 3; col++) {
            const titles = gameState.validCellCombinations[row][col].map(entry => entry.title);
            titles.forEach(title => totalUniqueAnswers.add(title));
        }
        
        // If there are 3 or fewer unique answers across the entire row, and each cell has similar options,
        // we need more aggressive diversification
        if (totalUniqueAnswers.size <= 3) {
            // Calculate overlap between cells
            let highOverlap = true;
            const commonAnswers = findCommonAnswers(row);
            
            // If most answers are common across all cells (>75% overlap), this row needs more diversity
            if (commonAnswers.length > 0 && commonAnswers.length >= totalUniqueAnswers.size * 0.75) {
                console.log(`Row ${row} has high overlap with only ${totalUniqueAnswers.size} unique answers total`);
                
                // Try to diversify at least 2 of the 3 cells
                let diversificationSuccess = false;
                for (let col = 0; col < 3; col++) {
                    if (tryToFindMoreDiverseOption(row, col, true)) { // Pass true for aggressive mode
                        diversificationSuccess = true;
                        break;
                    }
                }
                
                if (!diversificationSuccess) {
                    console.log(`Could not diversify row ${row} with few unique answers`);
                }
                
                // After aggressive diversification, recalculate common answers
                const newCommonAnswers = findCommonAnswers(row);
                console.log(`Row ${row} now has ${newCommonAnswers.length} common answers (down from ${commonAnswers.length})`);
            }
        }
        
        // Check if all cells in this row have identical options (this is the original check)
        for (let col1 = 0; col1 < 2; col1++) {
            for (let col2 = col1 + 1; col2 < 3; col2++) {
                const set1 = gameState.validCellCombinations[row][col1];
                const set2 = gameState.validCellCombinations[row][col2];
                
                if (set1.length === set2.length) {
                    // Check if all titles are the same
                    const titles1 = set1.map(entry => entry.title).sort().join(',');
                    const titles2 = set2.map(entry => entry.title).sort().join(',');
                    
                    if (titles1 === titles2 && set1.length > 0) {
                        console.log(`Row ${row}: Cells ${col1} and ${col2} have identical options`);
                        
                        // Try to find a better column value for col2
                        tryToFindMoreDiverseOption(row, col2);
                    }
                }
            }
        }
    }
}

// Helper function to find answers common to all cells in a row
function findCommonAnswers(row) {
    if (row < 0 || row >= 3) return [];
    
    // Get all titles from first cell
    const firstCellTitles = new Set(gameState.validCellCombinations[row][0].map(entry => entry.title));
    
    // Find intersection with other cells
    const commonTitles = Array.from(firstCellTitles).filter(title => {
        return gameState.validCellCombinations[row][1].some(entry => entry.title === title) &&
               gameState.validCellCombinations[row][2].some(entry => entry.title === title);
    });
    
    return commonTitles;
}

// Try to find a different valid value for a cell's column to increase diversity
function tryToFindMoreDiverseOption(row, col, aggressiveMode = false) {
    const currentColCategory = gameState.colCategories[col];
    const possibleColValues = gameState.categories[currentColCategory];
    const rowCategory = gameState.rowCategories[row];
    const rowValue = gameState.rowCategoryValues[row];
    
    // Get all other values from current column category
    const otherPossibleValues = possibleColValues.filter(value => value !== gameState.colCategoryValues[col]);
    
    // Shuffle to randomize search
    shuffleArray(otherPossibleValues);
    
    // Try each possible value
    for (const newColValue of otherPossibleValues) {
        // Check if this new value would create a valid cell
        const validEntries = gameState.filmsAndSeries.filter(entry => {
            // Handle the case where entry[category] might be undefined
            if (!entry[rowCategory] || !entry[currentColCategory]) {
                return false;
            }
            
            // Check if the entry matches the row category value
            let rowMatches = false;
            if (Array.isArray(entry[rowCategory])) {
                // For arrays, check if the array includes the exact value (case insensitive)
                rowMatches = entry[rowCategory].some(value => 
                    String(value).toLowerCase() === String(rowValue).toLowerCase()
                );
            } else {
                // For strings, directly compare
                rowMatches = String(entry[rowCategory]).toLowerCase() === String(rowValue).toLowerCase();
            }
            
            // Check if the entry matches the new column value
            let colMatches = false;
            if (Array.isArray(entry[currentColCategory])) {
                // For arrays, check if the array includes the exact value (case insensitive)
                colMatches = entry[currentColCategory].some(value => 
                    String(value).toLowerCase() === String(newColValue).toLowerCase()
                );
            } else {
                // For strings, directly compare
                colMatches = String(entry[currentColCategory]).toLowerCase() === String(newColValue).toLowerCase();
            }
            
            return rowMatches && colMatches;
        });
        
        // If we found valid entries...
        if (validEntries.length > 0) {
            // In aggressive mode, prioritize solutions that have fewer overlaps with other cells
            if (aggressiveMode) {
                // Get titles from other cells in the row
                const otherCellTitles = new Set();
                for (let otherCol = 0; otherCol < 3; otherCol++) {
                    if (otherCol !== col) {
                        const titles = gameState.validCellCombinations[row][otherCol].map(e => e.title);
                        titles.forEach(t => otherCellTitles.add(t));
                    }
                }
                
                // Calculate how many new entries don't appear in other cells
                const newTitles = validEntries.map(e => e.title);
                const uniqueNewTitles = newTitles.filter(title => !otherCellTitles.has(title));
                
                // If we don't have at least one unique title and we're in aggressive mode, skip unless it's our only option
                if (uniqueNewTitles.length === 0 && validEntries.length <= 2) {
                    continue; // Skip this option and try another
                }
            }
            
            // Check if this option would be different from other cells in the row
            let isDifferent = true;
            for (let otherCol = 0; otherCol < 3; otherCol++) {
                if (otherCol !== col) {
                    const otherSet = gameState.validCellCombinations[row][otherCol];
                    const otherTitles = otherSet.map(entry => entry.title).sort().join(',');
                    const newTitles = validEntries.map(entry => entry.title).sort().join(',');
                    
                    if (otherTitles === newTitles) {
                        isDifferent = false;
                        break;
                    }
                }
            }
            
            if (isDifferent || aggressiveMode) {
                // Update the column value for this cell
                gameState.colCategoryValues[col] = newColValue;
                
                // Update the valid combinations for this cell
                gameState.validCellCombinations[row][col] = validEntries;
                
                console.log(`Diversified cell [${row},${col}] with new value: ${newColValue} (aggressive: ${aggressiveMode})`);
                return true;
            }
        }
    }
    
    console.log(`Could not find a more diverse option for cell [${row},${col}] (aggressive: ${aggressiveMode})`);
    return false;
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
        
        // Create span for category name
        const categoryName = document.createElement("div");
        categoryName.className = "category-name";
        categoryName.textContent = `${gameState.colCategories[col]}:`;
        
        // Create span for category value on new line
        const categoryValue = document.createElement("div");
        categoryValue.className = "category-value";
        categoryValue.textContent = gameState.colCategoryValues[col];
        
        // Add both to the cell
        categoryCell.appendChild(categoryName);
        categoryCell.appendChild(categoryValue);
        
        gameBoard.appendChild(categoryCell);
    }
    
    // Create rows with row headers and game cells
    for (let row = 0; row < 3; row++) {
        // Row header
        const rowCategoryCell = document.createElement("div");
        rowCategoryCell.className = "board-cell category-cell";
        
        // Create span for category name
        const categoryName = document.createElement("div");
        categoryName.className = "category-name";
        categoryName.textContent = `${gameState.rowCategories[row]}:`;
        
        // Create span for category value on new line
        const categoryValue = document.createElement("div");
        categoryValue.className = "category-value";
        categoryValue.textContent = gameState.rowCategoryValues[row];
        
        // Add both to the cell
        rowCategoryCell.appendChild(categoryName);
        rowCategoryCell.appendChild(categoryValue);
        
        gameBoard.appendChild(rowCategoryCell);
        
        // Game cells for this row
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement("div");
            cell.className = "board-cell game-cell";
            cell.setAttribute("data-row", row);
            cell.setAttribute("data-col", col);
            
            // Add tooltip showing row and column categories/values for this cell
            const rowCat = gameState.rowCategories[row];
            const rowVal = gameState.rowCategoryValues[row];
            const colCat = gameState.colCategories[col];
            const colVal = gameState.colCategoryValues[col];
            
            cell.title = `${rowCat}: ${rowVal} + ${colCat}: ${colVal}`;
            
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
    // If game is over, show valid answers regardless of cell state
    if (gameState.gameOver) {
        showValidAnswers(row, col);
        return;
    }
    
    // If cell is already filled, do nothing
    if (gameState.board[row][col] !== "") {
        return;
    }
    
    // Set the selected cell
    gameState.selectedCell = { row, col };
    
    // Show the film/series selection
    showTitleOptions(row, col);
}

// Show options for film/series titles that can be placed in the selected cell
function showTitleOptions(row, col) {
    // Get the valid entries for this cell (now just for validation)
    const validEntries = gameState.validCellCombinations[row][col];
    
    if (validEntries.length === 0) {
        console.error("No valid entries for this cell");
        return;
    }
    
    // Store valid titles for later validation
    const validTitles = validEntries.map(entry => entry.title);
    
    // DEBUG: Log valid entries for this cell
    console.log(`Valid entries for cell [${row},${col}]:`, validEntries.map(e => e.title));
    
    // Clear previous options
    emojiOptions.innerHTML = "";
    
    // Create filter input
    const filterContainer = document.createElement("div");
    filterContainer.className = "filter-container";
    
    const filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.className = "title-filter";
    filterInput.placeholder = window.getTranslation('filterPlaceholder');
    filterInput.addEventListener("input", function() {
        filterTitles(this.value.toLowerCase(), allEntriesContainer);
    });
    
    filterContainer.appendChild(filterInput);
    emojiOptions.appendChild(filterContainer);
    
    // Create scrollable container for all entries
    const allEntriesContainer = document.createElement("div");
    allEntriesContainer.className = "all-entries-container";
    
    // Sort all entries alphabetically
    const allEntries = [...gameState.filmsAndSeries].sort((a, b) => 
        a.title.localeCompare(b.title)
    );
    
    // Create option for each entry in the database
    allEntries.forEach(entry => {
        const option = document.createElement("div");
        option.className = "option";
        option.dataset.title = entry.title;
        option.textContent = entry.title;
        
        // Add tooltip with more details about the entry
        let tooltip = `${entry.title} (${entry.type})`;
        tooltip += `\n${window.getTranslation('genre')}: ${Array.isArray(entry.genre) ? entry.genre.join(', ') : entry.genre}`;
        tooltip += `\n${window.getTranslation('language')}: ${entry.language}`;
        tooltip += `\n${window.getTranslation('decade')}: ${entry.decade}`;
        if (entry.director) tooltip += `\n${window.getTranslation('director')}: ${entry.director}`;
        if (entry.theme) tooltip += `\n${window.getTranslation('theme')}: ${Array.isArray(entry.theme) ? entry.theme.join(', ') : entry.theme}`;
        
        option.title = tooltip;
        
        option.addEventListener("click", () => {
            // Prevent interaction if the preventInteraction flag is set
            if (gameState.preventInteraction) {
                return;
            }
            
            // Check if this is a valid selection for the cell
            if (validTitles.includes(entry.title)) {
                makeMove(entry.title);
            } else {
                // DEBUG: Log why this entry wasn't valid
                console.log(`Invalid selection: ${entry.title}`);
                console.log(`Entry details:`, entry);
                console.log(`Row category: ${gameState.rowCategories[row]}, value: ${gameState.rowCategoryValues[row]}`);
                console.log(`Col category: ${gameState.colCategories[col]}, value: ${gameState.colCategoryValues[col]}`);
                
                // Debug why this entry isn't valid
                const rowCategory = gameState.rowCategories[row];
                const rowValue = gameState.rowCategoryValues[row];
                const colCategory = gameState.colCategories[col];
                const colValue = gameState.colCategoryValues[col];
                
                let rowMatches = false;
                if (Array.isArray(entry[rowCategory])) {
                    rowMatches = entry[rowCategory].some(val => 
                        String(val).toLowerCase() === String(rowValue).toLowerCase()
                    );
                } else if (entry[rowCategory]) {
                    rowMatches = String(entry[rowCategory]).toLowerCase() === String(rowValue).toLowerCase();
                }
                
                let colMatches = false;
                if (Array.isArray(entry[colCategory])) {
                    colMatches = entry[colCategory].some(val => 
                        String(val).toLowerCase() === String(colValue).toLowerCase()
                    );
                } else if (entry[colCategory]) {
                    colMatches = String(entry[colCategory]).toLowerCase() === String(colValue).toLowerCase();
                }
                
                // Special handling for 'tipo' field
                if (rowCategory === 'tipo') {
                    rowMatches = String(entry.tipo).toLowerCase() === String(rowValue).toLowerCase();
                }
                if (colCategory === 'tipo') {
                    colMatches = String(entry.tipo).toLowerCase() === String(colValue).toLowerCase();
                }
                
                console.log(`Row match (${rowCategory}: ${rowValue}): ${rowMatches}`);
                console.log(`Col match (${colCategory}: ${colValue}): ${colMatches}`);
                
                // Show wrong answer message - this will set preventInteraction
                showWrongAnswerMessage();
                // Pass turn to next player
                gameState.currentPlayer = gameState.currentPlayer === "red" ? "blue" : "red";
                currentPlayerEl.textContent = gameState.currentPlayer === "red" ? "Giocatore 1" : "Giocatore 2";
                currentPlayerEl.className = `player-marker ${gameState.currentPlayer}`;
                // Hide selection after a delay
                setTimeout(() => {
                    emojiSelection.classList.add("hidden");
                    gameState.selectedCell = null;
                    // Re-enable interactions
                    gameState.preventInteraction = false;
                }, 1500);
            }
        });
        
        allEntriesContainer.appendChild(option);
    });
    
    emojiOptions.appendChild(allEntriesContainer);
    
    // Update the title for selection
    const rowCategory = gameState.rowCategories[row];
    const rowValue = gameState.rowCategoryValues[row];
    const colCategory = gameState.colCategories[col];
    const colValue = gameState.colCategoryValues[col];
    
    const selectionTitle = `${window.getTranslation('selectMatchingTitle')} (${rowCategory}: ${rowValue} + ${colCategory}: ${colValue})`;
    document.getElementById("selectEmojiText").textContent = selectionTitle;
    
    // Show the selection panel
    emojiSelection.classList.remove("hidden");
    
    // Focus the filter input and ensure it's visible
    setTimeout(() => {
        // Ensure the emoji selection is fully visible
        emojiSelection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus the input after scrolling
        setTimeout(() => {
            filterInput.focus();
        }, 300);
    }, 100);
}

// Filter titles based on input
function filterTitles(query, container) {
    // Remember scroll position
    const scrollTop = container.scrollTop;
    
    const options = container.querySelectorAll('.option');
    let visibleCount = 0;
    
    options.forEach(option => {
        const title = option.dataset.title.toLowerCase();
        if (title.includes(query)) {
            option.style.display = '';
            visibleCount++;
        } else {
            option.style.display = 'none';
        }
    });
    
    // Set a minimum height for the container to prevent layout shifts
    if (visibleCount < 3) {
        container.style.minHeight = '100px';
    } else {
        container.style.minHeight = '';
    }
    
    // Restore scroll position
    setTimeout(() => {
        container.scrollTop = scrollTop;
    }, 10);
}

// Show wrong answer message
function showWrongAnswerMessage() {
    // Set the preventInteraction flag
    gameState.preventInteraction = true;
    
    // Disable the filter input
    const filterInput = document.querySelector('.title-filter');
    if (filterInput) {
        filterInput.disabled = true;
    }
    
    // Create message element if it doesn't exist
    let wrongAnswerMsg = document.getElementById("wrong-answer-message");
    
    if (!wrongAnswerMsg) {
        wrongAnswerMsg = document.createElement("div");
        wrongAnswerMsg.id = "wrong-answer-message";
        wrongAnswerMsg.className = "wrong-answer-message";
        document.getElementById("emoji-selection").appendChild(wrongAnswerMsg);
    }
    
    wrongAnswerMsg.textContent = window.getTranslation('wrongAnswer');
    wrongAnswerMsg.classList.add("show");
    
    // Add a visual overlay to indicate interaction is disabled
    let overlay = document.getElementById("interaction-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "interaction-overlay";
        overlay.className = "interaction-overlay";
        document.getElementById("emoji-selection").appendChild(overlay);
    }
    overlay.style.display = "block";
    
    // Hide after a delay
    setTimeout(() => {
        wrongAnswerMsg.classList.remove("show");
        if (overlay) overlay.style.display = "none";
        
        // Re-enable the filter input
        if (filterInput) {
            filterInput.disabled = false;
        }
        
        // Note: we don't reset preventInteraction here, it's done in the calling function
    }, 1500);
}

// Make a move on the board
function makeMove(title) {
    // If game is over or interaction is prevented, don't allow moves
    if (gameState.gameOver || gameState.preventInteraction) {
        return;
    }
    
    // Set the player's mark in the cell
    const { row, col } = gameState.selectedCell;
    
    // Check if the selected title is a valid choice
    const validEntries = gameState.validCellCombinations[row][col];
    const validTitles = validEntries.map(entry => entry.title);
    
    if (!validTitles.includes(title)) {
        // This is not a valid title, show an error and don't change the turn
        showWrongAnswerMessage();
        return;
    }
    
    // Update the game state
    gameState.board[row][col] = title;
    setCellState(row, col, gameState.currentPlayer);
    
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
        endGame(false);
        return;
    }
    
    // Check for draw
    if (checkDraw()) {
        endGame(true);
        return;
    }
    
    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === "red" ? "blue" : "red";
    
    // Update player marker text and class based on current language
    const lang = window.getCurrentLanguage();
    const player1Text = lang === 'en' ? "Player 1" : "Giocatore 1";
    const player2Text = lang === 'en' ? "Player 2" : "Giocatore 2";
    
    currentPlayerEl.textContent = gameState.currentPlayer === "red" ? player1Text : player2Text;
    currentPlayerEl.className = `player-marker ${gameState.currentPlayer}`;
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

// End the game and show winner
function endGame(isDraw) {
    gameState.gameOver = true;
    
    // Get current language
    const lang = window.getCurrentLanguage();
    
    // Update player turn display instead of a separate winner screen
    if (isDraw) {
        currentPlayerEl.textContent = window.getTranslation ? window.getTranslation("draw") : "It's a draw!";
        currentPlayerEl.className = "player-marker draw";
    } else {
        // Show the winning player in the current player element
        const player1Text = lang === 'en' ? "Player 1 Wins!" : "Giocatore 1 Vince!";
        const player2Text = lang === 'en' ? "Player 2 Wins!" : "Giocatore 2 Vince!";
        currentPlayerEl.textContent = gameState.currentPlayer === "red" ? player1Text : player2Text;
        currentPlayerEl.className = `player-marker ${gameState.currentPlayer}`;
    }
    
    // Show the New Game button and hide End Game button
    document.getElementById("new-game").style.display = "block";
    document.getElementById("end-game").style.display = "none";
}

// Declare the game as a draw
function declareGameDraw() {
    // Skip if game is already over
    if (gameState.gameOver) {
        return;
    }
    
    // Confirm the user wants to end the game
    if (confirm(window.getTranslation ? window.getTranslation("confirmEndGame") : "Are you sure you want to end the current game?")) {
        // Set game over state and declare draw
        gameState.gameOver = true;
        
        // Update player turn display to show draw
        currentPlayerEl.textContent = window.getTranslation ? window.getTranslation("draw") : "It's a draw!";
        currentPlayerEl.className = "player-marker draw";
        
        // Show the New Game button and hide End Game button
        document.getElementById("new-game").style.display = "block";
        document.getElementById("end-game").style.display = "none";
    }
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

// New function to show valid answers for a cell when game is over
function showValidAnswers(row, col) {
    // Get the valid entries for this cell
    const validEntries = gameState.validCellCombinations[row][col];
    
    if (validEntries.length === 0) {
        console.error("No valid entries for this cell");
        return;
    }
    
    // Remove any existing valid answers container
    const existingContainer = document.getElementById("valid-answers-container");
    if (existingContainer) {
        document.body.removeChild(existingContainer);
    }
    
    // Create the valid answers container
    const validAnswersContainer = document.createElement("div");
    validAnswersContainer.className = "valid-answers-container";
    validAnswersContainer.id = "valid-answers-container";
    
    // Add the title
    const title = document.createElement("h3");
    title.textContent = window.getTranslation('validAnswersTitle');
    validAnswersContainer.appendChild(title);
    
    // Add the list of valid answers
    const answersList = document.createElement("div");
    answersList.className = "valid-answers-list";
    
    // Sort entries alphabetically
    const sortedEntries = [...validEntries].sort((a, b) => 
        a.title.localeCompare(b.title)
    );
    
    // Add each valid answer to the list
    sortedEntries.forEach(entry => {
        const answerItem = document.createElement("div");
        answerItem.className = "valid-answer-item";
        answerItem.textContent = entry.title;
        
        // Add tooltip with details
        let tooltip = `${entry.title} (${entry.type})`;
        tooltip += `\n${window.getTranslation('genre')}: ${Array.isArray(entry.genre) ? entry.genre.join(', ') : entry.genre}`;
        tooltip += `\n${window.getTranslation('language')}: ${entry.language}`;
        tooltip += `\n${window.getTranslation('decade')}: ${entry.decade}`;
        if (entry.director) tooltip += `\n${window.getTranslation('director')}: ${entry.director}`;
        if (entry.theme) tooltip += `\n${window.getTranslation('theme')}: ${Array.isArray(entry.theme) ? entry.theme.join(', ') : entry.theme}`;
        
        answerItem.title = tooltip;
        
        answersList.appendChild(answerItem);
    });
    
    validAnswersContainer.appendChild(answersList);
    
    // Add close button
    const closeButton = document.createElement("button");
    closeButton.className = "valid-answers-close";
    closeButton.textContent = window.getTranslation('closeText');
    closeButton.addEventListener("click", () => {
        document.body.removeChild(validAnswersContainer);
    });
    
    validAnswersContainer.appendChild(closeButton);
    
    // Add to the body but keep it hidden initially
    validAnswersContainer.style.visibility = 'hidden';
    document.body.appendChild(validAnswersContainer);
    
    // Force browser to calculate layout before showing the container
    // This prevents the half-rendered initial state
    setTimeout(() => {
        validAnswersContainer.style.visibility = 'visible';
    }, 10);
} 