// Translations for the Quizzy game
const gameTranslations = {
    'it': {
        'gameTitle': 'Quizzy',
        'pageTitleDesc': 'Quizzy - Gioco Quiz a squadre | DrewGames',
        'metaDescription': 'Gioca a Quizzy: un divertente party game a quiz da fare con gli amici. Scegli categorie, difficoltà e sfida i tuoi amici in questo gioco di cultura generale!',
        'home': 'Home',
        
        // Welcome Screen
        'welcomeTitle': 'Benvenuto a Quizzy!',
        'gameRules': `
            <p>Quizzy è un gioco a quiz per più giocatori:</p>
            <div class="rules-list">
                <p class="rule-item">Ogni giocatore seleziona le categorie preferite all'inizio del gioco</p>
                <p class="rule-item">Ad ogni turno, il gioco sceglie casualmente la categoria o la difficoltà</p>
                <p class="rule-item">Rispondi correttamente per guadagnare punti, più alta è la difficoltà, più punti guadagni</p>
                <p class="rule-item">Il primo a raggiungere 25 punti vince!</p>
            </div>
        `,
        'startSetup': 'Inizia a Giocare',
        
        // Setup Screen
        'setupTitle': 'Impostazioni del Gioco',
        'playerCountLabel': 'Numero di Giocatori:',
        'continueBtn': 'Continua',
        'playerNamesTitle': 'Nomi dei Giocatori',
        'playerNameLabel': 'Giocatore',
        'gameModeLabel': 'Modalità di Gioco:',
        'modeIndividual': 'Categorie Individuali',
        'modeShared': 'Categorie Condivise',
        'modeIndividualDesc': 'Ogni giocatore sceglie le proprie categorie',
        'modeSharedDesc': 'Ogni giocatore sceglie 1-2 categorie, poi tutti giocano con le categorie combinate',
        'startGame': 'Inizia Gioco',
        
        // Category Selection Screen
        'categoryTitle': 'Selezione Categorie',
        'selectCategoryText': 'Giocatore',
        'chooseText': 'scegli le tue categorie:',
        'selectedTitle': 'Categorie Selezionate:',
        'confirmCategories': 'Conferma Categorie',
        'selectAtLeastOne': 'Seleziona almeno una categoria',
        'maxCategories': 'Puoi selezionare massimo',
        'categories': 'categorie',
        
        // Game Round Screen
        'turnText': 'Turno di',
        'scoreText': 'Punteggio:',
        'difficultyTitle': 'Scegli Difficoltà:',
        'diffChild': 'Bambino',
        'diffEasy': 'Facile',
        'diffMedium': 'Medio',
        'diffExpert': 'Esperto',
        'diffGraduate': 'Laureato',
        'pointText': 'punto',
        'pointsText': 'punti',
        'categorySelectionTitle': 'Scegli Categoria:',
        
        // Question Screen
        'categoryLabel': 'Categoria:',
        'difficultyLabel': 'Difficoltà:',
        'timerText': 'Tempo:',
        
        // Result Screen
        'resultTitle': 'Risposta',
        'correctAnswer': 'Risposta Corretta!',
        'wrongAnswer': 'Risposta Sbagliata!',
        'timeUp': 'Tempo Scaduto!',
        'correctWas': 'La risposta corretta era:',
        'pointsEarnedText': 'Punti Guadagnati:',
        'continueGame': 'Continua',
        
        // Game Over Screen
        'gameOverTitle': 'Gioco Terminato!',
        'winnerText': 'Il vincitore è',
        'finalScoreText': 'Punteggio finale:',
        'allScoresTitle': 'Punteggi Finali',
        'playAgain': 'Gioca Ancora',
        
        // Difficulty levels for answer display
        'bambino': 'Bambino',
        'facile': 'Facile',
        'medio': 'Medio',
        'esperto': 'Esperto',
        'laureato': 'Laureato',
        
        // Categories
        'categories': {
            'Storia': 'Storia',
            'Geografia': 'Geografia',
            'Cinema': 'Cinema',
            'Musica': 'Musica',
            'Arte': 'Arte',
            'Scienza': 'Scienza',
            'Sport': 'Sport',
            'Letteratura': 'Letteratura',
            'Tecnologia': 'Tecnologia',
            'Cibo': 'Cibo'
        },
        
        // File names
        'questionsFile': 'categorie.json'
    },
    'en': {
        'gameTitle': 'Quizzy',
        'pageTitleDesc': 'Quizzy - Team Quiz Game | DrewGames',
        'metaDescription': 'Play Quizzy: a fun quiz party game to play with friends. Choose categories, difficulty levels and challenge your friends in this general knowledge game!',
        'home': 'Home',
        
        // Welcome Screen
        'welcomeTitle': 'Welcome to Quizzy!',
        'gameRules': `
            <p>Quizzy is a quiz game for multiple players:</p>
            <div class="rules-list">
                <p class="rule-item">Each player selects their preferred categories at the start of the game</p>
                <p class="rule-item">On each turn, the game randomly assigns either the category or difficulty</p>
                <p class="rule-item">Answer correctly to earn points, higher difficulties award more points</p>
                <p class="rule-item">First to reach 25 points wins!</p>
            </div>
        `,
        'startSetup': 'Start Playing',
        
        // Setup Screen
        'setupTitle': 'Game Settings',
        'playerCountLabel': 'Number of Players:',
        'continueBtn': 'Continue',
        'playerNamesTitle': 'Player Names',
        'playerNameLabel': 'Player',
        'gameModeLabel': 'Game Mode:',
        'modeIndividual': 'Individual Categories',
        'modeShared': 'Shared Categories',
        'modeIndividualDesc': 'Each player chooses their own categories',
        'modeSharedDesc': 'Each player chooses 1-2 categories, then all play with the combined categories',
        'startGame': 'Start Game',
        
        // Category Selection Screen
        'categoryTitle': 'Category Selection',
        'selectCategoryText': 'Player',
        'chooseText': 'choose your categories:',
        'selectedTitle': 'Selected Categories:',
        'confirmCategories': 'Confirm Categories',
        'selectAtLeastOne': 'Select at least one category',
        'maxCategories': 'You can select maximum',
        'categories': 'categories',
        
        // Game Round Screen
        'turnText': 'Turn of',
        'scoreText': 'Score:',
        'difficultyTitle': 'Choose Difficulty:',
        'diffChild': 'Child',
        'diffEasy': 'Easy',
        'diffMedium': 'Medium',
        'diffExpert': 'Expert',
        'diffGraduate': 'Graduated',
        'pointText': 'point',
        'pointsText': 'points',
        'categorySelectionTitle': 'Choose Category:',
        
        // Question Screen
        'categoryLabel': 'Category:',
        'difficultyLabel': 'Difficulty:',
        'timerText': 'Time:',
        
        // Result Screen
        'resultTitle': 'Answer',
        'correctAnswer': 'Correct Answer!',
        'wrongAnswer': 'Wrong Answer!',
        'timeUp': 'Time\'s Up!',
        'correctWas': 'The correct answer was:',
        'pointsEarnedText': 'Points Earned:',
        'continueGame': 'Continue',
        
        // Game Over Screen
        'gameOverTitle': 'Game Over!',
        'winnerText': 'The winner is',
        'finalScoreText': 'Final score:',
        'allScoresTitle': 'Final Scores',
        'playAgain': 'Play Again',
        
        // Difficulty levels for answer display
        'bambino': 'Child',
        'facile': 'Easy',
        'medio': 'Medium',
        'esperto': 'Expert',
        'laureato': 'Graduated',
        
        // Categories
        'categories': {
            'Storia': 'History',
            'Geografia': 'Geography',
            'Cinema': 'Cinema',
            'Musica': 'Music',
            'Arte': 'Art',
            'Scienza': 'Science',
            'Sport': 'Sports',
            'Letteratura': 'Literature',
            'Tecnologia': 'Technology',
            'Cibo': 'Food'
        },
        
        // File names
        'questionsFile': 'categories.json'
    }
};

