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
        gameOver: false
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
        const maxCategories = gameState.gameMode === 'shared' ? 2 : 4;
        
        if (categoryCard.classList.contains('selected')) {
            // Deselect
            categoryCard.classList.remove('selected');
            updateSelectedCategoriesList();
        } else if (selectedCategories.length < maxCategories) {
            // Select if under max limit
            categoryCard.classList.add('selected');
            updateSelectedCategoriesList();
        } else {
            // Max limit reached
            alert(`${getGameTranslation('maxCategories')} ${maxCategories} ${getGameTranslation('categories')}`);
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
        currentPlayer.categories = selectedCategories;
        
        // Store in playerCategories for shared mode
        gameState.playerCategories[gameState.currentPlayerIndex] = selectedCategories;
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
        
        // Generate category buttons
        generateCategoryButtons(currentPlayer.categories);
        
        // Show game round screen
        showScreen(screens.gameRound);
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
    
    // Start the question timer
    function startTimer() {
        gameState.timeLeft = 30;
        updateTimerDisplay();
        
        // Clear any existing timer
        if (gameState.timer) {
            clearInterval(gameState.timer);
        }
        
        // Set a new timer
        gameState.timer = setInterval(function() {
            gameState.timeLeft--;
            updateTimerDisplay();
            
            if (gameState.timeLeft <= 0) {
                clearInterval(gameState.timer);
                handleTimeUp();
            }
        }, 1000);
    }
    
    // Update the timer display
    function updateTimerDisplay() {
        document.getElementById('timer-display').textContent = gameState.timeLeft;
    }
    
    // Handle a player's answer
    function handleAnswer(answerIndex) {
        // Stop the timer
        clearInterval(gameState.timer);
        
        const isCorrect = answerIndex === gameState.currentQuestion.correctIndex;
        let pointsEarned = 0;
        
        if (isCorrect) {
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
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            currentPlayer.score += pointsEarned;
            
            // Show result
            showResult(true, pointsEarned);
        } else {
            // Wrong answer - no points
            showResult(false, 0);
        }
    }
    
    // Handle time running out
    function handleTimeUp() {
        showResult(false, 0, true);
    }
    
    // Show the result screen
    function showResult(isCorrect, points, isTimeUp = false) {
        const resultMessage = document.getElementById('result-message');
        const pointsEarned = document.getElementById('points-earned');
        const correctAnswerContainer = document.getElementById('correct-answer-container');
        const correctAnswerText = document.getElementById('correct-answer');
        
        // Set result message and class
        if (isTimeUp) {
            resultMessage.textContent = getGameTranslation('timeUp');
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
        
        // Move to next player
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        
        // If we've gone through all players, increment rounds completed
        if (gameState.currentPlayerIndex === 0) {
            gameState.roundsCompleted++;
        }
        
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
        
        // Update winner info
        document.getElementById('winner-name').textContent = winner.name;
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
        
        sortedPlayers.forEach(player => {
            const listItem = document.createElement('li');
            
            const name = document.createElement('span');
            name.className = 'player-name';
            name.textContent = player.name;
            
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