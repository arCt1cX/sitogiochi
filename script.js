document.addEventListener('DOMContentLoaded', () => {
    // Apply initial language based on user preference
    applyTranslations();

    // Language toggle is now handled in applyTranslations() function in lang.js

    // Update page content with current language
    document.getElementById('tagline').textContent = getTranslation('tagline');
    const subtitleElem = document.getElementById('subtitle');
    if (subtitleElem) subtitleElem.textContent = getTranslation('subtitle');
    document.getElementById('copyright').textContent = getTranslation('copyright');

    // Update page title and description
    document.title = getTranslation('pageTitle');
    const metaDesc = document.getElementById('pageDescription');
    if (metaDesc) {
        metaDesc.setAttribute('content', getTranslation('pageDescription'));
    }

    // Games array - Reordered and SVGs removed
    // Per cambiare immagine: sostituisci 'chainReaction.png' con il nome del tuo file (es. 'impostor.png')
    const games = [
        {
            id: "drewnking",
            displayName: getTranslation('drewnking', 'title'),
            catchphrase: getTranslation('drewnking', 'catchphrase'),
            image: "picolo.png",
            players: getTranslation('drewnking', 'players'),
            time: getTranslation('drewnking', 'time'),
            difficulty: getTranslation('drewnking', 'difficulty'),
            description: getTranslation('drewnking', 'description'),
            features: getTranslation('drewnking', 'features'),
            instructions: getTranslation('drewnking', 'instructions')
        },
        {
            id: "impostor",
            displayName: getTranslation('impostor', 'title'),
            catchphrase: getTranslation('impostor', 'catchphrase'),
            image: "impostor.png",
            players: getTranslation('impostor', 'players'),
            time: getTranslation('impostor', 'time'),
            difficulty: getTranslation('impostor', 'difficulty'),
            description: getTranslation('impostor', 'description'),
            features: getTranslation('impostor', 'features'),
            instructions: getTranslation('impostor', 'instructions')
        },
        {
            id: "mrdrew",
            displayName: getTranslation('mrdrew', 'title'),
            catchphrase: getTranslation('mrdrew', 'catchphrase'),
            image: "mrdrew.png",
            players: getTranslation('mrdrew', 'players'),
            time: getTranslation('mrdrew', 'time'),
            difficulty: getTranslation('mrdrew', 'difficulty'),
            description: getTranslation('mrdrew', 'description'),
            features: getTranslation('mrdrew', 'features'),
            instructions: getTranslation('mrdrew', 'instructions')
        },
        {
            id: "hottakes",
            displayName: getTranslation('hottakes', 'title'),
            catchphrase: getTranslation('hottakes', 'catchphrase'),
            image: "hottakes.png",
            players: getTranslation('hottakes', 'players'),
            time: getTranslation('hottakes', 'time'),
            difficulty: getTranslation('hottakes', 'difficulty'),
            description: getTranslation('hottakes', 'description'),
            features: getTranslation('hottakes', 'features'),
            instructions: getTranslation('hottakes', 'instructions')
        },
        {
            id: "indovinaChi",
            displayName: getTranslation('indovinachi', 'title'),
            catchphrase: getTranslation('indovinachi', 'catchphrase'),
            image: "indovinachi.png",
            players: getTranslation('indovinachi', 'players'),
            time: getTranslation('indovinachi', 'time'),
            difficulty: getTranslation('indovinachi', 'difficulty'),
            description: getTranslation('indovinachi', 'description'),
            features: getTranslation('indovinachi', 'features'),
            instructions: getTranslation('indovinachi', 'instructions')
        },
        {
            id: "quizzy",
            displayName: getTranslation('quizzy', 'title'),
            catchphrase: getTranslation('quizzy', 'catchphrase'),
            image: "quizzy.png",
            players: getTranslation('quizzy', 'players'),
            time: getTranslation('quizzy', 'time'),
            difficulty: getTranslation('quizzy', 'difficulty'),
            description: getTranslation('quizzy', 'description'),
            features: getTranslation('quizzy', 'features'),
            instructions: getTranslation('quizzy', 'instructions')
        },
        {
            id: "guessthepic",
            displayName: getTranslation('guessthepic', 'title'),
            catchphrase: getTranslation('guessthepic', 'catchphrase'),
            image: "guessrush.png",
            players: getTranslation('guessthepic', 'players'),
            time: getTranslation('guessthepic', 'time'),
            difficulty: getTranslation('guessthepic', 'difficulty'),
            description: getTranslation('guessthepic', 'description'),
            features: getTranslation('guessthepic', 'features'),
            instructions: getTranslation('guessthepic', 'instructions')
        },
        {
            id: "chainreaction",
            displayName: getTranslation('chainreaction', 'title'),
            catchphrase: getTranslation('chainreaction', 'catchphrase'),
            image: "chainReaction.png",
            players: getTranslation('chainreaction', 'players'),
            time: getTranslation('chainreaction', 'time'),
            difficulty: getTranslation('chainreaction', 'difficulty'),
            description: getTranslation('chainreaction', 'description'),
            features: getTranslation('chainreaction', 'features'),
            instructions: getTranslation('chainreaction', 'instructions')
        },
        {
            id: "bluffme",
            displayName: getTranslation('bluffme', 'title'),
            catchphrase: getTranslation('bluffme', 'catchphrase'),
            image: "bluffme.png",
            players: getTranslation('bluffme', 'players'),
            time: getTranslation('bluffme', 'time'),
            difficulty: getTranslation('bluffme', 'difficulty'),
            description: getTranslation('bluffme', 'description'),
            features: getTranslation('bluffme', 'features'),
            instructions: getTranslation('bluffme', 'instructions')
        },
        {
            id: "alphabetgame",
            displayName: getTranslation('alphabetgame', 'title'),
            catchphrase: getTranslation('alphabetgame', 'catchphrase'),
            image: "alphabet.png",
            players: getTranslation('alphabetgame', 'players'),
            time: getTranslation('alphabetgame', 'time'),
            difficulty: getTranslation('alphabetgame', 'difficulty'),
            description: getTranslation('alphabetgame', 'description'),
            features: getTranslation('alphabetgame', 'features'),
            instructions: getTranslation('alphabetgame', 'instructions')
        },
        {
            id: "timergame",
            displayName: getTranslation('timergame', 'title'),
            catchphrase: getTranslation('timergame', 'catchphrase'),
            image: "wordrace.png",
            players: getTranslation('timergame', 'players'),
            time: getTranslation('timergame', 'time'),
            difficulty: getTranslation('timergame', 'difficulty'),
            description: getTranslation('timergame', 'description'),
            features: getTranslation('timergame', 'features'),
            instructions: getTranslation('timergame', 'instructions')
        },
        {
            id: "colorgrid",
            displayName: getTranslation('colorgrid', 'title'),
            catchphrase: getTranslation('colorgrid', 'catchphrase'),
            image: "colorgrid.png",
            players: getTranslation('colorgrid', 'players'),
            time: getTranslation('colorgrid', 'time'),
            difficulty: getTranslation('colorgrid', 'difficulty'),
            description: getTranslation('colorgrid', 'description'),
            features: getTranslation('colorgrid', 'features'),
            instructions: getTranslation('colorgrid', 'instructions')
        },
        {
            id: "nonhomai",
            displayName: getTranslation('nonhomai', 'title'),
            catchphrase: getTranslation('nonhomai', 'catchphrase'),
            image: "impostor.png", // Reusing impostor icon for now as requested/style
            players: getTranslation('nonhomai', 'players'),
            time: getTranslation('nonhomai', 'time'),
            difficulty: getTranslation('nonhomai', 'difficulty'),
            description: getTranslation('nonhomai', 'description'),
            features: getTranslation('nonhomai', 'features'),
            instructions: getTranslation('nonhomai', 'instructions')
        },
        {
            id: "tictactopics",
            displayName: getTranslation('tictactopics', 'title'),
            catchphrase: getTranslation('tictactopics', 'catchphrase'),
            image: "tictactopics.png",
            players: getTranslation('tictactopics', 'players'),
            time: getTranslation('tictactopics', 'time'),
            difficulty: getTranslation('tictactopics', 'difficulty'),
            description: getTranslation('tictactopics', 'description'),
            features: getTranslation('tictactopics', 'features'),
            instructions: getTranslation('tictactopics', 'instructions')
        }
    ];

    // Store games globally for overlay access
    window.gamesData = games;

    // Folder name mapping for case sensitivity issues
    const folderNameMap = {
        'bluffme': 'BluffMe',
        'indovinaChi': 'indovinaChi'
    };
    window.folderNameMap = folderNameMap;

    // Select the container element
    const gamesContainer = document.getElementById('gamesContainer');

    // Function to capitalize first letter and handle formatting
    const formatGameName = (name) => {
        // Convert camelCase or snake_case to space-separated words
        const formatted = name
            .replace(/([A-Z])/g, ' $1') // Handle camelCase
            .replace(/_/g, ' '); // Handle snake_case

        // Capitalize the first letter of each word
        return formatted
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Gradient classes for variety
    const gradientClasses = [
        'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4',
        'gradient-5', 'gradient-6', 'gradient-7', 'gradient-8'
    ];

    // Add CSS for icon styling
    const style = document.createElement('style');
    style.textContent = `
        /* New Vertical Card Layout */
        .game-card {
            display: flex;
            flex-direction: column;
            align-items: center; /* Center content horizontally */
            padding: 0.8rem; /* Slightly reduced padding */
            position: relative;
            overflow: hidden;
            min-height: 270px; /* Further reduced height */
            
            /* Custom Border Style: Purple - Black - Purple */
            border: 3px solid #000000;
            box-shadow: 0 0 0 4px #7b68ee, inset 0 0 0 4px #7b68ee;
            border-radius: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        /* Adjust hover effect */
        .game-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 0 0 4px #7b68ee, inset 0 0 0 4px #7b68ee, 0 10px 20px rgba(0,0,0,0.5);
        }
        
        /* Content container */
        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            z-index: 2;
        }

        /* Title Style - Centered and Clean */
        .game-card h3 {
            margin-bottom: 2px;
            align-self: center; /* Center */
            text-align: center;
            font-size: 1.3rem;
            margin-top: 2px;
            color: white;
            text-shadow: 2px 2px 0px #000; /* Shadow for legibility */
            text-transform: uppercase;
            letter-spacing: 1px;
            /* No background or border */
        }
        
        /* Catchphrase Style */
        .game-catchphrase {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.85);
            text-align: center;
            margin-bottom: 5px;
            font-style: italic;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            padding: 0 8px;
            line-height: 1.2;
            max-width: 100%;
        }
        
        /* Image Container */
        .game-icon-container {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin: 0;
            z-index: 1;
        }
        
        .game-icon {
            width: auto;
            height: 170px; /* Kept large */
            max-width: 100%;
            object-fit: contain;
            filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.4));
            transition: transform 0.3s ease;
        }
        
        .game-card:hover .game-icon {
            transform: scale(1.05) rotate(2deg);
        }
        
        /* Simple Play Button */
        .play-button {
            margin-top: auto;
            background-color: #7b68ee; /* Purple */
            color: white;
            border: 2px solid #000;
            padding: 8px 0;
            width: 90%;
            border-radius: 10px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 2px 2px 0px rgba(0,0,0,0.5);
            transition: all 0.2s ease;
            text-transform: uppercase;
        }

        .play-button:hover {
            background-color: #9385ff;
            transform: translateY(-2px);
            box-shadow: 2px 4px 0px rgba(0,0,0,0.5);
        }
        
        .play-button:active {
            transform: translateY(1px);
            box-shadow: 1px 1px 0px rgba(0,0,0,0.5);
        }
        
        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .game-card {
                min-height: 300px; /* Significant reduction for mobile */
            }
            .game-card h3 {
                font-size: 1.1rem;
                padding: 0;
            }
            .game-catchphrase {
                font-size: 0.7rem;
            }
            .game-icon {
                height: 200px; /* Big on mobile */
                width: auto;
                max-width: 95%;
            }
        }
    `;
    document.head.appendChild(style);

    // Create and append game cards
    games.forEach((game, index) => {
        // Create card element
        const card = document.createElement('div');
        card.className = `game-card ${gradientClasses[index % gradientClasses.length]}`;

        // Create title
        const title = document.createElement('h3');
        title.textContent = game.displayName || formatGameName(game.id);

        // Create icon container and update to use GAME SPECIFIC PROPERTY
        const iconContainer = document.createElement('div');
        iconContainer.className = 'game-icon-container';

        const img = document.createElement('img');
        // Use path relative to 'icone per giochi' folder
        img.src = `icone%20per%20giochi/${game.image}`;
        img.alt = `${game.displayName} Icon`;
        img.className = 'game-icon';

        // Add fallback only if needed to avoid broken images during setup
        img.onerror = function () {
            this.src = 'icone%20per%20giochi/chainReaction.png';
            console.log('Image not found for', game.id, 'using placeholder');
        };

        iconContainer.appendChild(img);

        // Create play button
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.textContent = getTranslation('play');

        // Add event listener to open game info overlay instead of navigating directly
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openGameInfo(game);
        });

        // Create catchphrase element
        const catchphrase = document.createElement('p');
        catchphrase.className = 'game-catchphrase';
        catchphrase.textContent = game.catchphrase || '';

        // Append elements to card in order: Title -> Catchphrase -> Image -> Button
        card.appendChild(title);
        card.appendChild(catchphrase);
        card.appendChild(iconContainer);
        card.appendChild(playButton);

        // Append card to container
        gamesContainer.appendChild(card);
    });

    // Add "Coming Soon" card
    const comingSoonCard = document.createElement('div');
    comingSoonCard.className = 'game-card coming-soon-card';
    comingSoonCard.style.cursor = 'default'; // Not clickable

    // Title
    const comingSoonTitle = document.createElement('h3');
    comingSoonTitle.textContent = getTranslation('comingSoon');
    comingSoonTitle.style.backgroundColor = 'rgba(0,0,0,0.5)'; // Darker title for disabled feel

    // Icon Container with PNG
    const comingSoonIconContainer = document.createElement('div');
    comingSoonIconContainer.className = 'game-icon-container';

    const comingSoonImg = document.createElement('img');
    comingSoonImg.src = 'icone%20per%20giochi/comingsoon.png';
    comingSoonImg.alt = 'Coming Soon Icon';
    comingSoonImg.className = 'game-icon';
    comingSoonImg.style.opacity = '0.3';
    comingSoonImg.style.filter = 'grayscale(100%)';

    comingSoonIconContainer.appendChild(comingSoonImg);

    // Placeholder dots
    const comingSoonText = document.createElement('div');
    comingSoonText.textContent = '...';
    comingSoonText.style.fontSize = '2rem';
    comingSoonText.style.color = 'white';
    comingSoonText.style.marginTop = 'auto';

    comingSoonCard.appendChild(comingSoonTitle);
    comingSoonCard.appendChild(comingSoonIconContainer);
    comingSoonCard.appendChild(comingSoonText);

    gamesContainer.appendChild(comingSoonCard);

    // Add CSS for Italian only text
    const styleElement = document.querySelector('style');
    styleElement.textContent += `
        .game-icon-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            z-index: 1;
            position: relative;
        }
        
        .italian-only-text {
            font-size: 11px;
            color: white;
            text-align: center;
            font-weight: 600;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
            transition: all 0.3s ease;
            padding: 3px 8px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            letter-spacing: 0.5px;
        }
        
        .game-card:hover .italian-only-text {
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
            background-color: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
        
        @media (max-width: 480px) {
            .game-icon {
                width: 90px;
                height: 90px;
                margin-bottom: 6px;
            }
            
            .italian-only-text {
                font-size: 9px;
                padding: 2px 6px;
            }
        }
    `;

    // Update navigation text based on language
    document.addEventListener('DOMContentLoaded', function () {
        // Navigation will be updated when translations are applied
        if (typeof applyTranslations === 'function') {
            const originalApply = applyTranslations;
            applyTranslations = function () {
                originalApply();
                updateNavigationText();
            };
        }

        function updateNavigationText() {
            if (typeof getTranslation === 'function') {
                document.getElementById('nav-home').textContent = getTranslation('navHome') || 'Home';
                document.getElementById('nav-games').textContent = getTranslation('navGames') || 'Games';
                document.getElementById('nav-about').textContent = getTranslation('navAbout') || 'About Us';
                document.getElementById('legal-header').textContent = getTranslation('navLegalHeader') || 'Legal';
                document.getElementById('nav-privacy').textContent = getTranslation('navPrivacy') || 'Privacy Policy';
                document.getElementById('nav-terms').textContent = getTranslation('navTerms') || 'Terms of Service';
                document.getElementById('nav-cookies').textContent = getTranslation('navCookies') || 'Cookie Policy';
            }
        }
    });
});

