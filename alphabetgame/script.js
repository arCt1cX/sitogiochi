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
    let timer;
    let timeLeft = 30;
    let timerRunning = false;
    
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
    
    // Create timer element
    function createTimer() {
        // Create timer container if it doesn't exist
        let timerContainer = document.getElementById('timer-container');
        if (!timerContainer) {
            timerContainer = document.createElement('div');
            timerContainer.id = 'timer-container';
            
            // Create timer display
            const timerDisplay = document.createElement('div');
            timerDisplay.id = 'timer-display';
            timerDisplay.textContent = '30';
            
            // Add the timer display to the container
            timerContainer.appendChild(timerDisplay);
            
            // Insert the timer container before the alphabet container
            gameScreen.insertBefore(timerContainer, alphabetContainer);
        }
    }
    
    // Start the timer
    function startTimer() {
        // Reset time left
        timeLeft = 30;
        
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
                restartTimer();
            }
        }, 1000);
    }
    
    // Reset timer
    function resetTimer() {
        if (timerRunning) {
            clearInterval(timer);
            startTimer();
        }
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
    
    function handleLetterClick(event) {
        const button = event.target;
        
        // Skip if button is already disabled
        if (button.classList.contains('disabled')) {
            return;
        }
        
        // Reset the timer
        resetTimer();
        
        // Play sound effect (optional)
        playClickSound();
        
        // Add click animation
        button.classList.add('click-animation');
        
        // Disable the button
        button.classList.add('disabled');
        
        // Track clicked letters
        clickedLetters++;
        
        // Add visual feedback
        const letter = button.dataset.letter;
        showLetterFeedback(letter);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            button.classList.remove('click-animation');
        }, 500);
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
        // Clear alphabet container first to prevent duplicates
        alphabetContainer.innerHTML = '';
        
        // Create alphabet buttons at game start
        createAlphabetButtons();
        
        // Create and start the timer
        createTimer();
        
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
                
                // Start the timer after animations complete
                setTimeout(() => {
                    startTimer();
                }, buttons.length * 50 + 100);
            }, 10);
        }, 300);
    }
    
    function resetGame() {
        // Add some animation to the reset process
        const letterButtons = document.querySelectorAll('.letter-button');
        
        // Reset timer
        resetTimer();
        
        // First fade out all buttons
        letterButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px)';
            }, index * 30);
        });
        
        // Then reset and fade them back in
        setTimeout(() => {
            clickedLetters = 0;
            
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
}); 