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

    // --- Tournament mode integration (read-only) ---
    const __isTournament = new URLSearchParams(location.search).get('mode') === 'tournament';
    let __tPlayers = [];
    if (__isTournament) { try { __tPlayers = (JSON.parse(localStorage.getItem('tournamentState')) || {}).players || []; } catch (e) {} }
    const __tNames = __tPlayers.map(p => p.name);   // array of strings
    const __tCount = __tNames.length;

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
        hasImpostor: true,
        playerNames: []
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

    // Helper function to select a unique phrase pair index using localStorage
    function selectUniquePhrasePairIndex() {
        const STORAGE_KEY = 'impostor_used_phrases';
        let usedIndices = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        // Filter out indices that are out of bounds (in case file changed)
        usedIndices = usedIndices.filter(idx => idx < gameState.allPhrasePairs.length);

        // Find available indices
        const allIndices = Array.from({ length: gameState.allPhrasePairs.length }, (_, i) => i);
        const availableIndices = allIndices.filter(idx => !usedIndices.includes(idx));

        // If no prompts are available (all used), reset the history
        if (availableIndices.length === 0) {
            console.log("All prompts used! Resetting history.");
            usedIndices = [];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usedIndices));
            // All indices are available again
            return Math.floor(Math.random() * gameState.allPhrasePairs.length);
        }

        // Pick a random index from available ones
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedOriginalIndex = availableIndices[randomIndex];

        // Add to used list and save
        usedIndices.push(selectedOriginalIndex);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usedIndices));

        console.log(`Selected prompt index: ${selectedOriginalIndex}. Used ${usedIndices.length}/${gameState.allPhrasePairs.length}`);

        return selectedOriginalIndex;
    }

    // Initialize the game
    function initGame() {
        // Set player count from input
        gameState.playerCount = parseInt(playerCountInput.value) || 4;

        if (__isTournament && __tCount > 0) {
            // Tournament mode: count and names come from the tournament roster
            gameState.playerCount = __tCount;
        }

        // Ensure minimum 3 players
        if (gameState.playerCount < 3) {
            gameState.playerCount = 3;
            playerCountInput.value = 3;
        }

        // Capture player names
        if (__isTournament && __tCount > 0) {
            gameState.playerNames = __tNames.slice();
        } else {
            const nameInputs = document.querySelectorAll('#player-names-container input');
            gameState.playerNames = Array.from(nameInputs).map(input => input.value.trim());
        }

        // Set impostor count from input
        const maxImpostors = Math.floor(gameState.playerCount / 2); // Define maxImpostors locally

        if (impostorCountInput.value === 'random') {
            // Random mode logic:
            // 5% - 0 impostors
            // 5% - All impostors
            // 90% - Random number of impostors between 1 and approx 1/3 of players (min 1, max varies)

            const rand = Math.random() * 100;
            if (rand < 5) {
                // 5% chance: No impostors
                gameState.impostorCount = 0;
                gameState.hasImpostor = false;
                console.log("Random mode: 0 impostors selected");
            } else if (rand < 10) {
                // 5% chance: All impostors
                gameState.impostorCount = gameState.playerCount;
                gameState.hasImpostor = true;
                console.log("Random mode: ALL impostors selected");
            } else {
                // 90% chance: Normal range of impostors
                // We want to allow more impostors for larger groups
                // Scale: Random between 1 and Max(2, floor(playerCount/3))
                // Examples: 
                // 4-5 players -> 1-1 (Max 1) -> Actually let's ensure at least 2 is possible if players >= 6?
                // Let's us a simple scalable max:
                const dynamicMax = Math.max(1, Math.floor(gameState.playerCount / 3));
                // But specifically for small groups (4-5), we usually want 1. 
                // For 6-8, maybe 1 or 2.
                // For 9-12, maybe 1, 2, 3, or 4?

                // Let's use a slightly more generous max for "random fun":
                // Max random impostors = floor(playerCount / 2.5)
                // 4 players -> max 1
                // 5 players -> max 2
                // 6 players -> max 2
                // 9 players -> max 3
                // 12 players -> max 4

                const randomMax = Math.max(1, Math.floor(gameState.playerCount / 2.5));
                gameState.impostorCount = Math.floor(Math.random() * randomMax) + 1;

                // Final safety check against hard limit
                gameState.impostorCount = Math.min(gameState.impostorCount, maxImpostors);

                gameState.hasImpostor = true;
                console.log(`Random mode: ${gameState.impostorCount} impostors selected (Max possible was ${randomMax})`);
            }
        } else {
            gameState.impostorCount = parseInt(impostorCountInput.value) || 1;

            // Ensure impostor count is valid (min 1, max half of players rounded down)
            if (gameState.impostorCount < 1) {
                gameState.impostorCount = 1;
                impostorCountInput.value = 1;
            } else if (gameState.impostorCount > maxImpostors) {
                gameState.impostorCount = maxImpostors;
                impostorCountInput.value = maxImpostors;
            }
            // Determine if this game will have impostors (standard 1/50 chance of no impostor)
            gameState.hasImpostor = Math.random() > 0.05; // 95% chance to have impostors
        }

        selectedMode = modeSelect ? modeSelect.value : 'classic';
        reverseAnswers = [];

        // Reset game state
        gameState.currentPlayer = 1;
        gameState.prompts = [];
        gameState.impostorIndices = [];

        // If it's NOT random mode, apply the standard small chance of no impostor
        // If it WAS random mode, hasImpostor is already set correctly
        if (impostorCountInput.value !== 'random') {
            gameState.hasImpostor = Math.random() > 0.05; // 95% chance to have impostors
        }

        if (selectedMode === 'reverse') {
            // Only use group prompt, no impostors
            gameState.impostorCount = 0;
            gameState.impostorIndices = [];
            gameState.hasImpostor = false;
            // Select a group prompt
            const randomPairIndex = selectUniquePhrasePairIndex();
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
                const randomPairIndex = selectUniquePhrasePairIndex();
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
                const randomPairIndex = selectUniquePhrasePairIndex();
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
        const currentPlayerName = gameState.playerNames[gameState.currentPlayer - 1]; // 0-indexed

        // Update main text
        const lang = getUserLanguage();
        const translations = gameTranslations[lang] || gameTranslations['en'];

        // If we have a custom name, use it. Otherwise fall back to "Player X"
        // But since we want to say "Turno di Davide" instead of "Turno del Giocatore 1",
        // we might need to adjust how we display it.
        // The safest way with current translations is:

        if (currentPlayerName && currentPlayerName !== translations.player + ' ' + gameState.currentPlayer) {
            // "Dave's Turn" or "Turno di Dave"
            if (lang === 'it') {
                document.querySelector('#player-turn-screen h2').innerHTML = `Turno di <span id="current-player-num">${currentPlayerName}</span>`;
            } else {
                document.querySelector('#player-turn-screen h2').innerHTML = `<span id="current-player-num">${currentPlayerName}</span>'s Turn`;
            }

            // Update pass phone text
            if (lang === 'it') {
                document.querySelector('#player-turn-screen p').innerHTML = `Passa il telefono a <span id="current-player-num-text">${currentPlayerName}</span>`;
            } else {
                document.querySelector('#player-turn-screen p').innerHTML = `Pass the phone to <span id="current-player-num-text">${currentPlayerName}</span>`;
            }
        } else {
            // Revert strict structure if needed or just use number


            // We need to reset the innerHTML if we messed it up above for a previous player? 
            // Actually, let's keep it simple. The HTML has spans.
            // Let's just update the content of the spans IF we can.
            // But "Turno del Giocatore" + "Davide" doesn't sound right ("Turno del Giocatore Davide").
            // User asked: "invece di turno del giocatore 1, dice turno di davide"

            // Rewrite:

            const playerLabel = currentPlayerName || `${translations.player} ${gameState.currentPlayer}`;

            // We need to completely replace the text content of the parent H2 and P
            if (lang === 'it') {
                document.querySelector('#player-turn-screen h2').textContent = `Turno di ${playerLabel}`;
                document.querySelector('#player-turn-screen p').textContent = `Passa il telefono a ${playerLabel}`;
            } else {
                document.querySelector('#player-turn-screen h2').textContent = `${playerLabel}'s Turn`;
                document.querySelector('#player-turn-screen p').textContent = `Pass the phone to ${playerLabel}`;
            }
        }

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
                const impIndex = gameState.impostorIndices[0];
                const impName = gameState.playerNames[impIndex] || (gameState.impostorIndices[0] + 1);

                document.getElementById('impostorIsText').textContent = translations.impostorIsText;

                if (gameState.playerNames[impIndex]) {
                    // Custom name
                    impostorRevealElement.innerHTML = `<span id="impostor-num">${impName}</span>!`;
                } else {
                    // Default
                    impostorRevealElement.innerHTML = `${translations.playerText} <span id="impostor-num">${impName}</span>!`;
                }
            } else {
                // Multiple impostors
                document.getElementById('impostorIsText').textContent =
                    lang === 'it' ? "Gli Impostori sono..." : "The Impostors are...";

                const impostorNames = gameState.impostorIndices.map(idx => {
                    return `<span class="impostor-num">${gameState.playerNames[idx] || (idx + 1)}</span>`;
                }).join(', ');

                if (gameState.impostorIndices.every(idx => gameState.playerNames[idx])) {
                    // All have custom names
                    impostorRevealElement.innerHTML = `${impostorNames}!`;
                } else {
                    impostorRevealElement.innerHTML =
                        lang === 'it' ? `I giocatori ${impostorNames}!` : `Players ${impostorNames}!`;
                }
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
        const authorName = gameState.playerNames[authorIndex] || (authorIndex + 1);

        if (gameState.playerNames[authorIndex]) {
            reverseAnswerAuthor.textContent = authorName;
        } else {
            reverseAnswerAuthor.textContent = translations.reverseAuthorText.replace('{n}', authorName);
        }
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
        // Save the current selection if possible
        const currentImpostorCount = impostorCountInput.value;

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
            impostorCountInput.appendChild(option);
        }

        // Add Random Option
        const randomOption = document.createElement('option');
        randomOption.value = 'random';
        randomOption.textContent = translations.random;
        // Maintain selection if it was random
        if (currentImpostorCount === 'random' || impostorCountInput.dataset.lastValue === 'random') {
            randomOption.selected = true;
        }
        impostorCountInput.appendChild(randomOption);

        // If no option was selected, select the first one
        if (impostorCountInput.selectedIndex === -1 && impostorCountInput.options.length > 0) {
            impostorCountInput.selectedIndex = 0;
        }
    });

    // Player Names Input Logic
    const playerNamesContainer = document.getElementById('player-names-container');

    function updatePlayerNameInputs() {
        // Tournament mode: names come from the tournament roster, so we don't
        // render the per-player name inputs (the user must not re-enter them).
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
            input.className = 'form-control'; // Use a class if defined, or just style directly
            // Reuse existing value if available
            if (i < currentValues.length) {
                input.value = currentValues[i];
            }

            // Placeholder
            let placeholder = translations.playerNamePlaceholder || `Player ${i + 1}`;
            placeholder = placeholder.replace('{n}', i + 1);
            input.placeholder = placeholder;

            // Basic styling is now handled in CSS
            // input.style.padding = '10px';
            // input.style.borderRadius = '8px';
            // input.style.border = '1px solid #3d3d3d';
            // input.style.backgroundColor = '#2d2d2d';
            // input.style.color = '#e1e1e1';

            playerNamesContainer.appendChild(input);
        }
    }

    // Add event listener for player count change to update name inputs
    playerCountInput.addEventListener('change', updatePlayerNameInputs);
    // Also call it initially


    // Save names before starting
    const nameInputs = playerNamesContainer.querySelectorAll('input');
    gameState.playerNames = Array.from(nameInputs).map(input => input.value.trim()); // Store empty string if empty

    // Call original init (but we can't easily overwrite the function reference inside the module scope if it was defined as function declaration? 
    // Actually function declarations are hoisted but reassigning them works if they are variables. 
    // But here 'initGame' is function declaration. 
    // Better to just Rename the old initGame to 'startGameLogic' or copy the logic.

    // Since I can't easily wrap it without changing the original function definition which is huge...
    // I will just rely on the fact that I'm editing the file and I should have edited initGame logic directly.
    // Wait, I can just edit initGame in the ReplacementChunks above!
    // But I missed it in the previous chunk planning.
    // I'll add the logic to capture names inside the initGame function content itself in a proper chunk.

    // Tournament mode: lock the player count to the tournament roster so the
    // impostor-count options below are built from the correct number of players,
    // and the user can't re-choose how many players there are.
    if (__isTournament && __tCount > 0) {
        let optionExists = Array.from(playerCountInput.options).some(o => parseInt(o.value) === __tCount);
        if (!optionExists) {
            const opt = document.createElement('option');
            opt.value = String(__tCount);
            opt.textContent = String(__tCount);
            playerCountInput.appendChild(opt);
        }
        playerCountInput.value = String(__tCount);
        // Prevent changing player count; names/count are fixed by the tournament.
        playerCountInput.disabled = true;
    }

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

    // Add Random Option
    const randomOption = document.createElement('option');
    randomOption.value = 'random';
    randomOption.textContent = translations.random;
    impostorCountInput.appendChild(randomOption);

    // Initialize player name inputs
    updatePlayerNameInputs();
}); 