// ============================================
// GAME INFO OVERLAY FUNCTIONS
// ============================================

// Current game being displayed
let currentGameData = null;

// Open the game info overlay
function openGameInfo(game) {
    currentGameData = game;
    const overlay = document.getElementById('gameInfoOverlay');
    if (!overlay) return;

    // Update overlay content
    updateGameInfoContent(game);

    // Show overlay with animation
    overlay.classList.add('active');

    // Prevent body scroll
    document.body.classList.add('overlay-open');

    // Store scroll position for iOS
    window.overlayScrollY = window.scrollY;
}

// Close the game info overlay
function closeGameInfo() {
    const overlay = document.getElementById('gameInfoOverlay');
    if (!overlay) return;

    // Hide overlay
    overlay.classList.remove('active');

    // Restore body scroll
    document.body.classList.remove('overlay-open');

    // Restore scroll position for iOS
    if (window.overlayScrollY !== undefined) {
        window.scrollTo(0, window.overlayScrollY);
    }

    currentGameData = null;
}

// Update the overlay content with game data
function updateGameInfoContent(game) {
    // Update icon
    const iconEl = document.getElementById('gameInfoIcon');
    if (iconEl) {
        iconEl.src = `icone%20per%20giochi/${game.image}`;
        iconEl.alt = `${game.displayName} Icon`;
    }

    // Update title and catchphrase
    const titleEl = document.getElementById('gameInfoTitle');
    if (titleEl) titleEl.textContent = game.displayName;

    const catchphraseEl = document.getElementById('gameInfoCatchphrase');
    if (catchphraseEl) catchphraseEl.textContent = game.catchphrase;

    // Update players
    const playersEl = document.getElementById('gameInfoPlayersText');
    if (playersEl) playersEl.textContent = game.players || '2-10 giocatori';

    // Update time
    const timeEl = document.getElementById('gameInfoTime');
    if (timeEl) timeEl.textContent = game.time || '10-15 min';

    // Update difficulty
    const difficultyEl = document.getElementById('gameInfoDifficulty');
    if (difficultyEl) difficultyEl.textContent = game.difficulty || 'Principiante';

    // Update description
    const descEl = document.getElementById('gameInfoDesc');
    if (descEl) descEl.textContent = game.description || '';

    // Update instructions
    const instructionsEl = document.getElementById('gameInfoInstructions');
    if (instructionsEl && Array.isArray(game.instructions)) {
        instructionsEl.innerHTML = '';
        game.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsEl.appendChild(li);
        });
    }

    // Update features
    const featuresEl = document.getElementById('gameInfoFeatures');
    if (featuresEl && Array.isArray(game.features)) {
        featuresEl.innerHTML = '';
        game.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresEl.appendChild(li);
        });
    }

    // Update labels based on language
    const descLabel = document.getElementById('descriptionLabel');
    if (descLabel) descLabel.textContent = getUserLanguage() === 'it' ? 'Descrizione' : 'Description';

    const instrLabel = document.getElementById('instructionsLabel');
    if (instrLabel) instrLabel.textContent = getTranslation('howToPlay') || 'Come Giocare';

    const featLabel = document.getElementById('featuresLabel');
    if (featLabel) featLabel.textContent = getTranslation('features') || 'Caratteristiche';

    const backBtn = document.getElementById('backBtnText');
    if (backBtn) backBtn.textContent = getUserLanguage() === 'it' ? 'Indietro' : 'Back';

    const playBtn = document.getElementById('playBtnText');
    if (playBtn) playBtn.textContent = getUserLanguage() === 'it' ? 'Gioca' : 'Play';

    // Setup play button to navigate to game
    const playBtnEl = document.getElementById('gameInfoPlayBtn');
    if (playBtnEl) {
        // Remove old listeners by cloning
        const newPlayBtn = playBtnEl.cloneNode(true);
        playBtnEl.parentNode.replaceChild(newPlayBtn, playBtnEl);

        newPlayBtn.addEventListener('click', () => {
            const folderName = window.folderNameMap[game.id] || game.id;
            window.location.href = `${folderName}/index.html`;
        });
    }
}

// Close overlay when pressing Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('gameInfoOverlay');
        if (overlay && overlay.classList.contains('active')) {
            closeGameInfo();
        }
    }
});

// Handle back button on mobile (for PWA)
window.addEventListener('popstate', function (e) {
    const overlay = document.getElementById('gameInfoOverlay');
    if (overlay && overlay.classList.contains('active')) {
        e.preventDefault();
        closeGameInfo();
    }
});