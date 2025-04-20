document.addEventListener('DOMContentLoaded', () => {
    // Array of game directories
    const games = [
        "impostor", 
        "colorgrid", 
        "guessthepic", 
        "timergame"
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
        title.textContent = formatGameName(game);
        
        // Create play link with explicit path to index.html
        const playLink = document.createElement('a');
        playLink.className = 'play-button';
        playLink.textContent = 'Gioca';
        playLink.href = game + '/index.html';  // Explicit path to index.html
        
        // Append elements to card
        card.appendChild(title);
        card.appendChild(playLink);
        
        // Append card to container
        gamesContainer.appendChild(card);
    });
    
    // Add "Coming Soon" card
    const comingSoonCard = document.createElement('div');
    comingSoonCard.className = 'game-card coming-soon-card';
    
    const comingSoonTitle = document.createElement('h3');
    comingSoonTitle.textContent = 'Coming Soon';
    
    comingSoonCard.appendChild(comingSoonTitle);
    gamesContainer.appendChild(comingSoonCard);
}); 