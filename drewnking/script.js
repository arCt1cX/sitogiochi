// Game state
let gameState = {
    players: [],
    playerSelectionCount: {}, // Track how many times each player has been selected
    totalRounds: 20,
    currentRound: 0,
    phrases: {},
    categorizedPhrases: {}, // New: Store phrases organized by category
    usedPhrases: [], // Track phrases used in CURRENT session
    activeRules: [], // Track active rules with their end round
    ruleEndQueue: [], // Queue of rule endings to show
    customPercentages: false, // Track if custom percentages are enabled
    categoryWeights: {}, // Store custom weights
    aiSelectedCards: [], // Store card IDs selected by AI for challenges
    gameDeck: [] // Pre-generated deck of cards for the current game
};

// Historical phrase tracking (persistent across sessions)
const STORAGE_KEY = 'drewnking_phrase_history';
let phraseHistory = {
    seenPhrases: {}, // uniqueId: count of times seen
    lastReset: Date.now()
};

// AI Challenge Settings (persistent across sessions)
const AI_SETTINGS_KEY = 'drewnking_ai_settings';
let aiSettings = {
    enabled: false,
    apiKey: ''
};

// Load AI settings from localStorage
function loadAISettings() {
    try {
        const stored = localStorage.getItem(AI_SETTINGS_KEY);
        if (stored) {
            aiSettings = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Errore nel caricamento impostazioni AI:', error);
    }
}

// Save AI settings to localStorage
function saveAISettings() {
    try {
        localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
    } catch (error) {
        console.error('Errore nel salvataggio impostazioni AI:', error);
    }
}


// Load phrase history from localStorage
function loadPhraseHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            phraseHistory = JSON.parse(stored);
            // Ensure seenPhrases exists
            if (!phraseHistory.seenPhrases) {
                phraseHistory.seenPhrases = {};
            }
        }
    } catch (error) {
        console.error('Errore nel caricamento dello storico:', error);
    }
}

// Save phrase history to localStorage
function savePhraseHistory() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(phraseHistory));
    } catch (error) {
        console.error('Errore nel salvataggio dello storico:', error);
    }
}

// Mark a phrase as seen
function markPhraseAsSeen(uniqueId) {
    if (!phraseHistory.seenPhrases[uniqueId]) {
        phraseHistory.seenPhrases[uniqueId] = 0;
    }
    phraseHistory.seenPhrases[uniqueId]++;
    savePhraseHistory();
}

// Check if a phrase has been seen
function isPhraseSeen(uniqueId) {
    return !!phraseHistory.seenPhrases[uniqueId];
}

// Reset history for a specific category
function resetCategoryHistory(category) {
    console.log(`🔄 Reset storico per categoria: ${category}`);

    // Get all phrases in this category
    const categoryPhrases = gameState.categorizedPhrases[category] || [];

    // Remove them from seenPhrases
    categoryPhrases.forEach(phrase => {
        delete phraseHistory.seenPhrases[phrase.uniqueId];
    });

    savePhraseHistory();
}

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const playerCountSelect = document.getElementById('player-count');
const playerNamesContainer = document.getElementById('player-names-container');
const roundsCountSelect = document.getElementById('rounds-count');
const startGameBtn = document.getElementById('start-game');
const phraseContainer = document.getElementById('phrase-container');
const phraseText = document.getElementById('phrase-text');
const nextPhraseBtn = document.getElementById('next-phrase');
const currentRoundSpan = document.getElementById('current-round');
const totalRoundsSpan = document.getElementById('total-rounds');
const playAgainBtn = document.getElementById('play-again');
const phraseTypeLabel = document.getElementById('phrase-type-label');
const customPercentagesToggle = document.getElementById('custom-percentages-toggle');
const percentagesControls = document.getElementById('percentages-controls');
const normalPercentageInput = document.getElementById('normal-percentage');
const challengePercentageInput = document.getElementById('challenge-percentage');
const votePercentageInput = document.getElementById('vote-percentage');
const rulePercentageInput = document.getElementById('rule-percentage');
const percentageTotalSpan = document.getElementById('percentage-total');
const percentageWarning = document.getElementById('percentage-warning');
const aiChallengeToggle = document.getElementById('ai-challenge-toggle');
const aiSettingsContainer = document.getElementById('ai-settings');
const aiApiKeyInput = document.getElementById('ai-api-key');


