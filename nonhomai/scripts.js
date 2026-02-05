
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

        // Shuffle and select questions
        const shuffled = [...gameState.questions].sort(() => 0.5 - Math.random());
        // Loop questions if more requested than available (shouldn't happen often but safe to have)
        if (count > shuffled.length) {
            gameState.gameQuestions = shuffled;
            // Add more if needed by duplicating (simple fix)
            while (gameState.gameQuestions.length < count) {
                gameState.gameQuestions = gameState.gameQuestions.concat(shuffled);
            }
            gameState.gameQuestions = gameState.gameQuestions.slice(0, count);
        } else {
            gameState.gameQuestions = shuffled.slice(0, count);
        }

        gameState.currentQuestionIndex = 0;

        // Update UI
        totalQuestionsSpan.textContent = gameState.totalQuestions;
        showQuestion();

        // precise UI update for next button
        updateNextButtonText();

        showScreen(gameScreen);
    }

    function showQuestion() {
        if (gameState.currentQuestionIndex >= gameState.gameQuestions.length) {
            endGame();
            return;
        }

        const question = gameState.gameQuestions[gameState.currentQuestionIndex];

        // Add "Never have I ever..." prefix if in English or ensure context?
        // Actually the file seems to have full sentences "Non ho mai...".
        // Let's assume they are ready to display.
        questionDisplay.textContent = question;

        currentQuestionSpan.textContent = gameState.currentQuestionIndex + 1;
        updateNextButtonText();
    }

    function nextQuestion() {
        gameState.currentQuestionIndex++;
        if (gameState.currentQuestionIndex < gameState.gameQuestions.length) {
            showQuestion();
            // Add animation class re-trigger
            const card = document.querySelector('.question-card');
            card.style.animation = 'none';
            card.offsetHeight; /* trigger reflow */
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            endGame();
        }
    }

    function updateNextButtonText() {
        const lang = getUserLanguage ? getUserLanguage() : 'it'; // safe check
        // Check if it's the last question
        if (gameState.currentQuestionIndex === gameState.gameQuestions.length - 1) {
            const finishText = lang === 'it' ? 'Finisci' : 'Finish';
            document.getElementById('nextText').textContent = finishText;
        } else {
            const nextText = lang === 'it' ? 'Prossima' : 'Next';
            document.getElementById('nextText').textContent = nextText;
        }
    }

    function endGame() {
        showScreen(endScreen);
    }

    function showScreen(screen) {
        setupScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        endScreen.classList.remove('active');

        screen.classList.add('active');
    }

    // Event Listeners
    startGameBtn.addEventListener('click', startGame);
    nextQuestionBtn.addEventListener('click', nextQuestion);
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
