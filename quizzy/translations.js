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
            <ul>
                <li>Ogni giocatore sceglie categorie e livelli di difficoltà</li>
                <li>Rispondi correttamente per guadagnare punti</li>
                <li>Più alta è la difficoltà, più punti guadagni</li>
                <li>Il primo a raggiungere 25 punti vince!</li>
            </ul>
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
            <ul>
                <li>Each player chooses categories and difficulty levels</li>
                <li>Answer correctly to earn points</li>
                <li>The higher the difficulty, the more points you earn</li>
                <li>First to reach 25 points wins!</li>
            </ul>
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
    
    // Update the language toggle button
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.textContent = lang.toUpperCase();
    }
    
    // Update home button text
    document.getElementById('homeText').textContent = translations.home;
    
    // Update game title
    document.getElementById('gameTitle').textContent = translations.gameTitle;
    
    // Welcome Screen
    document.getElementById('welcomeTitle').textContent = translations.welcomeTitle;
    document.getElementById('gameRules').innerHTML = translations.gameRules;
    document.getElementById('start-setup').textContent = translations.startSetup;
    
    // Setup Screen
    document.getElementById('setupTitle').textContent = translations.setupTitle;
    document.getElementById('playerCountLabel').textContent = translations.playerCountLabel;
    document.getElementById('continue-to-players').textContent = translations.continueBtn;
    document.getElementById('playerNamesTitle').textContent = translations.playerNamesTitle;
    document.getElementById('gameModeLabel').textContent = translations.gameModeLabel;
    document.getElementById('modeIndividual').textContent = translations.modeIndividual;
    document.getElementById('modeShared').textContent = translations.modeShared;
    document.getElementById('start-game').textContent = translations.startGame;
    
    // Mode descriptions
    updateModeDescription();
    
    // Category Selection Screen
    document.getElementById('categoryTitle').textContent = translations.categoryTitle;
    document.getElementById('selectCategoryText').textContent = translations.selectCategoryText;
    document.getElementById('chooseText').textContent = translations.chooseText;
    document.getElementById('selectedTitle').textContent = translations.selectedTitle;
    document.getElementById('confirm-categories').textContent = translations.confirmCategories;
    
    // Game Round Screen
    document.getElementById('turnText').textContent = translations.turnText;
    document.getElementById('scoreText').textContent = translations.scoreText;
    document.getElementById('difficultyTitle').textContent = translations.difficultyTitle;
    document.getElementById('diffChild').textContent = translations.diffChild;
    document.getElementById('diffEasy').textContent = translations.diffEasy;
    document.getElementById('diffMedium').textContent = translations.diffMedium;
    document.getElementById('diffExpert').textContent = translations.diffExpert;
    document.getElementById('diffGraduate').textContent = translations.diffGraduate;
    document.getElementById('pointText').textContent = translations.pointText;
    document.getElementById('pointsText').textContent = translations.pointsText;
    document.getElementById('pointsText2').textContent = translations.pointsText;
    document.getElementById('pointsText3').textContent = translations.pointsText;
    document.getElementById('pointsText4').textContent = translations.pointsText;
    document.getElementById('categorySelectionTitle').textContent = translations.categorySelectionTitle;
    
    // Question Screen
    document.getElementById('categoryLabel').textContent = translations.categoryLabel;
    document.getElementById('difficultyLabel').textContent = translations.difficultyLabel;
    document.getElementById('timerText').textContent = translations.timerText;
    
    // Result Screen
    document.getElementById('resultTitle').textContent = translations.resultTitle;
    document.getElementById('pointsEarnedText').textContent = translations.pointsEarnedText;
    document.getElementById('continue-game').textContent = translations.continueGame;
    
    // Game Over Screen
    document.getElementById('gameOverTitle').textContent = translations.gameOverTitle;
    document.getElementById('winnerText').textContent = translations.winnerText;
    document.getElementById('finalScoreText').textContent = translations.finalScoreText;
    document.getElementById('allScoresTitle').textContent = translations.allScoresTitle;
    document.getElementById('play-again').textContent = translations.playAgain;
}

// Update the game mode description based on selection
function updateModeDescription() {
    const gameMode = document.getElementById('game-mode');
    const modeDescription = document.getElementById('modeDescription');
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];
    
    if (gameMode && modeDescription) {
        gameMode.addEventListener('change', function() {
            if (this.value === 'individual') {
                modeDescription.textContent = translations.modeIndividualDesc;
            } else {
                modeDescription.textContent = translations.modeSharedDesc;
            }
        });
        
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

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 