// Load phrases from JSON
async function loadPhrases() {
    try {
        const response = await fetch('phrases.json');
        gameState.phrases = await response.json();

        // Organize phrases by category
        gameState.categorizedPhrases = {};

        for (const [category, data] of Object.entries(gameState.phrases)) {
            gameState.categorizedPhrases[category] = [];

            if (category === 'rule' && data.rules) {
                // Handle rules
                data.rules.forEach((rule, index) => {
                    gameState.categorizedPhrases[category].push({
                        text: rule.start,
                        endText: rule.end,
                        category: category,
                        color: data.color,
                        isRule: true,
                        uniqueId: `rule-${index}`
                    });
                });
            } else if (data.phrases) {
                // Regular phrases
                data.phrases.forEach((phrase, index) => {
                    gameState.categorizedPhrases[category].push({
                        text: phrase,
                        category: category,
                        color: data.color,
                        isRule: false,
                        uniqueId: `${category}-${index}`
                    });
                });
            }
        }

        console.log('Frasi caricate e categorizzate');
    } catch (error) {
        console.error('Errore nel caricamento delle frasi:', error);
        alert('Errore nel caricamento del gioco. Ricarica la pagina.');
    }
}

// Generate player name inputs
function generatePlayerInputs() {
    const count = parseInt(playerCountSelect.value);
    playerNamesContainer.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'player-input';
        div.innerHTML = `
            <div class="form-group">
                <label for="player-${i}">Giocatore ${i}:</label>
                <input type="text" id="player-${i}" placeholder="Nome giocatore ${i}" maxlength="20">
            </div>
        `;
        playerNamesContainer.appendChild(div);
    }
}

