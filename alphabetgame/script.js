document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const tryAgainButton = document.getElementById('try-again-button');
    const alphabetContainer = document.getElementById('alphabet-container');
    const categoryDisplay = document.getElementById('category-display');
    
    // Game Variables
    let categories = [];
    let currentCategory = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let clickedLetters = 0;
    let lastClickedLetter = null;
    let clickedLettersHistory = [];
    let timer;
    let timeLeft = 10;
    let timerRunning = false;
    let baseTimerValue = 10; // Starting timer value
    let gameOver = false;
    
    // Initialize the game
    init();
    
    // Event Listeners
    startButton.addEventListener('click', startGame);
    tryAgainButton.addEventListener('click', resetGame);
    
    // Functions
    async function init() {
        // Load categories from the file
        await loadCategories();
        
        // We'll create the alphabet buttons when the game starts, not on init
    }
    
    async function loadCategories() {
        try {
            const response = await fetch('categories.txt');
            if (!response.ok) {
                throw new Error('Failed to load categories');
            }
            
            const text = await response.text();
            categories = text.split('\n')
                .map(category => category.trim())
                .filter(category => category.length > 0);
                
            if (categories.length === 0) {
                throw new Error('No categories found');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            categoryDisplay.textContent = 'Error loading categories';
            categories = ['Animali', 'Città', 'Sport', 'Film', 'Cibo', 'Paesi', 'Professioni'];
        }
    }
    
    function createAlphabetButtons() {
        alphabetContainer.innerHTML = '';
        
        // Create a button for each letter with staggered animation delay
        alphabet.forEach((letter, index) => {
            const button = document.createElement('button');
            button.className = 'letter-button';
            button.textContent = letter;
            button.dataset.letter = letter;
            button.style.animationDelay = `${index * 0.05}s`;
            
            // Add click event
            button.addEventListener('click', handleLetterClick);
            
            alphabetContainer.appendChild(button);
        });
    }
    
    // Start the timer
    function startTimer() {
        // Reset time left to the current base value
        timeLeft = baseTimerValue;
        
        // Update display
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.textContent = timeLeft;
        
        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
        }
        
        // Start new timer
        timerRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            // Time's up!
            if (timeLeft <= 0) {
                clearInterval(timer);
                timerRunning = false;
                showTimeUpMessage();
                
                if (!gameOver) {
                    restartTimer();
                }
            }
        }, 1000);
    }
    
    // Create timer with initial display but don't start it
    function createTimer() {
        // Create timer container if it doesn't exist
        let timerContainer = document.getElementById('timer-container');
        if (!timerContainer) {
            timerContainer = document.createElement('div');
            timerContainer.id = 'timer-container';
            
            // Create timer display
            const timerDisplay = document.createElement('div');
            timerDisplay.id = 'timer-display';
            
            // Show base timer value but don't start counting
            timerDisplay.textContent = baseTimerValue;
            
            // Add the timer display to the container
            timerContainer.appendChild(timerDisplay);
            
            // Insert the timer container before the alphabet container
            gameScreen.insertBefore(timerContainer, alphabetContainer);
        }
    }
    
    // Create back button
    function createBackButton() {
        // Create back button if it doesn't exist
        let backButton = document.getElementById('back-button');
        if (!backButton) {
            backButton = document.createElement('button');
            backButton.id = 'back-button';
            backButton.className = 'back-button disabled';
            backButton.innerHTML = '<span class="arrow-icon">&#8592;</span>';
            backButton.title = 'Annulla ultima lettera';
            
            // Add click event
            backButton.addEventListener('click', handleBackButtonClick);
            
            // Get timer container to add the button there
            const timerContainer = document.getElementById('timer-container');
            if (timerContainer) {
                timerContainer.appendChild(backButton);
            } else {
                // Fallback to inserting before the alphabet container
                gameScreen.insertBefore(backButton, alphabetContainer);
            }
        }
    }
    
    // Reset timer
    function resetTimer() {
        if (timerRunning) {
            clearInterval(timer);
            startTimer();
        }
    }
    
    // Stop timer
    function stopTimer() {
        clearInterval(timer);
        timerRunning = false;
    }
    
    // Update timer base value based on number of clicked letters
    function updateTimerBaseValue() {
        // Calculate new base value: 10 seconds + 10 seconds for every 5 letters clicked
        const letterMilestones = Math.floor(clickedLetters / 5);
        baseTimerValue = 10 + (letterMilestones * 10);
        
        // Show message for time increase
        if (clickedLetters > 0 && clickedLetters % 5 === 0) {
            showTimerIncreasedMessage();
        }
    }
    
    // Show timer increased message
    function showTimerIncreasedMessage() {
        // Display the "Timer Increased" message with animation
        const timerMessage = document.createElement('div');
        timerMessage.className = 'timer-message';
        timerMessage.textContent = `Tempo Aumentato: ${baseTimerValue}s!`;
        timerMessage.style.position = 'fixed';
        timerMessage.style.fontSize = '2rem';
        timerMessage.style.fontWeight = 'bold';
        timerMessage.style.color = '#56ab2f';
        timerMessage.style.opacity = '0';
        timerMessage.style.zIndex = '1000';
        timerMessage.style.top = '50%';
        timerMessage.style.left = '50%';
        timerMessage.style.transform = 'translate(-50%, -50%)';
        timerMessage.style.pointerEvents = 'none';
        timerMessage.style.textShadow = '0 0 10px rgba(86, 171, 47, 0.7)';
        timerMessage.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(timerMessage);
        
        // Animate
        setTimeout(() => {
            timerMessage.style.opacity = '1';
            timerMessage.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }, 10);
        
        setTimeout(() => {
            timerMessage.style.opacity = '0';
            timerMessage.style.transform = 'translate(-50%, -50%) translateY(-100px) scale(0.5)';
        }, 1500);
        
        setTimeout(() => {
            document.body.removeChild(timerMessage);
        }, 2500);
    }
    
    // Show game over state
    function showGameOverState() {
        gameOver = true;
        
        // Stop the timer
        stopTimer();
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'game-over-overlay';
        
        // Create game over message
        const gameOverMessage = document.createElement('div');
        gameOverMessage.className = 'game-over-message';
        gameOverMessage.textContent = 'Hai Usato Tutte Le Lettere!';
        
        // Create restart button
        const restartButton = document.createElement('button');
        restartButton.className = 'primary-button restart-button';
        restartButton.textContent = 'Rigioca';
        restartButton.addEventListener('click', () => {
            // Remove overlay
            document.body.removeChild(overlay);
            
            // Reset the game
            resetGame();
            
            // Reset game over flag
            gameOver = false;
        });
        
        // Append elements to overlay
        overlay.appendChild(gameOverMessage);
        overlay.appendChild(restartButton);
        
        // Add overlay to body
        document.body.appendChild(overlay);
    }
    
    // Show time's up message
    function showTimeUpMessage() {
        // Display the "Tempo Scaduto" message with animation
        const timeUpMessage = document.createElement('div');
        timeUpMessage.className = 'time-up-message';
        timeUpMessage.textContent = 'Tempo Scaduto!';
        timeUpMessage.style.position = 'fixed';
        timeUpMessage.style.fontSize = '3rem';
        timeUpMessage.style.fontWeight = 'bold';
        timeUpMessage.style.color = '#FF416C';
        timeUpMessage.style.opacity = '0';
        timeUpMessage.style.zIndex = '1000';
        timeUpMessage.style.top = '50%';
        timeUpMessage.style.left = '50%';
        timeUpMessage.style.transform = 'translate(-50%, -50%)';
        timeUpMessage.style.pointerEvents = 'none';
        timeUpMessage.style.textShadow = '0 0 10px rgba(255, 65, 108, 0.7)';
        timeUpMessage.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(timeUpMessage);
        
        // Animate
        setTimeout(() => {
            timeUpMessage.style.opacity = '1';
            timeUpMessage.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }, 10);
        
        setTimeout(() => {
            timeUpMessage.style.opacity = '0';
            timeUpMessage.style.transform = 'translate(-50%, -50%) translateY(-100px) scale(0.5)';
        }, 1500);
        
        setTimeout(() => {
            document.body.removeChild(timeUpMessage);
        }, 2500);
    }
    
    // Restart timer after timeout
    function restartTimer() {
        setTimeout(() => {
            startTimer();
        }, 1000);
    }
    
    // Check if all letters are used
    function checkGameCompletion() {
        if (clickedLetters >= alphabet.length) {
            // All letters have been used - game over!
            showGameOverState();
        }
    }
    
    function handleLetterClick(event) {
        const button = event.target;
        
        // Skip if button is already disabled or game is over
        if (button.classList.contains('disabled') || gameOver) {
            return;
        }
        
        // Get the letter
        const letter = button.dataset.letter;
        
        // Add to history
        clickedLettersHistory.push(letter);
        
        // Track clicked letters
        clickedLetters++;
        
        // Start timer on first letter click
        if (clickedLetters === 1) {
            startTimer();
        } else {
            // Otherwise just reset the timer
            resetTimer();
        }
        
        // Update timer base value if needed
        updateTimerBaseValue();
        
        // Play sound effect (optional)
        playClickSound();
        
        // Add click animation
        button.classList.add('click-animation');
        
        // Disable the button
        button.classList.add('disabled');
        
        // Add visual feedback
        showLetterFeedback(letter);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            button.classList.remove('click-animation');
        }, 500);
        
        // Enable back button if it's disabled
        const backButton = document.getElementById('back-button');
        if (backButton.classList.contains('disabled')) {
            backButton.classList.remove('disabled');
        }
        
        // Check if game is completed
        checkGameCompletion();
    }
    
    function showLetterFeedback(letter) {
        // Create a floating letter that animates and fades out
        const feedback = document.createElement('div');
        feedback.className = 'letter-feedback';
        feedback.textContent = letter;
        feedback.style.position = 'fixed';
        feedback.style.fontSize = '3rem';
        feedback.style.fontWeight = 'bold';
        feedback.style.color = getRandomColor();
        feedback.style.opacity = '0';
        feedback.style.zIndex = '1000';
        
        // Random position near the center
        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 200 - 100;
        
        feedback.style.top = `calc(50% + ${randomY}px)`;
        feedback.style.left = `calc(50% + ${randomX}px)`;
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.pointerEvents = 'none';
        feedback.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
        feedback.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(feedback);
        
        // Animate
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = `translate(-50%, -50%) translateY(-100px) scale(1.5)`;
        }, 10);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = `translate(-50%, -50%) translateY(-200px) scale(0.5)`;
        }, 500);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 1500);
    }
    
    function getRandomColor() {
        const colors = [
            '#FF416C', '#12c2e9', '#56ab2f', 
            '#6a11cb', '#f953c6', '#c94b4b', 
            '#f46b45', '#e040fb', '#43cea2'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function playClickSound() {
        // Create a quick audio feedback (can be disabled by commenting this out)
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 300 + Math.random() * 200;
            gainNode.gain.value = 0.1;
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.start(0);
            gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
            oscillator.stop(context.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    function getRandomCategory() {
        // Get a random category from the array
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    }
    
    function startGame() {
        // Reset game variables
        clickedLetters = 0;
        baseTimerValue = 10;
        gameOver = false;
        clickedLettersHistory = [];
        
        // Clear alphabet container first to prevent duplicates
        alphabetContainer.innerHTML = '';
        
        // Create alphabet buttons at game start
        createAlphabetButtons();
        
        // Create timer but don't start it yet
        createTimer();
        
        // Create back button
        createBackButton();
        
        // Set a new random category
        setNewCategory();
        
        // Hide start screen and show game screen with animation
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.classList.remove('active');
            gameScreen.classList.add('active');
            gameScreen.style.opacity = '0';
            
            setTimeout(() => {
                gameScreen.style.opacity = '1';
                
                // Add animation to the alphabet buttons
                const buttons = document.querySelectorAll('.letter-button');
                buttons.forEach((button, index) => {
                    button.style.opacity = '0';
                    button.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        button.style.opacity = '1';
                        button.style.transform = 'translateY(0)';
                    }, index * 50);
                });
                
                // Timer will start on first letter click instead
            }, 10);
        }, 300);
    }
    
    function resetGame() {
        // Reset game variables
        clickedLetters = 0;
        baseTimerValue = 10;
        gameOver = false;
        clickedLettersHistory = [];
        
        // Add some animation to the reset process
        const letterButtons = document.querySelectorAll('.letter-button');
        
        // Reset timer
        clearInterval(timer);
        timerRunning = false;
        
        // First fade out all buttons
        letterButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px)';
            }, index * 30);
        });
        
        // Then reset and fade them back in
        setTimeout(() => {
            letterButtons.forEach((button, index) => {
                button.classList.remove('disabled');
                button.classList.remove('click-animation');
                
                setTimeout(() => {
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, index * 30);
            });
            
            // Set new category
            setNewCategory();
            
            // Update timer display to show initial value without starting it
            const timerDisplay = document.getElementById('timer-display');
            if (timerDisplay) {
                timerDisplay.textContent = baseTimerValue;
            }
            
            // Reset back button to disabled state
            const backButton = document.getElementById('back-button');
            if (backButton) {
                backButton.classList.add('disabled');
            }
            
        }, letterButtons.length * 30 + 200);
    }
    
    function setNewCategory() {
        // Fade out the current category
        categoryDisplay.style.opacity = '0';
        categoryDisplay.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            // Get a new random category
            currentCategory = getRandomCategory();
            
            // Update display
            categoryDisplay.textContent = currentCategory;
            
            // Fade in the new category
            categoryDisplay.style.opacity = '1';
            categoryDisplay.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Handle back button click
    function handleBackButtonClick() {
        const backButton = document.getElementById('back-button');
        
        // If button is disabled or there's no history, do nothing
        if (backButton.classList.contains('disabled') || clickedLettersHistory.length === 0 || gameOver) {
            return;
        }
        
        // Get the last clicked letter from history
        const lastLetter = clickedLettersHistory.pop();
        
        // Find the button for this letter
        const letterButton = document.querySelector(`.letter-button[data-letter="${lastLetter}"]`);
        
        if (letterButton) {
            // Re-enable the button
            letterButton.classList.remove('disabled');
            
            // Decrease clicked letters count
            clickedLetters--;
            
            // If we just removed the first and only letter, stop the timer
            if (clickedLetters === 0) {
                clearInterval(timer);
                timerRunning = false;
                const timerDisplay = document.getElementById('timer-display');
                if (timerDisplay) {
                    timerDisplay.textContent = baseTimerValue;
                }
            } else {
                // Otherwise, update timer base value
                updateTimerBaseValue();
            }
            
            // Show visual feedback
            showUndoFeedback(lastLetter);
            
            // If there's no more history, disable the back button
            if (clickedLettersHistory.length === 0) {
                backButton.classList.add('disabled');
            }
        }
    }
    
    // Show undo feedback animation
    function showUndoFeedback(letter) {
        // Create a floating letter that animates and fades out
        const feedback = document.createElement('div');
        feedback.className = 'letter-feedback undo-feedback';
        feedback.textContent = letter;
        feedback.style.position = 'fixed';
        feedback.style.fontSize = '3rem';
        feedback.style.fontWeight = 'bold';
        feedback.style.color = '#bb86fc';
        feedback.style.opacity = '0';
        feedback.style.zIndex = '1000';
        
        feedback.style.top = '50%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.pointerEvents = 'none';
        feedback.style.textShadow = '0 0 10px rgba(187, 134, 252, 0.7)';
        feedback.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(feedback);
        
        // Animate
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }, 10);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) translateY(100px) scale(0.5)';
        }, 500);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 1500);
    }
}); 