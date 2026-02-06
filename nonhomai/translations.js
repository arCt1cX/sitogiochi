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
        'btnEveryone': 'Tutti',
        'btnSomeone': 'Qualcuno',
        'btnNoOne': 'Nessuno',
        'finishText': 'Finisci',
        'gameOverTitle': 'Partita Finita!',
        'gameOverText': 'Speriamo vi siate divertiti (e abbiate bevuto abbastanza)!',
        'playAgainText': 'Gioca di Nuovo',
        'backToHomeText': 'Torna alla Home',
        'results': {
            'tutti': [
                "Ragazzi, datevi una regolata!",
                "Siete un gruppo di criminali!",
                "Quello che succede qui, resta qui...",
                "Sto chiamando la polizia adesso.",
                "Avete fatto letteralmente TUTTO!",
                "Nessun segreto tra peccatori, eh?",
                "Questo gruppo è ufficialmente vietato ai minori."
            ],
            'qualcuno': [
                "Un gruppo equilibrato tra santi e peccatori.",
                "Qualcuno di voi nasconde dei segreti...",
                "Perfettamente bilanciato, come tutto dovrebbe essere.",
                "Sappiamo chi sono quelli cattivi!",
                "Non vi giudichiamo (troppo).",
                "Un mix di angeli e diavoli.",
                "Abbastanza caos da essere divertente."
            ],
            'nessuno': [
                "Siete un po' noiosi, eh?",
                "Siete santi o solo bugiardi?",
                "Dai, vivete un po'!",
                "La partita più innocente della storia.",
                "Non vi credo. Bevete lo stesso!",
                "Santi. Siete dei santi.",
                "La prossima volta portate amici più pazzi."
            ]
        }
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
        'btnEveryone': 'Everyone',
        'btnSomeone': 'Someone',
        'btnNoOne': 'No One',
        'finishText': 'Finish',
        'gameOverTitle': 'Game Over!',
        'gameOverText': 'We hope you had fun (and drank enough)!',
        'playAgainText': 'Play Again',
        'backToHomeText': 'Back to Home',
        'results': {
            'tutti': [
                "Wow, you are a wild group!",
                "You definitely need to calm down!",
                "What happens in this room, stays in this room...",
                "I'm calling the police right now.",
                "You guys have done EVERYTHING!",
                "No secrets among sinners, right?",
                "This group is officially rated 18+."
            ],
            'qualcuno': [
                "A balanced group of saints and sinners.",
                "Some of you are hiding secrets...",
                "Perfectly balanced, as all things should be.",
                "We know who the naughty ones are!",
                "Don't worry, we won't judge (much).",
                "A mix of angels and devils.",
                "Just enough chaos to be fun."
            ],
            'nessuno': [
                "You guys are boring!",
                "Are you saints or just liars?",
                "Come on, live a little!",
                "This was the most innocent game ever.",
                "I don't believe you. Drink anyway!",
                "Saints. Absolute saints.",
                "Next time, bring some wilder friends."
            ]
        }
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
    setText('gameOverText', translations.gameOverText);
    setText('playAgainText', translations.playAgainText);
    setText('backToHomeText', translations.backToHomeText);

    // Update answer buttons
    setText('btn-everyone', translations.btnEveryone);
    setText('btn-someone', translations.btnSomeone);
    setText('btn-no-one', translations.btnNoOne);

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
