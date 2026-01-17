// Translations for the Indovina Chi game
const gameTranslations = {
    'it': {
        'gameTitle': 'Indovina Chi',
        'pageTitleDesc': 'Indovina Chi - Indovina la parola con le domande | DrewGames',
        'metaDescription': 'Gioca a Indovina Chi: fai domande agli amici per indovinare la parola segreta! Un perfetto party game da fare con gli amici.',
        'home': 'Home',
        'setupTitle': 'Impostazioni del Gioco',
        'playerCountLabel': 'Numero di Giocatori:',
        'players': 'Giocatori',
        'player': 'Giocatore',
        'startGameText': 'Inizia Gioco',
        'modeTitle': 'Scegli la Modalità',
        'modeChosenText': 'Categorie Scelte',
        'modeChosenDesc': 'Ogni giocatore sceglie la categoria',
        'modeRandomText': 'Categorie Casuali',
        'modeRandomDesc': 'Parola e categoria casuali',
        'modeCustomText': 'Parole Personalizzate',
        'modeCustomDesc': 'Gli altri giocatori scrivono la parola',
        'categoryTitle': 'Scegli una Categoria',
        'categoryPlayerText': 'Giocatore {n}, scegli la categoria per gli altri:',
        'customWordTitle': 'Scrivi una Parola',
        'customWordPlayerText': 'Il Giocatore {n} non deve guardare!',
        'customWordInstructions': 'Gli altri giocatori scrivono una parola da far indovinare:',
        'submitWordText': 'Conferma Parola',
        'customCategory': 'Personalizzata',
        'passPhoneTitle': 'Passa il Telefono',
        'passPhoneText': 'Passa il telefono ad un altro giocatore',
        'passPhoneInstructions': 'Quando è pronto, tocca per vedere la parola da indovinare',
        'showWordText': 'Mostra Parola',
        'currentPlayerLabel': 'Giocatore {n}',
        'wordToGuessLabel': 'La parola da indovinare è:',
        'questionsLabel': 'Domande fatte:',
        'guessedText': 'Ho Indovinato! 🎉',
        'endTitle': 'Fine del Gioco!',
        'playAgainText': 'Gioca di Nuovo',
        'questionsUnit': 'domande',
        'changeWordText': 'Cambia Parola',
        'giveUpText': 'Arreso',
        'areYouSure': 'Sicuro?',
        'changesLeft': 'rimanenti',
        'wordChangedAlert': 'Parola cambiata! La nuova parola è stata selezionata.',
        'noMoreChangesAlert': 'Hai finito i cambi parola!',
        'gaveUpAlert': 'Ti sei arreso!',
        'arreso': 'Arreso (Non Indovinata)',
        'theWordWas': 'La parola era:',
        'playerNamePlaceholder': 'Giocatore {n}',
        'categoryChooseOwn': '{n} scegli la tua categoria'
    },
    'en': {
        'gameTitle': 'Guess Who',
        'pageTitleDesc': 'Guess Who - Guess the word by asking questions | DrewGames',
        'metaDescription': 'Play Guess Who: ask your friends questions to guess the secret word! A perfect party game to play with friends.',
        'home': 'Home',
        'setupTitle': 'Game Settings',
        'playerCountLabel': 'Number of Players:',
        'players': 'Players',
        'player': 'Player',
        'startGameText': 'Start Game',
        'modeTitle': 'Choose Mode',
        'modeChosenText': 'Chosen Categories',
        'modeChosenDesc': 'Each player chooses the category',
        'modeRandomText': 'Random Categories',
        'modeRandomDesc': 'Random word and category',
        'modeCustomText': 'Custom Words',
        'modeCustomDesc': 'Other players write the word',
        'categoryTitle': 'Choose a Category',
        'categoryPlayerText': 'Player {n}, choose the category for the others:',
        'customWordTitle': 'Write a Word',
        'customWordPlayerText': 'Player {n} must not look!',
        'customWordInstructions': 'Other players write a word to guess:',
        'submitWordText': 'Confirm Word',
        'customCategory': 'Custom',
        'passPhoneTitle': 'Pass the Phone',
        'passPhoneText': 'Pass the phone to another player',
        'passPhoneInstructions': 'When ready, tap to see the word to guess',
        'showWordText': 'Show Word',
        'currentPlayerLabel': 'Player {n}',
        'wordToGuessLabel': 'The word to guess is:',
        'questionsLabel': 'Questions asked:',
        'guessedText': 'I Guessed It! 🎉',
        'endTitle': 'Game Over!',
        'playAgainText': 'Play Again',
        'questionsUnit': 'questions',
        'changeWordText': 'Change Word',
        'giveUpText': 'Give Up',
        'areYouSure': 'Sure?',
        'changesLeft': 'remaining',
        'wordChangedAlert': 'Word changed! A new word has been selected.',
        'noMoreChangesAlert': 'No more word changes allowed!',
        'gaveUpAlert': 'You gave up!',
        'arreso': 'Gave Up (Not Guessed)',
        'theWordWas': 'The word was:',
        'playerNamePlaceholder': 'Player {n}',
        'categoryChooseOwn': '{n} choose your category'
    }
};

// Apply translations to the Indovina Chi game
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
    const homeText = document.getElementById('homeText');
    if (homeText) homeText.textContent = translations.home;

    // Update all text elements
    const elements = {
        'gameTitle': 'gameTitle',
        'setupTitle': 'setupTitle',
        'playerCountLabel': 'playerCountLabel',
        'startGameText': 'startGameText',
        'modeTitle': 'modeTitle',
        'modeChosenText': 'modeChosenText',
        'modeChosenDesc': 'modeChosenDesc',
        'modeRandomText': 'modeRandomText',
        'modeRandomDesc': 'modeRandomDesc',
        'modeCustomText': 'modeCustomText',
        'modeCustomDesc': 'modeCustomDesc',
        'categoryTitle': 'categoryTitle',
        'customWordTitle': 'customWordTitle',
        'customWordInstructions': 'customWordInstructions',
        'submitWordText': 'submitWordText',
        'passPhoneTitle': 'passPhoneTitle',
        'passPhoneInstructions': 'passPhoneInstructions',
        'showWordText': 'showWordText',
        'wordToGuessLabel': 'wordToGuessLabel',
        'questionsLabel': 'questionsLabel',
        'guessedText': 'guessedText',
        'endTitle': 'endTitle',
        'playAgainText': 'playAgainText',
        'changeWordBtn': 'changeWordText',
        'giveUpBtn': 'giveUpText'
    };

    for (const [id, key] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el && translations[key]) {
            el.textContent = translations[key];
        }
    }

    // Update player count dropdown
    const playerSelect = document.getElementById('player-count');
    if (playerSelect) {
        const playerOptions = playerSelect.querySelectorAll('option');
        playerOptions.forEach(option => {
            const value = parseInt(option.value);
            option.textContent = `${value} ${translations.players}`;
        });
    }

    // Update custom word input placeholder
    const customWordInput = document.getElementById('custom-word-input');
    if (customWordInput) {
        customWordInput.placeholder = lang === 'it' ? 'Scrivi la parola...' : 'Enter the word...';
    }
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations);