// AI Card Selection - Select 2 most insulting vote cards from the GAME DECK
async function selectAIChallengeCards() {
    // Get vote cards present in the CURRENT GAME DECK
    const voteCards = gameState.gameDeck.filter(card => card.category === 'vote');

    if (voteCards.length < 2) {
        console.warn('Not enough vote cards in this game deck for AI selection');
        return;
    }

    // Create numbered list of vote cards
    const cardsList = voteCards.map((card, index) => {
        return `${index + 1}. ${card.text}`;
    }).join('\n');

    const prompt = `
        Sei un giudice in un gioco alcolico chiamato "Drewnking".
        Ecco le carte "Votazione" che usciranno in questa partita:

        ${cardsList}

        Il tuo compito: scegli i 2 NUMERI delle carte più SCORRETTE, INSULTANTI o CATTIVE.
        
        IMPORTANTE: Dai priorità assoluta alle carte che richiedono di votare UNA SOLA PERSONA (es. "Chi è il più...", "Chi ha...").
        Evita se possibile le carte che coinvolgono gruppi o minoranze, a meno che non siano molto divertenti.
        
        Rispondi SOLO con 2 numeri separati da virgola, senza spazi (esempio: "1,3").
        NON aggiungere altro testo.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiSettings.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 20
                }
            })
        });

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text.trim();

        // Parse response
        const numbers = responseText.split(',').map(n => parseInt(n.trim()));

        if (numbers.length === 2 && numbers.every(n => n > 0 && n <= voteCards.length)) {
            // Convert to 0-based indices and get uniqueIds
            const selectedCards = numbers.map(n => voteCards[n - 1].uniqueId);
            gameState.aiSelectedCards = selectedCards;

            console.log('🤖 IA ha selezionato le carte dal deck:', numbers, selectedCards);
        } else {
            console.error('IA response invalid:', responseText);
        }
    } catch (error) {
        console.error('AI Selection Error:', error);
    }
}

// Start game
async function startGame() {
    // Get player names
    const count = parseInt(playerCountSelect.value);
    gameState.players = [];
    gameState.playerSelectionCount = {};

    for (let i = 1; i <= count; i++) {
        const input = document.getElementById(`player-${i}`);
        const name = input.value.trim() || `Giocatore ${i}`;
        gameState.players.push(name);
        gameState.playerSelectionCount[name] = 0; // Initialize counter
    }

    // Get total rounds
    gameState.totalRounds = parseInt(roundsCountSelect.value);
    gameState.currentRound = 0;
    gameState.usedPhrases = []; // Reset current session used phrases
    gameState.aiSelectedCards = []; // Reset AI selection


    // Update UI
    totalRoundsSpan.textContent = gameState.totalRounds;

    // Show game screen
    showScreen('game-screen');

    // Hide rules panel to prevent flash
    const rulesPanel = document.getElementById('rules-panel');
    if (rulesPanel) {
        rulesPanel.classList.remove('active');
    }

    // Generate the deck for this game
    generateGameDeck();

    // If AI is enabled, select challenge cards before starting
    if (aiSettings.enabled && aiSettings.apiKey) {
        const loadingOverlay = document.getElementById('ai-loading-overlay');
        loadingOverlay.style.display = 'flex';

        await selectAIChallengeCards();

        loadingOverlay.style.display = 'none';
    }

    // Show first phrase
    showNextPhrase();
}

// Select a category based on weights
function selectCategory() {
    let weights = {};

    if (gameState.customPercentages) {
        weights = gameState.categoryWeights;
    } else {
        // Use default weights from JSON
        for (const [category, data] of Object.entries(gameState.phrases)) {
            weights[category] = data.weight || 10;
        }
    }

    // Calculate total weight
    let totalWeight = 0;
    for (const weight of Object.values(weights)) {
        totalWeight += weight;
    }

    // Random selection
    let random = Math.random() * totalWeight;

    for (const [category, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) {
            return category;
        }
    }

    // Fallback (should not happen)
    return Object.keys(weights)[0];
}

// Generate the game deck at the start
function generateGameDeck() {
    gameState.gameDeck = [];
    const deckUsedPhrases = []; // Track phrases used in this deck to avoid duplicates

    console.log(`🎴 Generazione deck per ${gameState.totalRounds} round...`);

    for (let i = 0; i < gameState.totalRounds; i++) {
        // 1. Select Category
        let category = selectCategory();

        // Special handling for end of game rules
        const roundsRemaining = gameState.totalRounds - i;
        const minRuleDuration = 2;

        // If we picked 'rule' but not enough rounds left, force pick another category
        if (category === 'rule' && roundsRemaining <= minRuleDuration) {
            const otherCategories = Object.keys(gameState.categorizedPhrases).filter(c => c !== 'rule');
            if (otherCategories.length > 0) {
                category = otherCategories[Math.floor(Math.random() * otherCategories.length)];
            }
        }

        // 2. Pick a phrase for this category
        const phrase = pickPhraseForDeck(category, deckUsedPhrases);

        if (phrase) {
            gameState.gameDeck.push(phrase);
            deckUsedPhrases.push(phrase.uniqueId);
        } else {
            console.error(`Impossibile trovare una frase per la categoria ${category}`);
        }
    }

    console.log('✅ Deck generato:', gameState.gameDeck);
}

// Pick a phrase for the deck (without updating global history yet)
function pickPhraseForDeck(category, deckUsedPhrases) {
    const categoryPhrases = gameState.categorizedPhrases[category];

    // Filter out phrases that are EITHER in global history OR used in current deck
    let availablePhrases = categoryPhrases.filter(phrase =>
        !isPhraseSeen(phrase.uniqueId) && !deckUsedPhrases.includes(phrase.uniqueId)
    );

    // If no unseen phrases, reset history for this category
    if (availablePhrases.length === 0) {
        console.log(`Tutte le frasi di ${category} viste! Reset categoria.`);
        resetCategoryHistory(category);

        // After reset, available phrases are all phrases in category EXCEPT those used in current deck
        availablePhrases = categoryPhrases.filter(phrase =>
            !deckUsedPhrases.includes(phrase.uniqueId)
        );

        // If STILL empty (meaning we used ALL phrases of this category in THIS deck alone),
        // then we just have to allow repeats from current deck.
        if (availablePhrases.length === 0) {
            console.log(`Tutte le frasi di ${category} usate in questo deck! Riuso.`);
            availablePhrases = categoryPhrases;
        }
    }

    // Pick random phrase
    if (availablePhrases.length > 0) {
        return availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
    }

    return null;
}

// Get a weighted random player (favors less-selected players)
function getWeightedRandomPlayer(excludePlayers = []) {
    // Get available players (not in exclude list)
    const availablePlayers = gameState.players.filter(p => !excludePlayers.includes(p));

    if (availablePlayers.length === 0) {
        // If all players excluded, use all players
        return gameState.players[Math.floor(Math.random() * gameState.players.length)];
    }

    // Find the minimum selection count among available players
    const minCount = Math.min(...availablePlayers.map(p => gameState.playerSelectionCount[p]));

    // Players with the minimum count have higher weight
    // Create a weighted pool where less-selected players appear more times
    const weightedPool = [];
    availablePlayers.forEach(player => {
        const count = gameState.playerSelectionCount[player];
        // Weight formula: players with minCount get 3x weight, others get decreasing weight
        const weight = Math.max(1, 4 - (count - minCount));
        for (let i = 0; i < weight; i++) {
            weightedPool.push(player);
        }
    });

    // Select random from weighted pool
    const selectedPlayer = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    gameState.playerSelectionCount[selectedPlayer]++;

    return selectedPlayer;
}

// Replace {player} with random player name
function replacePlaceholder(text) {
    if (text.includes('{player}')) {
        // Replace each {player} with a different random player
        let result = text;
        const usedPlayers = [];

        while (result.includes('{player}')) {
            // Get a weighted random player not used yet in this phrase
            const randomPlayer = getWeightedRandomPlayer(usedPlayers);
            usedPlayers.push(randomPlayer);

            // Replace only the first occurrence
            result = result.replace('{player}', randomPlayer);
        }

        return result;
    }
    return text;
}

// Show next phrase
function showNextPhrase() {
    // Check if we need to show a rule ending first (without incrementing round)
    if (gameState.ruleEndQueue.length > 0) {
        const ruleEnd = gameState.ruleEndQueue.shift();
        showRuleEnd(ruleEnd);
        return;
    }

    // Now increment the round
    gameState.currentRound++;

    // Check if game is over
    if (gameState.currentRound > gameState.totalRounds) {
        // Before showing end screen, check if there are active rules to end
        if (gameState.activeRules.length > 0) {
            // Queue all remaining active rule endings
            gameState.activeRules.forEach(rule => {
                gameState.ruleEndQueue.push(rule.endText);
            });
            gameState.activeRules = [];

            // Show the first rule ending
            if (gameState.ruleEndQueue.length > 0) {
                const ruleEnd = gameState.ruleEndQueue.shift();
                showRuleEnd(ruleEnd);
                return;
            }
        }

        // No more rules to end, show end screen
        showScreen('end-screen');
        return;
    }

    // Update round counter
    currentRoundSpan.textContent = gameState.currentRound;

    // Check for expired rules and queue their endings
    gameState.activeRules = gameState.activeRules.filter(rule => {
        if (rule.endRound === gameState.currentRound) {
            gameState.ruleEndQueue.push(rule.endText);
            return false; // Remove from active rules
        }
        return true;
    });

    // Update badge after filtering
    updateRulesBadge();

    // If we just queued a rule ending, show it (without consuming the round)
    if (gameState.ruleEndQueue.length > 0) {
        const ruleEnd = gameState.ruleEndQueue.shift();
        // Decrement round since we're showing an end, not a new phrase
        gameState.currentRound--;
        currentRoundSpan.textContent = gameState.currentRound;
        showRuleEnd(ruleEnd);
        return;
    }

    // Get next phrase from deck
    let phraseObj;
    if (gameState.gameDeck && gameState.gameDeck.length > 0) {
        phraseObj = gameState.gameDeck.shift();

        // Update history since we are now showing this phrase
        gameState.usedPhrases.push(phraseObj.uniqueId);
        markPhraseAsSeen(phraseObj.uniqueId);
    } else {
        // Fallback if deck is empty (should not happen)
        console.warn('Deck vuoto! Generazione frase casuale fallback.');
        phraseObj = getRandomPhrase();
    }

    // For rules, we need to replace placeholders in both start and end with the SAME players
    let finalText;
    let finalEndText;

    if (phraseObj.isRule && (phraseObj.text.includes('{player}') || phraseObj.endText.includes('{player}'))) {
        // Count how many {player} placeholders we need
        const startMatches = (phraseObj.text.match(/{player}/g) || []).length;
        const endMatches = (phraseObj.endText.match(/{player}/g) || []).length;
        const totalMatches = Math.max(startMatches, endMatches);

        // Generate the same players for both start and end
        const selectedPlayers = [];
        for (let i = 0; i < totalMatches; i++) {
            const player = getWeightedRandomPlayer(selectedPlayers);
            selectedPlayers.push(player);
        }

        // Replace placeholders in start text
        finalText = phraseObj.text;
        selectedPlayers.forEach(player => {
            finalText = finalText.replace('{player}', player);
        });

        // Replace placeholders in end text (reuse same players)
        finalEndText = phraseObj.endText;
        selectedPlayers.forEach(player => {
            finalEndText = finalEndText.replace('{player}', player);
        });
    } else {
        // Normal phrase or rule without placeholders
        finalText = replacePlaceholder(phraseObj.text);
        if (phraseObj.isRule) {
            finalEndText = phraseObj.endText; // No placeholders to replace
        }
    }

    // Set the type label based on category
    let typeLabel = '';
    if (phraseObj.category === 'challenge') {
        typeLabel = 'CHALLENGE!';
    } else if (phraseObj.category === 'vote') {
        typeLabel = 'VOTA!';
    } else if (phraseObj.category === 'rule' && phraseObj.isRule) {
        typeLabel = 'NUOVA REGOLA!';
    }

    // Update type label
    if (typeLabel) {
        phraseTypeLabel.textContent = typeLabel;
        phraseTypeLabel.classList.add('visible');
    } else {
        phraseTypeLabel.textContent = '';
        phraseTypeLabel.classList.remove('visible');
    }

    // If it's a rule, schedule its ending
    if (phraseObj.isRule) {
        const duration = Math.floor(Math.random() * 8) + 5; // Random 5-12 rounds
        const endRound = gameState.currentRound + duration;
        gameState.activeRules.push({
            endRound: endRound,
            startText: finalText,
            endText: finalEndText
        });
        console.log(`Regola attivata, finirà al round ${endRound}`);
        updateRulesBadge();
    }

    // Update phrase text with animation
    phraseText.classList.remove('phrase-animate');
    void phraseText.offsetWidth; // Trigger reflow

    // Hide text while calculating size
    phraseText.style.opacity = '0';
    phraseText.textContent = finalText;

    // Auto-scale text if needed
    autoScaleText();

    // Show text with animation after sizing is done
    setTimeout(() => {
        phraseText.style.opacity = '1';
        phraseText.classList.add('phrase-animate');
    }, 10);

    // Reset AI UI
    const aiContainer = document.getElementById('ai-challenge-container');
    if (aiContainer) {
        aiContainer.style.display = 'none';
        const aiText = document.getElementById('ai-challenge-text');
        if (aiText) aiText.style.display = 'block';
    }

    // Trigger AI Challenge for pre-selected vote cards
    const shouldTriggerAI = aiSettings.enabled &&
        aiSettings.apiKey &&
        phraseObj.category === 'vote' &&
        gameState.aiSelectedCards.includes(phraseObj.uniqueId);

    // Debug logging
    if (phraseObj.category === 'vote') {
        console.log('Vote card:', phraseObj.uniqueId, 'Selected cards:', gameState.aiSelectedCards, 'Match:', gameState.aiSelectedCards.includes(phraseObj.uniqueId));
    }

    if (shouldTriggerAI && window.triggerAIChallenge) {
        console.log('🎯 Triggering AI challenge for:', phraseObj.uniqueId);
        window.triggerAIChallenge(finalText);
    }

    // Update background color based on category
    phraseContainer.className = 'phrase-container ' + phraseObj.category;
}

// Auto-scale text to fit container
function autoScaleText() {
    const container = phraseContainer;
    const text = phraseText;

    // Determine initial font size based on screen width
    const isMobile = window.innerWidth <= 480;
    const defaultFontSize = isMobile ? 1.1 : 1.5;
    const minFontSize = isMobile ? 0.75 : 0.9;

    // Reset to default size
    text.style.fontSize = defaultFontSize + 'rem';

    // Get available height (container height minus padding and label)
    const containerHeight = container.clientHeight;
    const typeLabel = phraseTypeLabel;
    const labelHeight = typeLabel.classList.contains('visible') ? typeLabel.offsetHeight + 24 : 0; // 24px margin
    const paddingVertical = isMobile ? 48 : 96; // Total vertical padding (24px or 48px each side)
    const availableHeight = containerHeight - paddingVertical - labelHeight;

    // Check if text overflows and scale down if needed
    let fontSize = defaultFontSize;

    while (text.scrollHeight > availableHeight && fontSize > minFontSize) {
        fontSize -= 0.05;
        text.style.fontSize = fontSize + 'rem';
    }
}

// Show rule ending
function showRuleEnd(endText) {
    phraseText.classList.remove('phrase-animate');
    void phraseText.offsetWidth;

    // Hide text while calculating size
    phraseText.style.opacity = '0';
    phraseText.textContent = endText;

    // Auto-scale text if needed
    autoScaleText();

    // Show text with animation after sizing is done
    setTimeout(() => {
        phraseText.style.opacity = '1';
        phraseText.classList.add('phrase-animate');
    }, 10);

    // Hide type label for rule endings
    phraseTypeLabel.textContent = '';
    phraseTypeLabel.classList.remove('visible');

    // Use rule color but slightly different
    phraseContainer.className = 'phrase-container rule';
}

// Show screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the selected screen
    document.getElementById(screenId).classList.add('active');

    // Add/remove game-active class to body based on screen
    if (screenId === 'game-screen') {
        document.body.classList.add('game-active');
    } else {
        document.body.classList.remove('game-active');
    }
}

// Reset game
function resetGame() {
    // Save current players
    const savedPlayers = [...gameState.players];

    gameState.currentRound = 0;
    gameState.usedPhrases = [];
    gameState.activeRules = [];
    gameState.ruleEndQueue = [];
    gameState.playerSelectionCount = {};

    // Update badge after reset
    updateRulesBadge();

    showScreen('setup-screen');

    // Restore player count
    playerCountSelect.value = savedPlayers.length;
    generatePlayerInputs();

    // Restore player names
    savedPlayers.forEach((name, index) => {
        const input = document.getElementById(`player-${index + 1}`);
        if (input) {
            input.value = name;
        }
    });
}

// Toggle custom percentages
function toggleCustomPercentages() {
    const isChecked = customPercentagesToggle.checked;
    percentagesControls.style.display = isChecked ? 'block' : 'none';

    if (isChecked) {
        updatePercentageTotal();
    }
}

// Update percentage total and validate
function updatePercentageTotal() {
    const normal = parseInt(normalPercentageInput.value) || 0;
    const challenge = parseInt(challengePercentageInput.value) || 0;
    const vote = parseInt(votePercentageInput.value) || 0;
    const rule = parseInt(rulePercentageInput.value) || 0;

    const total = normal + challenge + vote + rule;
    percentageTotalSpan.textContent = total;

    // Show warning if not 100%
    if (total !== 100) {
        percentageWarning.style.display = 'inline-block';
        percentageTotalSpan.style.color = '#ff6b6b';
        startGameBtn.disabled = true;
        startGameBtn.style.opacity = '0.5';
        startGameBtn.style.cursor = 'not-allowed';
    } else {
        percentageWarning.style.display = 'none';
        percentageTotalSpan.style.color = '#2ecc71';
        startGameBtn.disabled = false;
        startGameBtn.style.opacity = '1';
        startGameBtn.style.cursor = 'pointer';
    }
}

// Save custom percentages
function saveCustomPercentages() {
    if (customPercentagesToggle.checked) {
        gameState.customPercentages = true;
        gameState.categoryWeights = {
            normal: parseInt(normalPercentageInput.value) || 0,
            challenge: parseInt(challengePercentageInput.value) || 0,
            vote: parseInt(votePercentageInput.value) || 0,
            rule: parseInt(rulePercentageInput.value) || 0
        };
    } else {
        gameState.customPercentages = false;
        gameState.categoryWeights = {};
    }
}

// Event listeners
playerCountSelect.addEventListener('change', generatePlayerInputs);
startGameBtn.addEventListener('click', async () => {
    saveCustomPercentages();
    await loadPhrases(); // Reload phrases with custom weights
    startGame();
});
nextPhraseBtn.addEventListener('click', showNextPhrase);
playAgainBtn.addEventListener('click', resetGame);
customPercentagesToggle.addEventListener('change', toggleCustomPercentages);
normalPercentageInput.addEventListener('input', updatePercentageTotal);
challengePercentageInput.addEventListener('input', updatePercentageTotal);
votePercentageInput.addEventListener('input', updatePercentageTotal);
rulePercentageInput.addEventListener('input', updatePercentageTotal);

// Toggle AI Challenge settings visibility
function toggleAISettings() {
    const isChecked = aiChallengeToggle.checked;
    aiSettingsContainer.style.display = isChecked ? 'block' : 'none';
    aiSettings.enabled = isChecked;
    saveAISettings();
}

// Save AI API Key
function saveAIAPIKey() {
    aiSettings.apiKey = aiApiKeyInput.value.trim();
    saveAISettings();
}

// AI Challenge event listeners
aiChallengeToggle.addEventListener('change', toggleAISettings);
aiApiKeyInput.addEventListener('input', saveAIAPIKey);


// Rules Badge and Panel Management
const rulesBadge = document.getElementById('rules-badge');
const rulesPanel = document.getElementById('rules-panel');
const closeRulesPanelBtn = document.getElementById('close-rules-panel');
const rulesCountSpan = document.getElementById('rules-count');
const rulesList = document.getElementById('rules-list');

function updateRulesBadge() {
    const activeCount = gameState.activeRules.length;
    if (activeCount > 0) {
        rulesBadge.style.display = 'flex';
        rulesCountSpan.textContent = activeCount;
    } else {
        rulesBadge.style.display = 'none';
        rulesPanel.classList.remove('active');
    }
}

function updateRulesList() {
    rulesList.innerHTML = '';

    gameState.activeRules.forEach((rule) => {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';

        const ruleText = document.createElement('div');
        ruleText.className = 'rule-text';
        ruleText.textContent = rule.startText || 'Regola attiva';

        ruleItem.appendChild(ruleText);
        rulesList.appendChild(ruleItem);
    });
}

function toggleRulesPanel() {
    rulesPanel.classList.toggle('active');
    if (rulesPanel.classList.contains('active')) {
        updateRulesList();
    }
}

function closeRulesPanel() {
    rulesPanel.classList.remove('active');
}

rulesBadge.addEventListener('click', toggleRulesPanel);
closeRulesPanelBtn.addEventListener('click', closeRulesPanel);

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (rulesPanel.classList.contains('active') &&
        !rulesPanel.contains(e.target) &&
        !rulesBadge.contains(e.target)) {
        closeRulesPanel();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    loadPhraseHistory(); // Load historical data from localStorage
    loadAISettings(); // Load AI settings from localStorage
    await loadPhrases();
    generatePlayerInputs();

    // Restore AI settings UI state
    if (aiSettings.enabled) {
        aiChallengeToggle.checked = true;
        aiSettingsContainer.style.display = 'block';
    }
    if (aiSettings.apiKey) {
        aiApiKeyInput.value = aiSettings.apiKey;
    }


    // Debug helper - expose to console
    window.drewnkingDebug = {
        getHistory: () => phraseHistory,
        resetHistory: () => {
            phraseHistory.seenPhrases = {};
            phraseHistory.lastReset = Date.now();
            savePhraseHistory();
            console.log('Storico resettato!');
        },
        getStats: () => {
            const totalUnique = new Set(gameState.allPhrases.map(p => p.uniqueId)).size;
            const totalSeen = Object.keys(phraseHistory.seenPhrases).length;
            const neverSeen = totalUnique - totalSeen;
            const seenOnce = Object.values(phraseHistory.seenPhrases).filter(c => c === 1).length;
            const seenMultiple = Object.values(phraseHistory.seenPhrases).filter(c => c > 1).length;

            return {
                totalUniquePhrases: totalUnique,
                totalSeenPhrases: totalSeen,
                neverSeen: neverSeen,
                seenOnce: seenOnce,
                seenMultipleTimes: seenMultiple,
                lastReset: new Date(phraseHistory.lastReset).toLocaleString()
            };
        }
    };

    console.log('🎮 Drewnking Game caricato!');
    console.log('📊 Usa window.drewnkingDebug.getStats() per vedere le statistiche');
    console.log('🔄 Usa window.drewnkingDebug.resetHistory() per resettare lo storico');
});
// AI Challenge Logic
const AI_CHANCE = 0.15; // 15% chance

const aiUI = {
    container: document.getElementById('ai-challenge-container'),
    text: document.getElementById('ai-challenge-text'),
    actions: document.getElementById('ai-actions'),
    acceptBtn: document.getElementById('ai-accept-btn'),
    refuseBtn: document.getElementById('ai-refuse-btn'),
    inputArea: document.getElementById('ai-input-area'),
    defenseInput: document.getElementById('ai-defense-input'),
    submitBtn: document.getElementById('ai-submit-btn'),
    verdictArea: document.getElementById('ai-verdict-area'),
    verdictText: document.getElementById('ai-verdict-text'),
    penaltyText: document.getElementById('ai-penalty-text')
};

let currentAIChallenge = null;

async function triggerAIChallenge(phraseText) {
    aiUI.container.style.display = 'block';
    aiUI.text.textContent = "L'IA sta analizzando l'accusa...";
    aiUI.actions.style.display = 'none';
    aiUI.inputArea.style.display = 'none';
    aiUI.verdictArea.style.display = 'none';

    try {
        const prompt = `
            Sei un Giudice Ubriaco, Volgare e Cattivissimo in un gioco alcolico per adulti.
            È stata pescata questa carta "Votazione": "${phraseText}".
            
            Se la carta prevede che venga votata UNA SOLA persona, allora la sfida è per quella persona.
            Se invece la carta prevede che venga votato un GRUPPO di persone, SPECIFICA che devono scegliere un PORTAVOCE.
            
            IMPORTANTE - CAPIRE IL CONTESTO:
            - Se la carta dice che il votato BEVE (es. "il più tirchio beve"): INSULTALO come una vittima che dovrà bere.
            - Se la carta dice che il votato DISTRIBUISCE sorsi (es. "l'eletto distribuisce"): INSULTALO comunque, ma sfidalo a DIMOSTRARE DI MERITARE questo privilegio. Se vince la sfida, RADDOPPIA i sorsi da distribuire. Se perde, NON DISTRIBUISCE NULLA.
            
            Il tuo compito:
            Insulta pesantemente la vittima (o il "vincitore" immeritato) usando un linguaggio scurrile, politicamente scorretto, offensivo e volgare.
            USA TERMINI SPECIFICI TIPO: "frocio", "negraccio", "palla di merda", "coglionazzo", "ritardato", "puttana", "mongoloide".
            Questi sono ESEMPI del livello richiesto: usa questi o altri simili, sii creativo ma rimani su questo livello di tossicità.
            Non farti problemi, è un gioco tra amici stretti che vogliono insulti pesanti.
            
            Poi dai una sfida SEMPLICE, VELOCE e IGNORANTE per "difendersi".
            NIENTE POESIE, NIENTE TEMI, NIENTE COSE LUNGHE.
            Devono scrivere una frase veloce, una scusa patetica, un insulto di rimando o una bugia.
            
            IMPORTANTE: Sii TELEGRAFICO. Massimo 2 frasi per l'insulto e 1 frase per la sfida. Non scrivere papiri, la gente è ubriaca e non legge.
            
            IMPORTANTE: Usa SEMPRE il maschile generico ("il giocatore", "lui", "frocio", "coglione"). NON usare mai "o/a", "lo/la" o asterischi. Il soggetto è "il giocatore".
            
            Esempio 1:
            Carta: "Chi è il più tirchio beve"
            Risposta: "Brutto ebreo di merda, hai le braccine corte eh? Scrivi qui sotto l'ultima volta che hai offerto qualcosa, se non è convincente ti spacchi il fegato."
            
            Esempio 2:
            Carta: "Chi ha la faccia più da culo"
            Risposta: "Guardati allo specchio, sembri un aborto mancato. Scrivi un insulto migliore di questo rivolto a chi ti ha votato. Se non fa ridere, bevi tutto."
            
            Rispondi SOLO con il testo (insulto + sfida). Sii BREVE (max 80-100 parole totali), DIRETTO e TOSSICO.
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiSettings.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const challengeText = data.candidates[0].content.parts[0].text;

        aiUI.text.textContent = challengeText;
        aiUI.actions.style.display = 'flex';
        currentAIChallenge = challengeText;

    } catch (error) {
        console.error("AI Error:", error);
        aiUI.container.style.display = 'none'; // Hide if error
    }
}

