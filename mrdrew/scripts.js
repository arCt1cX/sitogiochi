document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const playerTurnScreen = document.getElementById('player-turn-screen');
    const playingScreen = document.getElementById('playing-screen');
    const revealScreen = document.getElementById('reveal-screen');

    const playerCountInput = document.getElementById('player-count');
    const modeSelect = document.getElementById('mode-select');
    const startGameBtn = document.getElementById('start-game');
    const roleBreakdown = document.getElementById('roleBreakdown');

    const currentPlayerNum = document.getElementById('current-player-num');
    const currentPlayerNumText = document.getElementById('current-player-num-text');
    const showWordBtn = document.getElementById('show-word');
    const wordContainer = document.getElementById('word-container');
    const playerWord = document.getElementById('player-word');
    const playerRole = document.getElementById('player-role');
    const hideWordBtn = document.getElementById('hide-word');

    const revealRolesBtn = document.getElementById('reveal-roles');
    const mrdrewNum = document.getElementById('mrdrew-num');
    const undercoverRevealContainer = document.getElementById('undercover-reveal-container');
    const undercoverNum = document.getElementById('undercover-num');
    const undercoverWord = document.getElementById('undercover-word');
    const civilWord = document.getElementById('civil-word');
    const revealCivilWordBtn = document.getElementById('reveal-civil-word');
    const playAgainBtn = document.getElementById('play-again');

    // Apply game translations
    if (typeof applyGameTranslations === 'function') {
        applyGameTranslations();
    }

    // Game State
    let gameState = {
        playerCount: 4,
        currentPlayer: 1,
        mrdrewIndex: -1,
        undercoverIndex: -1,
        hasUndercover: false,
        civilWord: '',
        undercoverWord: '',
        theme: '',
        startingPlayer: 1,
        allWordPairs: []
    };

    // Load word pairs from the text file
    async function loadWordPairs() {
        try {
            const lang = getUserLanguage();
            const translations = gameTranslations[lang] || gameTranslations['en'];
            const phrasesFile = translations.phrasesFile;

            const response = await fetch(phrasesFile);
            const text = await response.text();

            // Split by new line and filter out empty lines
            const lines = text.split('\n').filter(line => line.trim().length > 0);

            // Parse each line into a word pair with theme
            gameState.allWordPairs = lines.map(line => {
                const parts = line.split('|').map(word => word.trim());
                return {
                    civilWord: parts[0] || '',
                    undercoverWord: parts[1] || '',
                    theme: parts[2] || ''
                };
            });

            console.log(`Loaded ${gameState.allWordPairs.length} word pairs`);
        } catch (error) {
            console.error('Error loading word pairs:', error);
            const lang = getUserLanguage();
            const errorMsg = lang === 'it'
                ? 'Errore nel caricamento delle parole. Ricarica la pagina per riprovare.'
                : 'Error loading words. Reload the page to try again.';
            alert(errorMsg);
        }
    }

    // Update role breakdown display
    function updateRoleBreakdown() {
        const playerCount = parseInt(playerCountInput.value) || 4;
        const selectedMode = modeSelect ? modeSelect.value : 'simple';
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        // Check if undercover mode is selected
        const hasUndercover = selectedMode === 'undercover' && playerCount >= 4;
        const numMrDrew = 1;
        const numUndercover = hasUndercover ? 1 : 0;
        const numCivils = playerCount - numMrDrew - numUndercover;

        let breakdown = `${numCivils} ${numCivils === 1 ? translations.roleCivil : translations.roleCivils}`;
        if (hasUndercover) {
            breakdown += `, 1 ${translations.roleUndercover}`;
        }
        breakdown += `, 1 ${translations.roleMrDrew}`;

        roleBreakdown.textContent = breakdown;
    }

    // Initialize the game
    function initGame() {
        gameState.playerCount = parseInt(playerCountInput.value) || 4;
        const selectedMode = modeSelect ? modeSelect.value : 'simple';

        // Ensure minimum 3 players
        gameState.playerCount = 3;
        playerCountInput.value = 3;
    }

    // Collect player names
    gameState.players = [];
    const lang = getUserLanguage();
    const defaultNamePrefix = lang === 'it' ? 'Giocatore' : 'Player';

    for (let i = 1; i <= gameState.playerCount; i++) {
        const input = document.getElementById(`player-${i}`);
        let name = input ? input.value.trim() : '';
        if (!name) {
            name = `${defaultNamePrefix} ${i}`;
        }
        gameState.players.push(name);
    }

    // Reset game state
    gameState.currentPlayer = 1;

    // Determine if undercover based on mode selection (requires at least 4 players)
    gameState.hasUndercover = selectedMode === 'undercover' && gameState.playerCount >= 4;

    // Randomly select Mr. Drew
    gameState.mrdrewIndex = Math.floor(Math.random() * gameState.playerCount);

    // Randomly select Undercover (if applicable, must be different from Mr. Drew)
    if (gameState.hasUndercover) {
        do {
            gameState.undercoverIndex = Math.floor(Math.random() * gameState.playerCount);
        } while (gameState.undercoverIndex === gameState.mrdrewIndex);
    } else {
        gameState.undercoverIndex = -1;
    }

    // Select a random word pair
    const randomPairIndex = Math.floor(Math.random() * gameState.allWordPairs.length);
    const selectedPair = gameState.allWordPairs[randomPairIndex];
    gameState.civilWord = selectedPair.civilWord;
    gameState.undercoverWord = selectedPair.undercoverWord;
    gameState.theme = selectedPair.theme || '';

    // Select random starting player
    gameState.startingPlayer = Math.floor(Math.random() * gameState.playerCount) + 1;

    console.log(`Game started with ${gameState.playerCount} players`);
    console.log(`Mr. Drew is player: ${gameState.mrdrewIndex + 1}`);
    if (gameState.hasUndercover) {
        console.log(`Undercover is player: ${gameState.undercoverIndex + 1}`);
    }
    console.log(`Civil word: ${gameState.civilWord}`);
    console.log(`Undercover word: ${gameState.undercoverWord}`);
    console.log(`Theme: ${gameState.theme}`);
    console.log(`Starting player: ${gameState.startingPlayer}`);

    // Update UI for first player
    updatePlayerTurnUI();

    // Switch screen
    showScreen(playerTurnScreen);
}

    // Update player turn UI
    function updatePlayerTurnUI() {
        const playerIndex = gameState.currentPlayer - 1;
        const playerName = (gameState.players && gameState.players[playerIndex])
            ? gameState.players[playerIndex]
            : gameState.currentPlayer;

        currentPlayerNum.textContent = playerName;
        currentPlayerNumText.textContent = playerName;

        // Hide word container initially
        wordContainer.classList.add('hidden');
        showWordBtn.classList.remove('hidden');
    }

    // Show word for current player
    function showWord() {
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];
        const currentIndex = gameState.currentPlayer - 1;

        let word, roleText, roleClass;

        if (currentIndex === gameState.mrdrewIndex) {
            // This player is Mr. Drew
            word = translations.wordMrDrew;
            roleText = translations.roleMrDrew;
            roleClass = 'mrdrew';
        } else if (currentIndex === gameState.undercoverIndex) {
            // This player is Undercover
            word = gameState.undercoverWord;
            roleText = translations.roleUndercover;
            roleClass = 'undercover';
        } else {
            // This player is a Civil
            word = gameState.civilWord;
            roleText = translations.roleCivil;
            roleClass = 'civil';
        }

        playerWord.textContent = word;
        playerRole.textContent = roleText;
        playerRole.className = 'role-badge ' + roleClass;

        // Show word container
        wordContainer.classList.remove('hidden');
        showWordBtn.classList.add('hidden');
    }

    // Move to next player or playing screen
    function nextPlayerOrPlaying() {
        if (gameState.currentPlayer < gameState.playerCount) {
            // Move to next player
            gameState.currentPlayer++;
            updatePlayerTurnUI();
        } else {
            // All players have seen their word, move to playing screen
            // Update starting player and theme display
            const startingPlayerNum = document.getElementById('starting-player-num');
            const themeDisplay = document.getElementById('theme-display');

            if (startingPlayerNum) {
                // startingPlayer is 1-based index in gameState.startingPlayer, but we need 0-based for array
                // actually gameState.startingPlayer is set as: Math.floor(...) + 1
                const startIdx = gameState.startingPlayer - 1;
                const startName = (gameState.players && gameState.players[startIdx])
                    ? gameState.players[startIdx]
                    : gameState.startingPlayer;
                startingPlayerNum.textContent = startName;
            }
            if (themeDisplay) {
                themeDisplay.textContent = gameState.theme || '???';
            }

            showScreen(playingScreen);
        }
    }

    // Reveal the roles
    function revealRoles() {
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        // Show Mr. Drew
        const mrdrewName = gameState.players[gameState.mrdrewIndex];
        mrdrewNum.textContent = mrdrewName;

        // Show Undercover if applicable
        if (gameState.hasUndercover) {
            undercoverRevealContainer.classList.remove('hidden');
            const undercoverName = gameState.players[gameState.undercoverIndex];
            undercoverNum.textContent = undercoverName;
            undercoverWord.textContent = gameState.undercoverWord;
        } else {
            undercoverRevealContainer.classList.add('hidden');
        }

        // Hide civil word initially (Mr. Drew can try to guess first)
        civilWord.textContent = gameState.civilWord;
        civilWord.classList.add('hidden');
        revealCivilWordBtn.classList.remove('hidden');

        showScreen(revealScreen);
    }

    // Reveal the civil word (after Mr. Drew tries to guess)
    function revealCivilWord() {
        civilWord.classList.remove('hidden');
        revealCivilWordBtn.classList.add('hidden');
    }

    // Helper to show a specific screen and hide others
    function showScreen(screenToShow) {
        // Hide all screens
        setupScreen.classList.remove('active');
        playerTurnScreen.classList.remove('active');
        playingScreen.classList.remove('active');
        revealScreen.classList.remove('active');

        // Show requested screen
        screenToShow.classList.add('active');
    }

    // Event Listeners
    startGameBtn.addEventListener('click', initGame);

