// Translations for the Mr. Drew game
const gameTranslations = {
    'it': {
        'gameTitle': 'Mr. Drew',
        'pageTitleDesc': 'Mr. Drew - Chi sarà il Mr. White? | DrewGames',
        'metaDescription': 'Gioca a Mr. Drew: il gioco di deduzione sociale dove devi scoprire chi non conosce la parola segreta! Un perfetto party game da fare con gli amici offline.',
        'home': 'Home',
        'setupTitle': 'Impostazioni del Gioco',
        'playerCountLabel': 'Numero di Giocatori:',
        'modeLabel': 'Modalità:',
        'simpleModeOption': 'Senza Undercover',
        'undercoverModeOption': 'Con Undercover',
        'players': 'Giocatori',
        'player': 'Giocatore',
        'startGameText': 'Inizia Gioco',
        'playerTurnText': 'Turno del Giocatore',
        'passPhoneText': 'Passa il telefono al giocatore',
        'showWordText': 'Scopri la tua Parola',
        'seenItText': 'Ho Visto',
        'playingTitle': 'Giocate!',
        'startingPlayerText': 'Inizia il giocatore:',
        'themeText': 'Tema:',
        'playingInstructionsText': 'Tutti i giocatori hanno visto la loro parola. Ora giocate a voce: a turno, ogni giocatore dice UNA parola che descrive il proprio termine.',
        'playingTipText': 'Consiglio: I Civili devono farsi riconoscere senza dare troppi indizi a Mr. Drew!',
        'discussInstructionsText': 'Discutete e votate chi pensate sia Mr. Drew. Quando siete pronti, rivelate i ruoli!',
        'revealRolesText': 'Rivela i Ruoli',
        'mrdrewIsText': 'Mr. Drew era...',
        'playerText': 'Il giocatore',
        'undercoverWasText': "L'Undercover era:",
        'undercoverPlayerText': 'Il giocatore',
        'undercoverWordWasText': 'La sua parola era:',
        'civilWordWasText': 'La parola dei Civili era:',
        'revealWordText': 'Rivela la Parola',
        'mrdrewGuessText': 'Mr. Drew, prova a indovinare la parola! Se la indovini, vinci tu!',
        'playAgainText': 'Gioca di Nuovo',
        'roleInfoText': 'Con questo numero di giocatori ci saranno:',
        'roleCivil': 'Civile',
        'roleCivils': 'Civili',
        'roleUndercover': 'Undercover',
        'roleMrDrew': 'Mr. Drew',
        'wordMrDrew': '???',
        'phrasesFile': 'parole_mrdrew.txt',
        'playerNamePlaceholder': 'Giocatore {n}'
    },
    'en': {
        'gameTitle': 'Mr. Drew',
        'pageTitleDesc': 'Mr. Drew - Who is Mr. White? | DrewGames',
        'metaDescription': 'Play Mr. Drew: a social deduction game where you must find out who does not know the secret word! A perfect party game to play with friends offline.',
        'home': 'Home',
        'setupTitle': 'Game Settings',
        'playerCountLabel': 'Number of Players:',
        'modeLabel': 'Mode:',
        'simpleModeOption': 'Without Undercover',
        'undercoverModeOption': 'With Undercover',
        'players': 'Players',
        'player': 'Player',
        'startGameText': 'Start Game',
        'playerTurnText': 'Player Turn',
        'passPhoneText': 'Pass the phone to player',
        'showWordText': 'Reveal your Word',
        'seenItText': "I've Seen It",
        'playingTitle': 'Play!',
        'startingPlayerText': 'Starting player:',
        'themeText': 'Theme:',
        'playingInstructionsText': 'All players have seen their word. Now play vocally: each player takes turns saying ONE word that describes their term.',
        'playingTipText': 'Tip: Civilians must recognize each other without giving too many clues to Mr. Drew!',
        'discussInstructionsText': 'Discuss and vote on who you think is Mr. Drew. When ready, reveal the roles!',
        'revealRolesText': 'Reveal Roles',
        'mrdrewIsText': 'Mr. Drew was...',
        'playerText': 'Player',
        'undercoverWasText': 'The Undercover was:',
        'undercoverPlayerText': 'Player',
        'undercoverWordWasText': 'Their word was:',
        'civilWordWasText': 'The Civilians\' word was:',
        'revealWordText': 'Reveal the Word',
        'mrdrewGuessText': 'Mr. Drew, try to guess the word! If you guess it, you win!',
        'playAgainText': 'Play Again',
        'roleInfoText': 'With this number of players there will be:',
        'roleCivil': 'Civilian',
        'roleCivils': 'Civilians',
        'roleUndercover': 'Undercover',
        'roleMrDrew': 'Mr. Drew',
        'wordMrDrew': '???',
        'phrasesFile': 'words_mrdrew_en.txt',
        'playerNamePlaceholder': 'Player {n}'
    }
};

// Apply translations to the Mr. Drew game
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

    // Update mode selector
    const modeLabel = document.getElementById('modeLabel');
    if (modeLabel) modeLabel.textContent = translations.modeLabel;
    const simpleModeOption = document.getElementById('simpleModeOption');
    if (simpleModeOption) simpleModeOption.textContent = translations.simpleModeOption;
    const undercoverModeOption = document.getElementById('undercoverModeOption');
    if (undercoverModeOption) undercoverModeOption.textContent = translations.undercoverModeOption;

    document.getElementById('startGameText').textContent = translations.startGameText;
    document.getElementById('playerTurnText').textContent = translations.playerTurnText;
    document.getElementById('passPhoneText').textContent = translations.passPhoneText;
    document.getElementById('showWordText').textContent = translations.showWordText;
    document.getElementById('seenItText').textContent = translations.seenItText;
    document.getElementById('playingTitle').textContent = translations.playingTitle;

    // Update starting player and theme texts
    const startingPlayerText = document.getElementById('startingPlayerText');
    if (startingPlayerText) startingPlayerText.textContent = translations.startingPlayerText;
    const themeText = document.getElementById('themeText');
    if (themeText) themeText.textContent = translations.themeText;

    document.getElementById('playingInstructionsText').textContent = translations.playingInstructionsText;
    document.getElementById('playingTipText').innerHTML = '<strong>' + (lang === 'it' ? 'Consiglio:' : 'Tip:') + '</strong> ' + translations.playingTipText.replace(/^(Consiglio:|Tip:)\s*/, '');
    document.getElementById('discussInstructionsText').textContent = translations.discussInstructionsText;
    document.getElementById('revealRolesText').textContent = translations.revealRolesText;
    document.getElementById('mrdrewIsText').textContent = translations.mrdrewIsText;
    document.getElementById('playerText').textContent = translations.playerText;
    document.getElementById('undercoverWasText').textContent = translations.undercoverWasText;
    document.getElementById('undercoverPlayerText').textContent = translations.undercoverPlayerText;
    document.getElementById('undercoverWordWasText').textContent = translations.undercoverWordWasText;
    document.getElementById('civilWordWasText').textContent = translations.civilWordWasText;

    // Update reveal word button
    const revealWordText = document.getElementById('revealWordText');
    if (revealWordText) revealWordText.textContent = translations.revealWordText;

    document.getElementById('mrdrewGuessText').textContent = translations.mrdrewGuessText;
    document.getElementById('playAgainText').textContent = translations.playAgainText;

    // Update player count dropdown
    const playerSelect = document.getElementById('player-count');
    const playerOptions = playerSelect.querySelectorAll('option');
    playerOptions.forEach(option => {
        const value = parseInt(option.value);
        option.textContent = `${value} ${translations.players}`;
    });
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations);
