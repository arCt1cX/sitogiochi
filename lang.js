// Language utility for DrewGames
const translations = {
    'it': {
        // Meta data
        'pageTitle': 'DrewGames - Giochi da fare con gli amici offline',
        'pageDescription': 'DrewGames: una collezione di giochi divertenti da fare con gli amici offline. Scopri giochi interattivi come Impostor, ColorGrid, GuessThePic e molti altri!',
        
        // Common elements across all pages
        'home': 'Home',
        'play': 'Gioca',
        'comingSoon': 'Coming Soon',
        'newGamesComingSoon': 'Nuovi giochi in arrivo...',
        'copyright': '© 2025 partygamesdrew.com - Tutti i diritti riservati',
        'toggleLanguage': 'IT',
        'tagline': 'Illumina la mente, scatena la serata',
        'subtitle': 'Giochi da fare con gli amici offline 🎉',
        'buyMeCoffee': 'Buy me a coffee',
        
        // Game titles and descriptions
        'impostor': {
            'title': 'Impostor',
            'catchphrase': 'Scopri chi mente nel gruppo!'
        },
        'colorgrid': {
            'title': 'Color Grid',
            'catchphrase': 'Indovina la cella colorata segreta!'
        },
        'guessthepic': {
            'title': 'Indovina Immagini',
            'catchphrase': 'Indovina cosa mostrano le 5 immagini e accumula più punti!'
        },
        'timergame': {
            'title': 'Wordrace',
            'catchphrase': 'Corri contro il tempo in questa sfida di parole!'
        },
        'chainreaction': {
            'title': 'Chain Reaction',
            'catchphrase': 'Crea concatenazioni di parole in questa sfida a squadre!'
        },
        'alphabetgame': {
            'title': 'Alphabet Game',
            'catchphrase': 'Trova parole che iniziano con una lettera specifica!'
        },
        'bluffme': {
            'title': 'BluffMe',
            'catchphrase': 'Riuscirai a bluffare i tuoi amici e vincere la partita?'
        }
    },
    'en': {
        // Meta data
        'pageTitle': 'DrewGames - Games to play with friends offline',
        'pageDescription': 'DrewGames: a collection of fun games to play with friends offline. Discover interactive games like Impostor, ColorGrid, GuessThePic and many more!',
        
        // Common elements across all pages
        'home': 'Home',
        'play': 'Play',
        'comingSoon': 'Coming Soon',
        'newGamesComingSoon': 'New games coming soon...',
        'copyright': '© 2025 partygamesdrew.com - All rights reserved',
        'toggleLanguage': 'EN',
        'tagline': 'Enlighten minds, ignite the night',
        'subtitle': 'Games to play with friends offline 🎉',
        'buyMeCoffee': 'Buy me a coffee',
        
        // Game titles and descriptions
        'impostor': {
            'title': 'Impostor',
            'catchphrase': 'Find out who is lying in the group!'
        },
        'colorgrid': {
            'title': 'Color Grid',
            'catchphrase': 'Guess the secret colored cell!'
        },
        'guessthepic': {
            'title': 'Guess The Pic',
            'catchphrase': 'Guess what the 5 images show and score points!'
        },
        'timergame': {
            'title': 'Wordrace',
            'catchphrase': 'Race against time in this word challenge!'
        },
        'chainreaction': {
            'title': 'Chain Reaction',
            'catchphrase': 'Create word chains in this team challenge!'
        },
        'alphabetgame': {
            'title': 'Alphabet Game',
            'catchphrase': 'Find words that start with a specific letter!'
        },
        'bluffme': {
            'title': 'BluffMe',
            'catchphrase': 'Can you bluff your friends and win the game?'
        }
    }
};

// Function to get user's language preference
function getUserLanguage() {
    // Check if a language is stored in localStorage
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
        return storedLang;
    }
    
    // If no stored preference, try to detect based on browser language
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Default to 'en' unless it's specifically Italian
    if (browserLang.startsWith('it')) {
        localStorage.setItem('lang', 'it');
        return 'it';
    } else {
        localStorage.setItem('lang', 'en');
        return 'en';
    }
}

// Function to set the user's language preference
function setUserLanguage(lang) {
    if (lang !== 'en' && lang !== 'it') {
        lang = 'en'; // Default to English for invalid values
    }
    localStorage.setItem('lang', lang);
    return lang;
}

// Function to toggle between languages
function toggleLanguage() {
    const currentLang = getUserLanguage();
    const newLang = currentLang === 'it' ? 'en' : 'it';
    setUserLanguage(newLang);
    location.reload();
}

// Function to get a translation
function getTranslation(key, subKey = null) {
    const lang = getUserLanguage();
    
    if (subKey) {
        // For nested translations like game titles/descriptions
        if (translations[lang][key] && translations[lang][key][subKey]) {
            return translations[lang][key][subKey];
        }
        // Fallback to English if translation not found
        return translations['en'][key][subKey];
    } else {
        // For top-level translations
        if (translations[lang][key]) {
            return translations[lang][key];
        }
        // Fallback to English if translation not found
        return translations['en'][key];
    }
}

// Function to check if we're on the main page
function isMainPage() {
    // If we're at the root or index.html, it's the main page
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/index.html') || path === '/sitogiochi/' || path.endsWith('/sitogiochi/index.html');
}

// Apply translations to the current page
function applyTranslations() {
    const lang = getUserLanguage();
    document.documentElement.lang = lang;
    
    // Update meta tags if they exist
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        document.title = getTranslation('pageTitle');
    }
    
    const pageDescription = document.getElementById('pageDescription');
    if (pageDescription) {
        pageDescription.setAttribute('content', getTranslation('pageDescription'));
    }
    
    // Handle language toggle - only show on main page
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        if (isMainPage()) {
            languageToggle.style.display = 'block';
            languageToggle.textContent = getTranslation('toggleLanguage');
        } else {
            languageToggle.style.display = 'none';
        }
    }
} 