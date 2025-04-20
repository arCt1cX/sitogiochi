/**
 * Image Guessing Game
 * A browser-based guessing game that works completely offline
 */

document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const startScreen = document.getElementById('start-screen');
    const playerSetupScreen = document.getElementById('player-setup-screen');
    const playerTransitionScreen = document.getElementById('player-transition-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const openPlayerSetupButton = document.getElementById('open-player-setup');
    const startButton = document.getElementById('start-game');
    const playAgainButton = document.getElementById('play-again');
    const submitButton = document.getElementById('submit-guess');
    const prevImageButton = document.getElementById('prev-image');
    const nextImageButton = document.getElementById('next-image');
    const startPlayerTurnButton = document.getElementById('start-player-turn');
    
    const playerCountSelect = document.getElementById('player-count');
    const playerNamesContainer = document.getElementById('player-names-container');
    
    const guessInput = document.getElementById('guess-input');
    const gameImage = document.getElementById('game-image');
    const feedbackDiv = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');
    const currentPlayerNameElement = document.getElementById('current-player-name');
    const nextPlayerNameElement = document.getElementById('next-player-name');
    const playerScoresElement = document.getElementById('player-scores');
    const currentQuestionElement = document.getElementById('current-question');
    const resultDetailsElement = document.getElementById('result-details');
    const timeRemainingElement = document.getElementById('time-remaining');
    const indicatorCircles = document.querySelectorAll('.circle');
    const currentCategoryElement = document.getElementById('current-category');

    // Game state
    let categories = [];
    let allPlayers = []; // Store players for the whole game
    let playerRounds = []; // Array to store each player's round images
    let currentQuestionIndex = 0;
    let currentPlayerIndex = 0;
    let players = [];
    let roundResults = [];
    let currentRoundNumber = 1;
    let totalRounds = 3;
    let timer = null;
    let timeRemaining = 60;
    let questionStatuses = []; // Array to track the status of each image: null, 'correct', 'incorrect', or 'pending'
    
    // Sound effects (optional)
    const correctSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAqAABHnwAFBwkMDhATFRcaHB8hJCYpKy4wMzU4Ojs+QUNGSEtNUFJVV1pcX2FkZ2lsbnFzdnl7foGDhoiLjZCSlZeanZ+ipKeprK6xtLa5vL7BxMbJy87R09bY293g4uXn6uzu8fP2+fv+AAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAXaAAAAAAAAR5+fSpwoAAAAAAAAAAAAAAAAAAD/+0DEAAP7uuzoYwkAJ3VNOt7Pg3B7QwdgAsK6WTEsxoiWpnrJmDNDIwRtCY+g8BBIiDtHcMjAcMTCYAwCAmDkNzBIBuVP/1QLJcHgBmBYDAQMwNhmAK10MCQCzAzAcGA4AIHBMLTJm0MFgBwYBGCAHA2DphR+kDgCwSAYwFAGDgdHYZ+k14qigAYJgJAQCAAHgKHgRB/+NUB4gFwUAIwHAcS+VQj9rn//1QygNB3C//tAxAcAEn7s8f5iAAp8ZqH/sOAFLVBJ0iNTTy1DIMzIJPLTO3/xAAJDqIvGp9C5wJeJh3+LuH/5EAKjABG2aLu69F3C7sTzAEOwHBUJUNw6gdF36t80QmDIcCCFWXDtF3dF3d4O4nGQXB4MXSKlRuIgouIl3+r/yrVbiyUMDBBwfJcFYuAGTjXqP/7NKtQw2d8qsP/7QMQDARKq0uz+HgCKGFXh/5hQCbgzOYuIcUWkBIKQh/KqgxarILDEoJiYUZSfJjTaZMYU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');
    const incorrectSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAsAAAZyAAICgoNDQ8PEhIUFBcXGRkcHB4eISEjIyYmKCgrKy0tMDA0NDY2OTk7Oz4+QUFDRUhIS0tOTlFRU1NWVllZXFxfX2JiZWVnZ2pqbW1vb3JydXV3d3p6fX2AgIKChYWIiIqKjY2Pj5KSlZWXl5qanJyfn6KipKSnp6qqrKyvr7KytbW3t7q6vLy/v8LCxcXHx8rKzMzPz9LS1dXX19ra3d3f3+Li5eXn5+rq7e3v7/Ly9fX39/r6/f0AAAA5TEFNRTMuMTAwBLQAAAAAAAAAABUgJAjpTQABzAABmchOO7KBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tAxAADwlwm9k5xAAhaV17dyKABECEVdjggAAkRFkcAABURc3K3K3KwICAgFQMDAwMDAwMYJ0CAoCAgFQoCpytytwICA3NzAwMDAwMD/K3AgCpwICAgIEaP/////+VuVuVg3Nzc3NzcqoHR0f/////KqoCAzNzc3Nzf///////++gICAgKqp0dHR0f/////+VUDp//6HAwMBAQEBGRkZGRnKqoCA3P//6qB0dH//tAxFuAE1J139vYbopP3rb7OqABqlVVf9+qodHR/wdOjAa+jt3a///70DoGB0dHR0dH//////6wPHDh////////kVERGPEDBP////////hgQEBR41SsrKysrK////////yqqqqsrKysr/////////////yssrP///////////6f/////////////////////////////////////////////////////7QMRFg9LaotbiMzxKIFrQsARAH////////////9JWWWXlf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////tAxF0AEiAAvYAQAAAAAA0gAAAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7QMRLAAAAAaQAAAAAAAAA0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');

    // Cache for offline images
    let imageCache = {};

    // Event listeners for game navigation
    openPlayerSetupButton.addEventListener('click', openPlayerSetup);
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', () => {
        // Start a new round or go back to player setup if all rounds are finished
        if (currentRoundNumber < totalRounds) {
            currentRoundNumber++;
            startNextRound();
        } else {
            openPlayerSetup();
        }
    });
    submitButton.addEventListener('click', checkAnswer);
    prevImageButton.addEventListener('click', navigateToPreviousImage);
    nextImageButton.addEventListener('click', navigateToNextImage);
    startPlayerTurnButton.addEventListener('click', startCurrentPlayerTurn);
    
    // Add click listeners to indicator circles for navigation
    indicatorCircles.forEach((circle, index) => {
        circle.addEventListener('click', () => navigateToImage(index));
    });
    
    // Player count selection changes the input fields
    playerCountSelect.addEventListener('change', updatePlayerInputs);
    
    // Handle Enter key press
    guessInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter' && !submitButton.disabled) {
            // Only check answer if the submit button is not disabled
            // and there's text in the input
            if (guessInput.value.trim() !== '') {
                checkAnswer();
            } else {
                // Show message requiring input
                feedbackDiv.textContent = "Please enter a guess before submitting!";
                feedbackDiv.className = "feedback incorrect";
                feedbackDiv.classList.remove("hidden");
                guessInput.focus();
            }
        }
    });
    
    // Initialize the game
    initGame();

    /**
     * Initialize the game by loading available categories
     */
    async function initGame() {
        try {
            // Try to load categories from the file system
            const response = await fetch('categories.json');
            
            if (response.ok) {
                const data = await response.json();
                categories = data;
                console.log("Successfully loaded categories from categories.json");
                console.log(`Loaded ${categories.length} categories with a total of ${categories.reduce((sum, cat) => sum + cat.items.length, 0)} items`);
                console.log("Categories:", categories.map(cat => `${cat.name} (${cat.items.length} items)`));
                
                // Pre-check if any image directories exist
                console.log("Checking image directories for each category...");
                for (const category of categories) {
                    try {
                        // Create and test a sample image path from this category
                        if (category.items && category.items.length > 0) {
                            const sampleItem = category.items[0];
                            const samplePath = `img/${category.name}/${sampleItem.replace(/ /g, '_').toLowerCase()}.jpg`;
                            console.log(`Testing path for ${category.name}: ${samplePath}`);
                            
                            // Try to load the sample image
                            const exists = await checkImageExists(samplePath);
                            console.log(`${category.name} directory test: ${exists ? 'SUCCESS' : 'FAILED'}`);
                        } else {
                            console.warn(`Category ${category.name} has no items`);
                        }
                    } catch (e) {
                        console.warn(`Error checking directory for ${category.name}:`, e);
                    }
                }
            } else {
                console.warn("Could not load categories.json. Using fallback data.");
                // If categories.json doesn't exist, scan for categories manually
                await scanCategories();
            }
        } catch (error) {
            console.error('Error initializing game:', error);
            console.warn("Using fallback data.");
            // Fallback to manual category scanning
            await scanCategories();
        }
    }

    /**
     * Open the player setup screen
     */
    function openPlayerSetup() {
        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        playerTransitionScreen.classList.add('hidden');
        playerSetupScreen.classList.remove('hidden');
        
        // Reset round number
        currentRoundNumber = 1;
        
        // Reset player count to 1 and update inputs
        playerCountSelect.value = "1";
        updatePlayerInputs();
    }
    
    /**
     * Show the player transition screen
     */
    function showPlayerTransition(playerIndex) {
        // Update next player name
        nextPlayerNameElement.textContent = players[playerIndex].name;
        
        // Hide game screen and show transition screen
        gameScreen.classList.add('hidden');
        playerTransitionScreen.classList.remove('hidden');
    }
    
    /**
     * Start the current player's turn after transition
     */
    function startCurrentPlayerTurn() {
        // Hide transition screen and show game screen
        playerTransitionScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Begin the round for the current player
        startRound();
    }
    
    /**
     * Update player input fields based on selected player count
     */
    function updatePlayerInputs() {
        const playerCount = parseInt(playerCountSelect.value);
        playerNamesContainer.innerHTML = '';
        
        for (let i = 1; i <= playerCount; i++) {
            const playerInput = document.createElement('div');
            playerInput.className = 'player-input';
            
            const label = document.createElement('label');
            label.setAttribute('for', `player${i}-name`);
            label.textContent = `Player ${i}:`;
            
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', `player${i}-name`);
            input.setAttribute('placeholder', `Player ${i}`);
            
            // Don't prefill the name, just use placeholder
            input.value = '';
            
            playerInput.appendChild(label);
            playerInput.appendChild(input);
            playerNamesContainer.appendChild(playerInput);
        }
    }

    /**
     * Scan for categories by checking directories in the img folder
     */
    async function scanCategories() {
        console.log("Scanning for categories...");
        categories = [
            { name: 'actors', items: [] },
            { name: 'monuments', items: [] },
            { name: 'singers', items: [] },
            { name: 'politicians', items: [] },
            { name: 'cartoons', items: [] },
            { name: 'football teams', items: [] },
            { name: 'capitals', items: [] },
            { name: 'superheroes', items: [] },
            { name: 'animals', items: [] },
            { name: 'flags', items: [] },
            { name: 'historical figures', items: [] }
        ];
        
        // For each category, try to populate items by checking the img directory
        for (const category of categories) {
            // In a web environment, we can't read directories directly
            // So we'll use a fallback approach:
            // Try to load a few common items that are likely to exist
            
            // We'll manually add some common items for each category
            switch(category.name) {
                case 'actors':
                    category.items = ['Tom Hanks', 'Brad Pitt', 'Leonardo DiCaprio', 'Keanu Reeves', 
                                      'Scarlett Johansson', 'Robert Downey Jr', 'Meryl Streep'];
                    break;
                case 'monuments':
                    category.items = ['Eiffel Tower', 'Statue of Liberty', 'Colosseum', 'Taj Mahal',
                                      'Great Wall of China', 'Big Ben', 'Stonehenge'];
                    break;
                case 'singers':
                    category.items = ['Lady Gaga', 'Beyoncé', 'Ed Sheeran', 'Taylor Swift', 
                                     'Adele', 'Bruno Mars', 'Billie Eilish'];
                    break;
                case 'politicians':
                    category.items = ['Joe Biden', 'Donald Trump', 'Barack Obama', 'Vladimir Putin',
                                     'Angela Merkel', 'Justin Trudeau', 'Boris Johnson'];
                    break;
                case 'cartoons':
                    category.items = ['Mickey Mouse', 'Homer Simpson', 'SpongeBob SquarePants', 'Bugs Bunny',
                                     'Scooby-Doo', 'Tom and Jerry', 'Shrek'];
                    break;
                case 'football teams':
                    category.items = ['Juventus FC', 'FC Barcelona', 'Real Madrid CF', 'Manchester United FC',
                                     'Liverpool FC', 'Bayern Munich', 'Paris Saint-Germain FC'];
                    break;
                    category.items = ['Apple', 'Google', 'Microsoft', 'Amazon', 'Facebook',
                                     'Coca-Cola', 'Nike'];
                    break;
                case 'capitals':
                    category.items = ['Roma', 'Parigi', 'Londra', 'Berlino', 'Madrid',
                                     'Washington D.C.', 'Tokyo'];
                    break;
                case 'superheroes':
                    category.items = ['Superman', 'Batman', 'Spider-Man', 'Iron Man', 'Wonder Woman',
                                     'Captain America', 'Hulk'];
                    break;
                case 'animals':
                    category.items = ['Leone', 'Tigre', 'Elefante', 'Giraffa', 'Zebra',
                                     'Orso', 'Lupo'];
                    break;
                case 'flags':
                    category.items = ['Italia', 'Francia', 'Germania', 'Spagna', 'Regno Unito',
                                     'Stati Uniti', 'Giappone'];
                    break;
                case 'historical figures':
                    category.items = ['Giulio Cesare', 'Alessandro Magno', 'Napoleone Bonaparte', 
                                     'Leonardo da Vinci', 'Albert Einstein', 'Winston Churchill', 'Abraham Lincoln'];
                    break;
            }
        }
        
        console.log("Scanned categories:", categories);
    }

    /**
     * Check if an image file exists at the specified path
     */
    function checkImageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
        });
    }

    /**
     * Generate an in-memory placeholder image when a real image is not found
     */
    function generatePlaceholderImage(name, category) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 600;  // Increased from 400
        canvas.height = 450; // Increased from 300
        
        // Get the context
        const ctx = canvas.getContext('2d');
        
        // Fill the background with a light color
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add a border
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 8;  // Increased from 5
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
        
        // Write the category
        ctx.fillStyle = '#555';
        ctx.font = 'bold 28px Arial';  // Increased from 20px
        ctx.textAlign = 'center';
        ctx.fillText(category.toUpperCase(), canvas.width / 2, 60);  // Adjusted position
        
        // Write the item name
        ctx.fillStyle = '#333';
        ctx.font = 'bold 42px Arial';  // Increased from 30px
        ctx.textAlign = 'center';
        
        // Handle long names by splitting them if needed
        const words = name.split(' ');
        if (words.length > 3) {
            // For very long names, split into multiple lines
            const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
            const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ');
            
            ctx.fillText(firstLine, canvas.width / 2, canvas.height / 2 - 20);
            ctx.fillText(secondLine, canvas.width / 2, canvas.height / 2 + 40);
        } else {
            // For shorter names, just center them
            ctx.fillText(name, canvas.width / 2, canvas.height / 2);
        }
        
        return canvas.toDataURL();
    }

    /**
     * Setup players based on input fields
     */
    function setupPlayers() {
        const playerCount = parseInt(playerCountSelect.value);
        players = [];
        allPlayers = []; // Reset the stored players
        
        for (let i = 1; i <= playerCount; i++) {
            const nameInput = document.getElementById(`player${i}-name`);
            // Use the placeholder text as default if no name is provided
            const playerName = nameInput.value.trim() || `Player ${i}`;
            
            const player = {
                name: playerName,
                score: 0,
                roundScores: [0, 0, 0] // Scores for each round
            };
            
            players.push(player);
            allPlayers.push(player); // Store in our persistent array
        }
        
        console.log("Players setup:", players);
    }

    /**
     * Start a new game
     */
    function startGame() {
        console.log("Starting a new game for round 1...");
        
        // Setup players from input fields
        setupPlayers();
        
        // Reset game state
        currentQuestionIndex = 0;
        currentPlayerIndex = 0;
        roundResults = [];
        playerRounds = []; // Reset player rounds
        currentRoundNumber = 1;
        
        // Show game screen
        playerSetupScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Generate all player rounds for the current round
        generatePlayerRounds();
        
        // Start first round
        startRound();
    }

    /**
     * Generate rounds for all players
     */
    function generatePlayerRounds() {
        playerRounds = []; // Clear existing rounds
        
        // For each player, generate a unique set of questions
        for (let i = 0; i < players.length; i++) {
            if (!categories || categories.length === 0 || categories.every(cat => !cat.items || cat.items.length === 0)) {
                console.error("No category data available for player " + (i+1) + ". Using fallback data.");
                playerRounds.push(generateFallbackItems());
            } else {
                playerRounds.push(generateRandomItems());
            }
        }
        
        console.log("Generated rounds for all players:", playerRounds);
    }

    /**
     * Start the next round
     */
    function startNextRound() {
        console.log(`Starting round ${currentRoundNumber}...`);
        
        // Reset state for the new round
        currentQuestionIndex = 0;
        currentPlayerIndex = 0;
        
        // Generate new rounds for all players
        generatePlayerRounds();
        
        // Hide result screen and show game screen
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Start the round
        startRound();
    }

    /**
     * Start a round for the current player
     */
    function startRound() {
        console.log(`Round ${currentRoundNumber}: Player ${currentPlayerIndex + 1} (${players[currentPlayerIndex].name})`);
        
        // Current player's round is already set in playerRounds[currentPlayerIndex]
        
        // Reset question statuses for this player's turn
        questionStatuses = [null, null, null, null, null];
        
        // Reset UI
        scoreElement.textContent = players[currentPlayerIndex].roundScores[currentRoundNumber - 1];
        currentPlayerNameElement.textContent = players[currentPlayerIndex].name;
        currentQuestionIndex = 0;
        
        // Enable navigation buttons
        prevImageButton.disabled = true; // Disabled at first question
        nextImageButton.disabled = false;
        submitButton.disabled = false;
        guessInput.disabled = false;
        
        // Update question number
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        
        // Clear feedback
        feedbackDiv.classList.add('hidden');
        
        // Start the timer
        startTimer();
        
        // Update circle indicators
        updateCircleIndicators();
        
        // Load the first question
        loadQuestion(false); // Don't restart timer as we just started it
    }

    /**
     * Generate a set of random items for a player's round
     */
    function generateRandomItems() {
        const playerRound = [];
        
        // Get all categories that have items
        const validCategories = categories.filter(cat => cat.items && cat.items.length > 0);
        
        if (validCategories.length === 0) {
            console.error("No valid categories with items found.");
            return generateFallbackItems();
        }
        
        console.log("Valid categories for selection:", validCategories.map(c => `${c.name} (${c.items.length} items)`));
        
        // Shuffle the categories to ensure random selection
        const shuffledCategories = [...validCategories];
        shuffleArray(shuffledCategories);
        console.log("Shuffled categories for selection:", shuffledCategories.map(c => c.name));
        
        // Try to select one item from the first 5 shuffled categories
        // This ensures we get a good mix of categories
        const categoriesToUse = shuffledCategories.slice(0, Math.min(5, shuffledCategories.length));
        console.log("Categories selected for this round:", categoriesToUse.map(c => c.name));
        
        // Select one item from each selected category
        for (const category of categoriesToUse) {
            const randomIndex = Math.floor(Math.random() * category.items.length);
            const item = category.items[randomIndex];
            
            // Create the file path
            const imagePath = `img/${category.name}/${item.replace(/ /g, '_').toLowerCase()}.jpg`;
            console.log(`Adding item from ${category.name}: ${item} (${imagePath})`);
            
            playerRound.push({
                category: category.name,
                item: item,
                imagePath: imagePath
            });
        }
        
        // If we don't have 5 items yet (because there weren't enough valid categories),
        // add more from the available categories
        if (playerRound.length < 5) {
            console.log(`Only have ${playerRound.length} items, need to add more...`);
            
            // Keep track of items we've already chosen
            const chosenItems = playerRound.map(item => `${item.category}-${item.item}`);
            
            // Continue adding items until we have 5 or run out of unique items
            let attempts = 0;
            while (playerRound.length < 5 && attempts < 100) { // Add an attempts limit to prevent infinite loops
                attempts++;
                
                // Randomly select a category
                const categoryIndex = Math.floor(Math.random() * validCategories.length);
                const category = validCategories[categoryIndex];
                
                // Randomly select an item from that category
                const itemIndex = Math.floor(Math.random() * category.items.length);
                const item = category.items[itemIndex];
                
                // Check if this item is already in our round
                const itemKey = `${category.name}-${item}`;
                if (!chosenItems.includes(itemKey)) {
                    chosenItems.push(itemKey);
                    
                    // Create the file path
                    const imagePath = `img/${category.name}/${item.replace(/ /g, '_').toLowerCase()}.jpg`;
                    console.log(`Adding additional item from ${category.name}: ${item} (${imagePath})`);
                    
                    playerRound.push({
                        category: category.name,
                        item: item,
                        imagePath: imagePath
                    });
                }
            }
            
            if (playerRound.length < 5) {
                console.warn(`Could not find enough unique items, only have ${playerRound.length}`);
                
                // Fill remaining slots with fallback items if needed
                const fallbackItems = generateFallbackItems();
                while (playerRound.length < 5 && fallbackItems.length > 0) {
                    playerRound.push(fallbackItems.pop());
                }
            }
        }
        
        // Shuffle the round
        const shuffledRound = [...playerRound]; // Create a copy to shuffle
        shuffleArray(shuffledRound);
        console.log("Final round items:", shuffledRound.map(item => `${item.category}: ${item.item}`));
        return shuffledRound;
    }

    /**
     * Generate fallback items for a player's round
     */
    function generateFallbackItems() {
        console.log("Using fallback items for a player's round");
        
        // Create a larger pool of fallback items from all categories
        const fallbackPool = [
            {
                category: 'actors',
                item: 'Keanu Reeves',
                imagePath: 'img/actors/keanu_reeves.jpg'
            },
            {
                category: 'monuments',
                item: 'Eiffel Tower',
                imagePath: 'img/monuments/eiffel_tower.jpg'
            },
            {
                category: 'singers',
                item: 'Lady Gaga',
                imagePath: 'img/singers/lady_gaga.jpg'
            },
            {
                category: 'politicians',
                item: 'Joe Biden',
                imagePath: 'img/politicians/joe_biden.jpg'
            },
            {
                category: 'cartoons',
                item: 'Homer Simpson',
                imagePath: 'img/cartoons/homer_simpson.jpg'
            },
            {
                category: 'football teams',
                item: 'Juventus FC',
                imagePath: 'img/football teams/juventus_fc.jpg'
            },
            {
                category: 'capitals',
                item: 'Roma',
                imagePath: 'img/capitals/roma.jpg'
            },
            {
                category: 'superheroes',
                item: 'Superman',
                imagePath: 'img/superheroes/superman.jpg'
            },
            {
                category: 'animals',
                item: 'Leone',
                imagePath: 'img/animals/leone.jpg'
            },
            {
                category: 'flags',
                item: 'Italia',
                imagePath: 'img/flags/italia.jpg'
            },
            {
                category: 'historical figures',
                item: 'Leonardo da Vinci',
                imagePath: 'img/historical figures/leonardo_da_vinci.jpg'
            }
        ];
        
        // Randomly select 5 different items from the pool
        const shuffledPool = [...fallbackPool]; // Create a copy to shuffle
        shuffleArray(shuffledPool);
        
        // Take the first 5 items
        return shuffledPool.slice(0, 5);
    }

    /**
     * Check if the user's answer is correct
     */
    function checkAnswer() {
        // Get the current player's round items
        const currentPlayerRound = playerRounds[currentPlayerIndex];
        
        // Safety check
        if (currentQuestionIndex >= 5 || !currentPlayerRound || !currentPlayerRound[currentQuestionIndex]) {
            console.error("Invalid question index or missing question data");
            return;
        }
        
        // If this question was already answered or timer is up, don't allow submission
        if (questionStatuses[currentQuestionIndex] === 'correct' || 
            questionStatuses[currentQuestionIndex] === 'incorrect' || 
            timeRemaining <= 0) {
            return;
        }
        
        // Disable the submit button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.style.opacity = "0.5";
        submitButton.style.cursor = "not-allowed";
        
        const currentQuestion = currentPlayerRound[currentQuestionIndex];
        const userAnswer = guessInput.value.trim().toLowerCase();
        
        // Require the user to type something before submitting
        if (!userAnswer) {
            // Alert the user they need to enter a guess
            feedbackDiv.textContent = "Please enter a guess before submitting!";
            feedbackDiv.className = "feedback incorrect";
            feedbackDiv.classList.remove("hidden");
            
            // Focus on the input field
            guessInput.focus();
            
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.style.opacity = "1";
            submitButton.style.cursor = "pointer";
            
            return;
        }
        
        const correctAnswer = currentQuestion.item.toLowerCase();
        const currentPlayer = players[currentPlayerIndex];
        
        console.log(`Checking answer from ${currentPlayer.name}: "${userAnswer}" against "${correctAnswer}"`);
        
        // Simple string normalization for comparison
        const normalizedUserAnswer = userAnswer.replace(/[^a-z0-9]/gi, '');
        const normalizedCorrectAnswer = correctAnswer.replace(/[^a-z0-9]/gi, '');
        
        // Check if the answer is correct (allowing for some flexibility)
        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer || 
                         correctAnswer.includes(userAnswer) || 
                         normalizedCorrectAnswer.includes(normalizedUserAnswer) || 
                         (normalizedUserAnswer.length > 3 && normalizedCorrectAnswer.includes(normalizedUserAnswer));
        
        console.log(`Answer is ${isCorrect ? 'correct' : 'incorrect'}`);
        
        // Update question status
        questionStatuses[currentQuestionIndex] = isCorrect ? 'correct' : 'incorrect';
        
        // Update circle indicators
        updateCircleIndicators();
        
        // Show feedback
        feedbackDiv.textContent = isCorrect 
            ? `Correct! It's ${currentQuestion.item}` 
            : `Incorrect. It was ${currentQuestion.item}`;
        
        feedbackDiv.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
        feedbackDiv.classList.remove('hidden');
        
        // Play sound if available
        if (isCorrect) {
            correctSound.play().catch(e => console.log('Sound play error:', e));
        } else {
            incorrectSound.play().catch(e => console.log('Sound play error:', e));
        }
        
        // Update score if correct
        if (isCorrect) {
            // Update the score for the current round
            currentPlayer.roundScores[currentRoundNumber - 1]++;
            // Update total score
            currentPlayer.score++;
            // Update display
            scoreElement.textContent = currentPlayer.roundScores[currentRoundNumber - 1];
        }
        
        // Save the result for the summary
        roundResults.push({
            round: currentRoundNumber,
            item: currentQuestion.item,
            category: currentQuestion.category,
            imagePath: currentQuestion.imagePath,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            player: currentPlayer.name
        });
        
        // Check if all questions have been answered
        const allAnswered = questionStatuses.every(status => 
            status === 'correct' || status === 'incorrect');
        
        if (allAnswered) {
            // Stop the timer
            stopTimer();
            
            // Move to the next player or end the round after a delay
            setTimeout(() => {
                if (currentPlayerIndex < players.length - 1) {
                    // Move to the next player
                    currentPlayerIndex++;
                    // Show player transition screen
                    showPlayerTransition(currentPlayerIndex);
                } else {
                    // All players have completed this round
                    showRoundResults();
                }
            }, 2000);
        } else {
            // Move to the next unanswered question after a short delay
            setTimeout(() => {
                let nextIndex = findNextUnansweredQuestion();
                if (nextIndex !== -1) {
                    currentQuestionIndex = nextIndex;
                    loadQuestion(false); // Don't reset timer
                }
            }, 1500);
        }
    }
    
    /**
     * Find the next unanswered question
     */
    function findNextUnansweredQuestion() {
        // First look for null (never seen) questions
        for (let i = 0; i < questionStatuses.length; i++) {
            if (questionStatuses[i] === null) {
                return i;
            }
        }
        
        // Then look for pending questions
        for (let i = 0; i < questionStatuses.length; i++) {
            if (questionStatuses[i] === 'pending') {
                return i;
            }
        }
        
        // No unanswered questions found
        return -1;
    }
    
    /**
     * Load the current question
     */
    async function loadQuestion(resetTimer = true) {
        // If this is called with reset timer and we're in a new question, start the timer
        if (resetTimer) {
            startTimer();
        }
        
        // Update circle indicators
        updateCircleIndicators();
        
        // Update navigation buttons
        prevImageButton.disabled = currentQuestionIndex === 0;
        nextImageButton.disabled = currentQuestionIndex === 4;
        
        // Get the current player's round items
        const currentPlayerRound = playerRounds[currentPlayerIndex];
        
        // Double check we have valid items
        if (!currentPlayerRound || currentPlayerRound.length === 0) {
            console.error("No items found for the current player's round");
            return;
        }
        
        // Get current question for the current player
        const currentQuestion = currentPlayerRound[currentQuestionIndex];
        
        if (!currentQuestion) {
            console.error("Question not found at index", currentQuestionIndex);
            return;
        }
        
        console.log(`Loading question ${currentQuestionIndex + 1} for ${players[currentPlayerIndex].name}: ${currentQuestion.item} (${currentQuestion.category})`);
        console.log(`Image path: ${currentQuestion.imagePath}`);
        
        // Clear previous feedback if loading a new question
        if (questionStatuses[currentQuestionIndex] === null || questionStatuses[currentQuestionIndex] === 'pending') {
            feedbackDiv.classList.add('hidden');
        } else {
            // Show the previous feedback for already answered questions
            const isCorrect = questionStatuses[currentQuestionIndex] === 'correct';
            feedbackDiv.textContent = isCorrect 
                ? `Correct! It's ${currentQuestion.item}` 
                : `Incorrect. It was ${currentQuestion.item}`;
            
            feedbackDiv.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
            feedbackDiv.classList.remove('hidden');
        }
        
        // Update question number and current player
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        currentPlayerNameElement.textContent = players[currentPlayerIndex].name;
        scoreElement.textContent = players[currentPlayerIndex].roundScores[currentRoundNumber - 1];
        
        // Enable/disable submit button based on if the question was already answered
        const alreadyAnswered = questionStatuses[currentQuestionIndex] === 'correct' || 
                               questionStatuses[currentQuestionIndex] === 'incorrect';
        submitButton.disabled = alreadyAnswered;
        guessInput.disabled = alreadyAnswered;
        
        // Load image with fade effect
        gameImage.style.opacity = 0;
        
        try {
            // Try to load from cache first
            if (imageCache[currentQuestion.imagePath]) {
                console.log("Loading image from cache");
                gameImage.src = imageCache[currentQuestion.imagePath];
                
                // Make sure we wait for the fade-in to complete
                setTimeout(() => {
                    gameImage.style.opacity = 1;
                }, 50);
            } else {
                // Check if the image exists
                const exists = await checkImageExists(currentQuestion.imagePath);
                
                if (exists) {
                    console.log("Image exists, loading it");
                    gameImage.src = currentQuestion.imagePath;
                    
                    // Cache the image for future use
                    gameImage.onload = function() {
                        imageCache[currentQuestion.imagePath] = currentQuestion.imagePath;
                        setTimeout(() => {
                            gameImage.style.opacity = 1;
                        }, 50);
                    };
                } else {
                    console.warn(`Image not found: ${currentQuestion.imagePath}`);
                    console.log("Generating placeholder image");
                    
                    // Generate placeholder image
                    const placeholderDataUrl = generatePlaceholderImage(
                        currentQuestion.item, 
                        currentQuestion.category
                    );
                    
                    // Use the placeholder
                    gameImage.src = placeholderDataUrl;
                    imageCache[currentQuestion.imagePath] = placeholderDataUrl;
                    
                    setTimeout(() => {
                        gameImage.style.opacity = 1;
                    }, 50);
                }
            }
        } catch (error) {
            console.error("Error loading image:", error);
            // Create a placeholder as fallback
            const placeholderDataUrl = generatePlaceholderImage(
                currentQuestion.item, 
                currentQuestion.category
            );
            
            gameImage.src = placeholderDataUrl;
            
            setTimeout(() => {
                gameImage.style.opacity = 1;
            }, 50);
        }
        
        // If it's a new or pending question, clear input
        if (questionStatuses[currentQuestionIndex] === null || questionStatuses[currentQuestionIndex] === 'pending') {
            guessInput.value = '';
            
            // Only focus if this is a brand new question (not from navigation)
            // This prevents keyboard from opening on mobile when navigating
            if (questionStatuses[currentQuestionIndex] === null && resetTimer) {
                guessInput.focus();
            }
        }
        
        // Update category display
        if (currentQuestion && currentQuestion.category) {
            currentCategoryElement.textContent = currentQuestion.category;
        } else {
            currentCategoryElement.textContent = 'Unknown';
        }
    }

    /**
     * Show the results for the current round
     */
    function showRoundResults() {
        // Stop the timer if it's still running
        stopTimer();
        
        // Hide game screen, show result screen
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        // Update title based on round number
        const resultTitle = document.querySelector('#result-screen h2');
        if (currentRoundNumber < totalRounds) {
            resultTitle.textContent = `Round ${currentRoundNumber} Completed!`;
            playAgainButton.textContent = `Start Round ${currentRoundNumber + 1}`;
        } else {
            resultTitle.textContent = `Game Over - Final Results!`;
            playAgainButton.textContent = `Play Again`;
        }
        
        // Sort players by score for the current round
        const playerRoundScores = players.map(player => ({
            name: player.name,
            roundScore: player.roundScores[currentRoundNumber - 1],
            totalScore: player.score
        }));
        
        const sortedPlayersByRound = [...playerRoundScores].sort((a, b) => {
            // First sort by round score (descending)
            if (b.roundScore !== a.roundScore) {
                return b.roundScore - a.roundScore;
            }
            // If round scores are tied, sort by total score (descending)
            return b.totalScore - a.totalScore;
        });
        
        // Get the highest round score
        const highestRoundScore = sortedPlayersByRound[0].roundScore;
        
        // Display player scores
        playerScoresElement.innerHTML = '';
        
        // Add round header
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header';
        roundHeader.innerHTML = `
            <h3>Round ${currentRoundNumber} Scores</h3>
            ${currentRoundNumber === totalRounds ? '<h3>Total Scores</h3>' : ''}
        `;
        playerScoresElement.appendChild(roundHeader);
        
        // Add player scores
        sortedPlayersByRound.forEach((player) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = `player-score-item ${player.roundScore === highestRoundScore ? 'winner' : ''}`;
            
            const playerName = document.createElement('div');
            playerName.className = 'player-name';
            playerName.textContent = player.name;
            
            const scoreInfo = document.createElement('div');
            scoreInfo.className = 'score-info';
            
            // Show both round score and total if final round
            if (currentRoundNumber === totalRounds) {
                scoreInfo.innerHTML = `
                    <span class="round-score">${player.roundScore}/5</span>
                    <span class="total-score">Total: ${player.totalScore}/${5 * totalRounds}</span>
                `;
            } else {
                scoreInfo.textContent = `${player.roundScore}/5`;
            }
            
            scoreItem.appendChild(playerName);
            scoreItem.appendChild(scoreInfo);
            playerScoresElement.appendChild(scoreItem);
        });
        
        // Filter results for current round
        const currentRoundResults = roundResults.filter(result => result.round === currentRoundNumber);
        
        // Clear previous results
        resultDetailsElement.innerHTML = '';
        
        // Add details section header
        const detailsHeader = document.createElement('h3');
        detailsHeader.textContent = 'Question Details';
        detailsHeader.style.marginBottom = '10px';
        resultDetailsElement.appendChild(detailsHeader);
        
        // With many players, group results by question rather than showing all individually
        if (players.length > 4) {
            // Create an array of unique questions
            const questions = [...new Set(currentRoundResults.map(result => result.item))];
            
            // For each question, show a summary of player responses
            questions.forEach((item, questionIndex) => {
                // Get all results for this question
                const questionResults = currentRoundResults.filter(result => result.item === item);
                const category = questionResults[0].category;
                
                // Create a container for this question
                const questionContainer = document.createElement('div');
                questionContainer.className = 'result-item';
                
                // Calculate how many players got it right
                const correctCount = questionResults.filter(result => result.isCorrect).length;
                
                // Set background color based on whether most players got it right
                if (correctCount > players.length / 2) {
                    questionContainer.classList.add('correct');
                } else {
                    questionContainer.classList.add('incorrect');
                }
                
                // Create question header
                const questionHeader = document.createElement('div');
                questionHeader.className = 'question-header';
                questionHeader.innerHTML = `
                    <strong>Question ${questionIndex + 1}:</strong> ${item} (${category})<br>
                    <small>${correctCount} out of ${players.length} players correct</small>
                `;
                
                questionContainer.appendChild(questionHeader);
                resultDetailsElement.appendChild(questionContainer);
            });
        } else {
            // For fewer players, show each player's response individually
            currentRoundResults.forEach((result, index) => {
                const resultItem = document.createElement('div');
                resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
                
                const icon = document.createElement('span');
                icon.className = 'result-icon';
                icon.textContent = result.isCorrect ? '✓' : '✗';
                
                const details = document.createElement('div');
                details.innerHTML = `
                    <strong>Question ${index % 5 + 1}:</strong> ${result.item} (${result.category})<br>
                    <small>${result.player}: ${result.userAnswer || '(no answer)'}</small>
                `;
                
                resultItem.appendChild(icon);
                resultItem.appendChild(details);
                resultDetailsElement.appendChild(resultItem);
            });
        }
    }

    /**
     * Shuffle an array in place
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Navigate to previous image
     */
    function navigateToPreviousImage() {
        if (currentQuestionIndex > 0) {
            // Blur input field to prevent keyboard from opening on mobile
            guessInput.blur();
            
            // Mark current question as pending if not already answered
            if (questionStatuses[currentQuestionIndex] === null) {
                questionStatuses[currentQuestionIndex] = 'pending';
                updateCircleIndicators();
            }
            
            // Go to previous image
            currentQuestionIndex--;
            loadQuestion(false); // Don't reset the timer
        }
    }
    
    /**
     * Navigate to next image
     */
    function navigateToNextImage() {
        if (currentQuestionIndex < 4) {
            // Blur input field to prevent keyboard from opening on mobile
            guessInput.blur();
            
            // Mark current question as pending if not already answered
            if (questionStatuses[currentQuestionIndex] === null) {
                questionStatuses[currentQuestionIndex] = 'pending';
                updateCircleIndicators();
            }
            
            // Go to next image
            currentQuestionIndex++;
            loadQuestion(false); // Don't reset the timer
        }
    }
    
    /**
     * Navigate to a specific image by index
     */
    function navigateToImage(index) {
        if (index >= 0 && index < 5 && index !== currentQuestionIndex) {
            // Blur input field to prevent keyboard from opening on mobile
            guessInput.blur();
            
            // Mark current question as pending if not already answered
            if (questionStatuses[currentQuestionIndex] === null) {
                questionStatuses[currentQuestionIndex] = 'pending';
            }
            
            // Go to selected image
            currentQuestionIndex = index;
            loadQuestion(false); // Don't reset the timer
        }
    }
    
    /**
     * Start the round timer
     */
    function startTimer() {
        // Clear any existing timer
        clearInterval(timer);
        
        // Reset time remaining
        timeRemaining = 60;
        timeRemainingElement.textContent = timeRemaining;
        
        // Start a new timer
        timer = setInterval(() => {
            timeRemaining--;
            timeRemainingElement.textContent = timeRemaining;
            
            // Time's up
            if (timeRemaining <= 0) {
                clearInterval(timer);
                endPlayerTurn();
            }
        }, 1000);
    }
    
    /**
     * Stop the timer
     */
    function stopTimer() {
        clearInterval(timer);
    }
    
    /**
     * End the current player's turn when time runs out
     */
    function endPlayerTurn() {
        // Mark any unanswered questions as incorrect
        questionStatuses.forEach((status, index) => {
            if (status === null || status === 'pending') {
                questionStatuses[index] = 'incorrect';
                
                // Add to results
                const currentPlayerRound = playerRounds[currentPlayerIndex];
                if (currentPlayerRound && currentPlayerRound[index]) {
                    roundResults.push({
                        round: currentRoundNumber,
                        item: currentPlayerRound[index].item,
                        category: currentPlayerRound[index].category,
                        imagePath: currentPlayerRound[index].imagePath,
                        userAnswer: '(time ran out)',
                        isCorrect: false,
                        player: players[currentPlayerIndex].name
                    });
                }
            }
        });
        
        // Update circles
        updateCircleIndicators();
        
        // Show time's up message
        feedbackDiv.textContent = "Time's up!";
        feedbackDiv.className = "feedback incorrect";
        feedbackDiv.classList.remove("hidden");
        
        // Disable inputs
        submitButton.disabled = true;
        guessInput.disabled = true;
        prevImageButton.disabled = true;
        nextImageButton.disabled = true;
        
        // Move to the next player or end the round after a delay
        setTimeout(() => {
            if (currentPlayerIndex < players.length - 1) {
                // Move to the next player
                currentPlayerIndex++;
                // Show player transition screen instead of immediately starting
                showPlayerTransition(currentPlayerIndex);
            } else {
                // All players have completed this round
                showRoundResults();
            }
        }, 2000);
    }
    
    /**
     * Update the indicator circles based on question statuses
     */
    function updateCircleIndicators() {
        indicatorCircles.forEach((circle, index) => {
            // Clear existing classes
            circle.className = 'circle';
            
            // Add status class
            if (index === currentQuestionIndex) {
                circle.classList.add('current');
            }
            
            if (questionStatuses[index]) {
                circle.classList.add(questionStatuses[index]);
            }
        });
    }
}); 