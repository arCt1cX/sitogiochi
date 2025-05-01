// Translations for the CineTris game
const translations = {
    'it': {
        'gameTitle': 'CineTris',
        'pageTitleDesc': 'CineTris - Tris con Film e Serie TV | DrewGames',
        'metaDescription': 'Gioca a CineTris: una versione divertente del tris dove inserisci film e serie TV che collegano categorie nelle righe e nelle colonne! Un party game perfetto da giocare con gli amici offline.',
        'home': 'Home',
        'passwordTitle': 'Gioco in Fase di Test',
        'passwordText': 'Questo gioco è attualmente in fase di test. Inserisci la password per continuare.',
        'submitPassword': 'Invia',
        'passwordError': 'Password errata. Riprova.',
        'instructionsTitle': 'Come Giocare',
        'instructionsText': 'Gioca a una versione divertente del tris classico dove segni la griglia scegliendo film o serie TV che collegano una categoria di riga e una di colonna.',
        'rulesText': 'I giocatori a turno posizionano 🔴 o 🔵 selezionando un titolo che corrisponde alla cella. Ottieni tre in fila per vincere!',
        'startGame': 'Inizia Gioco',
        'playerTurnText': 'Turno Attuale:',
        'newGameText': 'Nuova Partita',
        'selectEmojiText': 'Seleziona un titolo corrispondente:',
        'selectMatchingTitle': 'Seleziona un titolo corrispondente',
        'winnerTitle': 'Partita Finita!',
        'winnerText': 'Vincitore:',
        'playAgainText': 'Gioca Ancora',
        'draw': 'Pareggio!',
        'noWinner': 'Nessun vincitore',
        'gameOver': 'Partita Finita!',
        'winner': 'Vincitore:',
        'invalidMoveText': 'Mossa non valida. Seleziona un titolo diverso!',
        'noValidTitles': 'Nessun titolo valido per questa combinazione!',
        'closeText': 'Chiudi',
        'genre': 'Genere',
        'language': 'Lingua',
        'decade': 'Decennio',
        'director': 'Regista',
        'theme': 'Tema'
    },
    'en': {
        'gameTitle': 'CineTris',
        'pageTitleDesc': 'CineTris - Tic-Tac-Toe with Movies and TV Shows | DrewGames',
        'metaDescription': 'Play CineTris: a fun twist on classic tic-tac-toe where you place movies and TV shows that connect row and column categories! A perfect party game to play with friends offline.',
        'home': 'Home',
        'passwordTitle': 'Game Under Testing',
        'passwordText': 'This game is currently under testing. Please enter the password to continue.',
        'submitPassword': 'Submit',
        'passwordError': 'Incorrect password. Please try again.',
        'instructionsTitle': 'How to Play',
        'instructionsText': 'Play a fun twist on classic tic-tac-toe where you mark the grid by choosing movies or TV shows that connect a row category and a column category.',
        'rulesText': 'Players take turns placing either 🔴 or 🔵 by submitting a matching title for the cell. Get three in a row to win!',
        'startGame': 'Start Game',
        'playerTurnText': 'Current Turn:',
        'newGameText': 'New Game',
        'selectEmojiText': 'Select a matching title:',
        'selectMatchingTitle': 'Select a matching title',
        'winnerTitle': 'Game Over!',
        'winnerText': 'Winner:',
        'playAgainText': 'Play Again',
        'draw': 'It\'s a draw!',
        'noWinner': 'No Winner',
        'gameOver': 'Game Over!',
        'winner': 'Winner:',
        'invalidMoveText': 'Invalid move. Please select a different title!',
        'noValidTitles': 'No valid titles for this combination!',
        'closeText': 'Close',
        'genre': 'Genre',
        'language': 'Language',
        'decade': 'Decade',
        'director': 'Director',
        'theme': 'Theme'
    }
};

// Get the current language
function getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && (langParam === 'en' || langParam === 'it')) {
        return langParam;
    }
    
    // Check browser language
    const preferredLang = navigator.language || navigator.userLanguage;
    if (preferredLang && preferredLang.startsWith('it')) {
        return 'it';
    }
    
    // Default to English
    return 'en';
}

// Toggle between languages
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'it' : 'en';
    
    // Add or update the lang parameter in the URL
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
}

// Apply translations to the CineTris game
function applyGameTranslations() {
    const lang = getCurrentLanguage();
    const translationSet = translations[lang] || translations['en'];
    
    // Update language toggle button text
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.textContent = lang.toUpperCase();
    }
    
    // Update home button text
    document.getElementById('homeText').textContent = translationSet.home;
    
    // Update all text elements
    document.getElementById('gameTitle').textContent = translationSet.gameTitle;
    
    // Password screen translations
    document.getElementById('passwordTitle').textContent = translationSet.passwordTitle;
    document.getElementById('passwordText').textContent = translationSet.passwordText;
    document.getElementById('submit-password').textContent = translationSet.submitPassword;
    document.getElementById('password-error').textContent = translationSet.passwordError;
    
    // Game instructions translations
    document.getElementById('instructionsTitle').textContent = translationSet.instructionsTitle;
    document.getElementById('instructionsText').textContent = translationSet.instructionsText;
    document.getElementById('rulesText').textContent = translationSet.rulesText;
    document.getElementById('start-game').textContent = translationSet.startGame;
    document.getElementById('playerTurnText').textContent = translationSet.playerTurnText;
    document.getElementById('newGameText').textContent = translationSet.newGameText;
    document.getElementById('selectEmojiText').textContent = translationSet.selectEmojiText;
    document.getElementById('winnerTitle').textContent = translationSet.winnerTitle;
    document.getElementById('winnerText').textContent = translationSet.winnerText;
    document.getElementById('playAgainText').textContent = translationSet.playAgainText;
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 