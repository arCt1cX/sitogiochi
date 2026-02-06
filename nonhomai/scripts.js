
document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let gameState = {
        questions: [],
        currentQuestionIndex: 0,
        totalQuestions: 20,
        gameQuestions: []
    };

    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    const questionCountSelect = document.getElementById('question-count');
    const startGameBtn = document.getElementById('start-game');
    const nextQuestionBtn = document.getElementById('next-question');
    const playAgainBtn = document.getElementById('play-again');

    const questionDisplay = document.getElementById('question-display');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');

    // Load translations if available
    if (typeof applyGameTranslations === 'function') {
        applyGameTranslations();
    }

    // Load questions from file based on language
    async function loadQuestions() {
        try {
            const lang = typeof getUserLanguage === 'function' ? getUserLanguage() : 'it';
            const questionFile = lang === 'en' ? 'questions.txt' : 'domande.txt';
            const response = await fetch(questionFile);
            const text = await response.text();
            // Split by new line and filter empty lines
            gameState.questions = text.split('\n').filter(line => line.trim().length > 0);
            console.log(`Loaded ${gameState.questions.length} questions from ${questionFile}`);
        } catch (error) {
            console.error('Error loading questions:', error);
            const lang = typeof getUserLanguage === 'function' ? getUserLanguage() : 'it';
            const errorMsg = lang === 'en'
                ? 'Error loading questions. Please reload the page.'
                : 'Errore nel caricamento delle domande. Ricarica la pagina.';
            alert(errorMsg);
        }
    }

    // Initialize game
    function startGame() {
        const count = parseInt(questionCountSelect.value);
        gameState.totalQuestions = count;
        gameState.currentQuestionIndex = 0;

        // Reset answer counts
        gameState.answers = {
            tutti: 0,
            qualcuno: 0,
            nessuno: 0
        };

        // Shuffle and select questions
        const shuffled = [...gameState.questions].sort(() => 0.5 - Math.random());
        // Loop questions if more requested than available
        if (count > shuffled.length) {
            gameState.gameQuestions = shuffled;
            while (gameState.gameQuestions.length < count) {
                gameState.gameQuestions = gameState.gameQuestions.concat(shuffled);
            }
            gameState.gameQuestions = gameState.gameQuestions.slice(0, count);
        } else {
            gameState.gameQuestions = shuffled.slice(0, count);
        }

        // Update UI
        totalQuestionsSpan.textContent = gameState.totalQuestions;
        showQuestion();
        showScreen(gameScreen);
    }

    function showQuestion() {
        if (gameState.currentQuestionIndex >= gameState.gameQuestions.length) {
            endGame();
            return;
        }

        const question = gameState.gameQuestions[gameState.currentQuestionIndex];
        questionDisplay.textContent = question;
        currentQuestionSpan.textContent = gameState.currentQuestionIndex + 1;

        // Reset animation
        const card = document.querySelector('.question-card');
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = 'fadeIn 0.5s ease';
    }

    function handleAnswer(answerType) {
        // Increment counter
        if (gameState.answers.hasOwnProperty(answerType)) {
            gameState.answers[answerType]++;
        }

        // Move to next question
        gameState.currentQuestionIndex++;
        showQuestion();
    }

    function endGame() {
        showScreen(endScreen);

        // Determine winner stats
        const answers = gameState.answers;
        let maxCount = -1;
        let winner = 'qualcuno'; // default

        // Find max
        for (const [type, count] of Object.entries(answers)) {
            if (count > maxCount) {
                maxCount = count;
                winner = type;
            } else if (count === maxCount) {
                // Tie-breaker logic (prefer crazy > balanced > boring)
                if (type === 'tutti') winner = 'tutti';
                else if (type === 'qualcuno' && winner === 'nessuno') winner = 'qualcuno';
            }
        }

        // Get translation phrases
        const lang = getUserLanguage ? getUserLanguage() : 'it';
        const phrases = gameTranslations[lang].results[winner];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

        // Display result
        const resultMessage = document.getElementById('result-message');
        const resultStats = document.getElementById('result-stats');

        resultMessage.textContent = randomPhrase;

        // Show detailed stats
        const labels = {
            tutti: lang === 'it' ? 'Tutti' : 'Everyone',
            qualcuno: lang === 'it' ? 'Qualcuno' : 'Someone',
            nessuno: lang === 'it' ? 'Nessuno' : 'No One'
        };

        resultStats.innerHTML = `
            ${labels.tutti}: <strong>${answers.tutti}</strong> | 
            ${labels.qualcuno}: <strong>${answers.qualcuno}</strong> | 
            ${labels.nessuno}: <strong>${answers.nessuno}</strong>
        `;
    }

    function showScreen(screen) {
        setupScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        endScreen.classList.remove('active');

        screen.classList.add('active');
    }

    // Event Listeners
    startGameBtn.addEventListener('click', startGame);

    // Add listeners for new buttons
    document.getElementById('btn-everyone').addEventListener('click', () => handleAnswer('tutti'));
    document.getElementById('btn-someone').addEventListener('click', () => handleAnswer('qualcuno'));
    document.getElementById('btn-no-one').addEventListener('click', () => handleAnswer('nessuno'));

    playAgainBtn.addEventListener('click', () => {
        showScreen(setupScreen);
    });

    // Helper for language handling (reusing existing system from other games)
    window.toggleLanguage = function () {
        if (typeof window.toggleLanguageGlobal === 'function') {
            window.toggleLanguageGlobal();
        } else {
            // Fallback if global function not found (should be in lang.js but just in case)
            const currentLang = localStorage.getItem('lang') || 'it';
            const newLang = currentLang === 'it' ? 'en' : 'it';
            localStorage.setItem('lang', newLang);
            location.reload();
        }
    };

    // Initial Load
    loadQuestions();
});
