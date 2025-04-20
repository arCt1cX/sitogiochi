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
        
        // Create a button for each letter
        alphabet.forEach(letter => {
            const button = document.createElement('button');
            button.className = 'letter-button';
            button.textContent = letter;
            button.dataset.letter = letter;
            
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
        
        // Add click animation
        button.classList.add('click-animation');
        
        // Disable the button
        button.classList.add('disabled');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            button.classList.remove('click-animation');
        }, 300);
    }
    
    function getRandomCategory() {
        // Get a random category from the array
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    }
    
    function startGame() {
        // Hide start screen and show game screen
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Set initial category
        setNewCategory();
    }
    
    function resetGame() {
        // Reset alphabet buttons
        const letterButtons = document.querySelectorAll('.letter-button');
        letterButtons.forEach(button => {
            button.classList.remove('disabled');
            button.classList.remove('click-animation');
        });
        
        // Set new category
        setNewCategory();
    }
    
    function setNewCategory() {
        // Get a new random category
        currentCategory = getRandomCategory();
        
        // Update display
        categoryDisplay.textContent = currentCategory;
    }
}); 