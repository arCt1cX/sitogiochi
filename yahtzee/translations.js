// Translations for the Yahtzee game
const gameTranslations = {
    'it': {
        'gameTitle': 'Yahtzee',
        'pageTitleDesc': 'Yahtzee - Il classico gioco di dadi | DrewGames',
        'metaDescription': 'Gioca a Yahtzee: lancia i cinque dadi, scegli le combinazioni e fai più punti degli avversari! Il classico gioco di dadi da fare con gli amici offline.',
        'home': 'Home',

        // Setup
        'setupTitle': 'Impostazioni del Gioco',
        'playerCountLabel': 'Numero di Giocatori:',
        'players': 'Giocatori',
        'player': 'Giocatore',
        'playerNamePlaceholder': 'Nome Giocatore {n}',
        'autoRotateLabel': 'Rotazione automatica schermo:',
        'autoRotateOn': 'Attiva',
        'autoRotateOff': 'Disattiva',
        'startGame': 'Inizia Gioco',

        // Turn intro
        'turnTitle': 'Tocca a:',
        'passPhone': 'Passa il telefono a',
        'startTurn': 'Inizia il Turno',

        // Play
        'rollBtn': 'Lancia i Dadi',
        'rollAgainBtn': 'Rilancia',
        'rollLabel': 'Lancio',
        'of': 'di',
        'holdHint': 'Tocca i dadi per bloccarli',
        'rollToStart': 'Lancia i dadi per iniziare il turno',
        'chooseHint': 'Tocca una casella libera per segnare il punteggio',
        'upperSection': 'Sezione Superiore',
        'lowerSection': 'Sezione Inferiore',
        'bonusLabel': 'Bonus (63+)',
        'totalLabel': 'Totale',
        'scoreboardTitle': 'Classifica',
        'held': 'Bloccato',

        // Categories
        'categories': {
            'ones': 'Uno',
            'twos': 'Due',
            'threes': 'Tre',
            'fours': 'Quattro',
            'fives': 'Cinque',
            'sixes': 'Sei',
            'threeKind': 'Tris',
            'fourKind': 'Poker',
            'fullHouse': 'Full',
            'smallStraight': 'Scala Piccola',
            'largeStraight': 'Scala Grande',
            'yahtzee': 'Yahtzee',
            'chance': 'Chance'
        },

        // Game over
        'gameOverTitle': 'Partita Finita!',
        'winnerTitle': 'Vince...',
        'finalStandingsTitle': 'Classifica Finale',
        'playAgainBtn': 'Gioca di Nuovo',
        'pointSingular': 'punto',
        'pointPlural': 'punti'
    },
    'en': {
        'gameTitle': 'Yahtzee',
        'pageTitleDesc': 'Yahtzee - The classic dice game | DrewGames',
        'metaDescription': 'Play Yahtzee: roll the five dice, pick your combinations and outscore your rivals! The classic dice game to play with friends offline.',
        'home': 'Home',

        // Setup
        'setupTitle': 'Game Settings',
        'playerCountLabel': 'Number of Players:',
        'players': 'Players',
        'player': 'Player',
        'playerNamePlaceholder': 'Player {n} Name',
        'autoRotateLabel': 'Auto-rotate screen:',
        'autoRotateOn': 'On',
        'autoRotateOff': 'Off',
        'startGame': 'Start Game',

        // Turn intro
        'turnTitle': 'Up next:',
        'passPhone': 'Pass the phone to',
        'startTurn': 'Start Turn',

        // Play
        'rollBtn': 'Roll the Dice',
        'rollAgainBtn': 'Roll Again',
        'rollLabel': 'Roll',
        'of': 'of',
        'holdHint': 'Tap the dice to hold them',
        'rollToStart': 'Roll the dice to start your turn',
        'chooseHint': 'Tap an empty box to score',
        'upperSection': 'Upper Section',
        'lowerSection': 'Lower Section',
        'bonusLabel': 'Bonus (63+)',
        'totalLabel': 'Total',
        'scoreboardTitle': 'Standings',
        'held': 'Held',

        // Categories
        'categories': {
            'ones': 'Ones',
            'twos': 'Twos',
            'threes': 'Threes',
            'fours': 'Fours',
            'fives': 'Fives',
            'sixes': 'Sixes',
            'threeKind': 'Three of a Kind',
            'fourKind': 'Four of a Kind',
            'fullHouse': 'Full House',
            'smallStraight': 'Small Straight',
            'largeStraight': 'Large Straight',
            'yahtzee': 'Yahtzee',
            'chance': 'Chance'
        },

        // Game over
        'gameOverTitle': 'Game Over!',
        'winnerTitle': 'The winner is...',
        'finalStandingsTitle': 'Final Standings',
        'playAgainBtn': 'Play Again',
        'pointSingular': 'point',
        'pointPlural': 'points'
    }
};

function getGameTranslations() {
    const lang = (typeof getUserLanguage === 'function') ? getUserLanguage() : 'it';
    return gameTranslations[lang] || gameTranslations['en'];
}

function applyGameTranslations() {
    const t = getGameTranslations();
    const lang = (typeof getUserLanguage === 'function') ? getUserLanguage() : 'it';

    document.title = t.pageTitleDesc;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t.metaDescription);
    document.documentElement.lang = lang;

    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) languageToggle.style.display = 'none';

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set('homeText', t.home);
    set('gameTitle', t.gameTitle);
    set('setupTitle', t.setupTitle);
    set('playerCountLabel', t.playerCountLabel);
    set('autoRotateLabel', t.autoRotateLabel);
    set('autoRotateOn', t.autoRotateOn);
    set('autoRotateOff', t.autoRotateOff);
    set('start-game', t.startGame);
    set('gameOverTitle', t.gameOverTitle);
    set('winnerTitle', t.winnerTitle);
    set('finalStandingsTitle', t.finalStandingsTitle);
    set('play-again', t.playAgainBtn);

    // Player count dropdown
    const playerSelect = document.getElementById('player-count');
    if (playerSelect) {
        playerSelect.querySelectorAll('option').forEach(option => {
            option.textContent = `${option.value} ${t.players}`;
        });
    }
}

document.addEventListener('DOMContentLoaded', applyGameTranslations);
