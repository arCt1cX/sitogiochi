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
        availableOptions: [] // New property to store limited options
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
        
        // Result screen
        document.getElementById('continue-game').addEventListener('click', function() {
            nextTurn();
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
            
            // Show a message about the random categories that were added
            const lang = getUserLanguage();
            const randomCategoriesText = randomCategories.map(
                cat => getGameTranslation('categories', cat) || cat
            ).join(', ');
            
            const randomCatsMsg = document.createElement('div');
            randomCatsMsg.className = 'info-message';
            
            if (lang === 'it') {
                randomCatsMsg.textContent = `Categorie aggiunte dal gioco: ${randomCategoriesText}`;
            } else {
                randomCatsMsg.textContent = `Categories added by the game: ${randomCategoriesText}`;
            }
            
            // Insert message in a visible area
            const container = document.querySelector('.selected-categories-container');
            if (container) {
                // Remove any existing message
                const existingMsg = container.querySelector('.info-message');
                if (existingMsg) {
                    existingMsg.remove();
                }
                
                container.appendChild(randomCatsMsg);
                
                // Set a timeout to remove the message when proceeding
                setTimeout(() => {
                    if (randomCatsMsg.parentNode) {
                        randomCatsMsg.remove();
                    }
                }, 4000);
            }
        } else {
            // Shared mode - just save the selected categories
            currentPlayer.categories = selectedCategories;
        }
        
        // Store in playerCategories for shared mode
        gameState.playerCategories[gameState.currentPlayerIndex] = 
            gameState.gameMode === 'individual' ? currentPlayer.categories : selectedCategories;
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
        
        // Add trophy icon if this player is leading
        const leadingPlayerIndex = findLeadingPlayer();
        if (leadingPlayerIndex === gameState.currentPlayerIndex && gameState.players.length > 1 && currentPlayer.score > 0) {
            const crownIcon = `<svg class="trophy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3,11 L7,3 L12,5 L17,3 L21,11 L3,11 Z M12,13 L12,19 M7,19 L17,19" />
            </svg>`;
            document.getElementById('current-player-name').innerHTML = `${currentPlayer.name} ${crownIcon}`;
        }
        
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
                showResult(false, pointsEarned);
            }, 1500);
        }
        
        // Disable all buttons to prevent multiple answers
        disableAnswerButtons();
    }
    
    // Show the result screen
    function showResult(isCorrect, points, isTimeUp = false) {
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
        }
        
        // Set points earned
        pointsEarned.textContent = points;
        
        // Show result screen
        showScreen(screens.result);
    }
    
    // Move to the next player's turn
    function nextTurn() {
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