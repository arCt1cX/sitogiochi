// Translations for the Taboo game
const gameTranslations = {
    'it': {
        'gameTitle': 'Taboo',
        'pageTitleDesc': 'Taboo - Fai indovinare la parola senza dire i tabù | DrewGames',
        'metaDescription': 'Gioca a Taboo: fai indovinare la parola segreta alla tua squadra senza usare le cinque parole vietate! Un classico party game da fare con gli amici offline.',
        'home': 'Home',
        'cardsFile': 'taboo_cards_it.txt',

        // Setup
        'setupTitle': 'Impostazioni del Gioco',
        'modeLabel': 'Modalità:',
        'teamsMode': 'Squadre',
        'ffaMode': 'Tutti contro tutti',
        'teamCountLabel': 'Numero di Squadre:',
        'playerCountLabel': 'Numero di Giocatori:',
        'teams': 'Squadre',
        'team': 'Squadra',
        'players': 'Giocatori',
        'player': 'Giocatore',
        'teamNamePlaceholder': 'Nome Squadra {n}',
        'playerNamePlaceholder': 'Nome Giocatore {n}',
        'roundTimeLabel': 'Durata del Turno:',
        'seconds': 'secondi',
        'targetScoreLabel': 'Punti per Vincere:',
        'points': 'punti',
        'skipPenaltyLabel': 'Penalità per "Passa":',
        'penaltyNone': 'Nessuna',
        'penaltyMinusOne': '-1 punto',
        'startGame': 'Inizia Gioco',

        // Turn intro
        'turnIntroTitle': 'Tocca a:',
        'turnIntroTitleFFA': 'Nuovo Turno',
        'passToDescriber': 'Passa il telefono a chi descrive di',
        'passToDescriberFFA': 'Passa il telefono a',
        'describerHint': 'Descrivi la parola senza dire le parole vietate. La tua squadra deve indovinare!',
        'describerHintFFA': 'Descrivi la parola solo a chi indovina, senza dire le parole vietate. Gli altri controllano che le rispetti!',
        'startTurn': 'Inizia il Turno',
        'scoreLabel': 'Punteggio',
        'roleDescribe': 'Descrive',
        'roleGuess': 'Indovina',
        'roleControl': 'Controllano',

        // Round play
        'tabooWordsLabel': 'Parole Vietate',
        'correctBtn': 'Indovinato',
        'skipBtn': 'Passa',
        'tabooBtn': 'Tabù',
        'roundScoreLabel': 'Punti in questo turno',
        'playVs': 'fa indovinare',

        // Round summary
        'timeUpTitle': 'Tempo Scaduto!',
        'roundResultText': 'ha guadagnato',
        'roundResultTextFFA': 'hanno guadagnato',
        'roundResultAnd': 'e',
        'pointsThisRound': 'punti in questo turno',
        'nextTeamBtn': 'Prossima Squadra',
        'nextTeamBtnFFA': 'Prossimo Turno',
        'standingsTitle': 'Classifica',

        // Victory
        'winnerTitle': 'Vince...',
        'finalStandingsTitle': 'Classifica Finale',
        'playAgainBtn': 'Gioca di Nuovo',
        'pointSingular': 'punto',
        'pointPlural': 'punti'
    },
    'en': {
        'gameTitle': 'Taboo',
        'pageTitleDesc': 'Taboo - Make them guess without the forbidden words | DrewGames',
        'metaDescription': 'Play Taboo: make your team guess the secret word without using the five forbidden words! A classic party game to play with friends offline.',
        'home': 'Home',
        'cardsFile': 'taboo_cards_en.txt',

        // Setup
        'setupTitle': 'Game Settings',
        'modeLabel': 'Mode:',
        'teamsMode': 'Teams',
        'ffaMode': 'Free-for-all',
        'teamCountLabel': 'Number of Teams:',
        'playerCountLabel': 'Number of Players:',
        'teams': 'Teams',
        'team': 'Team',
        'players': 'Players',
        'player': 'Player',
        'teamNamePlaceholder': 'Team {n} Name',
        'playerNamePlaceholder': 'Player {n} Name',
        'roundTimeLabel': 'Round Duration:',
        'seconds': 'seconds',
        'targetScoreLabel': 'Points to Win:',
        'points': 'points',
        'skipPenaltyLabel': '"Skip" Penalty:',
        'penaltyNone': 'None',
        'penaltyMinusOne': '-1 point',
        'startGame': 'Start Game',

        // Turn intro
        'turnIntroTitle': 'Up next:',
        'turnIntroTitleFFA': 'New Turn',
        'passToDescriber': 'Pass the phone to the describer of',
        'passToDescriberFFA': 'Pass the phone to',
        'describerHint': 'Describe the word without saying the forbidden words. Your team has to guess!',
        'describerHintFFA': 'Describe the word only to the guesser, without saying the forbidden words. The others make sure you follow the rules!',
        'startTurn': 'Start Turn',
        'scoreLabel': 'Score',
        'roleDescribe': 'Describes',
        'roleGuess': 'Guesses',
        'roleControl': 'Watch',

        // Round play
        'tabooWordsLabel': 'Forbidden Words',
        'correctBtn': 'Correct',
        'skipBtn': 'Skip',
        'tabooBtn': 'Taboo',
        'roundScoreLabel': 'Points this turn',
        'playVs': 'describes to',

        // Round summary
        'timeUpTitle': 'Time\'s Up!',
        'roundResultText': 'scored',
        'roundResultTextFFA': 'scored',
        'roundResultAnd': 'and',
        'pointsThisRound': 'points this turn',
        'nextTeamBtn': 'Next Team',
        'nextTeamBtnFFA': 'Next Turn',
        'standingsTitle': 'Standings',

        // Victory
        'winnerTitle': 'The winner is...',
        'finalStandingsTitle': 'Final Standings',
        'playAgainBtn': 'Play Again',
        'pointSingular': 'point',
        'pointPlural': 'points'
    }
};

