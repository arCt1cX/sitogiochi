// Game State
const gameState = {
    players: [],
    categories: [],
    availableCategories: [], // Track unused categories
    currentCategory: '',
    playerInputs: {}, // { playerName: "hot take" }
    currentPlayerIndex: 0,
    shuffledInputs: []
};

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const inputScreen = document.getElementById('input-screen');
const revealScreen = document.getElementById('reveal-screen');

const playerCountSelect = document.getElementById('player-count');
const playerNamesContainer = document.getElementById('player-names-container');
const startGameBtn = document.getElementById('start-game');

const currentCategoryDisplay = document.getElementById('current-category');
const currentPlayerNameDisplay = document.getElementById('current-player-name');
const inputArea = document.getElementById('input-area');
const hotTakeInput = document.getElementById('hot-take-input');
const submitTakeBtn = document.getElementById('submit-take');
const revealInputBtn = document.getElementById('reveal-input');

const revealedTakeDisplay = document.getElementById('revealed-take');
const revealAuthorBtn = document.getElementById('reveal-author');
const authorDisplay = document.getElementById('author-display');
const authorNameSpan = document.getElementById('author-name');
const nextRoundBtn = document.getElementById('next-round');

const rerollCategoryBtn = document.getElementById('reroll-category');

// Helper to get current language
function getUserLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam) return langParam;
    return localStorage.getItem('lang') || 'it';
}

// Load Categories
async function loadCategories() {
    try {
        const lang = getUserLanguage();
        const filename = lang === 'en' ? 'categories_en.txt' : 'categories.txt';

        console.log(`Loading categories from ${filename}...`);
        const response = await fetch(filename);
        const text = await response.text();
        gameState.categories = text.split('\n').filter(line => line.trim() !== '');
        gameState.availableCategories = [...gameState.categories]; // Initialize available pool
        console.log(`Loaded ${gameState.categories.length} categories.`);
    } catch (error) {
        console.error('Error loading categories:', error);
        gameState.categories = ['Videogames', 'Food', 'Movies', 'Music', 'Travel']; // Fallback
    }
}

// Generate Player Inputs
function generatePlayerInputs() {
    const count = parseInt(playerCountSelect.value);
    playerNamesContainer.innerHTML = '';

    // Refresh UI language to ensure headers are correct before adding inputs
    // But we need to know the translations... they are in translations.js
    const lang = getUserLanguage();
    // Fallback if translation script hasn't run yet or isn't available
    const playerLabel = (gameTranslations && gameTranslations[lang]) ? gameTranslations[lang].players.slice(0, -1) : 'Giocatore';
    const playerPlaceholder = (gameTranslations && gameTranslations[lang]) ? gameTranslations[lang].playerPlaceholder : 'Nome giocatore';

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'player-input';
        div.innerHTML = `
            <div class="form-group">
                <label for="player-${i}">${playerLabel} ${i}:</label>
                <input type="text" id="player-${i}" placeholder="${playerPlaceholder} ${i}" maxlength="15">
            </div>
        `;
        playerNamesContainer.appendChild(div);
    }
}

// Start Game
function startGame() {
    // Get player names
    const count = parseInt(playerCountSelect.value);
    gameState.players = [];

    // Get translations for default name
    const lang = getUserLanguage();
    const playerLabel = (gameTranslations && gameTranslations[lang]) ? gameTranslations[lang].players.slice(0, -1) : 'Giocatore';

    for (let i = 1; i <= count; i++) {
        const input = document.getElementById(`player-${i}`);
        const name = input.value.trim() || `${playerLabel} ${i}`;
        gameState.players.push(name);
    }

    startRound();
}

// Start Round
function startRound() {
    // Pick random category
    if (gameState.categories.length === 0) {
        loadCategories().then(() => pickCategory());
    } else {
        pickCategory();
    }
}

