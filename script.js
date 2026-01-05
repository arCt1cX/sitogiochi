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
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "impostor",
            displayName: getTranslation('impostor', 'title'),
            catchphrase: getTranslation('impostor', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "mrdrew",
            displayName: getTranslation('mrdrew', 'title'),
            catchphrase: getTranslation('mrdrew', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "hottakes",
            displayName: getTranslation('hottakes', 'title'),
            catchphrase: getTranslation('hottakes', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "quizzy",
            displayName: getTranslation('quizzy', 'title'),
            catchphrase: getTranslation('quizzy', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "guessthepic",
            displayName: getTranslation('guessthepic', 'title'),
            catchphrase: getTranslation('guessthepic', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
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
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "alphabetgame",
            displayName: getTranslation('alphabetgame', 'title'),
            catchphrase: getTranslation('alphabetgame', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "colorgrid",
            displayName: getTranslation('colorgrid', 'title'),
            catchphrase: getTranslation('colorgrid', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "timergame",
            displayName: getTranslation('timergame', 'title'),
            catchphrase: getTranslation('timergame', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
        },
        {
            id: "tictactopics",
            displayName: getTranslation('tictactopics', 'title'),
            catchphrase: getTranslation('tictactopics', 'catchphrase'),
            image: "chainReaction.png" // CAMBIA QUI
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
            padding: 1rem;
            position: relative;
            overflow: hidden;
            min-height: 290px; /* Reduced specific height for more compact look */
            
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

        /* Title Style - Left Aligned */
        .game-card h3 {
            margin-bottom: 0.5rem;
            align-self: flex-start; /* Align to left */
            margin-left: 5px;
            font-size: 1.2rem;
            margin-top: 5px;
            /* Button styling look background */
            background-color: rgba(0, 0, 0, 0.4); 
            color: white;
            padding: 5px 15px;
            border-radius: 12px;
            border: 2px solid #000;
            box-shadow: 2px 2px 0px rgba(0,0,0,0.5);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            width: fit-content;
            backdrop-filter: blur(2px);
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
                min-height: 330px; /* Reduced for trimmed images */
            }
            .game-card h3 {
                font-size: 1.1rem;
                padding: 4px 12px;
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
        img.src = game.image; // Use the property from the object
        img.alt = `${game.displayName} Icon`;
        img.className = 'game-icon';

        // Add fallback only if needed to avoid broken images during setup
        img.onerror = function () {
            this.src = 'chainReaction.png';
            console.log('Image not found for', game.id, 'using placeholder');
        };

        iconContainer.appendChild(img);

        // Create play button
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.textContent = getTranslation('play');

        // Folder name mapping for case sensitivity issues
        const folderNameMap = {
            'bluffme': 'BluffMe',
        };

        // Add specific event listener to the BUTTON only
        playButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Safe practice even if container has no listener
            const folderName = folderNameMap[game.id] || game.id;
            window.location.href = `${folderName}/index.html`;
        });

        // Append elements to card in order: Title -> Image -> Button
        card.appendChild(title);
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
    comingSoonImg.src = 'chainReaction.png';
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