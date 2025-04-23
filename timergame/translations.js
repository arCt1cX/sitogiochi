// Translations for the TimerGame
const gameTranslations = {
    'it': {
        'gameTitle': 'Wordrace',
        'pageTitleDesc': 'Wordrace - Sfida di parole a tempo | DrewGames',
        'metaDescription': 'Gioca a Wordrace: una sfida di parole a tempo per 2-4 giocatori. Corri contro il tempo in questa divertente sfida verbale, ideale per serate con amici!',
        'home': 'Home',
        'playerModeTitle': 'Modalità Giocatori',
        'players2Text': '2 Giocatori',
        'players3Text': '3 Giocatori',
        'players4Text': '4 Giocatori',
        'gameModeTitle': 'Modalità Gioco',
        'timerModeText': 'Solo Timer',
        'categoryModeText': 'Con Categorie',
        'initialTimeTitle': 'Tempo Iniziale',
        'seconds30Text': '30 Secondi',
        'minute1Text': '1 Minuto',
        'minutes2Text': '2 Minuti',
        'minutes5Text': '5 Minuti',
        'startGameText': 'Inizia Gioco',
        'howToPlayTitle': 'Come Giocare',
        'challengeDescription': 'Una sfida verbale veloce per giocatori:',
        'mode2pTitle': 'Modalità 2 Giocatori:',
        'mode2p1': 'Ogni giocatore ha il proprio timer.',
        'mode2p2': 'Quando è il tuo turno, il tuo timer diminuisce.',
        'mode2p3': 'Premi il pulsante quando finisci il turno per passare al giocatore successivo.',
        'mode2p4': 'Il gioco termina quando il timer di un giocatore raggiunge zero.',
        'mode3pTitle': 'Modalità 3 Giocatori:',
        'mode3p1': 'Quando un giocatore preme il pulsante:',
        'mode3p2': '- Il suo timer inizia ad aumentare (guadagnando tempo)',
        'mode3p3': '- I timer degli altri due giocatori iniziano a diminuire',
        'mode3p4': '- Qualsiasi giocatore con un timer in diminuzione può premere per il prossimo turno',
        'mode3p5': 'I giocatori vengono eliminati quando il loro timer raggiunge zero',
        'mode3p6': 'L\'ultimo giocatore rimasto vince!',
        'mode4pTitle': 'Modalità 4 Giocatori:',
        'mode4p1': 'Funziona come la modalità 3 giocatori, ma con 4 partecipanti',
        'mode4p2': 'Quando un giocatore preme il pulsante:',
        'mode4p3': '- Il suo timer inizia ad aumentare (guadagnando tempo)',
        'mode4p4': '- I timer degli altri tre giocatori iniziano a diminuire',
        'mode4p5': '- Qualsiasi giocatore con un timer in diminuzione può premere per il prossimo turno',
        'mode4p6': 'I giocatori vengono eliminati quando il loro timer raggiunge zero',
        'mode4p7': 'L\'ultimo giocatore rimasto vince!',
        'tipText': 'Consiglio: Premi il pulsante quando dici una parola per guadagnare tempo o cambiare turno!',
        'yourTurn': 'IL TUO TURNO',
        'pressButton': 'Premi',
        'menuButton': 'Menu',
        'resetButton': 'Ricomincia',
        'mainMenuButton': 'Menu Principale',
        'youWin': 'HAI VINTO!',
        'pressNow': 'PREMI ORA',
        'place1': '1° POSTO',
        'place2': '2° POSTO',
        'place3': '3° POSTO',
        'place4': '4° POSTO',
        'categoryLabel': 'Categoria:',
        'eliminated': 'ELIMINATO',
        'gameOver': 'PARTITA FINITA'
    },
    'en': {
        'gameTitle': 'Wordrace',
        'pageTitleDesc': 'Wordrace - Timed Word Challenge | DrewGames',
        'metaDescription': 'Play Wordrace: a timed word challenge for 2-4 players. Race against time in this fun verbal challenge, perfect for evenings with friends!',
        'home': 'Home',
        'playerModeTitle': 'Player Mode',
        'players2Text': '2 Players',
        'players3Text': '3 Players',
        'players4Text': '4 Players',
        'gameModeTitle': 'Game Mode',
        'timerModeText': 'Timer Only',
        'categoryModeText': 'With Categories',
        'initialTimeTitle': 'Initial Time',
        'seconds30Text': '30 Seconds',
        'minute1Text': '1 Minute',
        'minutes2Text': '2 Minutes',
        'minutes5Text': '5 Minutes',
        'startGameText': 'Start Game',
        'howToPlayTitle': 'How to Play',
        'challengeDescription': 'A fast-paced verbal challenge for players:',
        'mode2pTitle': '2 Player Mode:',
        'mode2p1': 'Each player has their own timer.',
        'mode2p2': 'When it\'s your turn, your timer decreases.',
        'mode2p3': 'Press the button when you finish your turn to pass to the next player.',
        'mode2p4': 'The game ends when a player\'s timer reaches zero.',
        'mode3pTitle': '3 Player Mode:',
        'mode3p1': 'When a player presses the button:',
        'mode3p2': '- Their timer starts increasing (gaining time)',
        'mode3p3': '- The other two players\' timers begin decreasing',
        'mode3p4': '- Any player with a decreasing timer can press for the next turn',
        'mode3p5': 'Players are eliminated when their timer reaches zero',
        'mode3p6': 'The last player remaining wins!',
        'mode4pTitle': '4 Player Mode:',
        'mode4p1': 'Works like the 3 player mode, but with 4 participants',
        'mode4p2': 'When a player presses the button:',
        'mode4p3': '- Their timer starts increasing (gaining time)',
        'mode4p4': '- The other three players\' timers begin decreasing',
        'mode4p5': '- Any player with a decreasing timer can press for the next turn',
        'mode4p6': 'Players are eliminated when their timer reaches zero',
        'mode4p7': 'The last player remaining wins!',
        'tipText': 'Tip: Press the button when you say a word to gain time or change turns!',
        'yourTurn': 'YOUR TURN',
        'pressButton': 'Press',
        'menuButton': 'Menu',
        'resetButton': 'Restart',
        'mainMenuButton': 'Main Menu',
        'youWin': 'YOU WIN!',
        'pressNow': 'PRESS NOW',
        'place1': '1ST PLACE',
        'place2': '2ND PLACE',
        'place3': '3RD PLACE',
        'place4': '4TH PLACE',
        'categoryLabel': 'Category:',
        'eliminated': 'ELIMINATED',
        'gameOver': 'GAME OVER'
    }
};

