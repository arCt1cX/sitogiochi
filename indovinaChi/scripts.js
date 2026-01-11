// Game state
let gameState = {
    playerCount: 4,
    currentPlayer: 1,
    mode: 'chosen', // 'chosen', 'random', 'custom'
    categories: [],
    scores: [], // Array of { player: number, questions: number, word: string, category: string }
    currentQuestions: 0,
    currentWord: '',
    currentCategory: '',
    changeWordCount: 0,
    giveUpConfirmationPending: false,
    tournamentMode: false,
    tournamentPlayers: []
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Screens
    const setupScreen = document.getElementById('setup-screen');
    const modeScreen = document.getElementById('mode-screen');
    const categoryScreen = document.getElementById('category-screen');
    const customWordScreen = document.getElementById('custom-word-screen');
    const passPhoneScreen = document.getElementById('pass-phone-screen');
    const gamePlayScreen = document.getElementById('game-play-screen');
    const endScreen = document.getElementById('end-screen');

    // DOM Elements - Controls
    const playerCountInput = document.getElementById('player-count');
    const startGameBtn = document.getElementById('start-game');
    const modeChosenBtn = document.getElementById('mode-chosen');
    const modeRandomBtn = document.getElementById('mode-random');
    const modeCustomBtn = document.getElementById('mode-custom');
    const categoryList = document.getElementById('category-list');
    const customWordInput = document.getElementById('custom-word-input');
    const submitCustomWordBtn = document.getElementById('submit-custom-word');
    const showWordBtn = document.getElementById('show-word-btn');
    const incrementBtn = document.getElementById('increment-btn');
    const decrementBtn = document.getElementById('decrement-btn');
    const questionCount = document.getElementById('question-count');
    const guessedBtn = document.getElementById('guessed-btn');
    const playAgainBtn = document.getElementById('play-again');

    // Apply translations
    applyGameTranslations();

    // Helper to get player name
    function getPlayerName(index) {
        if (gameState.tournamentMode && gameState.tournamentPlayers[index - 1]) {
            return gameState.tournamentPlayers[index - 1].name;
        }
        return `${index}`; // Just the number, the "Player"/"Giocatore" prefix is in the UI text usually
    }

    // Check for tournament mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'tournament') {
        gameState.tournamentMode = true;
        const savedState = localStorage.getItem('tournamentState');
        if (savedState) {
            const tournamentState = JSON.parse(savedState);
            gameState.tournamentPlayers = tournamentState.players;
            gameState.playerCount = tournamentState.players.length;

            // Skip setup screen and go to mode selection
            // We need to wait for translations/other init potentially, but startGame essentially just changes screen
            // However, we want to let the user choose the Mode (Chosen/Random/Custom) even in tournament? Yes.
            // But we skip the player count selection.
            setTimeout(() => {
                startGame();
            }, 100);
        }
    }

    // Load categories from JSON
    async function loadCategories() {
        try {
            const response = await fetch('categorie.json');
            const data = await response.json();
            gameState.categories = data.categorie;
            console.log(`Loaded ${gameState.categories.length} categories`);
        } catch (error) {
            console.error('Error loading categories:', error);
            const lang = getUserLanguage();
            const errorMsg = lang === 'it'
                ? 'Errore nel caricamento delle categorie. Ricarica la pagina.'
                : 'Error loading categories. Please reload the page.';
            alert(errorMsg);
        }
    }

    // Show a specific screen
    function showScreen(screen) {
        // Hide all screens
        setupScreen.classList.remove('active');
        modeScreen.classList.remove('active');
        categoryScreen.classList.remove('active');
        customWordScreen.classList.remove('active');
        passPhoneScreen.classList.remove('active');
        gamePlayScreen.classList.remove('active');
        endScreen.classList.remove('active');

        // Show the requested screen
        screen.classList.add('active');
    }

    // Start game - go to mode selection
    function startGame() {
        gameState.playerCount = parseInt(playerCountInput.value) || 4;
        gameState.currentPlayer = 1;
        gameState.scores = [];
        showScreen(modeScreen);
    }

    // Select game mode
    function selectMode(mode) {
        gameState.mode = mode;

        if (mode === 'chosen') {
            // Show category selection for current player
            showCategorySelection();
        } else if (mode === 'random') {
            // Pick random category and word
            selectRandomWord();
            showPassPhoneScreen();
        } else if (mode === 'custom') {
            // Show custom word input
            showCustomWordScreen();
        }
    }

    // Show category selection screen
    function showCategorySelection() {
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        document.getElementById('category-player-num').textContent = getPlayerName(gameState.currentPlayer);

        // Clear and populate category list
        categoryList.innerHTML = '';
        gameState.categories.forEach((category, index) => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category.nome;
            btn.addEventListener('click', () => selectCategory(index));
            categoryList.appendChild(btn);
        });

        showScreen(categoryScreen);
    }

    // Select a category and pick random word from it
    function selectCategory(categoryIndex) {
        const category = gameState.categories[categoryIndex];
        const randomIndex = Math.floor(Math.random() * category.parole.length);
        gameState.currentWord = category.parole[randomIndex];
        gameState.currentCategory = category.nome;

        showPassPhoneScreen();
    }

    // Select random word from random category
    function selectRandomWord() {
        const randomCategoryIndex = Math.floor(Math.random() * gameState.categories.length);
        const category = gameState.categories[randomCategoryIndex];
        const randomWordIndex = Math.floor(Math.random() * category.parole.length);

        gameState.currentWord = category.parole[randomWordIndex];
        gameState.currentCategory = category.nome;
    }

    // Show custom word input screen
    function showCustomWordScreen() {
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        document.getElementById('custom-player-num').textContent = getPlayerName(gameState.currentPlayer);
        customWordInput.value = '';
        gameState.currentCategory = translations.customCategory || 'Personalizzata';

        showScreen(customWordScreen);
    }

    // Submit custom word
    function submitCustomWord() {
        const word = customWordInput.value.trim();
        if (word.length === 0) {
            const lang = getUserLanguage();
            const errorMsg = lang === 'it'
                ? 'Scrivi una parola!'
                : 'Enter a word!';
            alert(errorMsg);
            return;
        }

        gameState.currentWord = word;
        showPassPhoneScreen();
    }

    // Show pass phone screen
    function showPassPhoneScreen() {
        document.getElementById('pass-player-num').textContent = getPlayerName(gameState.currentPlayer);
        showScreen(passPhoneScreen);
    }

    // Show the word and start the game
    function showWord() {
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        document.getElementById('game-player-num').textContent = getPlayerName(gameState.currentPlayer);
        document.getElementById('word-display').textContent = gameState.currentWord;
        document.getElementById('categoryLabel').textContent = gameState.currentCategory;

        gameState.currentQuestions = 0;
        questionCount.textContent = '0';

        // Reset change word state
        gameState.changeWordCount = 0;
        const changeBtn = document.getElementById('change-word-btn');
        changeBtn.style.opacity = '1';
        changeBtn.style.cursor = 'pointer';

        // Reset give up button
        gameState.giveUpConfirmationPending = false;
        const giveUpBtn = document.getElementById('give-up-btn');
        // Update button text immediately to default
        const giveUpSpan = document.getElementById('giveUpBtn');
        if (giveUpSpan) giveUpSpan.textContent = translations.giveUpText;

        showScreen(gamePlayScreen);
    }

    // Increment question counter
    function incrementQuestions() {
        gameState.currentQuestions++;
        questionCount.textContent = gameState.currentQuestions;
    }

    // Decrement question counter
    function decrementQuestions() {
        if (gameState.currentQuestions > 0) {
            gameState.currentQuestions--;
            questionCount.textContent = gameState.currentQuestions;
        }
    }

    // Player guessed the word
    function playerGuessed() {
        // Save score
        gameState.scores.push({
            player: gameState.currentPlayer,
            questions: gameState.currentQuestions,
            word: gameState.currentWord,
            category: gameState.currentCategory
        });

        // Move to next player or end game
        if (gameState.currentPlayer < gameState.playerCount) {
            gameState.currentPlayer++;

            // Go to appropriate screen based on mode
            if (gameState.mode === 'chosen') {
                showCategorySelection();
            } else if (gameState.mode === 'random') {
                selectRandomWord();
                showPassPhoneScreen();
            } else if (gameState.mode === 'custom') {
                showCustomWordScreen();
            }
        } else {
            // End game - show results
            showResults();
        }
    }

    // Show results screen
    function showResults() {
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';

        // Sort by questions (lowest first = winner)
        const sortedScores = [...gameState.scores].sort((a, b) => a.questions - b.questions);

        sortedScores.forEach((score, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '';
            const playerLabel = translations.player || 'Giocatore';
            const questionsLabel = translations.questionsUnit || 'domande';

            // Use getPlayerName for the result display too
            let playerNameDisplay = score.player;
            if (gameState.tournamentMode) {
                // If it's tournament mode, score.player is the index.
                playerNameDisplay = getPlayerName(score.player);
            } else {
                playerNameDisplay = `${playerLabel} ${score.player}`;
            }

            let questionsText = `${score.questions} ${questionsLabel}`;
            if (score.gaveUp) {
                questionsText = `<span style="color: #cf6679">${translations.arreso || 'Arreso'}</span>`;
            }

            resultItem.innerHTML = `
                <div>
                    <div class="result-player">${medal}${playerNameDisplay}</div>
                    <div class="result-word">${score.word} (${score.category})</div>
                </div>
                <div class="result-score">${questionsText}</div>
            `;

            resultsContainer.appendChild(resultItem);
        });

        if (gameState.tournamentMode) {
            const existingReturnBtn = document.getElementById('return-tournament-btn');
            if (!existingReturnBtn) {
                const returnBtn = document.createElement('button');
                returnBtn.id = 'return-tournament-btn';
                returnBtn.className = 'btn primary-btn';
                returnBtn.textContent = '🏆 Torna al Torneo';
                returnBtn.style.marginTop = '10px';
                returnBtn.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
                returnBtn.onclick = () => {
                    window.location.href = '../tournament/index.html?return=true';
                };
                resultsContainer.parentElement.appendChild(returnBtn);
                // Hide play again button in tournament mode to avoid confusion? 
                // Or keep it? Usually better to guide them back.
                playAgainBtn.style.display = 'none';
            }
        }

        showScreen(endScreen);
    }

    // Play again
    function playAgain() {
        showScreen(setupScreen);
    }

    // Event listeners
    startGameBtn.addEventListener('click', startGame);
    modeChosenBtn.addEventListener('click', () => selectMode('chosen'));
    modeRandomBtn.addEventListener('click', () => selectMode('random'));
    modeCustomBtn.addEventListener('click', () => selectMode('custom'));
    submitCustomWordBtn.addEventListener('click', submitCustomWord);
    showWordBtn.addEventListener('click', showWord);
    incrementBtn.addEventListener('click', incrementQuestions);
    decrementBtn.addEventListener('click', decrementQuestions);
    guessedBtn.addEventListener('click', playerGuessed);
    playAgainBtn.addEventListener('click', playAgain);

    // New buttons
    document.getElementById('change-word-btn').addEventListener('click', changeWord);
    document.getElementById('give-up-btn').addEventListener('click', giveUp);

    // Enter key for custom word input
    customWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitCustomWord();
        }
    });

    // Change Word functionality
    function changeWord() {
        if (gameState.changeWordCount >= 3) {
            const lang = getUserLanguage();
            const translations = gameTranslations[lang] || gameTranslations['en'];
            alert(translations.noMoreChangesAlert);
            return;
        }

        let newWord = '';
        let newCategory = '';

        // Determine how to pick new word based on mode
        if (gameState.mode === 'chosen') {
            // Find current category object
            const categoryObj = gameState.categories.find(c => c.nome === gameState.currentCategory);
            if (categoryObj) {
                const randomIndex = Math.floor(Math.random() * categoryObj.parole.length);
                newWord = categoryObj.parole[randomIndex];
                newCategory = categoryObj.nome;
            }
        }

        // If random mode OR custom mode OR if chosen mode failed to find category
        if (!newWord) {
            const randomCategoryIndex = Math.floor(Math.random() * gameState.categories.length);
            const categoryObj = gameState.categories[randomCategoryIndex];
            const randomIndex = Math.floor(Math.random() * categoryObj.parole.length);
            newWord = categoryObj.parole[randomIndex];
            newCategory = categoryObj.nome;
        }

        // Update state
        gameState.currentWord = newWord;
        gameState.currentCategory = newCategory;
        gameState.changeWordCount++;

        // Update UI
        document.getElementById('word-display').textContent = gameState.currentWord;
        document.getElementById('categoryLabel').textContent = gameState.currentCategory;

        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        let changesLeft = 3 - gameState.changeWordCount;
        alert(`${translations.wordChangedAlert} (${changesLeft} ${translations.changesLeft || 'remaining'})`);

        // Disable button visually if limit reached
        if (gameState.changeWordCount >= 3) {
            document.getElementById('change-word-btn').style.opacity = '0.5';
            document.getElementById('change-word-btn').style.cursor = 'not-allowed';
        }
    }

    // Give Up functionality
    function giveUp() {
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];
        const giveUpSpan = document.getElementById('giveUpBtn');

        if (!gameState.giveUpConfirmationPending) {
            // First click - ask for confirmation
            gameState.giveUpConfirmationPending = true;
            giveUpSpan.textContent = translations.areYouSure || 'Sicuro?';
            return;
        }

        // Second click - confirm give up
        // Save score as "Gave Up" (high question count + flag)
        gameState.scores.push({
            player: gameState.currentPlayer,
            questions: 100, // Penality
            word: gameState.currentWord,
            category: gameState.currentCategory,
            gaveUp: true
        });

        // Move to next player
        if (gameState.currentPlayer < gameState.playerCount) {
            gameState.currentPlayer++;
            if (gameState.mode === 'chosen') {
                showCategorySelection();
            } else if (gameState.mode === 'random') {
                selectRandomWord();
                showPassPhoneScreen();
            } else if (gameState.mode === 'custom') {
                showCustomWordScreen();
            }
        } else {
            showResults();
        }
    }

    // Load categories on page load
    loadCategories();
});