function pickCategory() {
    // Reset pool if empty
    if (gameState.availableCategories.length === 0) {
        gameState.availableCategories = [...gameState.categories];
        console.log('Pool reset!');
    }

    const randomIndex = Math.floor(Math.random() * gameState.availableCategories.length);
    gameState.currentCategory = gameState.availableCategories[randomIndex];

    // Remove selected category from pool
    gameState.availableCategories.splice(randomIndex, 1);

    // Reset state for new round
    gameState.playerInputs = {};
    gameState.currentPlayerIndex = 0;

    // Setup UI
    currentCategoryDisplay.textContent = gameState.currentCategory;
    showPlayerInputScreen();
    showScreen('input-screen');
}

// Reroll Category
function rerollCategory() {
    // Reset pool if empty
    if (gameState.availableCategories.length === 0) {
        gameState.availableCategories = [...gameState.categories];
    }

    const randomIndex = Math.floor(Math.random() * gameState.availableCategories.length);
    gameState.currentCategory = gameState.availableCategories[randomIndex];

    // Remove selected category from pool
    gameState.availableCategories.splice(randomIndex, 1);

    currentCategoryDisplay.textContent = gameState.currentCategory;
}

// Show Player Input Screen
function showPlayerInputScreen() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayerNameDisplay.textContent = currentPlayer;

    // Reset input area
    inputArea.style.display = 'none';
    revealInputBtn.style.display = 'block';

    // Use translations for button if available
    if (typeof updateUILanguage === 'function') {
        // This ensures dynamic elements get translated
        // But specifically for this button, let's reset its text
        const lang = getUserLanguage();
        if (gameTranslations && gameTranslations[lang]) {
            revealInputBtn.textContent = gameTranslations[lang].ready;
        }
    }

    hotTakeInput.value = '';

    // Show/Hide reroll button: only show for first player
    if (gameState.currentPlayerIndex === 0) {
        rerollCategoryBtn.style.display = 'block';
    } else {
        rerollCategoryBtn.style.display = 'none';
    }
}

// Reveal Input Area (Player confirms they are holding the phone)
function revealInputArea() {
    revealInputBtn.style.display = 'none';
    inputArea.style.display = 'block';
    hotTakeInput.focus();
}

// Submit Hot Take
function submitHotTake() {
    const take = hotTakeInput.value.trim();
    if (!take) {
        const lang = getUserLanguage();
        const alertMsg = (gameTranslations && gameTranslations[lang]) ? gameTranslations[lang].alertEmpty : 'Scrivi qualcosa!';
        alert(alertMsg);
        return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    gameState.playerInputs[currentPlayer] = take;

    gameState.currentPlayerIndex++;

    if (gameState.currentPlayerIndex < gameState.players.length) {
        // Next player
        showPlayerInputScreen();
    } else {
        // All players done
        startRevealPhase();
    }
}

// Start Reveal Phase
function startRevealPhase() {
    // Shuffle inputs to pick one randomly
    const entries = Object.entries(gameState.playerInputs);
    const randomIndex = Math.floor(Math.random() * entries.length);
    const [author, take] = entries[randomIndex];

    // Show reveal screen
    revealedTakeDisplay.textContent = `"${take}"`;
    authorNameSpan.textContent = author;

    // Reset reveal controls
    authorDisplay.style.display = 'none';
    revealAuthorBtn.style.display = 'block';
    revealAuthorBtn.disabled = false;

    showScreen('reveal-screen');
}

// Reveal Author
function revealAuthor() {
    authorDisplay.style.display = 'block';
    revealAuthorBtn.style.display = 'none';
}

// Helper: Show Screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Apply translations properly
    if (typeof updateUILanguage === 'function') {
        updateUILanguage();
    }

    loadCategories();
    // Wait for translations to be applied before generating inputs
    setTimeout(generatePlayerInputs, 100);

    playerCountSelect.addEventListener('change', generatePlayerInputs);
    startGameBtn.addEventListener('click', startGame);
    revealInputBtn.addEventListener('click', revealInputArea);
    submitTakeBtn.addEventListener('click', submitHotTake);
    revealAuthorBtn.addEventListener('click', revealAuthor);
    nextRoundBtn.addEventListener('click', startRound);
    rerollCategoryBtn.addEventListener('click', rerollCategory);

    // Handle tournament mode return if needed
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'tournament') {
        // Add logic if specific tournament handling is needed
        // For now, just playing normally is fine
    }
});


