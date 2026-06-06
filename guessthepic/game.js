/**
 * Image Guessing Game
 * A browser-based guessing game that works completely offline
 */

document.addEventListener('DOMContentLoaded', function () {
    // Game elements
    const startScreen = document.getElementById('start-screen');
    const playerSetupScreen = document.getElementById('player-setup-screen');
    const playerTransitionScreen = document.getElementById('player-transition-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const categorySelectionScreen = document.getElementById('category-selection-screen');

    const openPlayerSetupButton = document.getElementById('open-player-setup');
    const startButton = document.getElementById('start-game');
    const playAgainButton = document.getElementById('play-again');
    const replaySamePlayersButton = document.getElementById('replay-same-players');
    const submitButton = document.getElementById('submit-guess');
    const prevImageButton = document.getElementById('prev-image');
    const nextImageButton = document.getElementById('next-image');
    const startPlayerTurnButton = document.getElementById('start-player-turn');

    // Category source selection elements
    const catRandomButton = document.getElementById('cat-random');
    const catChosenButton = document.getElementById('cat-chosen');
    const catDescriptionElement = document.getElementById('cat-description');

    // Gameplay mode selection elements
    const playClassicButton = document.getElementById('play-classic');
    const playPixelButton = document.getElementById('play-pixel');
    const playObscureButton = document.getElementById('play-obscure');
    const playDescriptionElement = document.getElementById('play-description');

    // Reveal canvas (pixel / obscure modes)
    const revealCanvas = document.getElementById('reveal-canvas');
    const scoreSuffixElement = document.getElementById('score-suffix');

    // Category selection elements
    const categorySelectionTitle = document.getElementById('category-selection-title');
    const categorySelectionPlayer = document.getElementById('category-selection-player');
    const categorySelectionCounter = document.getElementById('category-selection-counter');
    const categoriesGrid = document.getElementById('categories-grid');
    const confirmCategoriesButton = document.getElementById('confirm-categories');

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

    // Game mode state
    let categoryMode = 'random'; // 'random' or 'chosen' (how categories are picked)
    let playMode = 'classic';    // 'classic', 'pixel' or 'obscure' (how images are revealed)
    let playerCategories = []; // Array to store each player's selected categories (for 'chosen' mode)
    let currentCategorySelection = []; // Temporary storage for current player's category selection
    let categorySelectingPlayerIndex = 0; // Index of player currently selecting categories

    // Reveal state (pixel / obscure modes)
    const REVEAL_MS = 24000;   // time for an image to go from fully hidden to fully revealed (full only at the very end)
    const REVEAL_CURVE = 3.0;  // ease-in exponent: stays hidden/pixelated longer, clears in the final seconds
    const GRACE_MS = 0;        // image reaches full reveal right as the countdown ends
    const IMAGE_TOTAL_MS = REVEAL_MS + GRACE_MS; // total window per image
    let revealRaf = null;          // requestAnimationFrame handle
    let revealStartTime = 0;       // timestamp when current image reveal started
    let imageCountdownInterval = null; // per-image countdown display
    let revealImg = null;          // loaded Image object for the current question
    let revealOrder = [];          // shuffled tile order for obscure mode
    let imageResolved = false;     // whether current image was answered/timed-out
    const OBSCURE_COLS = 8;
    const OBSCURE_ROWS = 6;
    // Obscure mode has its own tile-reveal pacing (independent of the pixel curve)
    const OBSCURE_HOLD_MS = 4000; // keep just the first tile for this long
    const OBSCURE_CURVE = 1.8;    // tile ramp after the hold: ~1 = even, higher = more back-loaded

    // True for the time-based reveal modes
    function isPointsMode() {
        return playMode === 'pixel' || playMode === 'obscure';
    }

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
    replaySamePlayersButton.addEventListener('click', replaySamePlayers);
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

    // Mode selection event listeners
    catRandomButton.addEventListener('click', () => selectCategoryMode('random'));
    catChosenButton.addEventListener('click', () => selectCategoryMode('chosen'));
    playClassicButton.addEventListener('click', () => selectPlayMode('classic'));
    playPixelButton.addEventListener('click', () => selectPlayMode('pixel'));
    playObscureButton.addEventListener('click', () => selectPlayMode('obscure'));
    confirmCategoriesButton.addEventListener('click', confirmCategorySelection);

    /**
     * Select how categories are picked (random or chosen)
     */
    function selectCategoryMode(mode) {
        categoryMode = mode;
        const isItalian = getLanguage();

        if (mode === 'random') {
            catRandomButton.classList.add('selected');
            catChosenButton.classList.remove('selected');
            catDescriptionElement.textContent = isItalian ?
                'Categorie casuali per tutti i giocatori' :
                'Random categories for all players';
        } else {
            catRandomButton.classList.remove('selected');
            catChosenButton.classList.add('selected');
            catDescriptionElement.textContent = isItalian ?
                'Ogni giocatore sceglie le sue 5 categorie' :
                'Each player chooses their 5 categories';
        }
    }

    /**
     * Select how images are revealed (classic, pixel or obscure)
     */
    function selectPlayMode(mode) {
        playMode = mode;
        const isItalian = getLanguage();

        playClassicButton.classList.toggle('selected', mode === 'classic');
        playPixelButton.classList.toggle('selected', mode === 'pixel');
        playObscureButton.classList.toggle('selected', mode === 'obscure');

        if (mode === 'classic') {
            playDescriptionElement.textContent = isItalian ?
                'Indovina l\'immagine completa, 60s per turno' :
                'Guess the full image, 60s per turn';
        } else if (mode === 'pixel') {
            playDescriptionElement.textContent = isItalian ?
                'L\'immagine si depixela: indovina presto per più punti!' :
                'The image un-pixelates: guess early for more points!';
        } else {
            playDescriptionElement.textContent = isItalian ?
                'L\'immagine si scopre a tasselli: indovina presto per più punti!' :
                'The image is revealed tile by tile: guess early for more points!';
        }
    }

    // Update player count dropdown options with translated text
    function updatePlayerCountOptions() {
        const isItalian = getLanguage();
        const playerSingular = isItalian ? 'Giocatore' : 'Player';
        const playerPlural = isItalian ? 'Giocatori' : 'Players';

        // Clear existing options
        playerCountSelect.innerHTML = '';

        // Add new options with translated text
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i === 1 ?
                `1 ${playerSingular}` :
                `${i} ${playerPlural}`;
            playerCountSelect.appendChild(option);
        }
    }

    // Run immediately to set initial options
    updatePlayerCountOptions();

    // Also call this when language changes or when the game initializes (for browsers that block initial script execution)
    document.addEventListener('DOMContentLoaded', function () {
        updatePlayerCountOptions();

        // Update when language changes (triggered by main site's language toggle)
        window.addEventListener('popstate', updatePlayerCountOptions);
    });

    // Handle Enter key press
    // Submit on Enter. Use keydown (+ keyCode fallback) for reliable mobile keyboard
    // support, and preventDefault so the keypress can't clear/blur the field.
    // checkAnswer() handles the empty-input case itself.
    guessInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            if (!submitButton.disabled) {
                checkAnswer();
            }
        }
    });

    // Keep the on-screen keyboard open when tapping "Invia": preventing the button's
    // default mousedown stops it from stealing focus from the input, so the player can
    // fire several guesses in a row without the keyboard closing.
    submitButton.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });

    // Mobile: when the answer field is focused the on-screen keyboard can push the
    // image off-screen. Compact the layout and keep the image in view while typing.
    guessInput.addEventListener('focus', function () {
        document.body.classList.add('keyboard-open');
        // Wait for the keyboard animation, then bring the image back into view
        setTimeout(function () {
            const media = document.querySelector('.image-container');
            if (media && typeof media.scrollIntoView === 'function') {
                media.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    });
    guessInput.addEventListener('blur', function () {
        document.body.classList.remove('keyboard-open');
    });

    // Initialize the game
    initGame();

    /**
     * Get the current language setting from URL, localStorage, or browser preference
     * This ensures compatibility with the main site's language toggle
     */
    function getLanguage() {
        // First check URL parameter (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang === 'en' || urlLang === 'it') {
            return urlLang === 'it';
        }

        // Then check localStorage (second priority)
        const storedLang = localStorage.getItem('lang');
        if (storedLang === 'en' || storedLang === 'it') {
            return storedLang === 'it';
        }

        // Finally fallback to browser language
        return (navigator.language || navigator.userLanguage || '').toLowerCase().startsWith('it');
    }

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
        stopReveal();
        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        playerTransitionScreen.classList.add('hidden');
        categorySelectionScreen.classList.add('hidden');
        playerSetupScreen.classList.remove('hidden');

        // Reset round number
        currentRoundNumber = 1;

        // Reset game mode state
        playerCategories = [];
        currentCategorySelection = [];
        categorySelectingPlayerIndex = 0;

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

        const isItalian = getLanguage();
        const playerLabel = isItalian ? 'Giocatore' : 'Player';

        for (let i = 1; i <= playerCount; i++) {
            const playerInput = document.createElement('div');
            playerInput.className = 'player-input';

            const label = document.createElement('label');
            label.setAttribute('for', `player${i}-name`);
            label.textContent = `${playerLabel} ${i}:`;

            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', `player${i}-name`);
            input.setAttribute('placeholder', `${playerLabel} ${i}`);

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
            { name: 'historical figures', items: [] },
            { name: 'athletes', items: [] },
            { name: 'influencers', items: [] }
        ];

        // For each category, try to populate items by checking the img directory
        for (const category of categories) {
            // In a web environment, we can't read directories directly
            // So we'll use a fallback approach:
            // Try to load a few common items that are likely to exist

            // We'll manually add some common items for each category
            switch (category.name) {
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
                    category.items = ['Juventus', 'FC Barcelona', 'Real Madrid CF', 'Manchester United FC',
                        'Liverpool', 'Bayern Munich', 'Paris Saint-Germain FC'];
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
                case 'athletes':
                    category.items = ['Cristiano Ronaldo', 'Lionel Messi', 'LeBron James', 'Serena Williams',
                        'Usain Bolt', 'Roger Federer', 'Michael Jordan'];
                    break;
                case 'influencers':
                    category.items = ['Cristiano Ronaldo', 'Selena Gomez', 'Kylie Jenner', 'Kim Kardashian',
                        'Dwayne Johnson', 'Taylor Swift', 'Justin Bieber'];
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
                roundScores: [0, 0, 0], // Correct-image count for each round (classic)
                roundPoints: [0, 0, 0]  // Points for each round (pixel / obscure)
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

        // Check category source mode
        if (categoryMode === 'chosen') {
            // In chosen-categories mode, show category selection for each player first
            playerCategories = []; // Reset player categories
            categorySelectingPlayerIndex = 0;
            showCategorySelection(0);
        } else {
            // Classic mode - start game immediately
            startGameWithCategories();
        }
    }

    /**
     * Start the game after categories have been selected (or in classic mode)
     */
    function startGameWithCategories() {
        // Show game screen
        playerSetupScreen.classList.add('hidden');
        categorySelectionScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        // Generate all player rounds for the current round
        generatePlayerRounds();

        // Start first round
        startRound();
    }

    /**
     * Show the category selection screen for a specific player
     */
    function showCategorySelection(playerIndex) {
        const isItalian = getLanguage();
        categorySelectingPlayerIndex = playerIndex;
        currentCategorySelection = []; // Reset selection

        // Hide other screens
        playerSetupScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        playerTransitionScreen.classList.add('hidden');

        // Show category selection screen
        categorySelectionScreen.classList.remove('hidden');

        // Update title and player name
        categorySelectionPlayer.textContent = players[playerIndex].name;

        // Update counter
        updateCategoryCounter();

        // Populate categories grid
        populateCategoriesGrid();

        // Reset confirm button
        confirmCategoriesButton.disabled = true;
    }

    /**
     * Populate the categories grid with all available categories
     */
    function populateCategoriesGrid() {
        categoriesGrid.innerHTML = ''; // Clear existing

        const validCategories = categories.filter(cat => cat.items && cat.items.length > 0);

        validCategories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category.name;
            button.dataset.category = category.name;

            button.addEventListener('click', () => toggleCategorySelection(category.name, button));

            categoriesGrid.appendChild(button);
        });
    }

    /**
     * Toggle selection of a category
     */
    function toggleCategorySelection(categoryName, buttonElement) {
        const index = currentCategorySelection.indexOf(categoryName);

        if (index > -1) {
            // Already selected, remove it
            currentCategorySelection.splice(index, 1);
            buttonElement.classList.remove('selected');
        } else {
            // Not selected yet, add it if we have room
            if (currentCategorySelection.length < 5) {
                currentCategorySelection.push(categoryName);
                buttonElement.classList.add('selected');
            }
        }

        // Update counter and button states
        updateCategoryCounter();
        updateCategoryButtonStates();
    }

    /**
     * Update the category counter display
     */
    function updateCategoryCounter() {
        const isItalian = getLanguage();
        const count = currentCategorySelection.length;
        categorySelectionCounter.textContent = isItalian ?
            `Selezionate: ${count}/5` :
            `Selected: ${count}/5`;

        // Enable/disable confirm button based on selection count
        confirmCategoriesButton.disabled = count !== 5;
    }

    /**
     * Update category button states (disable unselected when 5 are selected)
     */
    function updateCategoryButtonStates() {
        const buttons = categoriesGrid.querySelectorAll('.category-button');
        const maxReached = currentCategorySelection.length >= 5;

        buttons.forEach(button => {
            if (maxReached && !button.classList.contains('selected')) {
                button.classList.add('disabled');
            } else {
                button.classList.remove('disabled');
            }
        });
    }

    /**
     * Confirm the category selection for the current player
     */
    function confirmCategorySelection() {
        // Store the current player's categories
        playerCategories[categorySelectingPlayerIndex] = [...currentCategorySelection];
        console.log(`Player ${categorySelectingPlayerIndex + 1} selected categories:`, currentCategorySelection);

        // Move to next player or start game
        if (categorySelectingPlayerIndex < players.length - 1) {
            // Show category selection for next player
            showCategorySelection(categorySelectingPlayerIndex + 1);
        } else {
            // All players have selected, start the game
            console.log("All players have selected categories:", playerCategories);
            startGameWithCategories();
        }
    }

    /**
     * Generate rounds for all players
     */
    function generatePlayerRounds() {
        playerRounds = []; // Clear existing rounds

        // For each player, generate a unique set of questions
        for (let i = 0; i < players.length; i++) {
            if (!categories || categories.length === 0 || categories.every(cat => !cat.items || cat.items.length === 0)) {
                console.error("No category data available for player " + (i + 1) + ". Using fallback data.");
                playerRounds.push(generateFallbackItems());
            } else {
                playerRounds.push(generateRandomItems(i)); // Pass player index
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

        // Configure UI for the active play mode
        applyPlayModeUI();

        // Reset UI
        updateScoreDisplay();
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

        if (isPointsMode()) {
            // Points modes use a per-image reveal timer instead of the shared 60s timer
            updateCircleIndicators();
            loadQuestion(false);
        } else {
            // Start the shared turn timer (classic)
            startTimer();
            updateCircleIndicators();
            loadQuestion(false); // Don't restart timer as we just started it
        }
    }

    /**
     * Show/hide controls depending on the active play mode
     */
    function applyPlayModeUI() {
        const points = isPointsMode();
        // Free navigation only exists in classic mode
        prevImageButton.style.display = points ? 'none' : '';
        nextImageButton.style.display = points ? 'none' : '';
        // Score is "/5" in classic, raw points otherwise
        scoreSuffixElement.style.display = points ? 'none' : '';
        // Swap the visible media element
        if (points) {
            gameImage.classList.add('hidden');
            revealCanvas.classList.remove('hidden');
        } else {
            revealCanvas.classList.add('hidden');
            gameImage.classList.remove('hidden');
        }
    }

    /**
     * Update the in-game score header for the current player/mode
     */
    function updateScoreDisplay() {
        const player = players[currentPlayerIndex];
        scoreElement.textContent = isPointsMode()
            ? player.roundPoints[currentRoundNumber - 1]
            : player.roundScores[currentRoundNumber - 1];
    }

    /**
     * Generate a set of random items for a player's round
     * @param {number} playerIndex - The index of the player (used for filtering categories in 'categories' mode)
     */
    function generateRandomItems(playerIndex = 0) {
        const playerRound = [];

        // Get all categories that have items
        let validCategories = categories.filter(cat => cat.items && cat.items.length > 0);

        // In 'chosen' mode, filter to only use player's selected categories
        if (categoryMode === 'chosen' && playerCategories[playerIndex] && playerCategories[playerIndex].length > 0) {
            const selectedCategoryNames = playerCategories[playerIndex];
            validCategories = validCategories.filter(cat => selectedCategoryNames.includes(cat.name));
            console.log(`Player ${playerIndex + 1} using selected categories:`, selectedCategoryNames);
        }

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
                item: 'Juventus',
                imagePath: 'img/football teams/juventus.jpg'
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
            },
            {
                category: 'athletes',
                item: 'Cristiano Ronaldo',
                imagePath: 'img/athletes/cristiano_ronaldo.jpg'
            },
            {
                category: 'influencers',
                item: 'Dwayne Johnson',
                imagePath: 'img/influencers/dwayne_johnson.jpg'
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
        // Points modes (pixel / obscure) have their own answer flow
        if (isPointsMode()) {
            checkPointsAnswer();
            return;
        }

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
            const isItalian = getLanguage();
            feedbackDiv.textContent = isItalian ?
                "Inserisci una risposta prima di inviare!" :
                "Enter an answer before submitting!";
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

        // Function to normalize accented characters
        function normalizeString(str) {
            return str
                .normalize('NFD')           // Decompose accented characters
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/[^a-z0-9]/gi, ''); // Remove non-alphanumeric chars
        }

        // Enhanced string normalization for comparison
        const normalizedUserAnswer = normalizeString(userAnswer);
        const normalizedCorrectAnswer = normalizeString(correctAnswer);

        // Check if the answer is correct (allowing for some flexibility)
        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer ||
            normalizeString(correctAnswer).includes(normalizeString(userAnswer)) ||
            normalizedCorrectAnswer.includes(normalizedUserAnswer) ||
            (normalizedUserAnswer.length > 3 && normalizedCorrectAnswer.includes(normalizedUserAnswer));

        console.log(`Answer is ${isCorrect ? 'correct' : 'incorrect'}`);

        // Update question status
        questionStatuses[currentQuestionIndex] = isCorrect ? 'correct' : 'incorrect';

        // Update circle indicators
        updateCircleIndicators();

        // Show feedback
        const isItalian = getLanguage();
        feedbackDiv.textContent = isCorrect
            ? (isItalian ? `Corretto! È ${currentQuestion.item}` : `Correct! It's ${currentQuestion.item}`)
            : (isItalian ? `Sbagliato. Era ${currentQuestion.item}` : `Wrong. It was ${currentQuestion.item}`);

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

            // Check if player got a perfect score
            const currentPlayerScore = players[currentPlayerIndex].roundScores[currentRoundNumber - 1];
            if (currentPlayerScore === 5) {
                // Show "SWEEP!" animation
                showSweepAnimation();
            }

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
        // Points modes have their own per-image reveal flow
        if (isPointsMode()) {
            loadPointsQuestion();
            return;
        }

        // If this is called with reset timer and we're in a new question, start the timer
        if (resetTimer) {
            startTimer();
        }

        // Reset submit button state
        submitButton.disabled = false;
        submitButton.style.opacity = "1";
        submitButton.style.cursor = "pointer";

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
                ? `Corretto! È ${currentQuestion.item}`
                : `Sbagliato. Era ${currentQuestion.item}`;

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
                    gameImage.onload = function () {
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

    // ===== Pixel / Obscure (points) mode =====

    // Offscreen canvas reused for downscaling in pixel mode
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');

    /**
     * Normalize a string for forgiving answer comparison (shared with classic logic)
     */
    function normalizeAnswer(str) {
        return str
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]/gi, '')
            .toLowerCase();
    }

    /**
     * Does the user's answer match the correct one? (same forgiving rules as classic)
     */
    function answerMatches(userAnswer, correctAnswer) {
        const u = normalizeAnswer(userAnswer);
        const c = normalizeAnswer(correctAnswer);
        if (!u) return false;
        return u === c ||
            c.includes(u) ||
            (u.length > 3 && c.includes(u));
    }

    /**
     * Resolve the displayable source for an image (real path or generated placeholder)
     */
    async function resolveImageSrc(question) {
        if (imageCache[question.imagePath]) return imageCache[question.imagePath];
        const exists = await checkImageExists(question.imagePath);
        if (exists) {
            imageCache[question.imagePath] = question.imagePath;
            return question.imagePath;
        }
        const placeholder = generatePlaceholderImage(question.item, question.category);
        imageCache[question.imagePath] = placeholder;
        return placeholder;
    }

    /**
     * Build a shuffled [0..n-1] array
     */
    function shuffledRange(n) {
        const arr = [];
        for (let i = 0; i < n; i++) arr.push(i);
        shuffleArray(arr);
        return arr;
    }

    /**
     * Build the tile reveal order for obscure mode.
     * The first tile (shown from the start) sits in the inner ring:
     * never the exact center, never on the border.
     */
    function buildObscureOrder() {
        const cols = OBSCURE_COLS, rows = OBSCURE_ROWS, total = cols * rows;
        const midC = Math.floor(cols / 2), midR = Math.floor(rows / 2);

        const candidates = [];
        for (let r = 1; r < rows - 1; r++) {       // skip top/bottom border rows
            for (let c = 1; c < cols - 1; c++) {   // skip left/right border cols
                const isCenter = (c === midC || c === midC - 1) && (r === midR || r === midR - 1);
                if (!isCenter) candidates.push(r * cols + c);
            }
        }

        const first = candidates[Math.floor(Math.random() * candidates.length)];
        const rest = [];
        for (let i = 0; i < total; i++) if (i !== first) rest.push(i);
        shuffleArray(rest);
        return [first, ...rest];
    }

    /**
     * Load and start the reveal for the current question (pixel / obscure modes)
     */
    async function loadPointsQuestion() {
        // Stop any reveal still running from a previous image
        stopReveal();
        imageResolved = false;
        revealImg = null;

        // Reset controls
        submitButton.disabled = false;
        submitButton.style.opacity = "1";
        submitButton.style.cursor = "pointer";
        guessInput.disabled = false;
        guessInput.value = '';
        feedbackDiv.classList.add('hidden');

        // Header
        updateCircleIndicators();
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        currentPlayerNameElement.textContent = players[currentPlayerIndex].name;
        updateScoreDisplay();

        const currentQuestion = playerRounds[currentPlayerIndex][currentQuestionIndex];
        currentCategoryElement.textContent = (currentQuestion && currentQuestion.category) || 'Unknown';

        // Clear the canvas to a neutral colour while the image loads
        const ctx = revealCanvas.getContext('2d');
        ctx.fillStyle = '#15151c';
        ctx.fillRect(0, 0, revealCanvas.width, revealCanvas.height);

        const indexAtLoad = currentQuestionIndex;
        const playerAtLoad = currentPlayerIndex;

        const src = await resolveImageSrc(currentQuestion);
        const img = new Image();
        img.onload = () => {
            // Guard against the player/question changing while loading
            if (indexAtLoad !== currentQuestionIndex || playerAtLoad !== currentPlayerIndex) return;
            revealImg = img;
            setupRevealCanvasSize(img);
            revealOrder = playMode === 'obscure' ? buildObscureOrder() : shuffledRange(OBSCURE_COLS * OBSCURE_ROWS);
            startReveal();
        };
        img.src = src;
    }

    /**
     * Size the reveal canvas to the image aspect ratio (capped)
     */
    function setupRevealCanvasSize(img) {
        const maxW = 600, maxH = 450;
        const w = img.naturalWidth || maxW;
        const h = img.naturalHeight || maxH;
        const r = Math.min(maxW / w, maxH / h, 1);
        revealCanvas.width = Math.max(1, Math.round(w * r));
        revealCanvas.height = Math.max(1, Math.round(h * r));
    }

    /**
     * Current reveal fraction (0 = fully hidden, 1 = fully revealed)
     */
    function currentRevealFraction() {
        return Math.min(1, (performance.now() - revealStartTime) / REVEAL_MS);
    }

    /**
     * Begin the reveal animation + per-image countdown
     */
    function startReveal() {
        stopReveal();
        revealStartTime = performance.now();

        timeRemainingElement.textContent = Math.ceil(IMAGE_TOTAL_MS / 1000);
        imageCountdownInterval = setInterval(() => {
            const remaining = Math.max(0, IMAGE_TOTAL_MS - (performance.now() - revealStartTime));
            timeRemainingElement.textContent = Math.ceil(remaining / 1000);
        }, 250);

        revealRaf = requestAnimationFrame(revealLoop);
    }

    /**
     * Animation frame: advance reveal, resolve on timeout
     */
    function revealLoop() {
        if (imageResolved) return;
        const elapsed = performance.now() - revealStartTime;
        renderReveal(Math.min(1, elapsed / REVEAL_MS));

        if (elapsed >= IMAGE_TOTAL_MS) {
            resolveImage(false);
            return;
        }
        revealRaf = requestAnimationFrame(revealLoop);
    }

    /**
     * Stop reveal animation + countdown
     */
    function stopReveal() {
        if (revealRaf) { cancelAnimationFrame(revealRaf); revealRaf = null; }
        if (imageCountdownInterval) { clearInterval(imageCountdownInterval); imageCountdownInterval = null; }
    }

    /**
     * Render the current reveal frame for the active mode
     */
    function renderReveal(fraction) {
        if (!revealImg) return;
        if (playMode === 'pixel') renderPixel(fraction);
        else renderObscure(fraction);
    }

    /**
     * Pixelated reveal: downscale then upscale; less pixelation as fraction grows
     */
    function renderPixel(fraction) {
        const ctx = revealCanvas.getContext('2d');
        const W = revealCanvas.width, H = revealCanvas.height;

        if (fraction >= 1) {
            ctx.imageSmoothingEnabled = true;
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(revealImg, 0, 0, W, H);
            return;
        }

        const minScale = 0.03;
        const scale = minScale + (1 - minScale) * Math.pow(fraction, REVEAL_CURVE);
        const sw = Math.max(2, Math.round(W * scale));
        const sh = Math.max(2, Math.round(H * scale));

        tmpCanvas.width = sw;
        tmpCanvas.height = sh;
        tmpCtx.imageSmoothingEnabled = true;
        tmpCtx.clearRect(0, 0, sw, sh);
        tmpCtx.drawImage(revealImg, 0, 0, sw, sh);

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(tmpCanvas, 0, 0, sw, sh, 0, 0, W, H);
    }

    /**
     * Obscured reveal: full image with hidden tiles covered, uncovered in random order
     */
    function renderObscure(fraction) {
        const ctx = revealCanvas.getContext('2d');
        const W = revealCanvas.width, H = revealCanvas.height;
        const cols = OBSCURE_COLS, rows = OBSCURE_ROWS, total = cols * rows;

        ctx.imageSmoothingEnabled = true;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(revealImg, 0, 0, W, H);

        // Dedicated obscure pacing: hold the first tile, then ramp tiles evenly to full by the end
        const elapsedMs = fraction * REVEAL_MS;
        let revealCount;
        if (elapsedMs < OBSCURE_HOLD_MS) {
            revealCount = 1;
        } else {
            const p = Math.min(1, (elapsedMs - OBSCURE_HOLD_MS) / (REVEAL_MS - OBSCURE_HOLD_MS));
            revealCount = 1 + Math.round(Math.pow(p, OBSCURE_CURVE) * (total - 1));
        }
        const cw = W / cols, ch = H / rows;
        ctx.fillStyle = '#15151c';
        for (let k = revealCount; k < total; k++) {
            const cell = revealOrder[k];
            const cx = (cell % cols) * cw;
            const cy = Math.floor(cell / cols) * ch;
            ctx.fillRect(cx, cy, Math.ceil(cw), Math.ceil(ch));
        }
    }

    /**
     * Handle a guess submission in points mode (multiple attempts allowed)
     */
    function checkPointsAnswer() {
        if (imageResolved) return;

        const currentPlayerRound = playerRounds[currentPlayerIndex];
        if (!currentPlayerRound || !currentPlayerRound[currentQuestionIndex]) return;

        const currentQuestion = currentPlayerRound[currentQuestionIndex];
        const userAnswer = guessInput.value.trim();
        const isItalian = getLanguage();

        // Require some input
        if (!userAnswer) {
            feedbackDiv.textContent = isItalian ?
                "Inserisci una risposta prima di inviare!" :
                "Enter an answer before submitting!";
            feedbackDiv.className = "feedback incorrect";
            feedbackDiv.classList.remove("hidden");
            guessInput.focus();
            return;
        }

        if (answerMatches(userAnswer, currentQuestion.item)) {
            resolveImage(true, userAnswer);
        } else {
            // Wrong guess: keep going, let them try again while the image keeps revealing
            incorrectSound.play().catch(e => console.log('Sound play error:', e));
            feedbackDiv.textContent = isItalian ? "Riprova..." : "Try again...";
            feedbackDiv.className = "feedback incorrect";
            feedbackDiv.classList.remove("hidden");
            guessInput.value = '';
            guessInput.focus();
        }
    }

    /**
     * Resolve the current image (correct guess or time-out), award points, then advance
     */
    function resolveImage(wasCorrect, userAnswer) {
        if (imageResolved) return;

        // Capture reveal fraction at the moment of resolution before stopping
        const fraction = currentRevealFraction();
        imageResolved = true;
        stopReveal();
        renderReveal(1); // show the full image

        const currentQuestion = playerRounds[currentPlayerIndex][currentQuestionIndex];
        const player = players[currentPlayerIndex];
        const isItalian = getLanguage();

        let earned = 0;
        if (wasCorrect) {
            earned = Math.max(5, Math.round(100 * (1 - fraction)));
            player.roundPoints[currentRoundNumber - 1] += earned;
            player.score += earned;
            questionStatuses[currentQuestionIndex] = 'correct';
            correctSound.play().catch(e => console.log('Sound play error:', e));
            feedbackDiv.textContent = isItalian ?
                `Corretto! È ${currentQuestion.item} (+${earned} punti)` :
                `Correct! It's ${currentQuestion.item} (+${earned} points)`;
            feedbackDiv.className = 'feedback correct';
        } else {
            questionStatuses[currentQuestionIndex] = 'incorrect';
            incorrectSound.play().catch(e => console.log('Sound play error:', e));
            feedbackDiv.textContent = isItalian ?
                `Tempo scaduto! Era ${currentQuestion.item}` :
                `Time's up! It was ${currentQuestion.item}`;
            feedbackDiv.className = 'feedback incorrect';
        }
        feedbackDiv.classList.remove('hidden');

        updateScoreDisplay();
        updateCircleIndicators();

        // Record result for the summary
        roundResults.push({
            round: currentRoundNumber,
            item: currentQuestion.item,
            category: currentQuestion.category,
            imagePath: currentQuestion.imagePath,
            userAnswer: wasCorrect ? userAnswer : (isItalian ? '(tempo scaduto)' : '(time ran out)'),
            isCorrect: wasCorrect,
            points: earned,
            player: player.name
        });

        // Lock input until the next image
        submitButton.disabled = true;
        guessInput.disabled = true;

        setTimeout(advancePointsImage, 2200);
    }

    /**
     * Advance to the next image, next player, or round results (points modes)
     */
    function advancePointsImage() {
        if (currentQuestionIndex < 4) {
            currentQuestionIndex++;
            loadQuestion(false);
        } else if (currentPlayerIndex < players.length - 1) {
            currentPlayerIndex++;
            showPlayerTransition(currentPlayerIndex);
        } else {
            showRoundResults();
        }
    }

    /**
     * Show the results for the current round
     */
    function showRoundResults() {
        // Stop any reveal animation and the timer if still running
        stopReveal();
        stopTimer();

        // Hide game screen, show result screen
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        // Determine language based on site's language setting
        const isItalian = getLanguage();

        // Update title based on round number
        const resultTitle = document.querySelector('#result-screen h2');
        if (currentRoundNumber < totalRounds) {
            resultTitle.textContent = isItalian ? `Round ${currentRoundNumber} Completato!` : `Round ${currentRoundNumber} Completed!`;
            playAgainButton.textContent = isItalian ? `Prossimo Round` : `Next Round`;
            replaySamePlayersButton.classList.add('hidden');
        } else {
            resultTitle.textContent = isItalian ? `Gioco Terminato - Risultati Finali!` : `Game Over - Final Results!`;
            playAgainButton.textContent = isItalian ? `Menu` : `Main Menu`;
            replaySamePlayersButton.textContent = isItalian ? `Rigioca con stessi giocatori` : `Play again with same players`;
            replaySamePlayersButton.classList.remove('hidden');

            // Check for perfect game (15/15) after the final round
            checkForPerfectGame();
        }

        const points = isPointsMode();
        const unitLabel = points ? (isItalian ? ' pti' : ' pts') : '/5';

        // Sort players by score for the current round
        const playerRoundScores = players.map(player => ({
            name: player.name,
            roundScore: points ? player.roundPoints[currentRoundNumber - 1] : player.roundScores[currentRoundNumber - 1],
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
            <h3>Punteggi Round ${currentRoundNumber}</h3>
            ${currentRoundNumber === totalRounds ? '<h3>Punteggi Totali</h3>' : ''}
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
                const totalLabel = isItalian ? 'Totale' : 'Total';
                const totalDisplay = points ? `${player.totalScore}${unitLabel}` : `${player.totalScore}/${5 * totalRounds}`;
                scoreInfo.innerHTML = `
                    <span class="round-score">${player.roundScore}${unitLabel}</span>
                    <span class="total-score">${totalLabel}: ${totalDisplay}</span>
                `;
            } else {
                scoreInfo.textContent = `${player.roundScore}${unitLabel}`;
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
        detailsHeader.textContent = 'Dettagli Domande';
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
                    <strong>Domanda ${questionIndex + 1}:</strong> ${item} (${category})<br>
                    <small>${correctCount} su ${players.length} giocatori corretti</small>
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

                const pointsSuffix = (isPointsMode() && result.isCorrect) ? ` (+${result.points} pti)` : '';
                const details = document.createElement('div');
                details.innerHTML = `
                    <strong>Domanda ${index % 5 + 1}:</strong> ${result.item} (${result.category})<br>
                    <small>${result.player}: ${result.userAnswer || '(nessuna risposta)'}${pointsSuffix}</small>
                `;

                resultItem.appendChild(icon);
                resultItem.appendChild(details);
                resultDetailsElement.appendChild(resultItem);
            });
        }
    }

    /**
     * Check if any player has achieved a perfect game (15/15)
     */
    function checkForPerfectGame() {
        // Check each player's total score
        for (const player of players) {
            if (player.score === 15) {
                // Found a player with a perfect score!
                console.log(`Perfect game achieved by ${player.name}!`);
                // Show perfect game celebration after a small delay
                setTimeout(showPerfectGameAnimation, 500);
                break; // Stop after finding the first perfect player
            }
        }
    }

    /**
     * Show the perfect game animation for a 15/15 score
     */
    function showPerfectGameAnimation() {
        const perfectGameContainer = document.querySelector('.perfect-game-container');
        const perfectGameText = document.querySelector('.perfect-game-text');
        const perfectGameScore = document.querySelector('.perfect-game-score');

        // Reset animations by removing and re-adding classes
        perfectGameContainer.classList.remove('perfect-game-animation');
        perfectGameText.classList.remove('perfect-game-text-animation');
        perfectGameScore.classList.remove('perfect-game-score-animation');

        // Force reflow to restart animations
        void perfectGameContainer.offsetWidth;
        void perfectGameText.offsetWidth;
        void perfectGameScore.offsetWidth;

        // Add animation classes
        perfectGameContainer.classList.add('perfect-game-animation');
        perfectGameText.classList.add('perfect-game-text-animation');
        perfectGameScore.classList.add('perfect-game-score-animation');

        // Create confetti animation
        createConfetti();
    }

    /**
     * Create confetti particles for the perfect game celebration
     */
    function createConfetti() {
        // Remove any existing confetti
        document.querySelectorAll('.confetti').forEach(el => el.remove());

        // Create 100 confetti particles
        const colors = ['#ffdf00', '#ff9933', '#ff5050', '#ff66b3', '#cc66ff', '#9999ff', '#66ccff', '#99ff99'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            // Random position, size, color, and animation duration
            const size = Math.floor(Math.random() * 10) + 5; // 5-15px
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100; // 0-100% of viewport width
            const animationDuration = (Math.random() * 3) + 2; // 2-5s duration
            const delay = Math.random() * 1.5; // 0-1.5s delay

            // Apply styles
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.top = '0';
            confetti.style.animationDuration = `${animationDuration}s`;
            confetti.style.animationDelay = `${delay}s`;

            // Different shapes for variety
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%'; // Circle
            } else if (Math.random() > 0.5) {
                confetti.style.transform = 'rotate(45deg)'; // Diamond
            }

            // Add to document
            document.body.appendChild(confetti);

            // Remove after animation completes
            setTimeout(() => {
                confetti.remove();
            }, (animationDuration + delay + 0.5) * 1000);
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
     * Navigate to previous image that hasn't been answered yet
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

            // Find the previous unanswered question
            let prevIndex = findPreviousUnansweredQuestion(currentQuestionIndex);

            // If found, go to that question
            if (prevIndex !== -1) {
                currentQuestionIndex = prevIndex;
                loadQuestion(false); // Don't reset the timer
            } else {
                // If no unanswered questions before current, go to previous question
                currentQuestionIndex--;
                loadQuestion(false); // Don't reset the timer
            }
        }
    }

    /**
     * Navigate to next image that hasn't been answered yet
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

            // Find the next unanswered question
            let nextIndex = findNextUnansweredQuestionFrom(currentQuestionIndex);

            // If found, go to that question
            if (nextIndex !== -1) {
                currentQuestionIndex = nextIndex;
                loadQuestion(false); // Don't reset the timer
            } else {
                // If no unanswered questions after current, go to next question
                currentQuestionIndex++;
                loadQuestion(false); // Don't reset the timer
            }
        }
    }

    /**
     * Find the previous unanswered question before the given index
     */
    function findPreviousUnansweredQuestion(fromIndex) {
        // Go backward from the current index (excluding it)
        for (let i = fromIndex - 1; i >= 0; i--) {
            if (questionStatuses[i] === null || questionStatuses[i] === 'pending') {
                return i;
            }
        }

        // No unanswered questions found before the current one
        return -1;
    }

    /**
     * Find the next unanswered question after the given index
     */
    function findNextUnansweredQuestionFrom(fromIndex) {
        // Go forward from the current index (excluding it)
        for (let i = fromIndex + 1; i < questionStatuses.length; i++) {
            if (questionStatuses[i] === null || questionStatuses[i] === 'pending') {
                return i;
            }
        }

        // No unanswered questions found after the current one
        return -1;
    }

    /**
     * Navigate to a specific image by index, but prefer unanswered questions if clicked on an already answered one
     */
    function navigateToImage(index) {
        if (isPointsMode()) return; // no free navigation in pixel / obscure modes
        if (index >= 0 && index < 5 && index !== currentQuestionIndex) {
            // Blur input field to prevent keyboard from opening on mobile
            guessInput.blur();

            // Mark current question as pending if not already answered
            if (questionStatuses[currentQuestionIndex] === null) {
                questionStatuses[currentQuestionIndex] = 'pending';
            }

            // If clicked on an already answered question, try to find unanswered ones
            if (questionStatuses[index] === 'correct' || questionStatuses[index] === 'incorrect') {
                // First try to find unanswered questions after the clicked index
                let nextUnanswered = findNextUnansweredQuestionFrom(index);
                if (nextUnanswered !== -1) {
                    currentQuestionIndex = nextUnanswered;
                    loadQuestion(false); // Don't reset the timer
                    return;
                }

                // If not found after, look before the clicked index
                let prevUnanswered = findPreviousUnansweredQuestion(index);
                if (prevUnanswered !== -1) {
                    currentQuestionIndex = prevUnanswered;
                    loadQuestion(false); // Don't reset the timer
                    return;
                }
            }

            // Either the clicked question is unanswered or all questions are answered,
            // so go to the selected image
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
     * End the current player's turn when time runs out or all questions are answered
     */
    function endPlayerTurn() {
        // Stop the timer
        stopTimer();

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
        const isItalian = getLanguage();
        feedbackDiv.textContent = isItalian ? "Tempo scaduto!" : "Time's up!";
        feedbackDiv.className = "feedback incorrect";
        feedbackDiv.classList.remove("hidden");

        // Disable inputs
        submitButton.disabled = true;
        guessInput.disabled = true;
        prevImageButton.disabled = true;
        nextImageButton.disabled = true;

        // Check if player got a perfect score
        const currentPlayerScore = players[currentPlayerIndex].roundScores[currentRoundNumber - 1];
        if (currentPlayerScore === 5) {
            // Show "SWEEP!" animation
            showSweepAnimation();
        }

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
     * Show a "SWEEP!" animation for perfect scores
     */
    function showSweepAnimation() {
        const sweepContainer = document.querySelector('.sweep-container');
        const sweepText = document.querySelector('.sweep-text');

        // Reset animations by removing and re-adding classes
        sweepContainer.classList.remove('sweep-animation');
        sweepText.classList.remove('sweep-text-animation');

        // Force reflow to restart animations
        void sweepContainer.offsetWidth;
        void sweepText.offsetWidth;

        // Add animation classes
        sweepContainer.classList.add('sweep-animation');
        sweepText.classList.add('sweep-text-animation');
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

    /**
     * Replay the game with the same players
     */
    function replaySamePlayers() {
        console.log("Replaying game with the same players");

        // Reset game state while keeping the same players
        currentQuestionIndex = 0;
        currentPlayerIndex = 0;
        roundResults = [];
        playerRounds = []; // Reset player rounds
        currentRoundNumber = 1;

        // Reset each player's score
        players.forEach(player => {
            player.score = 0;
            player.roundScores = [0, 0, 0]; // Reset scores for each round
            player.roundPoints = [0, 0, 0]; // Reset points for each round
        });

        // Hide result screen and show game screen
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        // Generate all player rounds for the new game
        generatePlayerRounds();

        // Start first round
        startRound();
    }
}); 