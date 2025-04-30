// Translations for the TikTakEmoji game
const gameTranslations = {
    'it': {
        'gameTitle': 'TikTakEmoji',
        'pageTitleDesc': 'TikTakEmoji - Tris con Emoji | DrewGames',
        'metaDescription': 'Gioca a TikTakEmoji: una versione divertente del tris dove inserisci emoji che collegano le righe e le colonne! Un party game perfetto da giocare con gli amici offline.',
        'home': 'Home',
        'passwordTitle': 'Gioco in Fase di Test',
        'passwordText': 'Questo gioco è attualmente in fase di test. Inserisci la password per continuare.',
        'submitPassword': 'Invia',
        'passwordError': 'Password errata. Riprova.',
        'instructionsTitle': 'Come Giocare',
        'instructionsText': 'Gioca a una versione divertente del tris classico dove segni la griglia scegliendo emoji che collegano un\'emoji di riga e un\'emoji di colonna.',
        'rulesText': 'I giocatori a turno posizionano 🔴 o 🔵 selezionando un\'emoji che corrisponde alla cella. Ottieni tre in fila per vincere!',
        'startGame': 'Inizia Gioco',
        'playerTurnText': 'Turno Attuale:',
        'newGameText': 'Nuova Partita',
        'selectEmojiText': 'Seleziona un\'emoji corrispondente:',
        'winnerTitle': 'Partita Finita!',
        'winnerText': 'Vincitore:',
        'playAgainText': 'Gioca Ancora',
        'drawText': 'Pareggio!',
        'invalidMoveText': 'Mossa non valida. Seleziona un\'emoji diversa!',
        'noValidEmojis': 'Nessuna emoji valida per questa combinazione!',
        'closeText': 'Chiudi'
    },
    'en': {
        'gameTitle': 'TikTakEmoji',
        'pageTitleDesc': 'TikTakEmoji - Tic-Tac-Toe with Emojis | DrewGames',
        'metaDescription': 'Play TikTakEmoji: a fun twist on classic tic-tac-toe where you place emojis that connect rows and columns! A perfect party game to play with friends offline.',
        'home': 'Home',
        'passwordTitle': 'Game Under Testing',
        'passwordText': 'This game is currently under testing. Please enter the password to continue.',
        'submitPassword': 'Submit',
        'passwordError': 'Incorrect password. Please try again.',
        'instructionsTitle': 'How to Play',
        'instructionsText': 'Play a fun twist on classic tic-tac-toe where you mark the grid by choosing emojis that connect a row emoji and a column emoji.',
        'rulesText': 'Players take turns placing either 🔴 or 🔵 by submitting a matching emoji for the cell. Get three in a row to win!',
        'startGame': 'Start Game',
        'playerTurnText': 'Current Turn:',
        'newGameText': 'New Game',
        'selectEmojiText': 'Select a matching emoji:',
        'winnerTitle': 'Game Over!',
        'winnerText': 'Winner:',
        'playAgainText': 'Play Again',
        'drawText': 'It\'s a draw!',
        'invalidMoveText': 'Invalid move. Please select a different emoji!',
        'noValidEmojis': 'No valid emojis for this combination!',
        'closeText': 'Close'
    }
};

// Apply translations to the TikTakEmoji game
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
        languageToggle.style.display = 'none';
    }
    
    // Update home button text
    document.getElementById('homeText').textContent = translations.home;
    
    // Update all text elements
    document.getElementById('gameTitle').textContent = translations.gameTitle;
    
    // Password screen translations
    document.getElementById('passwordTitle').textContent = translations.passwordTitle;
    document.getElementById('passwordText').textContent = translations.passwordText;
    document.getElementById('submit-password').textContent = translations.submitPassword;
    document.getElementById('password-error').textContent = translations.passwordError;
    
    // Game instructions translations
    document.getElementById('instructionsTitle').textContent = translations.instructionsTitle;
    document.getElementById('instructionsText').textContent = translations.instructionsText;
    document.getElementById('rulesText').textContent = translations.rulesText;
    document.getElementById('start-game').textContent = translations.startGame;
    document.getElementById('playerTurnText').textContent = translations.playerTurnText;
    document.getElementById('newGameText').textContent = translations.newGameText;
    document.getElementById('selectEmojiText').textContent = translations.selectEmojiText;
    document.getElementById('winnerTitle').textContent = translations.winnerTitle;
    document.getElementById('winnerText').textContent = translations.winnerText;
    document.getElementById('playAgainText').textContent = translations.playAgainText;
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 