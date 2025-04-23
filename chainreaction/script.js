document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Start Screen
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    
    // DOM Elements - Game Screen
    const gameScreen = document.getElementById('gameScreen');
    const timerEl = document.getElementById('timer');
    const scoreEl = document.getElementById('score');
    const passesEl = document.getElementById('passes');
    const wordDisplay = document.getElementById('wordDisplay');
    const correctButton = document.getElementById('correctButton');
    const wrongButton = document.getElementById('wrongButton');
    const passButton = document.getElementById('passButton');
    const resetButton = document.getElementById('resetButton');
    const continueButton = document.getElementById('continueButton');
    
    // DOM Elements - Game Over Screen
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreEl = document.getElementById('finalScore');
    const playAgainButton = document.getElementById('playAgainButton');
    const mainMenuButton = document.getElementById('mainMenuButton');
    
    // Game Variables
    let words = [];
    let currentWord = '';
    let score = 0;
    let passesRemaining = 3;
    let timeRemaining = 60;
    let timerInterval = null;
    let isPaused = false;
    
    // Fetch words from the appropriate words file based on language
    async function fetchWords() {
        try {
            // Get user language
            const lang = getUserLanguage();
            
            // Determine which file to load
            const wordFile = lang === 'en' ? 'words_en.txt' : 'words.txt';
            
            const response = await fetch(wordFile);
            if (!response.ok) {
                throw new Error('Failed to load words file');
            }
            const text = await response.text();
            
            // Split the text by new lines and filter out any empty lines
            return text.split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0);
        } catch (error) {
            console.error('Error loading words:', error);
            
            // Get user language for fallback
            const lang = getUserLanguage();
            
            // Fallback list of words in case of error
            return lang === 'en' ? 
                // English fallback words
                [
                    'Love', 'Joy', 'Fear', 'Dream', 'Hope', 
                    'Time', 'Party', 'Table', 'Book', 'Music',
                    'Pizza', 'Sea', 'Cinema', 'Travel', 'Family'
                ] : 
                // Italian fallback words
                [
                    'Amore', 'Gioia', 'Paura', 'Sogno', 'Speranza', 
                    'Tempo', 'Festa', 'Tavolo', 'Libro', 'Musica',
                    'Pizza', 'Mare', 'Cinema', 'Viaggio', 'Famiglia'
                ];
        }
    }
    
    // Initialize the game
    async function initGame() {
        words = await fetchWords();
        console.log("Loaded words:", words.length); // Debug log
        
        // Button event listeners
        startButton.addEventListener('click', startGame);
        correctButton.addEventListener('click', handleCorrect);
        wrongButton.addEventListener('click', handleWrong);
        passButton.addEventListener('click', handlePass);
        resetButton.addEventListener('click', resetGame);
        continueButton.addEventListener('click', continueGame);
        playAgainButton.addEventListener('click', resetGame);
        mainMenuButton.addEventListener('click', showStartScreen);
    }
    
    // Start the game
    function startGame() {
        hideAllScreens();
        gameScreen.classList.add('active');
        
        // Reset game state
        score = 0;
        passesRemaining = 3;
        timeRemaining = 60;
        isPaused = false;
        
        // Update UI
        updateUI();
        
        // Initially hide continue button and show action buttons
        correctButton.style.display = 'block';
        wrongButton.style.display = 'block';
        passButton.style.display = 'block';
        continueButton.style.display = 'none';
        
        // Get first word
        getNewWord();
        
        // Start timer
        startTimer();
    }
    
    // Get a random word
    function getNewWord() {
        if (words.length === 0) {
            console.error("No words available!");
            // Get translations
            const lang = getUserLanguage();
            const translations = gameTranslations[lang] || gameTranslations['en'];
            wordDisplay.textContent = translations.loadError;
            return;
        }
        
        // Get a random index
        const randomIndex = Math.floor(Math.random() * words.length);
        currentWord = words[randomIndex];
        wordDisplay.textContent = currentWord;
    }
    
    // Start the timer
    function startTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerInterval = setInterval(() => {
            if (!isPaused) {
                timeRemaining--;
                timerEl.textContent = timeRemaining;
                
                if (timeRemaining <= 0) {
                    gameOver();
                }
            }
        }, 1000);
    }
    
    // Handle correct answer
    function handleCorrect() {
        score++;
        pauseGame();
        updateUI();
    }
    
    // Handle wrong answer
    function handleWrong() {
        score = Math.max(0, score - 1); // Ensure score doesn't go below 0
        pauseGame();
        updateUI();
    }
    
    // Handle pass
    function handlePass() {
        if (passesRemaining > 0) {
            passesRemaining--;
            pauseGame();
            updateUI();
        }
    }
    
    // Pause the game
    function pauseGame() {
        isPaused = true;
        
        // Hide action buttons and show continue button
        correctButton.style.display = 'none';
        wrongButton.style.display = 'none';
        passButton.style.display = 'none';
        continueButton.style.display = 'block';
    }
    
    // Continue the game
    function continueGame() {
        isPaused = false;
        
        // Show action buttons and hide continue button
        correctButton.style.display = 'block';
        wrongButton.style.display = 'block';
        passButton.style.display = 'block';
        continueButton.style.display = 'none';
        
        // Get new word
        getNewWord();
    }
    
    // Game over
    function gameOver() {
        clearInterval(timerInterval);
        hideAllScreens();
        finalScoreEl.textContent = score;
        gameOverScreen.classList.add('active');
    }
    
    // Reset the game
    function resetGame() {
        hideAllScreens();
        gameScreen.classList.add('active');
        
        // Reset game state
        score = 0;
        passesRemaining = 3;
        timeRemaining = 60;
        isPaused = false;
        
        // Update UI
        updateUI();
        
        // Initially hide continue button and show action buttons
        correctButton.style.display = 'block';
        wrongButton.style.display = 'block';
        passButton.style.display = 'block';
        continueButton.style.display = 'none';
        
        // Get first word
        getNewWord();
        
        // Clear any existing interval and start timer again
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        startTimer();
    }
    
    // Show start screen
    function showStartScreen() {
        hideAllScreens();
        startScreen.classList.add('active');
        
        // Clear timer interval if it exists
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    // Update UI elements
    function updateUI() {
        timerEl.textContent = timeRemaining;
        scoreEl.textContent = score;
        passesEl.textContent = passesRemaining;
        
        // Disable pass button if no passes remaining
        if (passesRemaining <= 0) {
            passButton.disabled = true;
            passButton.style.opacity = '0.5';
        } else {
            passButton.disabled = false;
            passButton.style.opacity = '1';
        }
    }
    
    // Hide all screens
    function hideAllScreens() {
        startScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        gameOverScreen.classList.remove('active');
    }
    
    // Initialize the game
    initGame();
}); 