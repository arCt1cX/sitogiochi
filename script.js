document.addEventListener('DOMContentLoaded', () => {
    // Games array with additional catchphrase information and display names
    const games = [
        {
            id: "impostor",
            displayName: "Impostor",
            catchphrase: "Scopri chi mente nel gruppo!",
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <circle cx="40" cy="30" r="15" fill="rgba(255,255,255,0.2)" />
                <path d="M25,65 C25,50 30,45 40,45 C50,45 55,50 55,65" stroke-linecap="round" />
                <text x="40" y="32" font-size="24" fill="white" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">?</text>
                <circle cx="60" cy="20" r="10" fill="rgba(255,255,255,0.15)" stroke="none" />
                <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.1)" stroke="none" />
            </svg>`
        },
        {
            id: "colorgrid",
            displayName: "Color Grid",
            catchphrase: "Indovina la cella colorata segreta!",
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <rect x="15" y="15" width="50" height="50" rx="4" stroke-width="1.5" />
                <rect x="15" y="15" width="16.6" height="16.6" fill="rgba(255,0,0,0.6)" stroke="white" />
                <rect x="31.6" y="15" width="16.6" height="16.6" fill="rgba(0,255,0,0.6)" stroke="white" />
                <rect x="48.2" y="15" width="16.6" height="16.6" fill="rgba(255,255,0,0.6)" stroke="white" />
                <rect x="15" y="31.6" width="16.6" height="16.6" fill="rgba(0,0,255,0.6)" stroke="white" />
                <rect x="31.6" y="31.6" width="16.6" height="16.6" fill="rgba(255,0,255,0.6)" stroke="white" stroke-width="3" />
                <rect x="48.2" y="31.6" width="16.6" height="16.6" fill="rgba(0,255,255,0.6)" stroke="white" />
                <rect x="15" y="48.2" width="16.6" height="16.6" fill="rgba(255,165,0,0.6)" stroke="white" />
                <rect x="31.6" y="48.2" width="16.6" height="16.6" fill="rgba(128,0,128,0.6)" stroke="white" />
                <rect x="48.2" y="48.2" width="16.6" height="16.6" fill="rgba(0,128,0,0.6)" stroke="white" />
            </svg>`
        },
        {
            id: "guessthepic",
            displayName: "Indovina Immagini",
            catchphrase: "Indovina cosa mostrano le 5 immagini e accumula più punti!",
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <rect x="15" y="15" width="50" height="40" rx="2" fill="rgba(255,255,255,0.15)" />
                <path d="M25,45 L35,35 L45,45" stroke-linecap="round" />
                <circle cx="30" cy="25" r="4" fill="rgba(255,255,255,0.4)" />
                <path d="M55,35 L45,25" stroke="rgba(255,255,255,0.5)" stroke-dasharray="2" />
                <path d="M65,46 L59,42 L54,47 L50,52 L54,58 L59,60 L65,58 L69,52 L65,46z" fill="rgba(255,255,255,0.3)" />
                <circle cx="57" cy="50" r="8" stroke="white" fill="none" />
                <line x1="63" y1="56" x2="68" y2="61" stroke-width="3" stroke-linecap="round" />
            </svg>`
        },
        {
            id: "timergame",
            displayName: "Wordrace",
            catchphrase: "Corri contro il tempo in questa sfida di parole!",
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <circle cx="40" cy="40" r="25" fill="rgba(255,255,255,0.1)" />
                <circle cx="40" cy="40" r="23" stroke-width="1" />
                <line x1="40" y1="40" x2="40" y2="25" stroke-width="2.5" stroke-linecap="round" />
                <line x1="40" y1="40" x2="50" y2="50" stroke-width="2" stroke-linecap="round" />
                <line x1="40" y1="15" x2="40" y2="20" stroke-width="2" stroke-linecap="round" />
                <line x1="40" y1="60" x2="40" y2="65" stroke-width="2" stroke-linecap="round" />
                <line x1="15" y1="40" x2="20" y2="40" stroke-width="2" stroke-linecap="round" />
                <line x1="60" y1="40" x2="65" y2="40" stroke-width="2" stroke-linecap="round" />
                <path d="M60,25 L65,20" transform="rotate(15, 40, 40)" fill="none" stroke-width="2" stroke-linecap="round" />
                <path d="M20,25 L15,20" transform="rotate(-15, 40, 40)" fill="none" stroke-width="2" stroke-linecap="round" />
                <path d="M65,35 L70,30 M15,50 L10,55" fill="none" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
            </svg>`
        },
        {
            id: "alphabetgame",
            displayName: "Alphabet Game",
            catchphrase: "Trova parole per ogni lettera dell'alfabeto in base alla categoria!",
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <rect x="15" y="15" width="15" height="15" rx="2" fill="rgba(255,255,255,0.2)" />
                <text x="22.5" y="27" font-size="14" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">A</text>
                <rect x="32.5" y="15" width="15" height="15" rx="2" fill="rgba(255,255,255,0.25)" />
                <text x="40" y="27" font-size="14" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">B</text>
                <rect x="50" y="15" width="15" height="15" rx="2" fill="rgba(255,255,255,0.3)" />
                <text x="57.5" y="27" font-size="14" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">C</text>
                <rect x="15" y="32.5" width="15" height="15" rx="2" fill="rgba(255,255,255,0.35)" />
                <text x="22.5" y="44.5" font-size="14" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">X</text>
                <rect x="32.5" y="32.5" width="15" height="15" rx="2" fill="rgba(255,255,255,0.4)" />
                <text x="40" y="44.5" font-size="14" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">Y</text>
                <rect x="50" y="32.5" width="15" height="15" rx="2" fill="rgba(255,255,255,0.45)" />
                <text x="57.5" y="44.5" font-size="14" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">Z</text>
                <path d="M25,65 L55,65" stroke-linecap="round" stroke-width="3" stroke-dasharray="2 4" />
            </svg>`
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
        /* Create a flexbox layout for content and icon */
        .game-card {
            display: flex;
            flex-direction: row;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }
        
        /* Content container for title, catchphrase and button */
        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-right: 15px;
            z-index: 2;
        }
        
        /* Icon container styles */
        .game-icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            z-index: 1;
            position: relative;
        }
        
        .game-icon {
            width: 110px;
            height: 110px;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
            transition: transform 0.3s ease, filter 0.3s ease;
        }
        
        .game-card:hover .game-icon {
            transform: scale(1.1);
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
        }
        
        /* Adjust title margins */
        .game-card h3 {
            margin-bottom: 0.5rem;
        }
        
        /* Special case for coming soon card */
        .coming-soon-card {
            justify-content: center;
            align-items: center;
        }
        
        .coming-soon-card .card-content {
            text-align: center;
            margin-right: 0;
        }
        
        .coming-soon-card .game-icon-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.2;
        }
        
        .coming-soon-card .game-icon {
            width: 150px;
            height: 150px;
        }
        
        /* Make sure the play button stays at the bottom */
        .play-button {
            margin-top: 1rem;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .game-icon {
                width: 90px;
                height: 90px;
            }
            
            .card-content {
                margin-right: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create and append game cards
    games.forEach((game, index) => {
        // Create card element
        const card = document.createElement('div');
        card.className = `game-card ${gradientClasses[index % gradientClasses.length]}`;
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'card-content';
        
        // Create game title using the display name if available, otherwise format the ID
        const title = document.createElement('h3');
        title.textContent = game.displayName || formatGameName(game.id);
        
        // Create catchphrase
        const catchphrase = document.createElement('p');
        catchphrase.className = 'game-catchphrase';
        catchphrase.textContent = game.catchphrase;
        
        // Create play button as a button element
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.textContent = 'Gioca';
        
        // Add click event for navigation
        playButton.addEventListener('click', () => {
            window.location.href = `${game.id}/index.html`;
        });
        
        // Add title, catchphrase and button to content container
        contentContainer.appendChild(title);
        contentContainer.appendChild(catchphrase);
        contentContainer.appendChild(playButton);
        
        // Create icon container and add SVG
        const iconContainer = document.createElement('div');
        iconContainer.className = 'game-icon-container';
        iconContainer.innerHTML = game.iconSvg;
        const iconElement = iconContainer.querySelector('svg');
        iconElement.classList.add('game-icon');
        
        // Append content and icon containers to card
        card.appendChild(contentContainer);
        card.appendChild(iconContainer);
        
        // Append card to container
        gamesContainer.appendChild(card);
    });
    
    // Add "Coming Soon" card
    const comingSoonCard = document.createElement('div');
    comingSoonCard.className = 'game-card coming-soon-card';
    
    // Create content container
    const comingSoonContentContainer = document.createElement('div');
    comingSoonContentContainer.className = 'card-content';
    
    const comingSoonTitle = document.createElement('h3');
    comingSoonTitle.textContent = 'Coming Soon';
    
    const comingSoonCatchphrase = document.createElement('p');
    comingSoonCatchphrase.className = 'game-catchphrase';
    comingSoonCatchphrase.textContent = 'Nuovi giochi in arrivo...';
    
    // Create icon for Coming Soon card
    const comingSoonIconContainer = document.createElement('div');
    comingSoonIconContainer.className = 'game-icon-container';
    comingSoonIconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2" class="game-icon">
            <circle cx="40" cy="40" r="25" fill="rgba(255,255,255,0.1)" />
            <rect x="30" y="30" width="20" height="20" rx="2" fill="none" stroke-dasharray="4 2" />
            <path d="M35,65 L45,65 M40,65 L40,55" stroke-linecap="round" />
            <path d="M35,15 L45,15 M40,15 L40,25" stroke-linecap="round" />
            <path d="M15,35 L15,45 M15,40 L25,40" stroke-linecap="round" />
            <path d="M65,35 L65,45 M65,40 L55,40" stroke-linecap="round" />
            <path d="M40,40 L40,40" stroke-width="3" stroke-linecap="round">
                <animate attributeName="d" values="M35,35 L45,45; M35,45 L45,35; M35,35 L45,45" dur="2s" repeatCount="indefinite" />
            </path>
        </svg>
    `;
    
    // Add elements to containers
    comingSoonContentContainer.appendChild(comingSoonTitle);
    comingSoonContentContainer.appendChild(comingSoonCatchphrase);
    
    comingSoonCard.appendChild(comingSoonContentContainer);
    comingSoonCard.appendChild(comingSoonIconContainer);
    gamesContainer.appendChild(comingSoonCard);
}); 