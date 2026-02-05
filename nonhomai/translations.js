// Translations for the Non ho mai game
const gameTranslations = {
    'it': {
        'gameTitle': 'Non ho mai...',
        'pageTitleDesc': 'Non ho mai - Il classico gioco alcolico | DrewGames',
        'metaDescription': 'Gioca a Non ho mai: il classico gioco per bere con gli amici! Scopri i segreti dei tuoi amici con centinaia di domande.',
        'home': 'Home',
        'setupTitle': 'Impostazioni Partita',
        'questionCountLabel': 'Numero di frasi:',
        'questions15': '15 Frasi',
        'questions20': '20 Frasi',
        'questions30': '30 Frasi',
        'questions50': '50 Frasi',
        'startGameText': 'Inizia Gioco',
        'nextText': 'Prossima',
        'finishText': 'Finisci',
        'gameOverTitle': 'Partita Finita!',
        'gameOverText': 'Speriamo vi siate divertiti (e abbiate bevuto abbastanza)!',
        'playAgainText': 'Gioca di Nuovo',
        'backToHomeText': 'Torna alla Home'
    },
    'en': {
        'gameTitle': 'Never Have I Ever...',
        'pageTitleDesc': 'Never Have I Ever - The classic drinking game | DrewGames',
        'metaDescription': 'Play Never Have I Ever: the classic drinking game with friends! Discover your friends\' secrets with hundreds of questions.',
        'home': 'Home',
        'setupTitle': 'Game Settings',
        'questionCountLabel': 'Number of phrases:',
        'questions15': '15 Phrases',
        'questions20': '20 Phrases',
        'questions30': '30 Phrases',
        'questions50': '50 Phrases',
        'startGameText': 'Start Game',
        'nextText': 'Next',
        'finishText': 'Finish',
        'gameOverTitle': 'Game Over!',
        'gameOverText': 'We hope you had fun (and drank enough)!',
        'playAgainText': 'Play Again',
        'backToHomeText': 'Back to Home'
    }
};

// Apply translations to the Non ho mai game
function applyGameTranslations() {
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    };

    // Update page title and meta description
    document.title = translations.pageTitleDesc;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', translations.metaDescription);
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all translatable elements
    setText('homeText', translations.home);
    setText('gameTitle', translations.gameTitle);
    setText('setupTitle', translations.setupTitle);
    setText('questionCountLabel', translations.questionCountLabel);
    setText('startGameText', translations.startGameText);
    setText('nextText', translations.nextText);
    setText('gameOverTitle', translations.gameOverTitle);
    setText('gameOverText', translations.gameOverText);
    setText('playAgainText', translations.playAgainText);
    setText('backToHomeText', translations.backToHomeText);

    // Update select options
    const questionCountSelect = document.getElementById('question-count');
    if (questionCountSelect) {
        const options = questionCountSelect.options;
        for (let i = 0; i < options.length; i++) {
            const value = options[i].value;
            if (translations['questions' + value]) {
                options[i].textContent = translations['questions' + value];
            }
        }
    }
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations);