// Apply translations to the TimerGame
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
    
    // Update all start menu elements
    document.getElementById('gameTitle').textContent = translations.gameTitle;
    document.getElementById('playerModeTitle').textContent = translations.playerModeTitle;
    document.getElementById('players2Text').textContent = translations.players2Text;
    document.getElementById('players3Text').textContent = translations.players3Text;
    document.getElementById('players4Text').textContent = translations.players4Text;
    document.getElementById('gameModeTitle').textContent = translations.gameModeTitle;
    document.getElementById('timerModeText').textContent = translations.timerModeText;
    document.getElementById('categoryModeText').textContent = translations.categoryModeText;
    document.getElementById('initialTimeTitle').textContent = translations.initialTimeTitle;
    document.getElementById('seconds30Text').textContent = translations.seconds30Text;
    document.getElementById('minute1Text').textContent = translations.minute1Text;
    document.getElementById('minutes2Text').textContent = translations.minutes2Text;
    document.getElementById('minutes5Text').textContent = translations.minutes5Text;
    document.getElementById('startGameText').textContent = translations.startGameText;
    
    // Update how to play section
    document.getElementById('howToPlayTitle').textContent = translations.howToPlayTitle;
    document.getElementById('challengeDescription').textContent = translations.challengeDescription;
    document.getElementById('mode2pTitle').textContent = translations.mode2pTitle;
    document.getElementById('mode2p1').textContent = translations.mode2p1;
    document.getElementById('mode2p2').textContent = translations.mode2p2;
    document.getElementById('mode2p3').textContent = translations.mode2p3;
    document.getElementById('mode2p4').textContent = translations.mode2p4;
    document.getElementById('mode3pTitle').textContent = translations.mode3pTitle;
    document.getElementById('mode3p1').textContent = translations.mode3p1;
    document.getElementById('mode3p2').textContent = translations.mode3p2;
    document.getElementById('mode3p3').textContent = translations.mode3p3;
    document.getElementById('mode3p4').textContent = translations.mode3p4;
    document.getElementById('mode3p5').textContent = translations.mode3p5;
    document.getElementById('mode3p6').textContent = translations.mode3p6;
    document.getElementById('mode4pTitle').textContent = translations.mode4pTitle;
    document.getElementById('mode4p1').textContent = translations.mode4p1;
    document.getElementById('mode4p2').textContent = translations.mode4p2;
    document.getElementById('mode4p3').textContent = translations.mode4p3;
    document.getElementById('mode4p4').textContent = translations.mode4p4;
    document.getElementById('mode4p5').textContent = translations.mode4p5;
    document.getElementById('mode4p6').textContent = translations.mode4p6;
    document.getElementById('mode4p7').textContent = translations.mode4p7;
    document.getElementById('tipText').textContent = translations.tipText;
    
    // Update game UI elements
    // Since some of these might be dynamically generated, we'll update them all
    const turnIndicators = document.querySelectorAll('.turn-indicator');
    turnIndicators.forEach(indicator => {
        if (indicator.textContent.includes('TURNO')) {
            indicator.textContent = translations.yourTurn;
        } else if (indicator.textContent.includes('PREMI')) {
            indicator.textContent = translations.pressNow;
        }
    });
    
    const playerButtons = document.querySelectorAll('.player-button');
    playerButtons.forEach(button => {
        button.textContent = translations.pressButton;
    });
    
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.textContent = translations.menuButton;
    });
    
    const resetButtons = document.querySelectorAll('.reset-button');
    resetButtons.forEach(button => {
        button.textContent = translations.resetButton;
    });
    
    const mainMenuButtons = document.querySelectorAll('.main-menu-button');
    mainMenuButtons.forEach(button => {
        button.textContent = translations.mainMenuButton;
    });
    
    // Update results text
    const resultTexts = document.querySelectorAll('.player-result, .player-result3p, .player-result4p');
    resultTexts.forEach(result => {
        if (result.textContent.includes('VINTO')) {
            result.textContent = translations.youWin;
        } else if (result.textContent.includes('1°')) {
            result.textContent = translations.place1;
        } else if (result.textContent.includes('2°')) {
            result.textContent = translations.place2;
        } else if (result.textContent.includes('3°')) {
            result.textContent = translations.place3;
        } else if (result.textContent.includes('4°')) {
            result.textContent = translations.place4;
        }
    });
    
    // Update placement displays
    const placementDisplays = document.querySelectorAll('.placement-display');
    placementDisplays.forEach(display => {
        if (display.textContent.includes('1°')) {
            display.textContent = translations.place1;
        } else if (display.textContent.includes('2°')) {
            display.textContent = translations.place2;
        } else if (display.textContent.includes('3°')) {
            display.textContent = translations.place3;
        } else if (display.textContent.includes('4°')) {
            display.textContent = translations.place4;
        }
    });
    
    // Update category labels
    const categoryLabels = document.querySelectorAll('.category-container h2');
    categoryLabels.forEach(label => {
        label.textContent = translations.categoryLabel;
    });
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 