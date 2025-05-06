// Translations for the TicTacTopics game
window.translations = {
    'it': {
        'gameTitle': 'TicTacTopics',
        'pageTitleDesc': 'TicTacTopics - Tris con Argomenti Tematici | DrewGames',
        'metaDescription': 'Gioca a TicTacTopics: una versione divertente del tris dove inserisci argomenti che collegano categorie nelle righe e nelle colonne! Un party game perfetto da giocare con gli amici offline, con film, serie TV e altre categorie a venire!',
        'home': 'Home',
        'passwordTitle': 'Gioco in Fase di Test',
        'passwordText': 'Questo gioco è attualmente in fase di test. Inserisci la password per continuare.',
        'submitPassword': 'Invia',
        'passwordError': 'Password errata. Riprova.',
        'instructionsTitle': 'Come Giocare',
        'instructionsText': 'Gioca a una versione divertente del tris classico dove segni la griglia scegliendo argomenti che collegano una categoria di riga e una di colonna.',
        'rulesText': 'I giocatori a turno posizionano 🔴 o 🔵 selezionando un titolo che corrisponde alla cella. Ottieni tre in fila per vincere!',
        'startGame': 'Inizia Gioco',
        'goToTopics': 'Continua',
        'topicSelectionTitle': 'Seleziona un Argomento',
        'moviesTVTitle': 'Film e Serie TV',
        'moviesTVDesc': 'Gioca con titoli di film e serie TV',
        'videoGamesTitle': 'Videogiochi',
        'booksTitle': 'Libri',
        'comingSoonText': 'Prossimamente',
        'playerTurnText': 'Turno Attuale:',
        'newGameText': 'Nuova Partita',
        'endGameText': 'Fine Partita',
        'selectEmojiText': 'Seleziona un titolo corrispondente:',
        'selectMatchingTitle': 'Seleziona un titolo corrispondente',
        'validAnswersTitle': 'Risposte Valide per questa Cella:',
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
        'theme': 'Tema',
        'wrongAnswer': 'Risposta Sbagliata!',
        'filterPlaceholder': 'Filtra titoli...',
        'confirmEndGame': 'Sei sicuro di voler terminare la partita corrente?'
    },
    'en': {
        'gameTitle': 'TicTacTopics',
        'pageTitleDesc': 'TicTacTopics - Tic-Tac-Toe with Thematic Topics | DrewGames',
        'metaDescription': 'Play TicTacTopics: a fun twist on classic tic-tac-toe where you place topics that connect row and column categories! A perfect party game to play with friends offline, with movies, TV shows and more categories coming soon!',
        'home': 'Home',
        'passwordTitle': 'Game Under Testing',
        'passwordText': 'This game is currently under testing. Please enter the password to continue.',
        'submitPassword': 'Submit',
        'passwordError': 'Incorrect password. Please try again.',
        'instructionsTitle': 'How to Play',
        'instructionsText': 'Play a fun twist on classic tic-tac-toe where you mark the grid by choosing topics that connect a row category and a column category.',
        'rulesText': 'Players take turns placing either 🔴 or 🔵 by submitting a matching title for the cell. Get three in a row to win!',
        'startGame': 'Start Game',
        'goToTopics': 'Continue',
        'topicSelectionTitle': 'Select a Topic',
        'moviesTVTitle': 'Movies & TV Shows',
        'moviesTVDesc': 'Play with movie and TV show titles',
        'videoGamesTitle': 'Video Games',
        'booksTitle': 'Books',
        'comingSoonText': 'Coming Soon',
        'playerTurnText': 'Current Turn:',
        'newGameText': 'New Game',
        'endGameText': 'End Game',
        'selectEmojiText': 'Select a matching title:',
        'selectMatchingTitle': 'Select a matching title',
        'validAnswersTitle': 'Valid Answers for this Cell:',
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
        'theme': 'Theme',
        'wrongAnswer': 'Wrong Answer!',
        'filterPlaceholder': 'Filter titles...',
        'confirmEndGame': 'Are you sure you want to end the current game?'
    }
};

// Get the current language - Uses the main site's language system
window.getCurrentLanguage = function() {
    // Use the main site's getUserLanguage function if available
    if (typeof getUserLanguage === 'function') {
        return getUserLanguage();
    }
    
    // Fallback implementation if main site's function is not available
    
    // Try from URL
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
};

// Get translation for a key
window.getTranslation = function(key) {
    const currentLang = window.getCurrentLanguage();
    return window.translations[currentLang] && window.translations[currentLang][key] ? 
        window.translations[currentLang][key] : 
        window.translations['en'][key] || key;
};

// Apply translations to the TicTacTopics game
function applyGameTranslations() {
    const lang = window.getCurrentLanguage();
    const translationSet = window.translations[lang] || window.translations['en'];
    
    // Update page title and meta description based on language
    document.title = translationSet.pageTitleDesc;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', translationSet.metaDescription);
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
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
    document.getElementById('go-to-topics').textContent = translationSet.goToTopics;
    
    // Topic selection screen translations
    document.getElementById('topicSelectionTitle').textContent = translationSet.topicSelectionTitle;
    document.getElementById('moviesTVTitle').textContent = translationSet.moviesTVTitle;
    document.getElementById('moviesTVDesc').textContent = translationSet.moviesTVDesc;
    document.getElementById('videoGamesTitle').textContent = translationSet.videoGamesTitle;
    document.getElementById('booksTitle').textContent = translationSet.booksTitle;
    document.getElementById('comingSoonText').textContent = translationSet.comingSoonText;
    document.getElementById('comingSoonText2').textContent = translationSet.comingSoonText;
    
    // Game screen translations
    document.getElementById('playerTurnText').textContent = translationSet.playerTurnText;
    document.getElementById('newGameText').textContent = translationSet.newGameText;
    document.getElementById('endGameText').textContent = translationSet.endGameText;
    document.getElementById('selectEmojiText').textContent = translationSet.selectEmojiText;
    document.getElementById('winnerTitle').textContent = translationSet.winnerTitle;
    document.getElementById('winnerText').textContent = translationSet.winnerText;
    document.getElementById('playAgainText').textContent = translationSet.playAgainText;
    
    // Update placeholder for password input
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.placeholder = lang === 'it' ? 'Inserisci password' : 'Enter password';
    }
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations);

// Add a listener to reapply translations if language changes
if (typeof window.addEventListener === 'function') {
    // Check periodically for language changes
    setInterval(function() {
        const newLang = window.getCurrentLanguage();
        const htmlLang = document.documentElement.lang;
        
        // If the page language doesn't match the current language, reapply translations
        if (newLang !== htmlLang) {
            applyGameTranslations();
        }
    }, 1000); // Check every second
} 