// Translations for the Impostor game
const gameTranslations = {
    'it': {
        'gameTitle': 'Gioco dell\'Impostore',
        'pageTitleDesc': 'Gioco dell\'Impostore - Scopri chi mente nel gruppo | DrewGames',
        'metaDescription': 'Gioca al Gioco dell\'Impostore: un divertente gioco sociale dove devi scoprire chi mente nel gruppo! Un perfetto party game da fare con gli amici offline.',
        'home': 'Home',
        'setupTitle': 'Impostazioni del Gioco',
        'playerCountLabel': 'Numero di Giocatori:',
        'players': 'Giocatori',
        'player': 'Giocatore',
        'impostorCountLabel': 'Numero di Impostori:',
        'impostor': 'Impostore',
        'impostors': 'Impostori',
        'startGame': 'Inizia Gioco',
        'playerTurnText': 'Turno del Giocatore',
        'passPhoneText': 'Passa il telefono al giocatore',
        'showPromptText': 'Mostra il mio Prompt',
        'seenItText': 'Ho Visto',
        'writeAnswersTitle': 'Scrivete le Vostre Risposte',
        'allPlayersSeenText': 'Tutti i giocatori hanno visto il loro prompt.',
        'writeAnswersText': 'Ora scrivete le vostre risposte su carta.',
        'clickButtonText': 'Quando tutti hanno finito, cliccate sul pulsante per rivelare il prompt del gruppo.',
        'revealGroupPromptText': 'Rivela il Prompt del Gruppo',
        'discussionTitle': 'Discussione di Gruppo',
        'groupPromptIsText': 'Il prompt del gruppo è:',
        'discussInstructionsText': 'Discutete tra di voi e cercate di scoprire chi è l\'impostore!',
        'revealImpostorText': 'Rivela l\'Impostore',
        'impostorIsText': 'L\'Impostore è...',
        'playerText': 'Il giocatore',
        'theirPromptWasText': 'Il suo prompt era:',
        'playAgainText': 'Gioca di Nuovo',
        'phrasesFile': 'frasi_gioco_impostore.txt'
    },
    'en': {
        'gameTitle': 'Impostor Game',
        'pageTitleDesc': 'Impostor Game - Find out who is lying in the group | DrewGames',
        'metaDescription': 'Play the Impostor Game: a fun social game where you have to discover who is lying in the group! A perfect party game to play with friends offline.',
        'home': 'Home',
        'setupTitle': 'Game Settings',
        'playerCountLabel': 'Number of Players:',
        'players': 'Players',
        'player': 'Player',
        'impostorCountLabel': 'Number of Impostors:',
        'impostor': 'Impostor',
        'impostors': 'Impostors',
        'startGame': 'Start Game',
        'playerTurnText': 'Player Turn',
        'passPhoneText': 'Pass the phone to player',
        'showPromptText': 'Show my Prompt',
        'seenItText': 'I\'ve Seen It',
        'writeAnswersTitle': 'Write Your Answers',
        'allPlayersSeenText': 'All players have seen their prompt.',
        'writeAnswersText': 'Now write your answers on paper.',
        'clickButtonText': 'When everyone is done, click the button to reveal the group prompt.',
        'revealGroupPromptText': 'Reveal Group Prompt',
        'discussionTitle': 'Group Discussion',
        'groupPromptIsText': 'The group prompt is:',
        'discussInstructionsText': 'Discuss among yourselves and try to figure out who the impostor is!',
        'revealImpostorText': 'Reveal the Impostor',
        'impostorIsText': 'The Impostor is...',
        'playerText': 'Player',
        'theirPromptWasText': 'Their prompt was:',
        'playAgainText': 'Play Again',
        'phrasesFile': 'impostor_phrases_en.txt'
    }
};

// Apply translations to the Impostor game
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
        // Hide language toggle on game pages as requested
        languageToggle.style.display = 'none';
    }
    
    // Update home button text
    document.getElementById('homeText').textContent = translations.home;
    
    // Update all text elements
    document.getElementById('gameTitle').textContent = translations.gameTitle;
    document.getElementById('setupTitle').textContent = translations.setupTitle;
    document.getElementById('playerCountLabel').textContent = translations.playerCountLabel;
    document.getElementById('impostorCountLabel').textContent = translations.impostorCountLabel;
    document.getElementById('start-game').textContent = translations.startGame;
    document.getElementById('playerTurnText').textContent = translations.playerTurnText;
    document.getElementById('passPhoneText').textContent = translations.passPhoneText;
    document.getElementById('showPromptText').textContent = translations.showPromptText;
    document.getElementById('seenItText').textContent = translations.seenItText;
    document.getElementById('writeAnswersTitle').textContent = translations.writeAnswersTitle;
    document.getElementById('allPlayersSeenText').textContent = translations.allPlayersSeenText;
    document.getElementById('writeAnswersText').textContent = translations.writeAnswersText;
    document.getElementById('clickButtonText').textContent = translations.clickButtonText;
    document.getElementById('revealGroupPromptText').textContent = translations.revealGroupPromptText;
    document.getElementById('discussionTitle').textContent = translations.discussionTitle;
    document.getElementById('groupPromptIsText').textContent = translations.groupPromptIsText;
    document.getElementById('discussInstructionsText').textContent = translations.discussInstructionsText;
    document.getElementById('revealImpostorText').textContent = translations.revealImpostorText;
    document.getElementById('impostorIsText').textContent = translations.impostorIsText;
    document.getElementById('playerText').textContent = translations.playerText;
    document.getElementById('theirPromptWasText').textContent = translations.theirPromptWasText;
    document.getElementById('playAgainText').textContent = translations.playAgainText;
    
    // Update dropdown texts
    const playersTextElements = document.querySelectorAll('.players-text');
    playersTextElements.forEach(el => {
        el.textContent = translations.players;
    });
    
    const impostorTextElements = document.querySelectorAll('.impostor-text');
    const impostorSelect = document.getElementById('impostor-count');
    const options = impostorSelect.querySelectorAll('option');
    options.forEach(option => {
        const value = parseInt(option.value);
        const text = value === 1 ? translations.impostor : translations.impostors;
        option.textContent = `${value} ${text}`;
    });
    
    const playerSelect = document.getElementById('player-count');
    const playerOptions = playerSelect.querySelectorAll('option');
    playerOptions.forEach(option => {
        const value = parseInt(option.value);
        option.textContent = `${value} ${translations.players}`;
    });
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 