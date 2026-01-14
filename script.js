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
            image: "picolo.png" // CAMBIA QUI
        },
        {
            id: "impostor",
            displayName: getTranslation('impostor', 'title'),
            catchphrase: getTranslation('impostor', 'catchphrase'),
            image: "impostor.png" // CAMBIA QUI
        },
        {
            id: "mrdrew",
            displayName: getTranslation('mrdrew', 'title'),
            catchphrase: getTranslation('mrdrew', 'catchphrase'),
            image: "mrdrew.png" // CAMBIA QUI
        },
        {
            id: "hottakes",
            displayName: getTranslation('hottakes', 'title'),
            catchphrase: getTranslation('hottakes', 'catchphrase'),
            image: "hottakes.png" // CAMBIA QUI
        },
        {
            id: "indovinaChi",
            displayName: getTranslation('indovinachi', 'title'),
            catchphrase: getTranslation('indovinachi', 'catchphrase'),
            image: "indovinachi.png" // CAMBIA QUI
        },
        {
            id: "quizzy",
            displayName: getTranslation('quizzy', 'title'),
            catchphrase: getTranslation('quizzy', 'catchphrase'),
            image: "quizzy.png" // CAMBIA QUI
        },
        {
            id: "guessthepic",
            displayName: getTranslation('guessthepic', 'title'),
            catchphrase: getTranslation('guessthepic', 'catchphrase'),
            image: "guessrush.png" // CAMBIA QUI
        },
        {
            id: "chainreaction",
            displayName: getTranslation('chainreaction', 'title'),
            catchphrase: getTranslation('chainreaction', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "bluffme",
            displayName: getTranslation('bluffme', 'title'),
            catchphrase: getTranslation('bluffme', 'catchphrase'),
            image: "bluffme.png" // CAMBIA QUI
        },
        {
            id: "alphabetgame",
            displayName: getTranslation('alphabetgame', 'title'),
            catchphrase: getTranslation('alphabetgame', 'catchphrase'),
            image: "alphabet.png" // CAMBIA QUI
        },
        {
            id: "timergame",
            displayName: getTranslation('timergame', 'title'),
            catchphrase: getTranslation('timergame', 'catchphrase'),
            image: "wordrace.png" // CAMBIA QUI
        },
        {
            id: "colorgrid",
            displayName: getTranslation('colorgrid', 'title'),
            catchphrase: getTranslation('colorgrid', 'catchphrase'),
            image: "colorgrid.png" // CAMBIA QUI
        },
        {
            id: "tictactopics",
            displayName: getTranslation('tictactopics', 'title'),
            catchphrase: getTranslation('tictactopics', 'catchphrase'),
            image: "tictactopics.png" // CAMBIA QUI
        }
    ];

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
        
        /* ============================================ */
        /* Game Info Overlay Styles */
        /* ============================================ */
        .game-info-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.4s ease, visibility 0.4s ease;
            overflow-y: auto;
        }
        
        .game-info-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .game-info-overlay.animating {
            animation: overlayExpand 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .game-info-overlay.closing {
            animation: overlayCollapse 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes overlayExpand {
            0% {
                clip-path: circle(0% at var(--origin-x, 50%) var(--origin-y, 50%));
                opacity: 0;
            }
            100% {
                clip-path: circle(150% at var(--origin-x, 50%) var(--origin-y, 50%));
                opacity: 1;
            }
        }
        
        @keyframes overlayCollapse {
            0% {
                clip-path: circle(150% at var(--origin-x, 50%) var(--origin-y, 50%));
                opacity: 1;
            }
            100% {
                clip-path: circle(0% at var(--origin-x, 50%) var(--origin-y, 50%));
                opacity: 0;
            }
        }
        
        .overlay-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 1.5rem 2rem;
            background: linear-gradient(180deg, rgba(123, 104, 238, 0.3) 0%, transparent 100%);
        }
        
        .overlay-title-section {
            flex: 1;
        }
        
        .overlay-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
            margin: 0 0 0.5rem 0;
            background: linear-gradient(90deg, #8a7ced, #614dc2);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .overlay-catchphrase {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.8);
            font-style: italic;
            margin: 0;
        }
        
        .overlay-players-badge {
            background: linear-gradient(135deg, #7b68ee 0%, #6a5acd 100%);
            padding: 0.8rem 1.2rem;
            border-radius: 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 15px rgba(123, 104, 238, 0.4);
            text-align: center;
            min-width: 120px;
        }
        
        .players-label {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 1px;
            display: block;
            margin-bottom: 0.3rem;
        }
        
        .players-count {
            font-size: 1.3rem;
            font-weight: 700;
            color: white;
            display: block;
        }
        
        .overlay-content {
            flex: 1;
            padding: 1.5rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .overlay-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #d1c7ff;
            margin: 0 0 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .section-title::before {
            content: '🎮';
        }
        
        .instructions-list {
            list-style: none;
            padding: 0;
            margin: 0;
            counter-reset: instructions;
        }
        
        .instructions-list li {
            position: relative;
            padding-left: 2.5rem;
            margin-bottom: 1rem;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1rem;
            counter-increment: instructions;
        }
        
        .instructions-list li::before {
            content: counter(instructions);
            position: absolute;
            left: 0;
            top: 0;
            width: 1.8rem;
            height: 1.8rem;
            background: linear-gradient(135deg, #7b68ee 0%, #6a5acd 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.85rem;
            color: white;
        }
        
        .instructions-list li:last-child {
            margin-bottom: 0;
        }
        
        .overlay-buttons {
            display: flex;
            gap: 1rem;
            padding: 1.5rem 2rem 2rem;
            justify-content: center;
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
        }
        
        .overlay-btn {
            padding: 1rem 2.5rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: none;
            min-width: 150px;
        }
        
        .overlay-btn-play {
            background: linear-gradient(135deg, #7b68ee 0%, #6a5acd 100%);
            color: white;
            box-shadow: 0 4px 20px rgba(123, 104, 238, 0.5);
        }
        
        .overlay-btn-play:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 30px rgba(123, 104, 238, 0.7);
            background: linear-gradient(135deg, #8a7ced 0%, #7b68ee 100%);
        }
        
        .overlay-btn-back {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .overlay-btn-back:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-3px);
        }
        
        /* Mobile responsiveness for overlay */
        @media (max-width: 768px) {
            .overlay-header {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem 1.5rem;
            }
            
            .overlay-title {
                font-size: 1.8rem;
            }
            
            .overlay-catchphrase {
                font-size: 0.95rem;
            }
            
            .overlay-players-badge {
                align-self: flex-start;
            }
            
            .overlay-content {
                padding: 1rem 1.5rem;
            }
            
            .overlay-section {
                padding: 1rem;
            }
            
            .section-title {
                font-size: 1.1rem;
            }
            
            .instructions-list li {
                font-size: 0.9rem;
                padding-left: 2rem;
            }
            
            .instructions-list li::before {
                width: 1.5rem;
                height: 1.5rem;
                font-size: 0.75rem;
            }
            
            .overlay-buttons {
                flex-direction: column;
                padding: 1rem 1.5rem 1.5rem;
            }
            
            .overlay-btn {
                width: 100%;
                padding: 1rem;
            }
        }
        
        @media (max-width: 480px) {
            .overlay-title {
                font-size: 1.5rem;
            }
            
            .overlay-catchphrase {
                font-size: 0.85rem;
            }
        }
    `;
    document.head.appendChild(style);

    // Folder name mapping for case sensitivity issues
    const folderNameMap = {
        'bluffme': 'BluffMe',
    };

    // Create the overlay element (once, reused for all games)
    const overlay = document.createElement('div');
    overlay.className = 'game-info-overlay';
    overlay.id = 'gameInfoOverlay';
    document.body.appendChild(overlay);

    // Function to open game info overlay
    function openGameInfoOverlay(game, buttonElement) {
        // Get button position for animation origin
        const rect = buttonElement.getBoundingClientRect();
        const originX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const originY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

        // Set CSS custom properties for animation origin
        overlay.style.setProperty('--origin-x', `${originX}%`);
        overlay.style.setProperty('--origin-y', `${originY}%`);

        // Get game info from translations
        const gameId = game.id.toLowerCase();
        const title = game.displayName || getTranslation(gameId, 'title');
        const catchphrase = game.catchphrase || getTranslation(gameId, 'catchphrase');
        const players = getTranslation(gameId, 'players') || '2+ giocatori';
        const instructions = getTranslation(gameId, 'instructions') || [];
        const playersLabel = getTranslation('playersNeeded') || 'Giocatori';
        const howToPlayTitle = getTranslation('howToPlay') || 'Come Giocare';
        const playText = getTranslation('play') || 'Gioca';
        const backText = getTranslation('back') || 'Indietro';

        // Build instructions HTML
        let instructionsHTML = '';
        if (Array.isArray(instructions) && instructions.length > 0) {
            instructionsHTML = instructions.map(instr => `<li>${instr}</li>`).join('');
        } else {
            instructionsHTML = '<li>Segui le istruzioni nel gioco</li>';
        }

        // Build overlay HTML
        overlay.innerHTML = `
            <div class="overlay-header">
                <div class="overlay-title-section">
                    <h1 class="overlay-title">${title}</h1>
                    <p class="overlay-catchphrase">${catchphrase}</p>
                </div>
                <div class="overlay-players-badge">
                    <span class="players-label">${playersLabel}</span>
                    <span class="players-count">${players}</span>
                </div>
            </div>
            <div class="overlay-content">
                <div class="overlay-section">
                    <h2 class="section-title">${howToPlayTitle}</h2>
                    <ol class="instructions-list">
                        ${instructionsHTML}
                    </ol>
                </div>
            </div>
            <div class="overlay-buttons">
                <button class="overlay-btn overlay-btn-back" id="overlayBackBtn">${backText}</button>
                <button class="overlay-btn overlay-btn-play" id="overlayPlayBtn">${playText}</button>
            </div>
        `;

        // Show overlay with animation
        overlay.classList.add('active', 'animating');
        document.body.style.overflow = 'hidden'; // Prevent body scroll

        // Remove animating class after animation completes
        setTimeout(() => {
            overlay.classList.remove('animating');
        }, 500);

        // Get folder name for the game
        const folderName = folderNameMap[game.id] || game.id;

        // Add event listeners for buttons
        document.getElementById('overlayPlayBtn').addEventListener('click', () => {
            window.location.href = `${folderName}/index.html`;
        });

        document.getElementById('overlayBackBtn').addEventListener('click', () => {
            closeGameInfoOverlay();
        });

        // Close on escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeGameInfoOverlay();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Function to close game info overlay
    function closeGameInfoOverlay() {
        overlay.classList.add('closing');
        overlay.classList.remove('active');

        setTimeout(() => {
            overlay.classList.remove('closing');
            overlay.innerHTML = '';
            document.body.style.overflow = ''; // Restore body scroll
        }, 400);
    }

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

        // Add specific event listener to the BUTTON only - now opens overlay
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openGameInfoOverlay(game, playButton);
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