document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const playerTurnScreen = document.getElementById('player-turn-screen');
    const writingScreen = document.getElementById('writing-screen');
    const discussionScreen = document.getElementById('discussion-screen');
    const revealScreen = document.getElementById('reveal-screen');
    
    const playerCountInput = document.getElementById('player-count');
    const startGameBtn = document.getElementById('start-game');
    
    const currentPlayerNum = document.getElementById('current-player-num');
    const currentPlayerNumText = document.getElementById('current-player-num-text');
    const showPromptBtn = document.getElementById('show-prompt');
    const promptContainer = document.getElementById('prompt-container');
    const playerPrompt = document.getElementById('player-prompt');
    const hidePromptBtn = document.getElementById('hide-prompt');
    
    const showGroupPromptBtn = document.getElementById('show-group-prompt');
    const sharedPrompt = document.getElementById('shared-prompt');
    const revealImpostorBtn = document.getElementById('reveal-impostor');
    
    const impostorNum = document.getElementById('impostor-num');
    const impostorPrompt = document.getElementById('impostor-prompt');
    const playAgainBtn = document.getElementById('play-again');
    
    // Game State
    let gameState = {
        playerCount: 4,
        currentPlayer: 1,
        impostorIndex: -1,
        prompts: [],
        groupPrompt: '',
        impostorPrompt: '',
        allPhrasePairs: [],
        hasImpostor: true // New property to track if there's an impostor
    };
    
    // Load prompts from the text file
    async function loadPrompts() {
        try {
            const response = await fetch('frasi_gioco_impostore.txt');
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
            alert('Errore nel caricamento dei prompt. Ricarica la pagina per riprovare.');
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
        
        // Reset game state
        gameState.currentPlayer = 1;
        gameState.prompts = [];
        
        // Determine if this game will have an impostor (1/50 chance of no impostor)
        gameState.hasImpostor = Math.random() > 0.02; // 98% chance to have an impostor
        
        if (gameState.hasImpostor) {
            // Randomly select the impostor
            gameState.impostorIndex = Math.floor(Math.random() * gameState.playerCount);
            
            // Randomly select a phrase pair for this round
            const randomPairIndex = Math.floor(Math.random() * gameState.allPhrasePairs.length);
            const selectedPair = gameState.allPhrasePairs[randomPairIndex];
            
            gameState.groupPrompt = selectedPair.groupPhrase;
            gameState.impostorPrompt = selectedPair.impostorPhrase;
            
            console.log(`Game started with ${gameState.playerCount} players, impostor is player ${gameState.impostorIndex + 1}`);
            console.log(`Group prompt: ${gameState.groupPrompt}`);
            console.log(`Impostor prompt: ${gameState.impostorPrompt}`);
        } else {
            // No impostor game!
            gameState.impostorIndex = -1;
            
            // Select just a group prompt
            const randomPairIndex = Math.floor(Math.random() * gameState.allPhrasePairs.length);
            const selectedPair = gameState.allPhrasePairs[randomPairIndex];
            
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
        // Otherwise, the impostor gets a different prompt
        const isImpostor = gameState.hasImpostor && (gameState.currentPlayer - 1) === gameState.impostorIndex;
        
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
        sharedPrompt.textContent = gameState.groupPrompt;
        showScreen(discussionScreen);
    }
    
    // Reveal the impostor
    function revealImpostor() {
        const impostorRevealElement = document.querySelector('.impostor-reveal');
        
        // Remove any previous classes that might be applied
        impostorRevealElement.classList.remove('no-impostor-surprise');
        
        // Update the reveal screen based on whether there was an impostor
        if (gameState.hasImpostor) {
            // Normal game with an impostor
            document.querySelector('.reveal-header h2').textContent = "L'Impostore è...";
            impostorRevealElement.innerHTML = `Il giocatore <span id="impostor-num">${gameState.impostorIndex + 1}</span>!`;
            document.querySelector('.impostor-prompt-container p:first-child').textContent = "Il suo prompt era:";
            impostorPrompt.textContent = gameState.impostorPrompt;
        } else {
            // Special game with no impostor!
            document.querySelector('.reveal-header h2').textContent = "Sorpresa!";
            impostorRevealElement.innerHTML = "Ahah! Nessuno era l'impostore! <span class='emoji-surprise'>😜</span>";
            impostorRevealElement.classList.add('no-impostor-surprise');
            document.querySelector('.impostor-prompt-container p:first-child').textContent = "Eravate tutti dalla stessa parte:";
            impostorPrompt.textContent = gameState.groupPrompt;
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
    
    // Initial load
    loadPrompts();
}); 