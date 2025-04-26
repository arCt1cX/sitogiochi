// Quizzy Game - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Game state
    const gameState = {
        players: [],
        currentPlayerIndex: 0,
        gameMode: 'individual',
        categories: [],
        playerCategories: {},
        sharedCategories: [],
        questions: {},
        currentQuestion: null,
        currentDifficulty: null,
        currentCategory: null,
        timer: null,
        timeLeft: 30,
        winningScore: 25,
        roundsCompleted: 0,
        gameOver: false,
        availableOptions: [], // New property to store limited options
        lastRandomCategories: [], // Added for storing random categories
        isShockRound: false // Flag for shock round
    };

    // DOM Elements
    const screens = {
        welcome: document.getElementById('welcome-screen'),
        setup: document.getElementById('setup-screen'),
        categorySelection: document.getElementById('category-selection-screen'),
        gameRound: document.getElementById('game-round-screen'),
        question: document.getElementById('question-screen'),
        result: document.getElementById('result-screen'),
        gameOver: document.getElementById('game-over-screen')
    };

    // Initialize event listeners
    initEventListeners();
    
    // Load questions
    loadQuestions();

    function initEventListeners() {
        // Welcome screen
        document.getElementById('start-setup').addEventListener('click', function() {
            showScreen(screens.setup);
        });
        
        // Setup screen
        document.getElementById('continue-to-players').addEventListener('click', function() {
            const playerCount = parseInt(document.getElementById('player-count').value);
            if (playerCount >= 2 && playerCount <= 8) {
                generatePlayerInputs(playerCount);
                document.getElementById('player-names-container').classList.remove('hidden');
            }
        });
        
        document.getElementById('game-mode').addEventListener('change', function() {
            gameState.gameMode = this.value;
        });
        
        document.getElementById('start-game').addEventListener('click', startCategorySelection);
        
        // Category selection
        document.getElementById('confirm-categories').addEventListener('click', function() {
            const selectedCategories = document.querySelectorAll('.category-card.selected');
            if (selectedCategories.length > 0) {
                savePlayerCategories();
                
                // The flow will continue from the showRandomCategoriesScreen callback
                // or directly from savePlayerCategories for shared mode
                
                if (gameState.gameMode === 'shared') {
                    continueAfterCategorySelection();
                }
                // For individual mode, the flow continues in the button callback of showRandomCategoriesScreen
            } else {
                alert(getGameTranslation('selectAtLeastOne'));
            }
        });
        
        // Game Round screen - difficulty selection
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const difficulty = this.getAttribute('data-difficulty');
                selectDifficulty(difficulty);
            });
        });
        
        // Game Over screen
        document.getElementById('play-again').addEventListener('click', function() {
            resetGame();
            showScreen(screens.welcome);
        });
    }
    
    // Load questions from JSON file
    function loadQuestions() {
        const lang = getUserLanguage();
        const fileName = gameTranslations[lang].questionsFile || 'categorie.json';
        
        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                gameState.questions = data;
                gameState.categories = Object.keys(data);
                console.log('Questions loaded successfully');
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                // Create placeholder data for testing
                createPlaceholderQuestions();
            });
    }
    
    // Create placeholder questions if JSON file is not available
    function createPlaceholderQuestions() {
        const categories = [
            'Storia', 'Geografia', 'Cinema', 'Musica', 
            'Arte', 'Scienza', 'Sport', 'Letteratura', 
            'Tecnologia', 'Cibo'
        ];
        
        const difficulties = ['bambino', 'facile', 'medio', 'esperto', 'laureato'];
        
        gameState.questions = {};
        gameState.categories = categories;
        
        // Create sample questions for each category and difficulty
        categories.forEach(category => {
            gameState.questions[category] = {};
            
            difficulties.forEach(difficulty => {
                gameState.questions[category][difficulty] = [];
                
                // Create 5 sample questions for each difficulty
                for (let i = 0; i < 5; i++) {
                    const question = {
                        question: `Sample ${category} question (${difficulty}) #${i+1}`,
                        answers: [
                            `Answer option 1 for ${category}`,
                            `Answer option 2 for ${category}`,
                            `Answer option 3 for ${category}`,
                            `Answer option 4 for ${category}`
                        ],
                        correctIndex: Math.floor(Math.random() * 4)
                    };
                    
                    gameState.questions[category][difficulty].push(question);
                }
            });
        });
        
        console.log('Created placeholder questions');
    }
    
    // Generate player name input fields
    function generatePlayerInputs(count) {
        const container = document.getElementById('player-inputs');
        container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', `player-${i+1}`);
            label.textContent = `${getGameTranslation('playerNameLabel')} ${i+1}:`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-${i+1}`;
            input.className = 'player-name-input';
            input.placeholder = `${getGameTranslation('playerNameLabel')} ${i+1}`;
            
            inputGroup.appendChild(label);
            inputGroup.appendChild(input);
            container.appendChild(inputGroup);
        }
    }
    
    // Start the category selection phase
    function startCategorySelection() {
        // Create player objects
        gameState.players = [];
        const playerInputs = document.querySelectorAll('.player-name-input');
        
        playerInputs.forEach((input, index) => {
            const name = input.value.trim() || `${getGameTranslation('playerNameLabel')} ${index+1}`;
            gameState.players.push({
                name: name,
                score: 0,
                categories: []
            });
        });
        
        // Reset current player index
        gameState.currentPlayerIndex = 0;
        
        // Set game mode
        gameState.gameMode = document.getElementById('game-mode').value;
        
        // Setup category selection for first player
        setupCategorySelection();
    }
    
    // Setup the category selection screen for current player
    function setupCategorySelection() {
        if (gameState.currentPlayerIndex >= gameState.players.length) {
            return;
        }
        
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        document.getElementById('player-name-display').textContent = currentPlayer.name;
        
        // Clear selected categories list
        document.getElementById('selected-categories-list').innerHTML = '';
        
        // Generate category cards
        generateCategoryCards();
        
        // Show category selection screen
        showScreen(screens.categorySelection);
        
        // Disable confirm button initially
        document.getElementById('confirm-categories').disabled = true;
    }
    
    // Generate category selection cards
    function generateCategoryCards() {
        const container = document.getElementById('category-cards');
        container.innerHTML = '';
        
        gameState.categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.dataset.category = category;
            card.textContent = getGameTranslation('categories', category) || category;
            
            card.addEventListener('click', function() {
                toggleCategorySelection(this);
            });
            
            container.appendChild(card);
        });
    }
    
    // Toggle category selection on click
    function toggleCategorySelection(categoryCard) {
        const selectedCategories = document.querySelectorAll('.category-card.selected');
        // Limit to 2 categories in both modes now
        const maxCategories = 2;
        
        // Remove any existing error message
        const existingError = document.getElementById('max-categories-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (categoryCard.classList.contains('selected')) {
            // Deselect
            categoryCard.classList.remove('selected');
            updateSelectedCategoriesList();
        } else if (selectedCategories.length < maxCategories) {
            // Select if under max limit
            categoryCard.classList.add('selected');
            updateSelectedCategoriesList();
        } else {
            // Max limit reached - show custom error message
            const errorMsg = document.createElement('div');
            errorMsg.id = 'max-categories-error';
            errorMsg.className = 'error-message';
            
            // Use the correct word for categories based on language
            const lang = getUserLanguage();
            const categoriesText = lang === 'it' ? 'categorie' : 'categories';
            errorMsg.textContent = `${getGameTranslation('maxCategories')} ${maxCategories} ${categoriesText}`;
            
            // Insert error after the category grid
            const categoryGrid = document.getElementById('category-cards');
            categoryGrid.parentNode.insertBefore(errorMsg, categoryGrid.nextSibling);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                if (errorMsg.parentNode) {
                    errorMsg.remove();
                }
            }, 3000);
        }
        
        // Enable/disable confirm button based on selection
        document.getElementById('confirm-categories').disabled = selectedCategories.length === 0;
    }
    
    // Update the selected categories list
    function updateSelectedCategoriesList() {
        const selectedCategories = document.querySelectorAll('.category-card.selected');
        const listContainer = document.getElementById('selected-categories-list');
        listContainer.innerHTML = '';
        
        selectedCategories.forEach(card => {
            const category = card.dataset.category;
            const translatedCategory = getGameTranslation('categories', category) || category;
            
            const listItem = document.createElement('li');
            listItem.textContent = translatedCategory;
            listContainer.appendChild(listItem);
        });
    }
    
    // Save the selected categories for the current player
    function savePlayerCategories() {
        const selectedCards = document.querySelectorAll('.category-card.selected');
        const selectedCategories = Array.from(selectedCards).map(card => card.dataset.category);
        
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        if (gameState.gameMode === 'individual') {
            // In individual mode, add 2 random categories in addition to the 2 selected ones
            const availableCategories = gameState.categories.filter(
                category => !selectedCategories.includes(category)
            );
            
            // Get 2 random categories
            const randomCategories = getRandomSubset(availableCategories, 2);
            
            // Combine selected and random categories
            currentPlayer.categories = [...selectedCategories, ...randomCategories];
            
            // Store the random categories in gameState for display
            gameState.lastRandomCategories = randomCategories;
            
            // Show the categories screen with both selected and random categories
            showCategoriesScreen(selectedCategories, randomCategories);
        } else {
            // Shared mode - just save the selected categories
            currentPlayer.categories = selectedCategories;
        }
        
        // Store in playerCategories for shared mode
        gameState.playerCategories[gameState.currentPlayerIndex] = 
            gameState.gameMode === 'individual' ? currentPlayer.categories : selectedCategories;
    }
    
    // Show a screen with all categories (selected and random) before proceeding
    function showCategoriesScreen(selectedCategories, randomCategories) {
        // Create an overlay screen
        const overlay = document.createElement('div');
        overlay.className = 'overlay-screen';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        overlay.style.zIndex = '1000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = 'white';
        overlay.style.padding = '20px';
        overlay.style.textAlign = 'center';
        
        // Create container
        const container = document.createElement('div');
        container.style.maxWidth = '800px';
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        container.style.borderRadius = '10px';
        container.style.padding = '30px';
        container.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        
        // Title
        const title = document.createElement('h2');
        title.style.fontSize = '1.8rem';
        title.style.marginBottom = '20px';
        title.style.color = '#ffffff';
        title.textContent = getUserLanguage() === 'it' ? 
            'Le Tue Categorie' : 
            'Your Categories';
        
        // Selected categories section
        const selectedTitle = document.createElement('h3');
        selectedTitle.style.fontSize = '1.3rem';
        selectedTitle.style.marginTop = '20px';
        selectedTitle.style.marginBottom = '15px';
        selectedTitle.textContent = getUserLanguage() === 'it' ? 
            'Categorie Selezionate:' : 
            'Selected Categories:';
        
        // Selected categories list
        const selectedList = document.createElement('div');
        selectedList.style.display = 'flex';
        selectedList.style.flexDirection = 'column';
        selectedList.style.gap = '10px';
        selectedList.style.marginBottom = '30px';
        
        selectedCategories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.style.fontSize = '1.6rem';
            categoryItem.style.fontWeight = 'bold';
            categoryItem.style.padding = '10px 20px';
            categoryItem.style.backgroundColor = 'rgba(76, 175, 80, 0.6)'; // Green for selected
            categoryItem.style.borderRadius = '8px';
            categoryItem.style.display = 'flex';
            categoryItem.style.alignItems = 'center';
            categoryItem.style.justifyContent = 'center';
            
            // User icon
            const userIcon = document.createElement('span');
            userIcon.innerHTML = '👤 ';
            userIcon.style.marginRight = '10px';
            categoryItem.appendChild(userIcon);
            
            // Category name
            const catName = document.createElement('span');
            catName.textContent = getGameTranslation('categories', category) || category;
            categoryItem.appendChild(catName);
            
            selectedList.appendChild(categoryItem);
        });
        
        // Random categories section
        const randomTitle = document.createElement('h3');
        randomTitle.style.fontSize = '1.3rem';
        randomTitle.style.marginTop = '10px';
        randomTitle.style.marginBottom = '15px';
        randomTitle.textContent = getUserLanguage() === 'it' ? 
            'Categorie Aggiunte dal Gioco:' : 
            'Categories Added by the Game:';
        
        // Random categories list
        const randomList = document.createElement('div');
        randomList.style.display = 'flex';
        randomList.style.flexDirection = 'column';
        randomList.style.gap = '10px';
        randomList.style.marginBottom = '40px';
        
        randomCategories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.style.fontSize = '1.6rem';
            categoryItem.style.fontWeight = 'bold';
            categoryItem.style.padding = '10px 20px';
            categoryItem.style.backgroundColor = 'rgba(138, 80, 143, 0.6)'; // Purple for random
            categoryItem.style.borderRadius = '8px';
            categoryItem.style.display = 'flex';
            categoryItem.style.alignItems = 'center';
            categoryItem.style.justifyContent = 'center';
            
            // Random icon
            const randomIcon = document.createElement('span');
            randomIcon.innerHTML = '🎲 ';
            randomIcon.style.marginRight = '10px';
            categoryItem.appendChild(randomIcon);
            
            // Category name
            const catName = document.createElement('span');
            catName.textContent = getGameTranslation('categories', category) || category;
            categoryItem.appendChild(catName);
            
            randomList.appendChild(categoryItem);
        });
        
        // Continue button
        const continueBtn = document.createElement('button');
        continueBtn.className = 'primary-button';
        continueBtn.style.padding = '15px 30px';
        continueBtn.style.fontSize = '1.2rem';
        continueBtn.style.margin = '0 auto';
        continueBtn.style.display = 'block';
        continueBtn.textContent = getUserLanguage() === 'it' ? 'Continua' : 'Continue';
        
        // Add all elements to the container
        container.appendChild(title);
        container.appendChild(selectedTitle);
        container.appendChild(selectedList);
        container.appendChild(randomTitle);
        container.appendChild(randomList);
        container.appendChild(continueBtn);
        overlay.appendChild(container);
        
        // Append to body
        document.body.appendChild(overlay);
        
        // Add event listener to continue button
        continueBtn.addEventListener('click', function() {
            // Remove the overlay
            document.body.removeChild(overlay);
            
            // Continue with the game flow
            continueAfterCategorySelection();
        });
    }
    
    // Continue after category selection and random categories shown
    function continueAfterCategorySelection() {
        if (gameState.gameMode === 'shared') {
            // If all players have selected categories, combine them
            if (Object.keys(gameState.playerCategories).length === gameState.players.length) {
                combineSharedCategories();
                startGame();
            } else {
                // Move to next player for category selection
                gameState.currentPlayerIndex++;
                setupCategorySelection();
            }
        } else {
            // Individual mode - move to next player for category selection
            gameState.currentPlayerIndex++;
            if (gameState.currentPlayerIndex < gameState.players.length) {
                setupCategorySelection();
            } else {
                // All players have selected categories, start the game
                gameState.currentPlayerIndex = 0;
                startGame();
            }
        }
    }
    
    // Combine categories for shared mode
    function combineSharedCategories() {
        const allCategories = [];
        
        Object.values(gameState.playerCategories).forEach(categories => {
            categories.forEach(category => {
                if (!allCategories.includes(category)) {
                    allCategories.push(category);
                }
            });
        });
        
        gameState.sharedCategories = allCategories;
        
        // Assign these categories to all players
        gameState.players.forEach(player => {
            player.categories = [...allCategories];
        });
    }
    
    // Start the main game after category selection
    function startGame() {
        gameState.currentPlayerIndex = 0;
        gameState.roundsCompleted = 0;
        
        // Initialize shock round and skip turn flags for all players
        gameState.players.forEach(player => {
            player.hadShockRound = false;
            player.skipNextTurn = false;
        });
        
        setupGameRound();
    }
    
    // Setup the game round for the current player
    function setupGameRound() {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        // Update player info
        document.getElementById('current-player-name').textContent = currentPlayer.name;
        document.getElementById('current-player-score').textContent = currentPlayer.score;
        
        // Clear any previous assigned elements
        const previousAssigned = document.querySelectorAll('.assigned-element');
        previousAssigned.forEach(el => el.remove());
        
        // Make sure both sections are back to default state
        document.querySelector('.category-section').classList.remove('hidden');
        document.querySelector('.difficulty-section').classList.remove('hidden');
        
        // Reset shock round styling if it exists
        document.body.classList.remove('shock-round');
        const gameRoundScreen = document.getElementById('game-round-screen');
        if (gameRoundScreen) {
            gameRoundScreen.classList.remove('shock-round');
        }
        
        // Add trophy icon if this player is leading
        const leadingPlayerIndex = findLeadingPlayer();
        if (leadingPlayerIndex === gameState.currentPlayerIndex && gameState.players.length > 1 && currentPlayer.score > 0) {
            const crownIcon = `<svg class="trophy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3,11 L7,3 L12,5 L17,3 L21,11 L3,11 Z M12,13 L12,19 M7,19 L17,19" />
            </svg>`;
            document.getElementById('current-player-name').innerHTML = `${currentPlayer.name} ${crownIcon}`;
        }
        
        // Check if this is a shock round
        if (gameState.isShockRound) {
            setupShockRound(currentPlayer);
            return;
        }
        
        // Regular round - continue with normal logic
        // Determine if we should assign category or difficulty
        // Use rounds completed and player index to alternate
        const shouldAssignCategory = (gameState.roundsCompleted + gameState.currentPlayerIndex) % 2 === 0;
        
        // Store the current mode in the game state
        gameState.currentMode = shouldAssignCategory ? 'assignCategory' : 'assignDifficulty';
        
        if (shouldAssignCategory) {
            // Assign a random category, let player choose from 2 random difficulties
            const randomIndex = Math.floor(Math.random() * currentPlayer.categories.length);
            gameState.currentCategory = currentPlayer.categories[randomIndex];
            
            // Select 2 random difficulties (bambino and facile cannot appear together)
            const allDifficulties = ['bambino', 'facile', 'medio', 'esperto', 'laureato'];
            gameState.availableOptions = getRandomDifficulties(allDifficulties, 2);
            
            // Hide category section, show difficulty section
            document.querySelector('.category-section').classList.add('hidden');
            document.querySelector('.difficulty-section').classList.remove('hidden');
            
            // Show assigned category
            const assignedCategoryEl = document.createElement('div');
            assignedCategoryEl.className = 'assigned-element';
            const translatedCategory = getGameTranslation('categories', gameState.currentCategory) || gameState.currentCategory;
            assignedCategoryEl.innerHTML = `<h3>${getGameTranslation('categoryLabel')} ${translatedCategory}</h3>`;
            document.querySelector('.player-info').appendChild(assignedCategoryEl);
            
            // Update instruction text
            document.getElementById('difficulty-title').textContent = getGameTranslation('difficultyTitle');
            
            // Show only the 2 random difficulties
            updateDifficultyButtons(gameState.availableOptions);
        } else {
            // Assign a random difficulty, let player choose from 2 random categories
            const difficulties = ['bambino', 'facile', 'medio', 'esperto', 'laureato'];
            const randomIndex = Math.floor(Math.random() * difficulties.length);
            gameState.currentDifficulty = difficulties[randomIndex];
            
            // Select 2 random categories from player's categories
            gameState.availableOptions = getRandomSubset(currentPlayer.categories, 2);
            
            // Hide difficulty section, show category section
            document.querySelector('.difficulty-section').classList.add('hidden');
            document.querySelector('.category-section').classList.remove('hidden');
            
            // Show assigned difficulty
            const assignedDifficultyEl = document.createElement('div');
            assignedDifficultyEl.className = 'assigned-element';
            const translatedDifficulty = getGameTranslation(gameState.currentDifficulty);
            assignedDifficultyEl.innerHTML = `<h3>${getGameTranslation('difficultyLabel')} ${translatedDifficulty}</h3>`;
            document.querySelector('.player-info').appendChild(assignedDifficultyEl);
            
            // Update instruction text
            document.getElementById('category-selection-title').textContent = getGameTranslation('categorySelectionTitle');
            
            // Generate category buttons - only for the 2 random categories
            generateCategoryButtons(gameState.availableOptions);
        }
        
        // Show game round screen
        showScreen(screens.gameRound);
    }
    
    // Setup a shock round where both category and difficulty are assigned
    function setupShockRound(player) {
        console.log("Setting up shock round for", player.name);
        
        // Apply shock round styling
        document.body.classList.add('shock-round');
        const gameRoundScreen = document.getElementById('game-round-screen');
        if (gameRoundScreen) {
            gameRoundScreen.classList.add('shock-round');
        }
        
        // Create shock round style
        if (!document.getElementById('shock-round-style')) {
            const style = document.createElement('style');
            style.id = 'shock-round-style';
            style.textContent = `
                body.shock-round {
                    background: linear-gradient(135deg, #370000 0%, #4d0000 100%);
                    transition: background 0.5s ease;
                }
                #game-round-screen.shock-round .screen-content,
                #question-screen.shock-round .screen-content,
                #result-screen.shock-round .screen-content {
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
                }
                .shock-title {
                    color: #ff5252;
                    text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                    animation: pulse 1.5s infinite alternate;
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 2.2rem;
                }
                @keyframes pulse {
                    0% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                .shock-info {
                    background-color: rgba(255, 0, 0, 0.15);
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .shock-penalty {
                    color: #ff5252;
                    font-weight: bold;
                    margin-top: 10px;
                    font-style: italic;
                }
                .shock-assigned {
                    margin: 25px 0;
                    padding: 15px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    text-align: center;
                }
                .shock-assigned h3 {
                    margin-bottom: 10px;
                    color: #ff9292;
                }
                .shock-assigned p {
                    font-size: 1.3rem;
                    font-weight: bold;
                    color: white;
                }
                .timer-container.shock {
                    color: #ff5252;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add shock round title
        const shockTitle = document.createElement('h2');
        shockTitle.className = 'shock-title';
        shockTitle.textContent = getUserLanguage() === 'it' ? 'TURNO SHOCK!' : 'SHOCK ROUND!';
        
        // Add shock round info
        const shockInfo = document.createElement('div');
        shockInfo.className = 'shock-info';
        shockInfo.textContent = getUserLanguage() === 'it' ? 
            'Hai raggiunto 10 punti! In questo turno, sia la categoria che la difficoltà sono assegnate casualmente!' : 
            'You\'ve reached 10 points! In this round, both category and difficulty are randomly assigned!';
        
        // Add penalty info
        const penaltyInfo = document.createElement('p');
        penaltyInfo.className = 'shock-penalty';
        penaltyInfo.textContent = getUserLanguage() === 'it' ? 
            'Attenzione: Se rispondi in modo errato, salterai il tuo prossimo turno!' : 
            'Warning: If you answer incorrectly, you will skip your next turn!';
        shockInfo.appendChild(penaltyInfo);
        
        // Randomly select both category and difficulty
        const allDifficulties = ['bambino', 'facile', 'medio', 'esperto', 'laureato'];
        // With bias towards higher difficulties
        const weightedDifficulties = [...allDifficulties, 'esperto', 'laureato', 'laureato'];
        const randomDifficultyIndex = Math.floor(Math.random() * weightedDifficulties.length);
        gameState.currentDifficulty = weightedDifficulties[randomDifficultyIndex];
        
        const randomCategoryIndex = Math.floor(Math.random() * player.categories.length);
        gameState.currentCategory = player.categories[randomCategoryIndex];
        
        // Create container for the assigned values
        const assignedContainer = document.createElement('div');
        assignedContainer.className = 'shock-assigned';
        
        // Display assigned category 
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = getUserLanguage() === 'it' ? 'Categoria:' : 'Category:';
        
        const categoryValue = document.createElement('p');
        categoryValue.textContent = getGameTranslation('categories', gameState.currentCategory) || gameState.currentCategory;
        
        // Display assigned difficulty
        const difficultyTitle = document.createElement('h3');
        difficultyTitle.textContent = getUserLanguage() === 'it' ? 'Difficoltà:' : 'Difficulty:';
        
        const difficultyValue = document.createElement('p');
        difficultyValue.textContent = getGameTranslation(gameState.currentDifficulty) || gameState.currentDifficulty;
        
        // Continue button
        const continueBtn = document.createElement('button');
        continueBtn.className = 'primary-button';
        continueBtn.style.marginTop = '30px';
        continueBtn.textContent = getUserLanguage() === 'it' ? 'Inizia Turno Shock' : 'Start Shock Round';
        
        // Add all elements to the container
        assignedContainer.appendChild(categoryTitle);
        assignedContainer.appendChild(categoryValue);
        assignedContainer.appendChild(difficultyTitle);
        assignedContainer.appendChild(difficultyValue);
        
        // Clear game round screen content and add shock elements
        const screenContent = document.querySelector('#game-round-screen .screen-content');
        // Preserve player info
        const playerInfo = document.querySelector('.player-info');
        
        // Clear everything except player info
        screenContent.innerHTML = '';
        screenContent.appendChild(playerInfo);
        screenContent.appendChild(shockTitle);
        screenContent.appendChild(shockInfo);
        screenContent.appendChild(assignedContainer);
        screenContent.appendChild(continueBtn);
        
        // Add event listener to continue button
        continueBtn.addEventListener('click', handleShockRoundStart);
        
        // Show game round screen
        showScreen(screens.gameRound);
    }
    
    // Separate handler for shock round start
    function handleShockRoundStart() {
        console.log("Shock round start button clicked");
        
        // Apply shock styling to question screen
        const questionScreen = document.getElementById('question-screen');
        if (questionScreen) {
            questionScreen.classList.add('shock-round');
        }
        
        // Apply shock styling to result screen
        const resultScreen = document.getElementById('result-screen');
        if (resultScreen) {
            resultScreen.classList.add('shock-round');
        }
        
        // Make sure we have a valid question before proceeding
        const question = getRandomQuestion();
        if (!question) {
            console.error("No question found for category:", gameState.currentCategory, "difficulty:", gameState.currentDifficulty);
            alert('Error: No questions available for this category and difficulty.');
            return;
        }
        
        gameState.currentQuestion = question;
        
        // Update question display
        document.getElementById('current-category').textContent = getGameTranslation('categories', gameState.currentCategory) || gameState.currentCategory;
        document.getElementById('current-difficulty').textContent = getGameTranslation(gameState.currentDifficulty);
        document.getElementById('question-text').textContent = question.question;
        
        // Remove any existing bambino warning
        const existingWarning = document.getElementById('bambino-game-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        // Generate answer buttons
        const answerButtonsContainer = document.getElementById('answer-buttons');
        answerButtonsContainer.innerHTML = '';
        
        const letters = ['A', 'B', 'C', 'D'];
        
        // Add difficulty warning if bambino
        if (gameState.currentDifficulty === 'bambino' && !document.getElementById('bambino-game-warning')) {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'bambino-game-warning';
            warningDiv.style.color = 'red';
            warningDiv.style.fontWeight = 'bold';
            warningDiv.style.marginBottom = '10px';
            
            // Use direct text based on language instead of translation key
            const lang = getUserLanguage();
            warningDiv.textContent = '⚠️ ' + (lang === 'it' ? 
                'Modalità bambino: 5 secondi per rispondere! Risposta sbagliata: -2 punti!' : 
                'Child mode: 5 seconds to answer! Wrong answer: -2 points!');
            
            answerButtonsContainer.parentNode.insertBefore(warningDiv, answerButtonsContainer);
        }
        
        // Add shock round penalty warning
        const shockWarningDiv = document.createElement('div');
        shockWarningDiv.id = 'shock-warning';
        shockWarningDiv.style.color = 'red';
        shockWarningDiv.style.fontWeight = 'bold';
        shockWarningDiv.style.marginBottom = '10px';
        shockWarningDiv.style.textAlign = 'center';
        shockWarningDiv.style.padding = '5px';
        shockWarningDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        shockWarningDiv.style.borderRadius = '5px';
        
        shockWarningDiv.textContent = getUserLanguage() === 'it' ? 
            '⚠️ TURNO SHOCK: Risposta sbagliata = Salti il prossimo turno!' : 
            '⚠️ SHOCK ROUND: Wrong answer = Skip your next turn!';
        
        answerButtonsContainer.parentNode.insertBefore(shockWarningDiv, answerButtonsContainer);
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.dataset.index = index;
            
            const letter = document.createElement('span');
            letter.className = 'answer-letter';
            letter.textContent = letters[index];
            
            const text = document.createElement('span');
            text.className = 'answer-text';
            text.textContent = answer;
            
            button.appendChild(letter);
            button.appendChild(text);
            
            button.addEventListener('click', function() {
                handleAnswer(index);
            });
            
            answerButtonsContainer.appendChild(button);
        });
        
        // Add shock styling to timer
        const timerContainer = document.querySelector('.timer-container');
        if (timerContainer) {
            timerContainer.classList.add('shock');
        }
        
        // Start the timer
        startTimer();
        
        // Show question screen
        showScreen(screens.question);
    }
    
    // Helper function to get a random subset of an array
    function getRandomSubset(array, size) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, size);
    }
    
    // Helper function to get random difficulties with constraints
    function getRandomDifficulties(difficulties, size) {
        // If we want both bambino and facile to never appear together
        const includesBambino = Math.random() < 0.5;
        
        if (includesBambino) {
            // If we include bambino, we cannot include facile
            const filteredDiffs = difficulties.filter(diff => diff !== 'facile');
            const bambinoIndex = filteredDiffs.indexOf('bambino');
            
            // Generate a random index excluding bambino's index
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * filteredDiffs.length);
            } while (randomIndex === bambinoIndex);
            
            return ['bambino', filteredDiffs[randomIndex]];
        } else {
            // If we include facile, we cannot include bambino
            const filteredDiffs = difficulties.filter(diff => diff !== 'bambino');
            const facileIndex = filteredDiffs.indexOf('facile');
            
            // We can either include facile or not
            const includeFacile = Math.random() < 0.6; // 60% chance to include facile
            
            if (includeFacile) {
                // Include facile and one other (not bambino)
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * filteredDiffs.length);
                } while (randomIndex === facileIndex);
                
                return ['facile', filteredDiffs[randomIndex]];
            } else {
                // Just get 2 random difficulties excluding both bambino and facile
                const otherDiffs = difficulties.filter(diff => diff !== 'bambino' && diff !== 'facile');
                return getRandomSubset(otherDiffs, 2);
            }
        }
    }
    
    // Update difficulty buttons to show only the available options
    function updateDifficultyButtons(availableDifficulties) {
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        
        difficultyButtons.forEach(button => {
            const difficulty = button.getAttribute('data-difficulty');
            
            // Remove any existing warning labels
            const existingLabel = button.querySelector('.difficulty-warning');
            if (existingLabel) {
                existingLabel.remove();
            }
            
            if (availableDifficulties.includes(difficulty)) {
                button.style.display = 'block';
                
                // Add warning for bambino difficulty
                if (difficulty === 'bambino') {
                    // Remove standard point display for bambino
                    const pointsDisplay = button.querySelector('.points');
                    if (pointsDisplay) {
                        pointsDisplay.style.display = 'none';
                    }
                    
                    const warningLabel = document.createElement('span');
                    warningLabel.className = 'difficulty-warning';
                    
                    // Use direct text based on language instead of translation key
                    const lang = getUserLanguage();
                    warningLabel.textContent = lang === 'it' ? 
                        '(1/-2 punti & 5s tempo)' : 
                        '(1/-2 points & 5s time)';
                    
                    warningLabel.style.fontSize = '0.8em';
                    warningLabel.style.color = 'red';
                    warningLabel.style.display = 'block';
                    button.appendChild(warningLabel);
                } else {
                    // Make sure other difficulties show their points
                    const pointsDisplay = button.querySelector('.points');
                    if (pointsDisplay) {
                        pointsDisplay.style.display = 'block';
                    }
                }
            } else {
                button.style.display = 'none';
            }
        });
    }
    
    // Find the player with the highest score
    function findLeadingPlayer() {
        if (gameState.players.length === 0) return -1;
        
        let maxScore = -1;
        let leadingPlayerIndex = -1;
        
        gameState.players.forEach((player, index) => {
            if (player.score > maxScore) {
                maxScore = player.score;
                leadingPlayerIndex = index;
            }
        });
        
        return leadingPlayerIndex;
    }
    
    // Generate category buttons for the current player
    function generateCategoryButtons(categories) {
        const container = document.getElementById('category-buttons');
        container.innerHTML = '';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'player-category-btn';
            button.dataset.category = category;
            button.textContent = getGameTranslation('categories', category) || category;
            
            button.addEventListener('click', function() {
                selectCategory(category);
            });
            
            container.appendChild(button);
        });
    }
    
    // Handle category selection
    function selectCategory(category) {
        gameState.currentCategory = category;
        showQuestion();
    }
    
    // Handle difficulty selection
    function selectDifficulty(difficulty) {
        gameState.currentDifficulty = difficulty;
        showQuestion();
    }
    
    // Get a random question for the current category and difficulty
    function getRandomQuestion() {
        const category = gameState.currentCategory;
        const difficulty = gameState.currentDifficulty;
        
        if (!gameState.questions[category] || !gameState.questions[category][difficulty]) {
            return null;
        }
        
        const questions = gameState.questions[category][difficulty];
        if (!questions || questions.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex];
    }
    
    // Show a question to the current player
    function showQuestion() {
        // Get a random question
        const question = getRandomQuestion();
        if (!question) {
            alert('Error: No questions available for this category and difficulty.');
            return;
        }
        
        gameState.currentQuestion = question;
        
        // Update question display
        document.getElementById('current-category').textContent = getGameTranslation('categories', gameState.currentCategory) || gameState.currentCategory;
        document.getElementById('current-difficulty').textContent = getGameTranslation(gameState.currentDifficulty);
        document.getElementById('question-text').textContent = question.question;
        
        // Remove any existing bambino warning before generating new answer buttons
        const existingWarning = document.getElementById('bambino-game-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        // Generate answer buttons
        generateAnswerButtons(question);
        
        // Start the timer
        startTimer();
        
        // Show question screen
        showScreen(screens.question);
    }
    
    // Generate answer buttons for the question
    function generateAnswerButtons(question) {
        const container = document.getElementById('answer-buttons');
        container.innerHTML = '';
        
        const letters = ['A', 'B', 'C', 'D'];
        
        // Add difficulty warning if bambino
        if (gameState.currentDifficulty === 'bambino' && !document.getElementById('bambino-game-warning')) {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'bambino-game-warning';
            warningDiv.style.color = 'red';
            warningDiv.style.fontWeight = 'bold';
            warningDiv.style.marginBottom = '10px';
            
            // Use direct text based on language instead of translation key
            const lang = getUserLanguage();
            warningDiv.textContent = '⚠️ ' + (lang === 'it' ? 
                'Modalità bambino: 5 secondi per rispondere! Risposta sbagliata: -2 punti!' : 
                'Child mode: 5 seconds to answer! Wrong answer: -2 points!');
            
            container.parentNode.insertBefore(warningDiv, container);
        }
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.dataset.index = index;
            
            const letter = document.createElement('span');
            letter.className = 'answer-letter';
            letter.textContent = letters[index];
            
            const text = document.createElement('span');
            text.className = 'answer-text';
            text.textContent = answer;
            
            button.appendChild(letter);
            button.appendChild(text);
            
            button.addEventListener('click', function() {
                handleAnswer(index);
            });
            
            container.appendChild(button);
        });
    }
    
    // Start the timer for a question
    function startTimer() {
        // Clear any existing timer
        if (gameState.timer) {
            clearInterval(gameState.timer);
        }
        
        // Set time based on difficulty
        let timeLimit;
        switch (gameState.currentDifficulty) {
            case 'bambino': timeLimit = 5; break;  // 5 seconds for bambino
            case 'facile': timeLimit = 15; break;
            case 'medio': timeLimit = 20; break;
            case 'esperto': timeLimit = 30; break;
            case 'laureato': timeLimit = 30; break;
            default: timeLimit = 20;
        }
        
        gameState.timeLeft = timeLimit;
        updateTimerDisplay(gameState.timeLeft);
        
        // Start the timer
        gameState.timer = setInterval(() => {
            gameState.timeLeft--;
            updateTimerDisplay(gameState.timeLeft);
            
            if (gameState.timeLeft <= 0) {
                // Time's up
                clearInterval(gameState.timer);
                gameState.timer = null;
                timeOut();
            }
        }, 1000);
    }
    
    // Update the timer display
    function updateTimerDisplay(timeLeft) {
        document.getElementById('timer-display').textContent = timeLeft;
    }
    
    // Handle when time runs out
    function timeOut() {
        // Stop the timer (additional safety)
        if (gameState.timer) {
            clearInterval(gameState.timer);
            gameState.timer = null;
        }
        
        console.log("Time's up triggered!");  // Debug log
        
        // Display time's up message
        const answerFeedback = document.getElementById('answer-feedback');
        if (answerFeedback) {
            answerFeedback.textContent = "Tempo scaduto!";
            answerFeedback.style.color = "red";
            answerFeedback.style.fontWeight = "bold";
            answerFeedback.style.fontSize = "1.2em";
        }
        
        // Forcefully disable all answer buttons
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            // Remove the click event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Style and disable the new button
            newButton.disabled = true;
            newButton.classList.add('disabled-btn');
            newButton.style.opacity = '0.7';
            newButton.style.cursor = 'not-allowed';
            newButton.style.pointerEvents = 'none';  // Additional safety
        });
        
        // Show the correct answer
        const correctIndex = gameState.currentQuestion.correctIndex;
        if (answerButtons[correctIndex]) {
            const correctButton = answerButtons[correctIndex];
            correctButton.classList.add('correct-answer-btn');
        }
        
        // Wait a moment then show the result screen
        setTimeout(() => {
            showResult(false, 0, true);
        }, 2000);
    }
    
    // Disable all answer buttons
    function disableAnswerButtons() {
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            // Remove the click event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Style and disable the new button
            newButton.disabled = true;
            newButton.classList.add('disabled-btn');
            newButton.style.opacity = '0.7';
            newButton.style.cursor = 'not-allowed';
            newButton.style.pointerEvents = 'none';  // Additional safety
        });
    }
    
    // Handle a player's answer
    function handleAnswer(answerIndex) {
        // Check if timer is done or buttons disabled
        if (!gameState.timer || document.querySelector('.answer-btn.disabled-btn')) {
            console.log("Answer blocked: timer done or buttons disabled");
            return;
        }
        
        // Stop the timer
        clearInterval(gameState.timer);
        gameState.timer = null;
        
        // Rest of function unchanged
        const isCorrect = answerIndex === gameState.currentQuestion.correctIndex;
        let pointsEarned = 0;
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        // Get all answer buttons
        const answerButtons = document.querySelectorAll('.answer-btn');
        const selectedButton = answerButtons[answerIndex];
        const correctButton = answerButtons[gameState.currentQuestion.correctIndex];
        
        // Apply visual feedback
        if (isCorrect) {
            // Correct answer - highlight in green
            selectedButton.classList.add('correct-answer-btn');
            
            // Award points based on difficulty
            switch (gameState.currentDifficulty) {
                case 'bambino': pointsEarned = 1; break;
                case 'facile': pointsEarned = 2; break;
                case 'medio': pointsEarned = 3; break;
                case 'esperto': pointsEarned = 4; break;
                case 'laureato': pointsEarned = 5; break;
                default: pointsEarned = 1;
            }
            
            // Update player's score
            currentPlayer.score += pointsEarned;
            
            // Wait a moment before showing result screen
            setTimeout(() => {
                showResult(true, pointsEarned);
            }, 1000);
        } else {
            // Wrong answer - highlight selected in red, correct in green
            selectedButton.classList.add('incorrect-answer-btn');
            correctButton.classList.add('correct-answer-btn');
            
            // If this is a shock round, set flag to skip next turn
            if (gameState.isShockRound) {
                currentPlayer.skipNextTurn = true;
            }
            
            // Apply penalty for bambino difficulty level
            if (gameState.currentDifficulty === 'bambino') {
                pointsEarned = -2;
                // Ensure score doesn't go below zero
                if (currentPlayer.score >= 2) {
                    currentPlayer.score -= 2;
                } else {
                    // If player has less than 2 points, set score to 0
                    pointsEarned = -currentPlayer.score;
                    currentPlayer.score = 0;
                }
            }
            
            // Wait a moment before showing result screen
            setTimeout(() => {
                showResult(false, pointsEarned, false, gameState.isShockRound);
            }, 1500);
        }
        
        // Disable all buttons to prevent multiple answers
        disableAnswerButtons();
    }
    
    // Show the result screen
    function showResult(isCorrect, points, isTimeUp = false, isShockPenalty = false) {
        const resultMessage = document.getElementById('result-message');
        const pointsEarned = document.getElementById('points-earned');
        const correctAnswerContainer = document.getElementById('correct-answer-container');
        const correctAnswerText = document.getElementById('correct-answer');
        
        // Set result message and class
        if (isTimeUp) {
            resultMessage.textContent = getGameTranslation('timeUp') || "Tempo scaduto!";
            resultMessage.className = 'result-message incorrect';
            correctAnswerContainer.classList.remove('hidden');
            correctAnswerText.textContent = gameState.currentQuestion.answers[gameState.currentQuestion.correctIndex];
        } else if (isCorrect) {
            resultMessage.textContent = getGameTranslation('correctAnswer');
            resultMessage.className = 'result-message correct';
            correctAnswerContainer.classList.add('hidden');
        } else {
            resultMessage.textContent = getGameTranslation('wrongAnswer');
            resultMessage.className = 'result-message incorrect';
            correctAnswerContainer.classList.remove('hidden');
            correctAnswerText.textContent = gameState.currentQuestion.answers[gameState.currentQuestion.correctIndex];
            
            // Add shock round penalty message if needed
            if (isShockPenalty) {
                const penaltyEl = document.createElement('p');
                penaltyEl.style.color = 'red';
                penaltyEl.style.fontWeight = 'bold';
                penaltyEl.style.marginTop = '10px';
                penaltyEl.textContent = getUserLanguage() === 'it' ? 
                    '⚠️ Penalità del Turno Shock: Salterai il tuo prossimo turno!' : 
                    '⚠️ Shock Round Penalty: You will skip your next turn!';
                resultMessage.appendChild(penaltyEl);
            }
        }
        
        // Set points earned
        pointsEarned.textContent = points;
        
        // COMPLETELY REWORKED APPROACH: Replace the continue button with a direct approach
        const continueButtonContainer = document.querySelector('.result-actions');
        if (continueButtonContainer) {
            // Clear any existing content
            continueButtonContainer.innerHTML = '';
            
            // Create a fresh button with inline onclick attribute
            const freshButton = document.createElement('button');
            freshButton.id = 'continue-game';
            freshButton.className = 'primary-button';
            freshButton.textContent = getUserLanguage() === 'it' ? 'Continua' : 'Continue';
            
            // Add direct onclick that bypasses event listeners
            freshButton.setAttribute('onclick', `
                console.log('Direct onclick handler activated');
                
                // Clear shock styling
                document.body.classList.remove('shock-round');
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('shock-round'));
                
                // Reset game state for next player
                const wasShockRound = gameState.isShockRound;
                gameState.isShockRound = false;
                gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
                gameState.currentCategory = null;
                gameState.currentDifficulty = null;
                
                // Update round counter if needed
                if (gameState.currentPlayerIndex === 0) {
                    gameState.roundsCompleted++;
                }
                
                // Check if current player should skip
                if (gameState.players[gameState.currentPlayerIndex].skipNextTurn) {
                    showForceSkipMessage();
                    return;
                }
                
                // Check if this player should have a shock round
                const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                const needsShockRound = currentPlayer.score >= 10 && !currentPlayer.hadShockRound;
                
                if (needsShockRound) {
                    currentPlayer.hadShockRound = true;
                    gameState.isShockRound = true;
                    setupShockRound(currentPlayer);
                } else {
                    setupGameRound();
                }
            `);
            
            // Add button to container
            continueButtonContainer.appendChild(freshButton);
        }
        
        // Show result screen
        showScreen(screens.result);
    }
    
    // Force next turn - completely separate from regular nextTurn to avoid any issues
    function forceNextTurn() {
        console.log("FORCE NEXT TURN STARTED");
        
        // Check for winner first
        for (let i = 0; i < gameState.players.length; i++) {
            if (gameState.players[i].score >= gameState.winningScore && gameState.roundsCompleted > 0) {
                console.log("We have a winner!");
                showGameOver(i);
                return;
            }
        }
        
        // Thoroughly clean up shock round elements and styles
        console.log("Cleaning up shock round elements");
        cleanupShockRound();
        
        // Reset shock round flag
        const wasShockRound = gameState.isShockRound;
        gameState.isShockRound = false;
        console.log("Was shock round:", wasShockRound);
        
        // Move to next player
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        console.log("Moving to player index:", gameState.currentPlayerIndex);
        
        // Check if this player should skip their turn
        if (gameState.players[gameState.currentPlayerIndex].skipNextTurn) {
            console.log("Player should skip turn");
            
            // Create skip message
            showForceSkipMessage();
            return;
        }
        
        // Reset for next round
        gameState.currentCategory = null;
        gameState.currentDifficulty = null;
        
        // Check if we've completed a round
        if (gameState.currentPlayerIndex === 0) {
            gameState.roundsCompleted++;
            console.log("Completed round:", gameState.roundsCompleted);
        }
        
        // Check if next player needs a shock round
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        gameState.isShockRound = currentPlayer.score >= 10 && !currentPlayer.hadShockRound;
        console.log("Next player needs shock round:", gameState.isShockRound);
        
        if (gameState.isShockRound) {
            console.log("Setting up shock round for player:", currentPlayer.name);
            currentPlayer.hadShockRound = true;
            setupShockRound(currentPlayer);
        } else {
            console.log("Setting up regular game round");
            // Regular round
            setupGameRound();
        }
        
        console.log("FORCE NEXT TURN COMPLETED");
    }
    
    // Cleanup shock round styling and elements
    function cleanupShockRound() {
        console.log("Cleaning up shock round");
        
        // Remove shock styling from body
        document.body.classList.remove('shock-round');
        
        // Remove shock styling from all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('shock-round');
        });
        
        // Remove shock styling from timer
        const timerContainer = document.querySelector('.timer-container');
        if (timerContainer) {
            timerContainer.classList.remove('shock');
        }
        
        // Remove any shock warnings
        const shockWarning = document.getElementById('shock-warning');
        if (shockWarning) {
            shockWarning.remove();
        }
        
        // Remove any shock elements
        document.querySelectorAll('.shock-title, .shock-info, .shock-assigned, .shock-penalty').forEach(el => {
            el.remove();
        });
        
        // Reset shock round flag
        gameState.isShockRound = false;
    }
    
    // Forced skip message with clean implementation
    function showForceSkipMessage() {
        // First make sure body is clean
        document.body.className = '';
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        // Create message container
        const messageBox = document.createElement('div');
        messageBox.style.backgroundColor = '#222';
        messageBox.style.color = 'white';
        messageBox.style.padding = '30px';
        messageBox.style.borderRadius = '10px';
        messageBox.style.maxWidth = '500px';
        messageBox.style.textAlign = 'center';
        messageBox.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        
        // Title
        const skipTitle = document.createElement('h2');
        skipTitle.style.color = 'red';
        skipTitle.style.marginBottom = '15px';
        skipTitle.textContent = getUserLanguage() === 'it' ? 'Turno Saltato!' : 'Turn Skipped!';
        
        // Player name
        const playerName = document.createElement('p');
        playerName.style.fontSize = '1.2rem';
        playerName.style.marginBottom = '15px';
        playerName.textContent = gameState.players[gameState.currentPlayerIndex].name;
        
        // Reason
        const reason = document.createElement('p');
        reason.style.marginBottom = '25px';
        reason.textContent = getUserLanguage() === 'it' ? 
            'Ha sbagliato nel Turno Shock e salta questo turno.' : 
            'Failed in the Shock Round and skips this turn.';
        
        // Button
        const continueBtn = document.createElement('button');
        continueBtn.className = 'primary-button';
        continueBtn.style.padding = '10px 20px';
        continueBtn.textContent = getUserLanguage() === 'it' ? 'Continua' : 'Continue';
        
        // Add elements to container
        messageBox.appendChild(skipTitle);
        messageBox.appendChild(playerName);
        messageBox.appendChild(reason);
        messageBox.appendChild(continueBtn);
        overlay.appendChild(messageBox);
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Clear skip flag
        gameState.players[gameState.currentPlayerIndex].skipNextTurn = false;
        
        // Add event listener
        continueBtn.addEventListener('click', function() {
            // Remove overlay
            document.body.removeChild(overlay);
            
            // Move to next player
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            
            // Force next turn with small delay
            setTimeout(function() {
                // Check for shock round
                const player = gameState.players[gameState.currentPlayerIndex];
                gameState.isShockRound = player.score >= 10 && !player.hadShockRound;
                
                if (gameState.isShockRound) {
                    player.hadShockRound = true;
                    setupShockRound(player);
                } else {
                    setupGameRound();
                }
            }, 50);
        });
    }
    
    // Move to the next player's turn
    function nextTurn() {
        console.log("nextTurn called");
        
        // Ensure shock round is cleaned up
        cleanupShockRound();
        
        // Check if any player has reached the winning score
        const winnerIndex = checkForWinner();
        
        if (winnerIndex !== -1) {
            // We have a winner
            showGameOver(winnerIndex);
            return;
        }
        
        // Clean up any warning messages
        const existingWarning = document.getElementById('bambino-game-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        // Move to next player
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        console.log("Moving to player index:", gameState.currentPlayerIndex);
        
        // Check if current player should skip their turn
        if (gameState.players[gameState.currentPlayerIndex].skipNextTurn) {
            console.log("Player should skip turn");
            
            // Display skipped turn message
            showSkippedTurnMessage();
            return;
        }
        
        // Check if this player needs a shock round
        checkShockRoundAndSetup();
    }
    
    // Show a message that the player's turn is skipped
    function showSkippedTurnMessage() {
        console.log("Showing skipped turn message");
        
        const skipMessage = document.createElement('div');
        skipMessage.style.position = 'fixed';
        skipMessage.style.top = '50%';
        skipMessage.style.left = '50%';
        skipMessage.style.transform = 'translate(-50%, -50%)';
        skipMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        skipMessage.style.color = 'white';
        skipMessage.style.padding = '20px 40px';
        skipMessage.style.borderRadius = '10px';
        skipMessage.style.textAlign = 'center';
        skipMessage.style.zIndex = '1000';
        skipMessage.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        
        const skipTitle = document.createElement('h2');
        skipTitle.style.color = 'red';
        skipTitle.style.marginBottom = '10px';
        skipTitle.textContent = getUserLanguage() === 'it' ? 
            'Turno Saltato!' : 
            'Turn Skipped!';
        
        const playerName = document.createElement('p');
        playerName.style.fontSize = '1.2rem';
        playerName.style.marginBottom = '15px';
        playerName.textContent = gameState.players[gameState.currentPlayerIndex].name;
        
        const skipReason = document.createElement('p');
        skipReason.textContent = getUserLanguage() === 'it' ? 
            'Ha sbagliato nel Turno Shock e salta questo turno.' : 
            'Failed in the Shock Round and skips this turn.';
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'primary-button';
        continueBtn.style.marginTop = '20px';
        continueBtn.textContent = getUserLanguage() === 'it' ? 'Continua' : 'Continue';
        
        skipMessage.appendChild(skipTitle);
        skipMessage.appendChild(playerName);
        skipMessage.appendChild(skipReason);
        skipMessage.appendChild(continueBtn);
        
        document.body.appendChild(skipMessage);
        
        // Clear the skip flag so it only happens once
        gameState.players[gameState.currentPlayerIndex].skipNextTurn = false;
        
        // Add event listener to continue button
        continueBtn.addEventListener('click', function() {
            console.log("Skip message continue button clicked");
            document.body.removeChild(skipMessage);
            // Move to the next player
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            console.log("After skip, moving to player:", gameState.currentPlayerIndex);
            // Check if this player needs a shock round (has 10 or more points)
            checkShockRoundAndSetup();
        });
    }
    
    // Helper function to check for shock round and setup
    function checkShockRoundAndSetup() {
        console.log("checkShockRoundAndSetup called");
        
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        console.log("Current player:", currentPlayer.name, "Score:", currentPlayer.score, "Had shock round:", currentPlayer.hadShockRound);
        
        gameState.isShockRound = currentPlayer.score >= 10 && !currentPlayer.hadShockRound;
        console.log("Is shock round:", gameState.isShockRound);
        
        // Track that player had a shock round so it only happens once
        if (gameState.isShockRound) {
            currentPlayer.hadShockRound = true;
        }
        
        // If we've gone through all players, increment rounds completed
        if (gameState.currentPlayerIndex === 0) {
            gameState.roundsCompleted++;
        }
        
        // Reset game state variables
        gameState.currentCategory = null;
        gameState.currentDifficulty = null;
        
        // Setup the next round
        setupGameRound();
    }
    
    // Check if any player has reached the winning score
    function checkForWinner() {
        // Check each player's score
        for (let i = 0; i < gameState.players.length; i++) {
            if (gameState.players[i].score >= gameState.winningScore) {
                // If at least one round is complete, we have a winner
                if (gameState.roundsCompleted > 0) {
                    return i;
                }
            }
        }
        
        return -1;
    }
    
    // Show the game over screen
    function showGameOver(winnerIndex) {
        const winner = gameState.players[winnerIndex];
        
        // Trophy icon SVG
        const crownIcon = `<svg class="trophy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3,11 L7,3 L12,5 L17,3 L21,11 L3,11 Z M12,13 L12,19 M7,19 L17,19" />
        </svg>`;
        
        // Update winner info
        document.getElementById('winner-name').innerHTML = `${winner.name} ${crownIcon}`;
        document.getElementById('winner-score').textContent = winner.score;
        
        // Generate final scores list
        generateFinalScoresList();
        
        // Show game over screen
        showScreen(screens.gameOver);
        gameState.gameOver = true;
    }
    
    // Generate the final scores list
    function generateFinalScoresList() {
        const container = document.getElementById('final-scores-list');
        container.innerHTML = '';
        
        // Sort players by score (highest first)
        const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
        
        // Trophy icon SVG
        const crownIcon = `<svg class="trophy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3,11 L7,3 L12,5 L17,3 L21,11 L3,11 Z M12,13 L12,19 M7,19 L17,19" />
        </svg>`;
        
        sortedPlayers.forEach((player, index) => {
            const listItem = document.createElement('li');
            
            const name = document.createElement('span');
            name.className = 'player-name';
            // Add trophy icon to the winner (first in sorted list)
            if (index === 0 && player.score > 0) {
                name.innerHTML = `${player.name} ${crownIcon}`;
            } else {
                name.textContent = player.name;
            }
            
            const score = document.createElement('span');
            score.className = 'player-score';
            score.textContent = player.score;
            
            listItem.appendChild(name);
            listItem.appendChild(score);
            container.appendChild(listItem);
        });
    }
    
    // Reset the game to start over
    function resetGame() {
        gameState.players = [];
        gameState.currentPlayerIndex = 0;
        gameState.gameMode = 'individual';
        gameState.playerCategories = {};
        gameState.sharedCategories = [];
        gameState.currentQuestion = null;
        gameState.currentDifficulty = null;
        gameState.currentCategory = null;
        gameState.roundsCompleted = 0;
        gameState.gameOver = false;
        
        // Clear any active timer
        if (gameState.timer) {
            clearInterval(gameState.timer);
            gameState.timer = null;
        }
    }
    
    // Helper function to show a specific screen
    function showScreen(screen) {
        // Hide all screens
        Object.values(screens).forEach(s => {
            s.classList.remove('active');
        });
        
        // Show the specified screen
        screen.classList.add('active');
    }
}); 