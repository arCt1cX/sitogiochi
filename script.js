document.addEventListener('DOMContentLoaded', () => {
    // Games array with additional catchphrase information
    const games = [
        {
            id: "impostor",
            catchphrase: "Scopri chi mente nel gruppo!"
        },
        {
            id: "colorgrid",
            catchphrase: "Indovina la cella colorata segreta!"
        },
        {
            id: "guessthepic",
            catchphrase: "Indovina cosa mostrano le 5 immagini e accumula più punti!"
        },
        {
            id: "timergame",
            catchphrase: "Corri contro il tempo in questa sfida di parole!"
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
    
    // Create and append game cards
    games.forEach((game, index) => {
        // Create card element
        const card = document.createElement('div');
        card.className = `game-card ${gradientClasses[index % gradientClasses.length]}`;
        
        // Create game title
        const title = document.createElement('h3');
        title.textContent = formatGameName(game.id);
        
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
        
        // Append elements to card
        card.appendChild(title);
        card.appendChild(catchphrase);
        card.appendChild(playButton);
        
        // Append card to container
        gamesContainer.appendChild(card);
    });
    
    // Add "Coming Soon" card
    const comingSoonCard = document.createElement('div');
    comingSoonCard.className = 'game-card coming-soon-card';
    
    const comingSoonTitle = document.createElement('h3');
    comingSoonTitle.textContent = 'Coming Soon';
    
    const comingSoonCatchphrase = document.createElement('p');
    comingSoonCatchphrase.className = 'game-catchphrase';
    comingSoonCatchphrase.textContent = 'Nuovi giochi in arrivo...';
    
    comingSoonCard.appendChild(comingSoonTitle);
    comingSoonCard.appendChild(comingSoonCatchphrase);
    gamesContainer.appendChild(comingSoonCard);
}); 