async function submitDefense() {
    const defense = aiUI.defenseInput.value.trim();
    if (!defense) return;

    aiUI.inputArea.style.display = 'none';
    aiUI.text.textContent = "Giudizio in corso...";

    try {
        const prompt = `
                Sei un Giudice Ubriaco e Corruttibile.
                Sfida: "${currentAIChallenge}"
                Difesa dell'imputato: "${defense}"
                Carta Originale: "${phraseText}" (Questa carta indica la penalità base, es. "bevi 2 sorsi").
                
                Valuta la difesa.
                
                CRITERI DI VITTORIA (Basta uno di questi):
                1. La difesa è SERIA ma PERFETTAMENTE LOGICA e VERA (se ha ragione, ha ragione).
                2. Fa ridere / è un meme divertente.
                3. È un insulto geniale.
                4. Ti sta leccando il culo / lusingando (ATTENZIONE: qui c'è un rischio).
                
                RISCHIO LUSINGHE/INSULTI:
                Se l'imputato ti lusinga o ti insulta per ridere, tira una moneta virtuale:
                - 50% ti piace e lo PROMUOVI.
                - 50% ti irrita e lo BOCCI malamente.
                
                PENALITÀ (Basata sulla Carta Originale):
                Leggi attentamente la carta originale:
                - Se la carta dice che il votato BEVE (vittima):
                  * PROMOSSO: "0 sorsi" o "1 sorso" (sconto)
                  * BOCCIATO: "Raddoppia" o "Aggiungi 2 sorsi"
                - Se la carta dice che il votato DISTRIBUISCE (vincitore):
                  * PROMOSSO: "Distribuisci il doppio" (es. se la carta dice 3, ora distribuisce 6)
                  * BOCCIATO: "Non distribuisci nulla" (perde il privilegio, 0 sorsi distribuiti)
                
                NON inventare penalità a caso, basati SEMPRE sulla carta.
                
                Rispondi in JSON:
                {
                    "verdict": "Un commento BREVISSIMO (max 1 frase) e cattivo sulla difesa",
                    "penalty": "La penalità calcolata (es. '0 sorsi', 'Raddoppia', 'Bevi 3 sorsi')",
                    "success": true/false
                }
            `;

        // Retry logic for 500 errors
        let response;
        let retries = 2;

        while (retries >= 0) {
            try {
                response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiSettings.apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });

                if (response.ok) break;

                // If 500 error, throw to catch block but check retries
                if (response.status >= 500) {
                    throw new Error(`Server Error ${response.status}`);
                }
            } catch (e) {
                if (retries === 0) throw e;
                console.warn(`AI Error, retrying... (${retries} left)`);
                retries--;
                await new Promise(r => setTimeout(r, 1000)); // Wait 1s
            }
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);

        aiUI.text.style.display = 'none';
        aiUI.verdictArea.style.display = 'block';
        aiUI.verdictText.textContent = result.verdict;
        aiUI.penaltyText.textContent = result.penalty;
        aiUI.penaltyText.style.color = result.success ? '#4caf50' : '#f44336';

    } catch (error) {
        console.error("AI Judgment Error:", error);
        aiUI.text.textContent = "L'IA è troppo ubriaca per giudicare. Bevi 1 sorso per simpatia.";

        // Show verdict area anyway after error
        setTimeout(() => {
            aiUI.text.style.display = 'none';
            aiUI.verdictArea.style.display = 'block';
            aiUI.verdictText.textContent = "Errore di connessione (IA in coma etilico)";
            aiUI.penaltyText.textContent = "Bevi 1 sorso";
            aiUI.penaltyText.style.color = '#f44336';
        }, 2000);
    }
}

// Event Listeners for AI
if (aiUI.acceptBtn) {
    aiUI.acceptBtn.addEventListener('click', () => {
        aiUI.actions.style.display = 'none';
        aiUI.inputArea.style.display = 'block';
        aiUI.defenseInput.value = '';
        aiUI.defenseInput.focus();
    });
}


if (aiUI.refuseBtn) {
    aiUI.refuseBtn.addEventListener('click', () => {
        aiUI.container.style.display = 'none';
    });
}

if (aiUI.submitBtn) {
    aiUI.submitBtn.addEventListener('click', submitDefense);
}

// Override showNextPhrase to include AI trigger check
// We can't easily override showNextPhrase because it calls showNextPhrase recursively or via events.
// Instead, we should modify the showNextPhrase function definition itself in the file.
// But since I am appending here, I can't modify the function above easily without replacing the whole file.
// Wait, the user said "showPhrase is not defined". That's because I tried to access it outside.
// The best way is to modify the `showNextPhrase` function in the main body to call `triggerAIChallenge`.
// I will do that in a separate step. Here I just define the functions and attach listeners.
// I will attach `triggerAIChallenge` to the window or a global object so `showNextPhrase` can call it.
window.triggerAIChallenge = triggerAIChallenge;


