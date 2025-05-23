// Translations for the ColorGrid game
const gameTranslations = {
    'it': {
        'gameTitle': 'Gioco dei Colori',
        'pageTitleDesc': 'Gioco dei Colori - Indovina la cella colorata | DrewGames',
        'metaDescription': 'Gioca al Gioco dei Colori: un divertente gioco per 3+ persone dove devi indovinare la posizione della cella colorata segreta. Perfetto per le serate con amici!',
        'home': 'Home',
        'gameDescription': 'Un gioco per 3+ giocatori. Un giocatore vedrà una cella segreta, poi gli altri dovranno indovinarla!',
        'startGame': 'Nuova Partita',
        'rememberCell': 'Ricorda questa cella!',
        'gotIt': 'Ho Capito!',
        'addPlayer': 'Aggiungi Giocatore',
        'revealAnswer': 'Rivela Risposta',
        'resultsTitle': 'Risultati',
        'playAgain': 'Gioca Ancora',
        'player': 'Giocatore',
        'correct': 'Corretto!',
        'wrong': 'Sbagliato!',
        'theSecret': 'La cella segreta era:',
        'notSelected': 'Non selezionato',
        'playerResults': 'Risultati Giocatore',
        'winnerIs': 'Il vincitore è',
        'newGame': 'Nuova Partita',
        'rememberTitle': 'Ricorda questa cella!',
        'correctGuess': 'Risposta corretta!',
        'incorrectGuess': 'Sbagliato. La risposta corretta era:',
        'invalidGuess': 'Risposta non valida',
        'selectMode': 'Seleziona modalità:'
    },
    'en': {
        'gameTitle': 'Color Grid',
        'pageTitleDesc': 'Color Grid - Guess the colored cell | DrewGames',
        'metaDescription': 'Play Color Grid: a fun game for 3+ people where you have to guess the position of the secret colored cell. Perfect for evenings with friends!',
        'home': 'Home',
        'gameDescription': 'A game for 3+ players. One player will see a secret cell, then the others have to guess it!',
        'startGame': 'New Game',
        'rememberCell': 'Remember this cell!',
        'gotIt': 'Got it!',
        'addPlayer': 'Add Player',
        'revealAnswer': 'Reveal Answer',
        'resultsTitle': 'Results',
        'playAgain': 'Play Again',
        'player': 'Player',
        'correct': 'Correct!',
        'wrong': 'Wrong!',
        'theSecret': 'The secret cell was:',
        'notSelected': 'Not selected',
        'playerResults': 'Player Results',
        'winnerIs': 'The winner is',
        'newGame': 'New Game',
        'rememberTitle': 'Remember this cell!',
        'correctGuess': 'Correct guess!',
        'incorrectGuess': 'Incorrect. The correct answer was:',
        'invalidGuess': 'Invalid guess',
        'selectMode': 'Select mode:'
    }
};

// Apply translations to the ColorGrid game
function applyGameTranslations() {
    const lang = getLanguage();
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
    
    // Update all text elements
    document.getElementById('gameTitle').textContent = translations.gameTitle;
    document.getElementById('gameDescription').textContent = translations.gameDescription;
    document.getElementById('start-game').textContent = translations.startGame;
    document.getElementById('rememberCell').textContent = translations.rememberCell;
    document.getElementById('got-it').textContent = translations.gotIt;
    document.getElementById('add-player').textContent = translations.addPlayer;
    document.getElementById('reveal-answer').textContent = translations.revealAnswer;
    document.getElementById('resultsTitle').textContent = translations.resultsTitle;
    document.getElementById('play-again').textContent = translations.playAgain;
    document.getElementById('selectModeTitle').textContent = translations.selectMode;
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 