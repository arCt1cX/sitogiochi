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

    // Tournament mode detection (self-contained, read-only)
    const __isTournament = new URLSearchParams(location.search).get('mode') === 'tournament';
    let __tPlayers = [];
    if (__isTournament) { try { __tPlayers = (JSON.parse(localStorage.getItem('tournamentState')) || {}).players || []; } catch (e) {} }
    const __tNames = __tPlayers.map(p => p.name);   // array of strings
    const __tCount = __tNames.length;

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
        startingPlayer: 1,
        allWordPairs: [],
        shuffledPairs: [],
        shuffleIndex: 0,
        playerNames: []
    };

    // Fisher-Yates shuffle
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Get next word pair without repeats
    function getNextWordPair() {
        if (gameState.shuffledPairs.length === 0 || gameState.shuffleIndex >= gameState.shuffledPairs.length) {
            gameState.shuffledPairs = shuffleArray(gameState.allWordPairs);
            gameState.shuffleIndex = 0;
        }
        const pair = gameState.shuffledPairs[gameState.shuffleIndex];
        gameState.shuffleIndex++;
        return pair;
    }

    const playerNamesContainer = document.getElementById('player-names-container');

    function updatePlayerNameInputs() {
        // In tournament mode names come from the roster: don't render name inputs.
        if (__isTournament && __tCount > 0) {
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
        const playerCount = (__isTournament && __tCount > 0)
            ? __tCount
            : (parseInt(playerCountInput.value) || 4);
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
        if (__isTournament && __tCount > 0) {
            // Player count is fixed by the tournament roster.
            gameState.playerCount = __tCount;
        } else {
            gameState.playerCount = parseInt(playerCountInput.value) || 4;

            // Ensure minimum 3 players
            if (gameState.playerCount < 3) {
                gameState.playerCount = 3;
                playerCountInput.value = 3;
            }
        }
        const selectedMode = modeSelect ? modeSelect.value : 'simple';

        // Capture player names
        if (__isTournament && __tCount > 0) {
            // Names come from the tournament roster, not from input fields.
            gameState.playerNames = __tNames.slice();
        } else {
            const nameInputs = playerNamesContainer.querySelectorAll('input');
            gameState.playerNames = Array.from(nameInputs).map(input => input.value.trim());
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

        // Select the next word pair (no repeats until all used)
        const selectedPair = getNextWordPair();
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
        const currentPlayerName = gameState.playerNames[gameState.currentPlayer - 1]; // 0-indexed
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        const turnH2 = document.querySelector('#player-turn-screen h2');
        const passP = document.querySelector('#player-turn-screen p');

        if (currentPlayerName && currentPlayerName !== translations.player + ' ' + gameState.currentPlayer) {
            if (lang === 'it') {
                turnH2.innerHTML = `Turno di <span id="current-player-num">${currentPlayerName}</span>`;
                passP.innerHTML = `Passa il telefono a <span id="current-player-num-text">${currentPlayerName}</span>`;
            } else {
                turnH2.innerHTML = `<span id="current-player-num">${currentPlayerName}</span>'s Turn`;
                passP.innerHTML = `Pass the phone to <span id="current-player-num-text">${currentPlayerName}</span>`;
            }
        } else {
            // Default
            currentPlayerNum.textContent = gameState.currentPlayer;
            currentPlayerNumText.textContent = gameState.currentPlayer;

            // Restore default text structure if needed (though IDs should handle it if structure is preserved)
            // But since we modify innerHTML above, we should restore it fully if falling back to default?
            // Actually, if we just update the spans, it might be fine IF the spans still exist. 
            // BUT we replaced the spans parent content with new HTML.
            // So we must fully reconstruct.

            if (lang === 'it') {
                turnH2.innerHTML = `<span id="playerTurnText">${translations.playerTurnText}</span> <span id="current-player-num">${gameState.currentPlayer}</span>`;
                passP.innerHTML = `<span id="passPhoneText">${translations.passPhoneText}</span> <span id="current-player-num-text">${gameState.currentPlayer}</span>`;
            } else {
                // English structure might differ slightly in original? "Player Turn 1" vs "Turn of Player 1"
                // Original HTML: <h2><span id="playerTurnText">Turno del Giocatore</span> <span id="current-player-num">1</span></h2>
                turnH2.innerHTML = `<span id="playerTurnText">${translations.playerTurnText}</span> <span id="current-player-num">${gameState.currentPlayer}</span>`;
                passP.innerHTML = `<span id="passPhoneText">${translations.passPhoneText}</span> <span id="current-player-num-text">${gameState.currentPlayer}</span>`;
            }

            // Re-acquire references if needed for later, though querySelector gets fresh ones.
        }


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
                const startPlayerName = gameState.playerNames[gameState.startingPlayer - 1] || gameState.startingPlayer;
                startingPlayerNum.textContent = startPlayerName;
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
        const mrdrewName = gameState.playerNames[gameState.mrdrewIndex] || (gameState.mrdrewIndex + 1);
        mrdrewNum.textContent = mrdrewName;

        // Hide "The Player" prefix if custom name exists
        const playerText = document.getElementById('playerText');
        if (gameState.playerNames[gameState.mrdrewIndex]) {
            playerText.style.display = 'none';
        } else {
            playerText.style.display = 'inline';
        }

        // Show Undercover if applicable
        if (gameState.hasUndercover) {
            undercoverRevealContainer.classList.remove('hidden');
            const undercoverName = gameState.playerNames[gameState.undercoverIndex] || (gameState.undercoverIndex + 1);
            undercoverNum.textContent = undercoverName;

            const undercoverPlayerText = document.getElementById('undercoverPlayerText');
            if (gameState.playerNames[gameState.undercoverIndex]) {
                undercoverPlayerText.style.display = 'none';
            } else {
                undercoverPlayerText.style.display = 'inline';
            }

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

    // Update role breakdown when player count or mode changes
    // Update role breakdown when player count or mode changes
    playerCountInput.addEventListener('change', () => {
        updateRoleBreakdown();
        updatePlayerNameInputs();
    });
    if (modeSelect) {
        modeSelect.addEventListener('change', updateRoleBreakdown);
    }

    // Initial load
    loadWordPairs();

    // Tournament mode: pre-fill player count from the roster and skip the
    // redundant player-setup. The user still chooses the game mode
    // (with / without Undercover) and presses Start, so we land them on the
    // setup screen with everything but the mode pre-decided.
    if (__isTournament && __tCount > 0) {
        gameState.playerCount = __tCount;
        gameState.playerNames = __tNames.slice();

        // Reflect the roster count in the select (if it exists as an option),
        // and prevent changing it since the roster is fixed.
        const optionExists = Array.from(playerCountInput.options)
            .some(opt => parseInt(opt.value) === __tCount);
        if (optionExists) {
            playerCountInput.value = String(__tCount);
        }
        playerCountInput.disabled = true;
    }

    updateRoleBreakdown();
    updatePlayerNameInputs();
});