// Apply translations to the Quizzy game
function applyGameTranslations() {
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];
    
    // Update page title and meta description
    document.title = translations.pageTitleDesc;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', translations.metaDescription);
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update home button text
    document.getElementById('homeText').textContent = translations.home;
    
    // Welcome Screen
    document.getElementById('welcome-title').textContent = translations.welcomeTitle;
    document.getElementById('game-rules').innerHTML = translations.gameRules;
    document.getElementById('start-setup').textContent = translations.startSetup;
    
    // Setup Screen
    document.getElementById('setup-title').textContent = translations.setupTitle;
    document.getElementById('player-count-label').textContent = translations.playerCountLabel;
    document.getElementById('continue-to-players').textContent = translations.continueBtn;
    document.getElementById('player-names-title').textContent = translations.playerNamesTitle;
    document.getElementById('game-mode-label').textContent = translations.gameModeLabel;
    
    // Set options
    const individualOption = document.querySelector('#game-mode option[value="individual"]');
    const sharedOption = document.querySelector('#game-mode option[value="shared"]');
    if (individualOption) individualOption.textContent = translations.modeIndividual;
    if (sharedOption) sharedOption.textContent = translations.modeShared;
    
    document.getElementById('start-game').textContent = translations.startGame;
    
    // Mode descriptions
    updateModeDescription();
    
    // Category Selection Screen
    document.getElementById('category-title').textContent = translations.categoryTitle;
    document.getElementById('choose-text').textContent = translations.chooseText;
    document.getElementById('selected-title').textContent = translations.selectedTitle;
    document.getElementById('confirm-categories').textContent = translations.confirmCategories;
    
    // Game Round Screen
    document.getElementById('turn-text').textContent = translations.turnText;
    document.getElementById('score-text').textContent = translations.scoreText;
    document.getElementById('difficulty-title').textContent = translations.difficultyTitle;
    document.getElementById('diff-child').textContent = translations.diffChild;
    document.getElementById('diff-easy').textContent = translations.diffEasy;
    document.getElementById('diff-medium').textContent = translations.diffMedium;
    document.getElementById('diff-expert').textContent = translations.diffExpert;
    document.getElementById('diff-graduate').textContent = translations.diffGraduate;
    document.getElementById('point-text').textContent = translations.pointText;
    document.getElementById('points-text-1').textContent = translations.pointsText;
    document.getElementById('points-text-2').textContent = translations.pointsText;
    document.getElementById('points-text-3').textContent = translations.pointsText;
    document.getElementById('points-text-4').textContent = translations.pointsText;
    document.getElementById('category-selection-title').textContent = translations.categorySelectionTitle;
    
    // Question Screen
    document.getElementById('category-label').textContent = translations.categoryLabel;
    document.getElementById('difficulty-label').textContent = translations.difficultyLabel;
    document.getElementById('timer-text').textContent = translations.timerText;
    
    // Result Screen
    document.getElementById('result-title').textContent = translations.resultTitle;
    document.getElementById('correct-was').textContent = translations.correctWas;
    document.getElementById('points-earned-text').textContent = translations.pointsEarnedText;
    document.getElementById('continue-game').textContent = translations.continueGame;
    
    // Game Over Screen
    document.getElementById('game-over-title').textContent = translations.gameOverTitle;
    document.getElementById('winner-text').textContent = translations.winnerText;
    document.getElementById('final-score-text').textContent = translations.finalScoreText;
    document.getElementById('all-scores-title').textContent = translations.allScoresTitle;
    document.getElementById('play-again').textContent = translations.playAgain;
}

