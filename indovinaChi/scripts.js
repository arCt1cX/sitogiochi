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
    tournamentPlayers: [],
    playerNames: []
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

    const playerNamesContainer = document.getElementById('player-names-container');

    // Apply translations
    applyGameTranslations();

    // Helper to get player name
    function getPlayerName(index) {
        if (gameState.tournamentMode && gameState.tournamentPlayers[index - 1]) {
            return gameState.tournamentPlayers[index - 1].name;
        }
        // Custom name if available
        if (gameState.playerNames && gameState.playerNames[index - 1]) {
            return gameState.playerNames[index - 1];
        }
        return `${index}`; // Just the number, the "Player"/"Giocatore" prefix is in the UI text usually. Wait, previously it was just index. 
    }

    function updatePlayerNameInputs() {
        // Don't show inputs in tournament mode (names come from tournament)
        if (gameState.tournamentMode) {
            playerNamesContainer.innerHTML = '';
            return;
        }

        const count = parseInt(playerCountInput.value) || 4;
        const currentInputs = playerNamesContainer.querySelectorAll('input');
        const currentValues = Array.from(currentInputs).map(input => input.value);

        playerNamesContainer.innerHTML = '';

        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-name-${i}`;
            input.className = 'form-control';

            // Reuse existing value if available
            if (i < currentValues.length) {
                input.value = currentValues[i];
            }

            // Placeholder
            let placeholder = translations.playerNamePlaceholder || `Player ${i + 1}`;
            placeholder = placeholder.replace('{n}', i + 1);
            input.placeholder = placeholder;

            playerNamesContainer.appendChild(input);
        }
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
    } else {
        // Not tournament mode, initialize inputs
        updatePlayerNameInputs();
        playerCountInput.addEventListener('change', updatePlayerNameInputs);
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
        if (!gameState.tournamentMode) {
            gameState.playerCount = parseInt(playerCountInput.value) || 4;

            // Capture player names
            const nameInputs = playerNamesContainer.querySelectorAll('input');
            gameState.playerNames = Array.from(nameInputs).map(input => input.value.trim());
        }

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

        const playerLabel = translations.player || 'Giocatore';
        const name = getPlayerName(gameState.currentPlayer);
        const playerTextElement = document.getElementById('categoryPlayerText');

        // Logic for display text
        let message;
        // Check if it's a generic name (just the index number string)
        if (name === `${gameState.currentPlayer}`) {
            // Default: "Giocatore 1, scegli la categoria per gli altri"
            // Use existing translation 'categoryPlayerText' which has "Giocatore {n}..."
            const template = translations.categoryPlayerText || 'Giocatore {n}, scegli la categoria per gli altri:';
            message = template.replace('{n}', gameState.currentPlayer);
        } else {
            // Custom Name: "Davide scegli la tua categoria"
            const template = translations.categoryChooseOwn || '{n} scegli la tua categoria';
            message = template.replace('{n}', name);
        }

        if (playerTextElement) {
            playerTextElement.textContent = message;
        }

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
        // Filter for Normal categories only (exclude advanced)
        const normalCategories = gameState.categories.filter(c => c.tipo !== 'avanzata');
        // Fallback to all categories if filter returns empty (safety check)
        const sourceCategories = normalCategories.length > 0 ? normalCategories : gameState.categories;

        const randomCategoryIndex = Math.floor(Math.random() * sourceCategories.length);
        const category = sourceCategories[randomCategoryIndex];
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
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];
        // Use text directly from translations, no need for name replacement anymore
        document.getElementById('passPhoneText').textContent = translations.passPhoneText;
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

        // Reset change word state based on mode
        gameState.changeWordCount = 0;
        const changeBtn = document.getElementById('change-word-btn');

        if (gameState.mode === 'custom') {
            // Hide change word button for custom mode
            changeBtn.style.display = 'none';
        } else {
            changeBtn.style.display = '';
            changeBtn.style.opacity = '1';
            changeBtn.style.cursor = 'pointer';
            // Set max changes: 5 for random, 3 for chosen
            const maxChanges = gameState.mode === 'random' ? 5 : 3;
            document.getElementById('changeWordCount').textContent = maxChanges;
        }

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

            // Determine display name
            let playerNameDisplay;
            const customName = getPlayerName(score.player);

            // If getPlayerName returns just the number (default), prepend "Player" label
            if (customName === `${score.player}`) {
                playerNameDisplay = `${playerLabel} ${score.player}`;
            } else {
                // Otherwise use the custom name directly (e.g., "Alberto")
                playerNameDisplay = customName;
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
        if (!gameState.tournamentMode) {
            updatePlayerNameInputs();
        }
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
        // Get max changes based on mode: 5 for random, 3 for chosen, 0 for custom
        const maxChanges = gameState.mode === 'random' ? 5 : (gameState.mode === 'chosen' ? 3 : 0);

        if (gameState.changeWordCount >= maxChanges) {
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
            // Filter for Normal categories only if we are in random mode or fallback (exclude advanced)
            const normalCategories = gameState.categories.filter(c => c.tipo !== 'avanzata');
            const sourceCategories = normalCategories.length > 0 ? normalCategories : gameState.categories;

            const randomCategoryIndex = Math.floor(Math.random() * sourceCategories.length);
            const categoryObj = sourceCategories[randomCategoryIndex];
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

        // Update button counter
        let changesLeft = maxChanges - gameState.changeWordCount;
        document.getElementById('changeWordCount').textContent = changesLeft;

        // Disable button visually if limit reached
        if (gameState.changeWordCount >= maxChanges) {
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