showWordBtn.addEventListener('click', showWord);

hideWordBtn.addEventListener('click', nextPlayerOrPlaying);

revealRolesBtn.addEventListener('click', revealRoles);

revealCivilWordBtn.addEventListener('click', revealCivilWord);

playAgainBtn.addEventListener('click', () => {
    showScreen(setupScreen);
});

// Generate player name inputs
function generatePlayerInputs() {
    const count = parseInt(playerCountInput.value);
    const container = document.getElementById('player-names-container');
    if (!container) return;

    container.innerHTML = '';
    const lang = getUserLanguage();
    const placeholderText = lang === 'it' ? 'Giocatore' : 'Player';

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        // Reuse form-group style but make it a bit more compact if needed
        div.className = 'form-group player-input-group';
        div.style.marginBottom = '10px';

        div.innerHTML = `
                <input type="text" id="player-${i}" placeholder="${placeholderText} ${i}" maxlength="20" aria-label="${placeholderText} ${i}">
            `;
        container.appendChild(div);
    }
}

// Update role breakdown when player count or mode changes
playerCountInput.addEventListener('change', () => {
    updateRoleBreakdown();
    generatePlayerInputs();
});

if (modeSelect) {
    modeSelect.addEventListener('change', updateRoleBreakdown);
}

// Initial load
loadWordPairs();
updateRoleBreakdown();
generatePlayerInputs();
});

