document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Start Screen
    const startScreen = document.getElementById('startScreen');
    const beginButton = document.getElementById('beginButton');
    const playerCount = document.getElementById('playerCount');
    const playerNamesContainer = document.getElementById('playerNamesContainer');
    
    // DOM Elements - Game Screen
    const gameScreen = document.getElementById('gameScreen');
    const playersScoreContainer = document.getElementById('playersScoreContainer');
    const categoryDisplay = document.getElementById('categoryDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const countDisplay = document.getElementById('countDisplay');
    const startButton = document.getElementById('startButton');
    const incrementButton = document.getElementById('incrementButton');
    const nextRoundButton = document.getElementById('nextRoundButton');
    const timeUpOverlay = document.getElementById('timeUpOverlay');
    
    // Player Elements
    const playerLabels = {};
    const playerScores = {};
    const playerPlusBtns = {};
    const playerMinusBtns = {};
    
    // Game Variables
    let categories = [];
    let players = [];
    let currentCategory = '';
    let currentTimeLimit = 0;
    let count = 0;
    let timerInterval = null;
    let timeRemaining = 0;
    let isTimerRunning = false;
    let currentLanguage = 'it'; // Default language is Italian
    
    // Language-specific text
    const translations = {
        it: {
            categoriesFile: 'categories.txt',
            timeUp: 'Tempo Scaduto!',
            waitingForCategory: 'Attendi...',
            gameTitle: 'BluffMe',
            howToPlay: 'Come Giocare',
            configPlayers: 'Configura Giocatori',
            playerCount: 'Numero di Giocatori:',
            beginGame: 'Inizia Gioco',
            category: 'Categoria:',
            time: 'Tempo:',
            responses: 'Risposte:',
            start: 'Inizia',
            nextRound: 'Prossimo Round',
            defaultPlayerName: 'Giocatore',
            instructions: [
                'Una categoria e un tempo limite verranno mostrati',
                'I giocatori scommettono verbalmente su quanti elementi possono nominare della categoria',
                'Quando un giocatore dice "Dubito", l\'altro preme "Inizia"',
                'Durante il tempo, preme "+1" per ogni risposta corretta',
                'Quando il tempo scade, il conteggio si blocca',
                'Usate i pulsanti di punteggio per tenere traccia dei vincitori',
                'Premere "Prossimo Round" per una nuova categoria'
            ],
            fallbackCategories: [
                'Animali', 'Paesi', 'Città', 'Film', 'Cibo', 
                'Sport', 'Celebrità', 'Musica', 'Videogiochi'
            ],
            errorLoading: 'Errore nel caricamento delle categorie'
        },
        en: {
            categoriesFile: 'categories_en.txt',
            timeUp: 'Time\'s Up!',
            waitingForCategory: 'Waiting...',
            gameTitle: 'BluffMe',
            howToPlay: 'How to Play',
            configPlayers: 'Configure Players',
            playerCount: 'Number of Players:',
            beginGame: 'Start Game',
            category: 'Category:',
            time: 'Time:',
            responses: 'Responses:',
            start: 'Start',
            nextRound: 'Next Round',
            defaultPlayerName: 'Player',
            instructions: [
                'A category and time limit will be shown',
                'Players verbally bet on how many items they can name from the category',
                'When a player says "I doubt it", the other one presses "Start"',
                'During the time, press "+1" for each correct answer',
                'When time runs out, the count is locked',
                'Use the score buttons to keep track of winners',
                'Press "Next Round" for a new category'
            ],
            fallbackCategories: [
                'Animals', 'Countries', 'Cities', 'Movies', 'Food', 
                'Sports', 'Celebrities', 'Music', 'Video games'
            ],
            errorLoading: 'Error loading categories'
        }
    };
    
    // Possible time limits in seconds
    const timeLimits = [15, 30, 60];
    
    // Initialize the game
    async function initGame() {
        try {
            // Detect language first
            detectLanguage();
            
            // Update UI with detected language
            updateUILanguage();
            
            // Load categories
            categories = await fetchCategories();
            console.log("Loaded categories:", categories.length);
            
            // Setup event listeners
            beginButton.addEventListener('click', startGame);
            startButton.addEventListener('click', startTimer);
            incrementButton.addEventListener('click', incrementCount);
            nextRoundButton.addEventListener('click', nextRound);
            
            // Setup player count change event
            playerCount.addEventListener('change', updatePlayerInputs);
            
            // Load saved player names if available
            loadSavedPlayerNames();
            
            // Add initial player elements
            updatePlayerInputs();
            
            // Fetch existing player elements
            initializePlayerElements();
            
            // Watch for language changes
            watchLanguageChanges();
            
        } catch (error) {
            console.error("Failed to initialize game:", error);
            categoryDisplay.textContent = getText('errorLoading');
        }
    }
    
    // Detect language from localStorage or URL parameter
    function detectLanguage() {
        // Check if language is stored in localStorage (only check the 'lang' key)
        const storedLang = localStorage.getItem('lang');
        if (storedLang && (storedLang === 'it' || storedLang === 'en')) {
            currentLanguage = storedLang;
            return;
        }
        
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && (langParam === 'it' || langParam === 'en')) {
            currentLanguage = langParam;
            localStorage.setItem('lang', langParam);
            return;
        }
        
        // Default to Italian
        currentLanguage = 'it';
    }
    
    // Watch for language changes from localStorage
    function watchLanguageChanges() {
        // Check for language changes every second
        setInterval(() => {
            const storedLang = localStorage.getItem('lang');
            if (storedLang && storedLang !== currentLanguage && (storedLang === 'it' || storedLang === 'en')) {
                // Language has changed
                console.log(`Language changed from ${currentLanguage} to ${storedLang}`);
                currentLanguage = storedLang;
                
                // Update UI text
                updateUILanguage();
                
                // Reload categories and update the display
                fetchCategories().then(newCategories => {
                    categories = newCategories;
                    if (gameScreen.classList.contains('active')) {
                        // If we're in the game screen, update the category
                        const randomIndex = Math.floor(Math.random() * categories.length);
                        currentCategory = categories[randomIndex];
                        categoryDisplay.textContent = currentCategory;
                    }
                });
            }
        }, 1000);
    }
    
    // Get translation based on current language
    function getText(key, ...args) {
        let text = translations[currentLanguage][key] || translations['it'][key];
        
        // Replace placeholders with args
        if (args.length > 0) {
            args.forEach((arg, index) => {
                text = text.replace('%s', arg);
            });
        }
        
        return text;
    }
    
    // Update UI language
    function updateUILanguage() {
        // Update page title and language attribute
        document.documentElement.lang = currentLanguage;
        
        // Update game title
        document.querySelector('h1').textContent = getText('gameTitle');
        
        // Update how to play section
        const howToPlayHeading = document.querySelector('.game-instructions h2');
        if (howToPlayHeading) {
            howToPlayHeading.textContent = getText('howToPlay');
        }
        
        // Update instructions
        const instructionItems = document.querySelectorAll('.game-instructions ul li');
        const instructions = getText('instructions');
        instructionItems.forEach((item, index) => {
            if (index < instructions.length) {
                item.textContent = instructions[index];
            }
        });
        
        // Update player config section
        const configHeading = document.querySelector('.players-config h2');
        if (configHeading) {
            configHeading.textContent = getText('configPlayers');
        }
        
        // Update player count label
        const playerCountLabel = document.querySelector('label[for="playerCount"]');
        if (playerCountLabel) {
            playerCountLabel.textContent = getText('playerCount');
        }
        
        // Update player name labels
        const playerNameLabels = document.querySelectorAll('.player-name-input label');
        playerNameLabels.forEach((label, index) => {
            const playerNum = index + 1;
            label.textContent = `${getText('defaultPlayerName')} ${playerNum}:`;
        });
        
        // Update begin button
        beginButton.querySelector('span') ? 
            beginButton.querySelector('span').textContent = getText('beginGame') :
            beginButton.textContent = getText('beginGame');
        
        // Update game screen elements if visible
        if (gameScreen.classList.contains('active')) {
            // Update category label
            const categoryLabel = document.querySelector('.category-label');
            if (categoryLabel) {
                categoryLabel.textContent = getText('category');
            }
            
            // Update time label
            const timeLabel = document.querySelector('.time-label');
            if (timeLabel) {
                timeLabel.textContent = getText('time');
            }
            
            // Update responses label
            const responsesLabel = document.querySelector('.count-label');
            if (responsesLabel) {
                responsesLabel.textContent = getText('responses');
            }
            
            // Update button labels
            const startButtonText = startButton.querySelector('span');
            if (startButtonText) {
                startButtonText.textContent = getText('start');
            }
            
            const nextRoundButtonText = nextRoundButton.querySelector('span');
            if (nextRoundButtonText) {
                nextRoundButtonText.textContent = getText('nextRound');
            }
            
            // Update time up message
            const timeUpMessage = document.querySelector('.time-up-message');
            if (timeUpMessage) {
                timeUpMessage.textContent = getText('timeUp');
            }
        }
    }
    
    // Load player names from localStorage if available
    function loadSavedPlayerNames() {
        try {
            const savedNames = localStorage.getItem('bluffMePlayerNames');
            if (savedNames) {
                players = JSON.parse(savedNames);
            } else {
                // Initialize with default names
                players = [];
                for (let i = 1; i <= 6; i++) {
                    players.push(`${getText('defaultPlayerName')} ${i}`);
                }
            }
        } catch (error) {
            console.error("Error loading saved player names:", error);
            // Initialize with default names on error
            players = [];
            for (let i = 1; i <= 6; i++) {
                players.push(`${getText('defaultPlayerName')} ${i}`);
            }
        }
    }
    
    // Save player names to localStorage
    function savePlayerNames() {
        try {
            // Update players array with current input values
            const count = parseInt(playerCount.value);
            for (let i = 1; i <= count; i++) {
                const nameInput = document.getElementById(`player${i}Name`);
                if (nameInput && nameInput.value.trim() !== '') {
                    players[i-1] = nameInput.value.trim();
                }
            }
            
            localStorage.setItem('bluffMePlayerNames', JSON.stringify(players));
        } catch (error) {
            console.error("Error saving player names:", error);
        }
    }
    
    // Initialize player element references
    function initializePlayerElements() {
        // Store references to player 1 and 2 elements that are in HTML
        playerLabels[1] = document.getElementById('player1Label');
        playerLabels[2] = document.getElementById('player2Label');
        playerScores[1] = document.getElementById('player1Score');
        playerScores[2] = document.getElementById('player2Score');
        playerPlusBtns[1] = document.getElementById('player1Plus');
        playerPlusBtns[2] = document.getElementById('player2Plus');
        playerMinusBtns[1] = document.getElementById('player1Minus');
        playerMinusBtns[2] = document.getElementById('player2Minus');
        
        // Setup initial score control event listeners
        playerPlusBtns[1].addEventListener('click', () => updatePlayerScore(1, 1));
        playerPlusBtns[2].addEventListener('click', () => updatePlayerScore(2, 1));
        playerMinusBtns[1].addEventListener('click', () => updatePlayerScore(1, -1));
        playerMinusBtns[2].addEventListener('click', () => updatePlayerScore(2, -1));
    }
    
    // Update player input fields based on selected count
    function updatePlayerInputs() {
        const count = parseInt(playerCount.value);
        
        // Clear existing inputs
        playerNamesContainer.innerHTML = '';
        
        // Create input fields for each player
        for (let i = 1; i <= count; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'player-name-input';
            
            const label = document.createElement('label');
            label.setAttribute('for', `player${i}Name`);
            label.textContent = `${getText('defaultPlayerName')} ${i}:`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player${i}Name`;
            input.placeholder = `${getText('defaultPlayerName')} ${i}`;
            
            // Use saved name or leave empty
            if (players[i-1] && players[i-1] !== `${getText('defaultPlayerName')} ${i}`) {
                input.value = players[i-1];
            }
            
            // Add focus handler to select text when focused
            input.addEventListener('focus', function() {
                if (this.value) {
                    this.select();
                }
            });
            
            // Add blur handler to save the name
            input.addEventListener('blur', function() {
                if (this.value.trim() !== '') {
                    players[i-1] = this.value.trim();
                    savePlayerNames();
                } else if (players[i-1] !== `${getText('defaultPlayerName')} ${i}`) {
                    // If field is left empty, revert to default name in players array
                    players[i-1] = `${getText('defaultPlayerName')} ${i}`;
                    savePlayerNames();
                }
            });
            
            inputDiv.appendChild(label);
            inputDiv.appendChild(input);
            playerNamesContainer.appendChild(inputDiv);
        }
    }
    
    // Create player score elements dynamically
    function createPlayerScoreElements() {
        const count = parseInt(playerCount.value);
        playersScoreContainer.innerHTML = '';
        
        // Add 'many-players' class if more than 4 players
        if (count > 4) {
            playersScoreContainer.classList.add('many-players');
        } else {
            playersScoreContainer.classList.remove('many-players');
        }
        
        for (let i = 1; i <= count; i++) {
            const nameInput = document.getElementById(`player${i}Name`);
            let playerName;
            
            if (nameInput && nameInput.value.trim() !== '') {
                playerName = nameInput.value.trim();
                players[i-1] = playerName; // Update the players array
            } else {
                // Use the stored player name or default to "Player X"
                playerName = players[i-1] || `${getText('defaultPlayerName')} ${i}`;
            }
            
            // Create the player score container
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'player-score';
            
            // Create player label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'player-label';
            labelDiv.textContent = playerName;
            
            // Create score controls
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'score-controls';
            
            // Create minus button
            const minusBtn = document.createElement('button');
            minusBtn.className = 'score-button';
            minusBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13H5V11H19V13Z" fill="white"/>
                </svg>
            `;
            
            // Create score value
            const scoreValueDiv = document.createElement('div');
            scoreValueDiv.className = 'player-score-value';
            scoreValueDiv.textContent = '0';
            
            // Create plus button
            const plusBtn = document.createElement('button');
            plusBtn.className = 'score-button';
            plusBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white"/>
                </svg>
            `;
            
            // Assemble the score element
            controlsDiv.appendChild(minusBtn);
            controlsDiv.appendChild(scoreValueDiv);
            controlsDiv.appendChild(plusBtn);
            
            scoreDiv.appendChild(labelDiv);
            scoreDiv.appendChild(controlsDiv);
            
            playersScoreContainer.appendChild(scoreDiv);
            
            // Store references to the new elements
            playerLabels[i] = labelDiv;
            playerScores[i] = scoreValueDiv;
            playerPlusBtns[i] = plusBtn;
            playerMinusBtns[i] = minusBtn;
            
            // Add event listeners
            playerPlusBtns[i].addEventListener('click', () => updatePlayerScore(i, 1));
            playerMinusBtns[i].addEventListener('click', () => updatePlayerScore(i, -1));
        }
        
        // Save the player names after game starts
        savePlayerNames();
    }
    
    // Fetch categories from the categories.txt file
    async function fetchCategories() {
        try {
            const response = await fetch(getText('categoriesFile'));
            if (!response.ok) {
                throw new Error('Failed to load categories file');
            }
            const text = await response.text();
            
            // Split the text by new lines and filter out any empty lines
            return text.split('\n')
                .map(category => category.trim())
                .filter(category => category.length > 0);
        } catch (error) {
            console.error('Error loading categories:', error);
            // Fallback list of categories in case of error
            return getText('fallbackCategories');
        }
    }
    
    // Start the game
    function startGame() {
        hideAllScreens();
        gameScreen.classList.add('active');
        
        // Update UI with current language
        updateUILanguage();
        
        // Create player score elements based on configuration
        createPlayerScoreElements();
        
        // Get the first category and time limit
        nextRound();
    }
    
    // Set up the next round
    function nextRound() {
        // Reset count
        count = 0;
        countDisplay.textContent = count;
        
        // Reset timer state
        clearInterval(timerInterval);
        isTimerRunning = false;
        
        // Reset timer color
        timerDisplay.style.color = 'var(--secondary-color)';
        
        // Get a random category
        const randomIndex = Math.floor(Math.random() * categories.length);
        currentCategory = categories[randomIndex];
        categoryDisplay.textContent = currentCategory;
        
        // Get a random time limit
        const randomTimeIndex = Math.floor(Math.random() * timeLimits.length);
        currentTimeLimit = timeLimits[randomTimeIndex];
        timeRemaining = currentTimeLimit;
        timerDisplay.textContent = currentTimeLimit;
        
        // Reset button states
        startButton.disabled = false;
        incrementButton.disabled = true;
        
        // Set focus on start button for better UX
        startButton.focus();
    }
    
    // Start the timer
    function startTimer() {
        if (isTimerRunning) return;
        
        isTimerRunning = true;
        timeRemaining = currentTimeLimit;
        
        // Disable start button, enable increment button
        startButton.disabled = true;
        incrementButton.disabled = false;
        
        // Set focus on increment button for better UX
        incrementButton.focus();
        
        // Start the countdown
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;
            
            // Change color when timer is running low
            if (timeRemaining <= 5) {
                timerDisplay.style.color = 'var(--danger-color)';
            }
            
            // Timer complete
            if (timeRemaining <= 0) {
                endTimer();
            }
        }, 1000);
    }
    
    // End the timer
    function endTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        
        // Disable increment button
        incrementButton.disabled = true;
        
        // Make timer display flash
        timerDisplay.classList.add('pulse');
        setTimeout(() => {
            timerDisplay.classList.remove('pulse');
        }, 500);
        
        // Show time's up overlay
        showTimeUpOverlay();
        
        // Set focus on next round button for better UX
        nextRoundButton.focus();
    }
    
    // Show the time's up overlay with animation
    function showTimeUpOverlay() {
        // Update time's up message with current language
        const timeUpMessage = document.querySelector('.time-up-message');
        if (timeUpMessage) {
            timeUpMessage.textContent = getText('timeUp');
        }
        
        // Add active class to show the overlay
        timeUpOverlay.classList.add('active');
        
        // Start fade out animation after a short delay
        setTimeout(() => {
            timeUpOverlay.classList.add('fade-out');
            
            // Reset the overlay after animation completes
            setTimeout(() => {
                timeUpOverlay.classList.remove('active', 'fade-out');
            }, 1500); // This matches the duration of the fade-out animation
        }, 800); // Show for 800ms before starting fade out
    }
    
    // Increment the count
    function incrementCount() {
        if (!isTimerRunning) return;
        
        count++;
        countDisplay.textContent = count;
        
        // Add little animation to count
        countDisplay.classList.add('pulse');
        setTimeout(() => {
            countDisplay.classList.remove('pulse');
        }, 300);
    }
    
    // Update player score
    function updatePlayerScore(playerIndex, value) {
        const scoreElement = playerScores[playerIndex];
        if (!scoreElement) return;
        
        const currentScore = parseInt(scoreElement.textContent) || 0;
        const newScore = Math.max(0, currentScore + value);
        scoreElement.textContent = newScore;
        
        // Add little animation to score
        scoreElement.classList.add('pulse');
        setTimeout(() => {
            scoreElement.classList.remove('pulse');
        }, 300);
    }
    
    // Hide all screens
    function hideAllScreens() {
        startScreen.classList.remove('active');
        gameScreen.classList.remove('active');
    }
    
    // Initialize the game
    initGame();
}); 