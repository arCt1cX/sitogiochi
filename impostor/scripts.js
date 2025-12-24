let phrases = [];
let players = [];
let impostors = [];
let normalPlayers = [];
let currentPlayerIndex = 0;
let sharedPrompt = '';
let impostorPrompt = '';
// Track previous impostors across games to make selection more balanced
let previousImpostors = [];

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const playerTurnScreen = document.getElementById('player-turn-screen');
    const writingScreen = document.getElementById('writing-screen');
    const discussionScreen = document.getElementById('discussion-screen');
    const revealScreen = document.getElementById('reveal-screen');

    const playerCountInput = document.getElementById('player-count');
    const impostorCountInput = document.getElementById('impostor-count');
    const startGameBtn = document.getElementById('start-game');

    const currentPlayerNum = document.getElementById('current-player-num');
    const currentPlayerNumText = document.getElementById('current-player-num-text');
    const showPromptBtn = document.getElementById('show-prompt');
    const promptContainer = document.getElementById('prompt-container');
    const playerPrompt = document.getElementById('player-prompt');
    const hidePromptBtn = document.getElementById('hide-prompt');

    const showGroupPromptBtn = document.getElementById('show-group-prompt');
    const sharedPromptElement = document.getElementById('shared-prompt');
    const revealImpostorBtn = document.getElementById('reveal-impostor');

    const impostorNum = document.getElementById('impostor-num');
    const impostorPromptElement = document.getElementById('impostor-prompt');
    const playAgainBtn = document.getElementById('play-again');

    const modeSelect = document.getElementById('mode-select');
    const reverseAnswerContainer = document.getElementById('reverse-answer-container');
    const reverseAnswerInput = document.getElementById('reverse-answer-input');
    const submitReverseAnswerBtn = document.getElementById('submit-reverse-answer');
    const reverseRevealScreen = document.getElementById('reverse-reveal-screen');
    const reverseAnonymousAnswer = document.getElementById('reverse-anonymous-answer');
    const playAgainReverseBtn = document.getElementById('play-again-reverse');
    const reverseAnswerAuthor = document.getElementById('reverse-answer-author');
    const revealAuthorBtn = document.getElementById('reveal-author-btn');

    // Apply game translations
    if (typeof applyGameTranslations === 'function') {
        applyGameTranslations();
    }

    // Game State
    let gameState = {
        playerCount: 4,
        impostorCount: 1,
        currentPlayer: 1,
        impostorIndices: [],
        prompts: [],
        groupPrompt: '',
        impostorPrompt: '',
        allPhrasePairs: [],
        hasImpostor: true // New property to track if there's an impostor
    };

    let reverseAnswers = [];
    let selectedMode = 'classic';

    // Load prompts from the text file
    async function loadPrompts() {
        try {
            // Get correct language file based on user preference
            const lang = getUserLanguage();
            const translations = gameTranslations[lang] || gameTranslations['en'];
            const phrasesFile = translations.phrasesFile;

            const response = await fetch(phrasesFile);
            const text = await response.text();

            // Split by new line and filter out empty lines
            const lines = text.split('\n').filter(line => line.trim().length > 0);

            // Parse each line into a phrase pair
            gameState.allPhrasePairs = lines.map(line => {
                const [groupPhrase, impostorPhrase] = line.split('|').map(phrase => phrase.trim());
                return { groupPhrase, impostorPhrase };
            });

            console.log(`Loaded ${gameState.allPhrasePairs.length} phrase pairs`);
        } catch (error) {
            console.error('Error loading prompts:', error);
            const lang = getUserLanguage();
            const errorMsg = lang === 'it'
                ? 'Errore nel caricamento dei prompt. Ricarica la pagina per riprovare.'
                : 'Error loading prompts. Reload the page to try again.';
            alert(errorMsg);
        }
    }

    // Initialize the game
    function initGame() {
        // Set player count from input
        gameState.playerCount = parseInt(playerCountInput.value) || 4;

        // Ensure minimum 3 players
        if (gameState.playerCount < 3) {
            gameState.playerCount = 3;
            playerCountInput.value = 3;
        }

        // Set impostor count from input
        gameState.impostorCount = parseInt(impostorCountInput.value) || 1;

        // Ensure impostor count is valid (min 1, max half of players rounded down)
        const maxImpostors = Math.floor(gameState.playerCount / 2);
        if (gameState.impostorCount < 1) {
            gameState.impostorCount = 1;
            impostorCountInput.value = 1;
        } else if (gameState.impostorCount > maxImpostors) {
            gameState.impostorCount = maxImpostors;
            impostorCountInput.value = maxImpostors;
        }

        selectedMode = modeSelect ? modeSelect.value : 'classic';
        reverseAnswers = [];

        // Reset game state
        gameState.currentPlayer = 1;
        gameState.prompts = [];
        gameState.impostorIndices = [];

        // Determine if this game will have impostors (1/50 chance of no impostor)
        gameState.hasImpostor = Math.random() > 0.05; // 95% chance to have impostors

        if (selectedMode === 'reverse') {
            // Only use group prompt, no impostors
            gameState.impostorCount = 0;
            gameState.impostorIndices = [];
            gameState.hasImpostor = false;
            // Select a group prompt
            const randomPairIndex = Math.floor(Math.random() * gameState.allPhrasePairs.length);
            const selectedPair = gameState.allPhrasePairs[randomPairIndex];
            gameState.groupPrompt = selectedPair.groupPhrase;
            gameState.currentPlayer = 1;
            updatePlayerTurnUI();
            showScreen(playerTurnScreen);
        } else {
            if (gameState.hasImpostor) {
                // Use the weighted random selection for impostors instead of completely random
                gameState.impostorIndices = selectWeightedRandomImpostors(
                    gameState.playerCount,
                    gameState.impostorCount,
                    previousImpostors
                );

                // Randomly select a phrase pair for this round
                const randomPairIndex = Math.floor(Math.random() * gameState.allPhrasePairs.length);
                const selectedPair = gameState.allPhrasePairs[randomPairIndex];

                // Always use first phrase for group, second phrase for impostor
                gameState.groupPrompt = selectedPair.groupPhrase;
                gameState.impostorPrompt = selectedPair.impostorPhrase;

                console.log(`Game started with ${gameState.playerCount} players, ${gameState.impostorCount} impostors`);
                console.log(`Impostors are players: ${gameState.impostorIndices.map(idx => idx + 1).join(', ')}`);
                console.log(`Group prompt: ${gameState.groupPrompt}`);
                console.log(`Impostor prompt: ${gameState.impostorPrompt}`);

                // Save the current impostors to the history
                // Add the current impostors to the beginning of the history array
                previousImpostors = [...gameState.impostorIndices, ...previousImpostors];
                // Trim the history to keep only the last 3 games' worth of impostors
                const maxHistoryLength = gameState.playerCount * 3;
                if (previousImpostors.length > maxHistoryLength) {
                    previousImpostors = previousImpostors.slice(0, maxHistoryLength);
                }
                console.log("Updated impostor history:", previousImpostors);
            } else {
                // No impostor game!
                gameState.impostorIndices = [];

                // Select just a group prompt
                const randomPairIndex = Math.floor(Math.random() * gameState.allPhrasePairs.length);
                const selectedPair = gameState.allPhrasePairs[randomPairIndex];

                // Always use the first (left) phrase for the group
                gameState.groupPrompt = selectedPair.groupPhrase;
                gameState.impostorPrompt = ""; // Not used in this game

                console.log("Special game: No impostor!");
                console.log(`Group prompt for everyone: ${gameState.groupPrompt}`);
            }

            // Update UI for first player
            updatePlayerTurnUI();

            // Switch screen
            showScreen(playerTurnScreen);
        }
    }

    // Function to select impostors with weighted randomization
    // Players who were recently impostors have a lower chance of being selected again
    function selectWeightedRandomImpostors(playerCount, impostorCount, previousImpostorsList) {
        // Create an array of all player indices
        const allPlayerIndices = Array.from({ length: playerCount }, (_, i) => i);

        // Create weights for each player - players who were recently impostors get lower weights
        const weights = allPlayerIndices.map(playerIndex => {
            // Count how many times this player was an impostor in recent games
            // More recent games have a stronger effect
            let weight = 1.0; // Base weight

            // Check if this player was an impostor recently
            const recentOccurrences = previousImpostorsList.filter(idx => idx === playerIndex);

            if (recentOccurrences.length > 0) {
                // Apply a penalty based on how recently and how often they were an impostor
                for (let i = 0; i < recentOccurrences.length; i++) {
                    // The more recent, the higher the penalty
                    const position = previousImpostorsList.indexOf(playerIndex, i);
                    if (position !== -1) {
                        // Weight reduction formula: more penalty for more recent selections
                        // First position: ~50% reduction, Second position: ~25% reduction, Third position: ~10% reduction
                        const reduction = position === 0 ? 0.5 :
                            position === 1 ? 0.25 :
                                position === 2 ? 0.1 : 0.05;
                        weight -= reduction;
                    }
                }
                // Ensure weight doesn't go below 0.1 (still a small chance to be selected)
                weight = Math.max(0.1, weight);
            }

            return weight;
        });

        // Select impostors based on weights
        const selectedImpostors = [];
        let remainingIndices = [...allPlayerIndices];
        let remainingWeights = [...weights];

        for (let i = 0; i < impostorCount; i++) {
            if (remainingIndices.length === 0) break;

            // Calculate the total weight
            const totalWeight = remainingWeights.reduce((sum, weight) => sum + weight, 0);

            // Generate a random value between 0 and the total weight
            let randomValue = Math.random() * totalWeight;

            // Select a player based on the weights
            let selectedIndex = -1;
            for (let j = 0; j < remainingIndices.length; j++) {
                randomValue -= remainingWeights[j];
                if (randomValue <= 0) {
                    selectedIndex = j;
                    break;
                }
            }

            // If somehow we didn't select anyone (shouldn't happen), pick the first one
            if (selectedIndex === -1) selectedIndex = 0;

            // Add the selected player to the impostor list
            selectedImpostors.push(remainingIndices[selectedIndex]);

            // Remove the selected player from the remaining options
            remainingIndices.splice(selectedIndex, 1);
            remainingWeights.splice(selectedIndex, 1);
        }

        return selectedImpostors;
    }

    // Update player turn UI
    function updatePlayerTurnUI() {
        currentPlayerNum.textContent = gameState.currentPlayer;
        currentPlayerNumText.textContent = gameState.currentPlayer;

        // Hide prompt container initially
        promptContainer.classList.add('hidden');
        showPromptBtn.classList.remove('hidden');
        // Reset answer input for reverse mode
        if (selectedMode === 'reverse') {
            reverseAnswerInput.value = '';
            reverseAnswerContainer.classList.add('hidden');
        }
    }

    // Show prompt for current player
    function showPrompt() {
        if (selectedMode === 'reverse') {
            const lang = getUserLanguage();
            const translations = gameTranslations[lang] || gameTranslations['en'];
            document.getElementById('typeYourAnswer').textContent = translations.typeYourAnswer;
            submitReverseAnswerBtn.textContent = translations.submitAnswer;
            playerPrompt.textContent = gameState.groupPrompt;
            promptContainer.classList.remove('hidden');
            showPromptBtn.classList.add('hidden');
            reverseAnswerContainer.classList.remove('hidden');
            hidePromptBtn.classList.add('hidden');
        } else {
            // In a no-impostor game, everyone gets the same prompt
            // Otherwise, check if current player is an impostor
            const isImpostor = gameState.hasImpostor && gameState.impostorIndices.includes(gameState.currentPlayer - 1);

            // Set the appropriate prompt
            playerPrompt.textContent = isImpostor ? gameState.impostorPrompt : gameState.groupPrompt;

            // Show prompt container
            promptContainer.classList.remove('hidden');
            showPromptBtn.classList.add('hidden');
            hidePromptBtn.classList.remove('hidden');
        }
    }

    // Move to next player or writing screen
    function nextPlayerOrWriting() {
        if (selectedMode === 'reverse') {
            // Should not be called in reverse mode, handled by submitReverseAnswerBtn
            return;
        }
        if (gameState.currentPlayer < gameState.playerCount) {
            // Move to next player
            gameState.currentPlayer++;
            updatePlayerTurnUI();
        } else {
            // All players have seen their prompts, move to writing screen
            showScreen(writingScreen);
        }
    }

    // Show the group prompt and move to discussion
    function showGroupPrompt() {
        sharedPromptElement.textContent = gameState.groupPrompt;
        showScreen(discussionScreen);
    }

    // Reveal the impostor
    function revealImpostor() {
        const impostorRevealElement = document.querySelector('.impostor-reveal');
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        // Remove any previous classes that might be applied
        impostorRevealElement.classList.remove('no-impostor-surprise');

        // Update the reveal screen based on whether there was an impostor
        if (gameState.hasImpostor) {
            // Normal game with impostors
            if (gameState.impostorIndices.length === 1) {
                // Single impostor
                document.getElementById('impostorIsText').textContent = translations.impostorIsText;
                impostorRevealElement.innerHTML = `${translations.playerText} <span id="impostor-num">${gameState.impostorIndices[0] + 1}</span>!`;
            } else {
                // Multiple impostors
                document.getElementById('impostorIsText').textContent =
                    lang === 'it' ? "Gli Impostori sono..." : "The Impostors are...";
                const impostorNumbers = gameState.impostorIndices.map(idx => `<span class="impostor-num">${idx + 1}</span>`).join(', ');
                impostorRevealElement.innerHTML =
                    lang === 'it' ? `I giocatori ${impostorNumbers}!` : `Players ${impostorNumbers}!`;
            }

            document.getElementById('theirPromptWasText').textContent =
                gameState.impostorIndices.length > 1
                    ? (lang === 'it' ? "Il loro prompt era:" : "Their prompt was:")
                    : translations.theirPromptWasText;
            impostorPromptElement.textContent = gameState.impostorPrompt;
        } else {
            // Special game with no impostor!
            document.getElementById('impostorIsText').textContent =
                lang === 'it' ? "Sorpresa!" : "Surprise!";
            impostorRevealElement.innerHTML =
                lang === 'it'
                    ? "Ahah! Nessuno era l'impostore! <span class='emoji-surprise'>😜</span>"
                    : "Haha! No one was the impostor! <span class='emoji-surprise'>😜</span>";
            impostorRevealElement.classList.add('no-impostor-surprise');
            document.getElementById('theirPromptWasText').textContent =
                lang === 'it' ? "Eravate tutti dalla stessa parte:" : "You were all on the same side:";
            impostorPromptElement.textContent = gameState.groupPrompt;
        }

        showScreen(revealScreen);
    }

    function showReverseAnonymousAnswer() {
        // Pick a random answer
        const answers = reverseAnswers.filter(a => a && a.length > 0);
        if (answers.length === 0) return;
        const randomIndex = Math.floor(Math.random() * answers.length);
        reverseAnonymousAnswer.textContent = answers[randomIndex];
        // Find the author (player index + 1)
        let authorIndex = reverseAnswers.findIndex(a => a === answers[randomIndex]);
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];
        document.getElementById('revealAnonymousAnswer').textContent = translations.revealAnonymousAnswer;
        document.getElementById('anonymousAnswerIs').textContent = translations.anonymousAnswerIs;
        document.getElementById('guessWhoText').textContent = translations.guessWhoText;
        playAgainReverseBtn.textContent = translations.playAgainText;
        reverseAnswerAuthor.textContent = translations.reverseAuthorText.replace('{n}', authorIndex + 1);
        reverseAnswerAuthor.style.display = 'none';
        if (revealAuthorBtn) {
            revealAuthorBtn.textContent = translations.revealAuthorBtn;
            revealAuthorBtn.style.display = '';
        }
        showScreen(reverseRevealScreen);
    }

    // Helper to show a specific screen and hide others
    function showScreen(screenToShow) {
        // Hide all screens
        setupScreen.classList.remove('active');
        playerTurnScreen.classList.remove('active');
        writingScreen.classList.remove('active');
        discussionScreen.classList.remove('active');
        revealScreen.classList.remove('active');

        // Show requested screen
        screenToShow.classList.add('active');
    }

    // Event Listeners
    startGameBtn.addEventListener('click', initGame);

    showPromptBtn.addEventListener('click', showPrompt);

    hidePromptBtn.addEventListener('click', nextPlayerOrWriting);

    showGroupPromptBtn.addEventListener('click', showGroupPrompt);

    revealImpostorBtn.addEventListener('click', revealImpostor);

    playAgainBtn.addEventListener('click', () => {
        showScreen(setupScreen);
    });

    if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
            selectedMode = e.target.value;
            // Hide impostor count if reverse mode
            if (selectedMode === 'reverse') {
                document.getElementById('impostor-count').parentElement.style.display = 'none';
            } else {
                document.getElementById('impostor-count').parentElement.style.display = '';
            }
        });
        selectedMode = modeSelect.value;
    }

    if (submitReverseAnswerBtn) {
        submitReverseAnswerBtn.addEventListener('click', () => {
            const answer = reverseAnswerInput.value.trim();
            if (answer.length === 0) return;
            reverseAnswers[gameState.currentPlayer - 1] = answer;
            reverseAnswerInput.value = '';
            reverseAnswerContainer.classList.add('hidden');
            // Move to next player or reveal
            if (gameState.currentPlayer < gameState.playerCount) {
                gameState.currentPlayer++;
                updatePlayerTurnUI();
                showPromptBtn.classList.remove('hidden');
            } else {
                // All players have answered, show anonymous answer
                showReverseAnonymousAnswer();
            }
        });
    }

    if (playAgainReverseBtn) {
        playAgainReverseBtn.addEventListener('click', () => {
            // Hide reverse reveal screen and its elements
            reverseRevealScreen.classList.remove('active');
            reverseAnswerAuthor.style.display = 'none';
            if (revealAuthorBtn) revealAuthorBtn.style.display = 'none';
            showScreen(setupScreen);
        });
    }

    if (revealAuthorBtn) {
        revealAuthorBtn.addEventListener('click', () => {
            reverseAnswerAuthor.style.display = '';
            revealAuthorBtn.style.display = 'none';
        });
    }

    // Add impostor count validation
    playerCountInput.addEventListener('change', () => {
        const playerCount = parseInt(playerCountInput.value);
        const maxImpostors = Math.floor(playerCount / 2);

        // Save the current selection if possible
        const currentImpostorCount = parseInt(impostorCountInput.value);

        // Get translations for the current language
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        // Clear current options
        impostorCountInput.innerHTML = '';

        // Add new options based on the player count
        for (let i = 1; i <= maxImpostors; i++) {
            const option = document.createElement('option');
            option.value = i;
            const text = i === 1 ? translations.impostor : translations.impostors;
            option.textContent = `${i} ${text}`;

            // Set as selected if it matches the previous selection
            if (i === currentImpostorCount && currentImpostorCount <= maxImpostors) {
                option.selected = true;
            }

            impostorCountInput.appendChild(option);
        }

        // If no option was selected, select the first one
        if (impostorCountInput.selectedIndex === -1 && impostorCountInput.options.length > 0) {
            impostorCountInput.selectedIndex = 0;
        }
    });

    // Initial load
    loadPrompts();

    // Initialize impostor count options based on default player count
    const playerCount = parseInt(playerCountInput.value);
    const maxImpostors = Math.floor(playerCount / 2);

    // Get translations for the current language
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];

    // Clear current options
    impostorCountInput.innerHTML = '';

    // Add options based on the player count
    for (let i = 1; i <= maxImpostors; i++) {
        const option = document.createElement('option');
        option.value = i;
        const text = i === 1 ? translations.impostor : translations.impostors;
        option.textContent = `${i} ${text}`;

        // Set first option as selected
        if (i === 1) {
            option.selected = true;
        }

        impostorCountInput.appendChild(option);
    }
}); 