// Update the game mode description based on selection
function updateModeDescription() {
    const gameMode = document.getElementById('game-mode');
    const modeDescription = document.getElementById('mode-description');
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];
    
    if (gameMode && modeDescription) {
        // Set initial description
        if (gameMode.value === 'individual') {
            modeDescription.textContent = translations.modeIndividualDesc;
        } else {
            modeDescription.textContent = translations.modeSharedDesc;
        }
    }
}

// Get translated text
function getGameTranslation(key, subKey = null) {
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];
    
    if (subKey && translations[key] && translations[key][subKey]) {
        return translations[key][subKey];
    } else if (!subKey && translations[key]) {
        return translations[key];
    }
    
    // Fallback to English
    const enTranslations = gameTranslations['en'];
    if (subKey && enTranslations[key] && enTranslations[key][subKey]) {
        return enTranslations[key][subKey];
    } else if (!subKey && enTranslations[key]) {
        return enTranslations[key];
    }
    
    // If nothing found, return the key
    return subKey || key;
}

// Get the user's language preference
function getUserLanguage() {
    // First, try to get the language from the main site
    try {
        // If available, use the getLanguage function from the main site
        if (typeof getLanguage === 'function') {
            const mainSiteLang = getLanguage();
            if (mainSiteLang === 'it' || mainSiteLang === 'en') {
                return mainSiteLang;
            }
        }
    } catch (e) {
        console.log('Error retrieving language from main site:', e);
    }
    
    // Fallback to URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && (langParam === 'en' || langParam === 'it')) {
        return langParam;
    }
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('it')) {
        return 'it';
    }
    
    // Default to English
    return 'en';
}

// Apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 