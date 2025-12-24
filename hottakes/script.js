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

// Load Categories
async function loadCategories() {
    try {
        const response = await fetch('categories.txt');
        const text = await response.text();
        gameState.categories = text.split('\n').filter(line => line.trim() !== '');
        gameState.availableCategories = [...gameState.categories]; // Initialize available pool
        console.log(`Loaded ${gameState.categories.length} categories.`);
    } catch (error) {
        console.error('Error loading categories:', error);
        gameState.categories = ['Videogiochi', 'Cibo', 'Film', 'Musica', 'Viaggi']; // Fallback
    }
}

// Generate Player Inputs
function generatePlayerInputs() {
    const count = parseInt(playerCountSelect.value);
    playerNamesContainer.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'player-input';
        div.innerHTML = `
            <div class="form-group">
                <label for="player-${i}">Giocatore ${i}:</label>
                <input type="text" id="player-${i}" placeholder="Nome giocatore ${i}" maxlength="15">
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

    for (let i = 1; i <= count; i++) {
        const input = document.getElementById(`player-${i}`);
        const name = input.value.trim() || `Giocatore ${i}`;
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
        alert('Scrivi qualcosa!');
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
    loadCategories();
    generatePlayerInputs();

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
