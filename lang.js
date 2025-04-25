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
            'title': 'Guess Rush',
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
            'title': 'Guess Rush',
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

// Flag SVGs for language toggle
const flagSVGs = {
    'it': `
        <!-- Italian flag -->
        <rect width="640" height="480" fill="#ffffff"/>
        <rect width="213.3" height="480" fill="#009246"/>
        <rect width="213.3" height="480" x="426.7" fill="#ce2b37"/>
    `,
    'en': `
        <!-- UK flag (Union Jack) - Improved version -->
        <rect width="640" height="480" fill="#012169"/>
        <path d="M0,0 L640,480 M640,0 L0,480" stroke="#ffffff" stroke-width="96"/>
        <path d="M0,0 L640,480 M640,0 L0,480" stroke="#c8102e" stroke-width="64"/>
        <rect width="640" height="96" y="192" fill="#ffffff"/>
        <rect width="96" height="480" x="272" fill="#ffffff"/>
        <rect width="640" height="48" y="216" fill="#c8102e"/>
        <rect width="48" height="480" x="296" fill="#c8102e"/>
    `
};

// Function to get user's language preference
function getUserLanguage() {
    // Check if language is specified in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang === 'en' || urlLang === 'it') {
        // Store the URL language preference in localStorage
        localStorage.setItem('lang', urlLang);
        return urlLang;
    }
    
    // Check if a language is stored in localStorage
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
        return storedLang;
    }
    
    // If no stored preference, try to detect based on browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    console.log('Detected browser language:', browserLang);
    
    // More specific check for Italian language
    if (browserLang === 'it' || browserLang === 'it-it' || browserLang.startsWith('it-')) {
        localStorage.setItem('lang', 'it');
        return 'it';
    } else {
        // Default to English for any other language
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

// Function to set the flag icon based on current language
function setFlagIcon() {
    const currentFlag = document.getElementById('currentFlag');
    if (currentFlag) {
        const lang = getUserLanguage();
        currentFlag.innerHTML = flagSVGs[lang];
        
        // Set aria-label for accessibility
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            const nextLang = lang === 'it' ? 'en' : 'it';
            languageToggle.setAttribute('aria-label', `Switch to ${nextLang === 'en' ? 'English' : 'Italian'}`);
        }
    }
}

// Apply translations to the current page
function applyTranslations() {
    // Debug language detection
    console.log('Language detection debug:');
    console.log('- URL parameter:', new URLSearchParams(window.location.search).get('lang'));
    console.log('- localStorage lang:', localStorage.getItem('lang'));
    console.log('- navigator.language:', navigator.language);
    console.log('- navigator.userLanguage:', navigator.userLanguage);
    console.log('- document.documentElement.lang:', document.documentElement.lang);
    console.log('- Selected language:', getUserLanguage());
    
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
            languageToggle.style.display = 'flex';
            setFlagIcon();
        } else {
            languageToggle.style.display = 'none';
        }
    }
} 