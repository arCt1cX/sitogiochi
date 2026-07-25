// Translations for the Fake Drew game
const gameTranslations = {
    'it': {
        'gameTitle': 'Fake Drew',
        'pageTitleDesc': 'Fake Drew - Chi è il Falso Artista? | DrewGames',
        'metaDescription': 'Gioca a Fake Drew: tutti conoscono la parola tranne uno. Ognuno disegna una sola linea sul foglio: scoprite chi è il Falso Artista! Party game da fare con gli amici offline.',
        'home': 'Home',
        'setupTitle': 'Impostazioni del Gioco',
        'playerCountLabel': 'Numero di Giocatori:',
        'roundsLabel': 'Tratti per giocatore:',
        'players': 'Giocatori',
        'player': 'Giocatore',
        'startGameText': 'Inizia Gioco',
        'playerTurnText': 'Turno del Giocatore',
        'passPhoneText': 'Passa il telefono al giocatore',
        'showWordText': 'Scopri la tua Parola',
        'seenItText': 'Ho Visto',
        'cardThemeText': 'Tema:',
        'fakeHintText': 'Non conosci la parola: fingi e improvvisa!',
        'drawThemeLabel': 'Tema',
        'drawRoundLabel': 'Giro',
        'drawTurnText': 'Tocca a',
        'paperHintText': 'Disegna UNA sola linea, senza staccare il dito',
        'paperDoneHintText': 'Tratto fatto! Passa il telefono al prossimo giocatore',
        'drawPromptText': 'Disegna il tuo tratto',
        'undoStrokeText': 'Rifai il tratto',
        'nextTurnText': 'Passa a',
        'finishDrawingText': 'Disegno Finito',
        'discussTitle': 'Chi è il Falso Artista?',
        'discussInstructionsText': 'Il disegno è finito. Ora parlate a voce: discutete e votate a mano alzata chi pensate sia il Falso Artista.',
        'discussTipText': 'Consiglio: Guardate i tratti esitanti... ma occhio, chi conosce la parola potrebbe disegnare male apposta!',
        'discussThemeText': 'Tema:',
        'revealRolesText': 'Rivela il Falso Artista',
        'fakeIsText': 'Il Falso Artista era...',
        'playerText': 'Il giocatore',
        'wordWasText': 'La parola era:',
        'revealWordText': 'Rivela la Parola',
        'fakeGuessText': 'Falso Artista, prova a indovinare la parola! Se la indovini, vinci tu!',
        'playAgainText': 'Gioca di Nuovo',
        'roleInfoText': 'Con questo numero di giocatori ci saranno:',
        'roleArtist': 'Artista',
        'roleArtists': 'Artisti',
        'roleFake': 'Falso Artista',
        'wordFake': '???',
        'phrasesFile': 'parole_fakedrew.txt',
        'playerNamePlaceholder': 'Giocatore {n}'
    },
    'en': {
        'gameTitle': 'Fake Drew',
        'pageTitleDesc': 'Fake Drew - Who is the Fake Artist? | DrewGames',
        'metaDescription': 'Play Fake Drew: everybody knows the word except one player. Each player draws a single line on the sheet: find out who the Fake Artist is! A party game to play with friends offline.',
        'home': 'Home',
        'setupTitle': 'Game Settings',
        'playerCountLabel': 'Number of Players:',
        'roundsLabel': 'Strokes per player:',
        'players': 'Players',
        'player': 'Player',
        'startGameText': 'Start Game',
        'playerTurnText': 'Player Turn',
        'passPhoneText': 'Pass the phone to player',
        'showWordText': 'Reveal your Word',
        'seenItText': "I've Seen It",
        'cardThemeText': 'Theme:',
        'fakeHintText': "You don't know the word: fake it and improvise!",
        'drawThemeLabel': 'Theme',
        'drawRoundLabel': 'Round',
        'drawTurnText': "It's up to",
        'paperHintText': 'Draw ONE single line, without lifting your finger',
        'paperDoneHintText': 'Stroke done! Pass the phone to the next player',
        'drawPromptText': 'Draw your stroke',
        'undoStrokeText': 'Redo the stroke',
        'nextTurnText': 'Pass to',
        'finishDrawingText': 'Drawing Finished',
        'discussTitle': 'Who is the Fake Artist?',
        'discussInstructionsText': 'The drawing is done. Now talk it out: discuss and vote by a show of hands for who you think the Fake Artist is.',
        'discussTipText': 'Tip: Look for the hesitant strokes... but careful, whoever knows the word might draw badly on purpose!',
        'discussThemeText': 'Theme:',
        'revealRolesText': 'Reveal the Fake Artist',
        'fakeIsText': 'The Fake Artist was...',
        'playerText': 'Player',
        'wordWasText': 'The word was:',
        'revealWordText': 'Reveal the Word',
        'fakeGuessText': 'Fake Artist, try to guess the word! If you guess it, you win!',
        'playAgainText': 'Play Again',
        'roleInfoText': 'With this number of players there will be:',
        'roleArtist': 'Artist',
        'roleArtists': 'Artists',
        'roleFake': 'Fake Artist',
        'wordFake': '???',
        'phrasesFile': 'words_fakedrew_en.txt',
        'playerNamePlaceholder': 'Player {n}'
    }
};

// Apply translations to the Fake Drew game
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

    // Hide language toggle on game pages (same as the other games)
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.style.display = 'none';
    }

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el && value != null) el.textContent = value;
    };

    setText('homeText', translations.home);
    setText('gameTitle', translations.gameTitle);
    setText('setupTitle', translations.setupTitle);
    setText('playerCountLabel', translations.playerCountLabel);
    setText('roundsLabel', translations.roundsLabel);
    setText('startGameText', translations.startGameText);
    setText('playerTurnText', translations.playerTurnText);
    setText('passPhoneText', translations.passPhoneText);
    setText('showWordText', translations.showWordText);
    setText('seenItText', translations.seenItText);
    setText('cardThemeText', translations.cardThemeText);
    setText('fake-hint', translations.fakeHintText);

    setText('drawThemeLabel', translations.drawThemeLabel);
    setText('drawRoundLabel', translations.drawRoundLabel);
    setText('drawTurnText', translations.drawTurnText);
    setText('paper-hint', translations.paperHintText);
    setText('undoStrokeText', translations.undoStrokeText);
    setText('nextTurnText', translations.drawPromptText);

    setText('discussTitle', translations.discussTitle);
    setText('discussInstructionsText', translations.discussInstructionsText);
    const tipEl = document.getElementById('discussTipText');
    if (tipEl) {
        const tipLabel = lang === 'it' ? 'Consiglio:' : 'Tip:';
        tipEl.innerHTML = '<strong>' + tipLabel + '</strong> ' +
            translations.discussTipText.replace(/^(Consiglio:|Tip:)\s*/, '');
    }
    setText('discussThemeText', translations.discussThemeText);
    setText('revealRolesText', translations.revealRolesText);

    setText('fakeIsText', translations.fakeIsText);
    setText('playerText', translations.playerText);
    setText('wordWasText', translations.wordWasText);
    setText('revealWordText', translations.revealWordText);
    setText('fakeGuessText', translations.fakeGuessText);
    setText('playAgainText', translations.playAgainText);

    // Player count dropdown: plain numbers + translated label
    const playerSelect = document.getElementById('player-count');
    if (playerSelect) {
        playerSelect.querySelectorAll('option').forEach(option => {
            option.textContent = `${parseInt(option.value)} ${translations.players}`;
        });
    }
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations);