// Helper to get current translations object
function getGameTranslations() {
    const lang = (typeof getUserLanguage === 'function') ? getUserLanguage() : 'it';
    return gameTranslations[lang] || gameTranslations['en'];
}

// Apply translations to the static elements of the Taboo game
function applyGameTranslations() {
    const t = getGameTranslations();
    const lang = (typeof getUserLanguage === 'function') ? getUserLanguage() : 'it';

    // Page meta
    document.title = t.pageTitleDesc;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t.metaDescription);
    document.documentElement.lang = lang;

    // Hide language toggle on game pages (consistent with other games)
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) languageToggle.style.display = 'none';

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set('homeText', t.home);
    set('gameTitle', t.gameTitle);
    set('setupTitle', t.setupTitle);
    set('modeLabel', t.modeLabel);
    set('teamsModeOption', t.teamsMode);
    set('ffaModeOption', t.ffaMode);
    set('roundTimeLabel', t.roundTimeLabel);
    set('targetScoreLabel', t.targetScoreLabel);
    set('skipPenaltyLabel', t.skipPenaltyLabel);
    set('start-game', t.startGame);
    set('start-turn', t.startTurn);
    set('roleDescribeLabel', t.roleDescribe);
    set('roleGuessLabel', t.roleGuess);
    set('roleControlLabel', t.roleControl);
    set('tabooWordsLabel', t.tabooWordsLabel);
    set('correctBtnText', t.correctBtn);
    set('skipBtnText', t.skipBtn);
    set('tabooBtnText', t.tabooBtn);
    set('roundScoreLabel', t.roundScoreLabel);
    set('timeUpTitle', t.timeUpTitle);
    set('standingsTitle', t.standingsTitle);
    set('winnerTitle', t.winnerTitle);
    set('finalStandingsTitle', t.finalStandingsTitle);
    set('play-again', t.playAgainBtn);

    // Skip penalty options
    const penaltyNone = document.getElementById('penaltyNoneOption');
    const penaltyMinus = document.getElementById('penaltyMinusOption');
    if (penaltyNone) penaltyNone.textContent = t.penaltyNone;
    if (penaltyMinus) penaltyMinus.textContent = t.penaltyMinusOne;

    // Round time dropdown
    const timeSelect = document.getElementById('round-time');
    if (timeSelect) {
        timeSelect.querySelectorAll('option').forEach(option => {
            option.textContent = `${option.value} ${t.seconds}`;
        });
    }

    // Target score dropdown
    const targetSelect = document.getElementById('target-score');
    if (targetSelect) {
        targetSelect.querySelectorAll('option').forEach(option => {
            option.textContent = `${option.value} ${t.points}`;
        });
    }

    // The count dropdown, count label and name inputs are mode-dependent and
    // handled by scripts.js (updateModeUI), which runs after this.
}

document.addEventListener('DOMContentLoaded', applyGameTranslations);
