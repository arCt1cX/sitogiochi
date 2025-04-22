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
    
    const discussionTimer = document.getElementById('discussion-timer');
    const discussionTimerValue = 60; // Assuming a default value, you might want to fetch this from somewhere
    const skipDiscussionBtn = document.getElementById('skip-discussion');
    
    // Game State
    const gameState = {
        playerCount: 0,
        currentPlayer: 0,
        impostorIndices: [],
        impostorCount: 1,
        secretPrompt: "",
        playerPrompts: [],
        hasImpostor: true
    };
    
    // Load prompts from file
    async function loadPrompts() {
        try {
            const response = await fetch('frasi_gioco_impostore.txt');
            const text = await response.text();
            return text.split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            console.error('Errore nel caricamento delle frasi:', error);
            return [
                "Pizza", "Spaghetti", "Calcio", "Roma", "Venezia", 
                "Firenze", "Leonardo da Vinci", "Colosseo", "Ferrari",
                "Opera", "Gelato", "Cappuccino", "Pasta", "Vino"
            ];
        }
    }
    
    // Initialize game
    async function initializeGame() {
        // Reset game state
        gameState.playerCount = parseInt(document.getElementById('player-count').value, 10);
        gameState.impostorCount = parseInt(document.getElementById('impostor-count').value, 10);
        gameState.currentPlayer = 0;
        
        // Adjust impostor count based on player count
        const maxImpostors = gameState.playerCount >= 10 ? 4 : 
                             gameState.playerCount >= 8 ? 3 : 
                             gameState.playerCount >= 5 ? 2 : 1;
        
        gameState.impostorCount = Math.min(gameState.impostorCount, maxImpostors);
        document.getElementById('impostor-count').max = maxImpostors;
        
        // Generate impostor indices
        gameState.impostorIndices = [];
        gameState.hasImpostor = gameState.impostorCount > 0;
        
        if (gameState.hasImpostor) {
            // Create array of player indices
            const playerIndices = Array.from({ length: gameState.playerCount }, (_, i) => i);
            
            // Randomly select impostor indices
            for (let i = 0; i < gameState.impostorCount; i++) {
                if (playerIndices.length > 0) {
                    const randomIndex = Math.floor(Math.random() * playerIndices.length);
                    gameState.impostorIndices.push(playerIndices[randomIndex]);
                    playerIndices.splice(randomIndex, 1);
                }
            }
        }

        // Load and set prompts
        const prompts = await loadPrompts();
        const randomPromptIndex = Math.floor(Math.random() * prompts.length);
        gameState.secretPrompt = prompts[randomPromptIndex];
        gameState.playerPrompts = Array(gameState.playerCount).fill(gameState.secretPrompt);
        
        // Fill impostor prompts with blank
        gameState.impostorIndices.forEach(index => {
            gameState.playerPrompts[index] = "";
        });

        // Update UI
        updatePlayerTurn();
        
        // Switch to player turn screen
        setupScreen.classList.add('hidden');
        playerTurnScreen.classList.remove('hidden');
    }
    
    // Update player turn UI
    function updatePlayerTurn() {
        currentPlayerNum.textContent = gameState.currentPlayer + 1;
        currentPlayerNumText.textContent = gameState.currentPlayer + 1;
        
        // Hide prompt container initially
        promptContainer.classList.add('hidden');
        showPromptBtn.classList.remove('hidden');
    }
    
    // Show prompt for the current player
    function showPrompt() {
        const isImpostor = gameState.impostorIndices.includes(gameState.currentPlayer);
        
        if (isImpostor) {
            playerPrompt.textContent = "Sei l'Impostore! Fai attenzione a non farti scoprire.";
            impostorPrompt.textContent = "Non hai un suggerimento - dovrai fingere di conoscere l'argomento segreto!";
            impostorPrompt.classList.remove('hidden');
        } else {
            playerPrompt.textContent = gameState.secretPrompt;
            impostorPrompt.classList.add('hidden');
        }
        
        promptContainer.classList.remove('hidden');
        showPromptBtn.classList.add('hidden');
    }
    
    // Move to next player or writing screen
    function nextPlayerOrWriting() {
        if (gameState.currentPlayer < gameState.playerCount) {
            // Move to next player
            gameState.currentPlayer++;
            updatePlayerTurn();
        } else {
            // All players have seen their prompts, move to writing screen
            showScreen(writingScreen);
        }
    }
    
    // Show the group prompt and move to discussion
    function showGroupPrompt() {
        sharedPrompt.textContent = gameState.secretPrompt;
        showScreen(discussionScreen);
    }
    
    // Reveal the impostor
    function revealImpostor() {
        const impostorIndices = gameState.impostorIndices;
        
        if (impostorIndices.length === 0) {
            impostorNum.textContent = "Nessun impostore";
            impostorPrompt.textContent = "Non c'erano impostori in questa partita!";
        } else if (impostorIndices.length === 1) {
            impostorNum.textContent = `Giocatore ${impostorIndices[0] + 1}`;
            impostorPrompt.textContent = `L'impostore era il Giocatore ${impostorIndices[0] + 1}!`;
        } else {
            const impostorsList = impostorIndices.map(index => `${index + 1}`).join(', ');
            impostorNum.textContent = `Giocatori ${impostorsList}`;
            impostorPrompt.textContent = `Gli impostori erano i Giocatori ${impostorsList}!`;
        }
        
        playerTurnScreen.classList.add('hidden');
        writingScreen.classList.add('hidden');
        discussionScreen.classList.add('hidden');
        revealScreen.classList.remove('hidden');
    }
    
    // Helper to show a specific screen and hide others
    function showScreen(screenToShow) {
        // Hide all screens
        setupScreen.classList.add('hidden');
        playerTurnScreen.classList.add('hidden');
        writingScreen.classList.add('hidden');
        discussionScreen.classList.add('hidden');
        revealScreen.classList.add('hidden');
        
        // Show requested screen
        screenToShow.classList.remove('hidden');
    }
    
    // Event Listeners
    startGameBtn.addEventListener('click', initializeGame);
    
    showPromptBtn.addEventListener('click', showPrompt);
    
    hidePromptBtn.addEventListener('click', nextPlayerOrWriting);
    
    showGroupPromptBtn.addEventListener('click', showGroupPrompt);
    
    revealImpostorBtn.addEventListener('click', revealImpostor);
    
    playAgainBtn.addEventListener('click', () => {
        showScreen(setupScreen);
    });
    
    // Start the discussion phase
    function startDiscussion() {
        writingScreen.classList.add('hidden');
        discussionScreen.classList.remove('hidden');
        
        // Start the timer
        let timeLeft = discussionTimerValue;
        discussionTimer.textContent = timeLeft;
        
        const timerInterval = setInterval(() => {
            timeLeft--;
            discussionTimer.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                revealImpostor();
            }
        }, 1000);
        
        // Allow skipping the timer
        skipDiscussionBtn.onclick = () => {
            clearInterval(timerInterval);
            revealImpostor();
        };
    }
    
    // Initial load
    initializeGame();
}); 