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
    
    // Initialize the game
    init();
    
    // Event Listeners
    startButton.addEventListener('click', startGame);
    tryAgainButton.addEventListener('click', resetGame);
    
    // Functions
    async function init() {
        // Load categories from the file
        await loadCategories();
        
        // Generate alphabet buttons
        createAlphabetButtons();
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
    
    function handleLetterClick(event) {
        const button = event.target;
        
        // Skip if button is already disabled
        if (button.classList.contains('disabled')) {
            return;
        }
        
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
                
                // Set initial category
                setNewCategory();
            }, 50);
        }, 300);
    }
    
    function resetGame() {
        // Add some animation to the reset process
        const letterButtons = document.querySelectorAll('.letter-button');
        
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