let phrases = [];
let players = [];
let impostors = [];
let normalPlayers = [];
let currentPlayerIndex = 0;
let sharedPrompt = '';
let impostorPrompt = '';

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
        
        // Reset game state
        gameState.currentPlayer = 1;
        gameState.prompts = [];
        gameState.impostorIndices = [];
        
        // Determine if this game will have impostors (1/50 chance of no impostor)
        gameState.hasImpostor = Math.random() > 0.05; // 95% chance to have impostors
        
        if (gameState.hasImpostor) {
            // Randomly select the impostors
            const playerIndices = Array.from({ length: gameState.playerCount }, (_, i) => i);
            
            // Shuffle the player indices
            for (let i = playerIndices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]];
            }
            
            // Take the first N indices as impostors
            gameState.impostorIndices = playerIndices.slice(0, gameState.impostorCount);
            
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
    
    // Update player turn UI
    function updatePlayerTurnUI() {
        currentPlayerNum.textContent = gameState.currentPlayer;
        currentPlayerNumText.textContent = gameState.currentPlayer;
        
        // Hide prompt container initially
        promptContainer.classList.add('hidden');
        showPromptBtn.classList.remove('hidden');
    }
    
    // Show prompt for current player
    function showPrompt() {
        // In a no-impostor game, everyone gets the same prompt
        // Otherwise, check if current player is an impostor
        const isImpostor = gameState.hasImpostor && gameState.impostorIndices.includes(gameState.currentPlayer - 1);
        
        // Set the appropriate prompt
        playerPrompt.textContent = isImpostor ? gameState.impostorPrompt : gameState.groupPrompt;
        
        // Show prompt container
        promptContainer.classList.remove('hidden');
        showPromptBtn.classList.add('hidden');
    }
    
    // Move to next player or writing screen
    function nextPlayerOrWriting() {
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