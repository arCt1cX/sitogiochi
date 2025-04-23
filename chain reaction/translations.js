// Translations for Chain Reaction game
const gameTranslations = {
    'it': {
        'pageTitle': 'Chain Reaction - Gioco di parole a squadre | DrewGames',
        'metaDescription': 'Gioca a Chain Reaction: un emozionante gioco di parole a squadre. I due suggeritori forniscono indizi, mentre una persona deve indovinare la parola misteriosa. Ideale per serate con amici!',
        'home': 'Home',
        'gameTitle': 'Chain Reaction',
        'howToPlay': 'Come Giocare',
        'instructions': [
            'Il gioco è pensato per essere giocato con un telefono condiviso',
            'Due persone saranno i "suggeritori" e vedranno la parola sullo schermo',
            'La persona che indovina NON deve vedere lo schermo',
            'I suggeritori si alternano dicendo UNA sola parola ciascuno',
            'Se la parola viene indovinata, premete "Corretta"',
            'Se viene data una risposta sbagliata, premete "Errata" (-1 punto)',
            'Potete usare "Passa" solo 3 volte per partita',
            'Il timer si ferma dopo ogni azione, premere "Continua" per la prossima parola'
        ],
        'startGame': 'Inizia Gioco',
        'seconds': 'secondi',
        'score': 'Punteggio',
        'passesRemaining': 'Pass rimasti',
        'continue': 'Continua',
        'correct': 'Corretta',
        'wrong': 'Errata',
        'pass': 'Passa',
        'restart': 'Ricomincia',
        'timeUp': 'Tempo Scaduto!',
        'finalScore': 'Punteggio Finale',
        'playAgain': 'Gioca Ancora',
        'mainMenu': 'Menu Principale',
        'loadError': 'Errore nel caricamento delle parole'
    },
    'en': {
        'pageTitle': 'Chain Reaction - Team Word Game | DrewGames',
        'metaDescription': 'Play Chain Reaction: an exciting team word game. Two hint-givers provide clues, while one person must guess the mystery word. Perfect for evenings with friends!',
        'home': 'Home',
        'gameTitle': 'Chain Reaction',
        'howToPlay': 'How to Play',
        'instructions': [
            'The game is designed to be played with a shared phone',
            'Two people will be the "hint-givers" and will see the word on screen',
            'The person guessing should NOT see the screen',
            'Hint-givers take turns saying ONE word each',
            'If the word is guessed correctly, press "Correct"',
            'If a wrong answer is given, press "Wrong" (-1 point)',
            'You can use "Pass" only 3 times per game',
            'The timer stops after each action, press "Continue" for the next word'
        ],
        'startGame': 'Start Game',
        'seconds': 'seconds',
        'score': 'Score',
        'passesRemaining': 'Passes left',
        'continue': 'Continue',
        'correct': 'Correct',
        'wrong': 'Wrong',
        'pass': 'Pass',
        'restart': 'Restart',
        'timeUp': 'Time\'s Up!',
        'finalScore': 'Final Score',
        'playAgain': 'Play Again',
        'mainMenu': 'Main Menu',
        'loadError': 'Error loading words'
    }
};

// Apply translations to the Chain Reaction game
function applyGameTranslations() {
    const lang = getUserLanguage();
    const translations = gameTranslations[lang] || gameTranslations['en'];
    
    // Update page title and meta description
    document.title = translations.pageTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', translations.metaDescription);
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update the home button text
    const homeText = document.querySelector('.home-button');
    if (homeText) {
        homeText.innerHTML = `<span class="home-icon">⌂</span> ${translations.home}`;
    }
    
    // Update the language toggle button
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.innerHTML = lang.toUpperCase();
    }
    
    // Update all text elements - Start Screen
    document.querySelector('#startScreen h1').textContent = translations.gameTitle;
    document.querySelector('#startScreen h2').textContent = translations.howToPlay;
    
    // Update instructions list
    const instructionsList = document.querySelector('#startScreen ul');
    if (instructionsList) {
        instructionsList.innerHTML = '';
        translations.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
    }
    
    // Update button texts
    document.querySelector('#startButton span:not(.btn-icon)').textContent = translations.startGame;
    document.querySelector('#continueButton span').textContent = translations.continue;
    document.querySelector('#correctButton span').textContent = translations.correct;
    document.querySelector('#wrongButton span').textContent = translations.wrong;
    document.querySelector('#passButton span').textContent = translations.pass;
    document.querySelector('#resetButton span:not(.btn-icon)').textContent = translations.restart;
    document.querySelector('#playAgainButton span:not(.btn-icon)').textContent = translations.playAgain;
    document.querySelector('#mainMenuButton span:not(.btn-icon)').textContent = translations.mainMenu;
    
    // Update game screen elements
    document.querySelector('.timer-label').textContent = translations.seconds;
    document.querySelector('.score-label').textContent = translations.score;
    document.querySelector('.passes-label').textContent = translations.passesRemaining;
    
    // Update game over screen
    document.querySelector('#gameOverScreen h2').textContent = translations.timeUp;
    document.querySelector('.final-score-label').textContent = translations.finalScore;
}

// Add the function to apply translations on page load
document.addEventListener('DOMContentLoaded', applyGameTranslations); 