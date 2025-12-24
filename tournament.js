// Update available games list excluding TicTacTopics
const availableGames = {
    'impostor': { minPlayers: 3, maxPlayers: 10, url: 'impostor/index.html' },
    'colorgrid': { minPlayers: 2, maxPlayers: 8, url: 'colorgrid/index.html' },
    'guessthepic': { minPlayers: 2, maxPlayers: 8, url: 'guessthepic/index.html' },
    'timergame': { minPlayers: 2, maxPlayers: 10, url: 'timergame/index.html' },
    'chainreaction': { minPlayers: 3, maxPlayers: 12, url: 'chainreaction/index.html', specialRule: 'playersMultipleOf3' },
    'alphabetgame': { minPlayers: 2, maxPlayers: 8, url: 'alphabetgame/index.html' },
    'bluffme': { minPlayers: 3, maxPlayers: 8, url: 'bluffme/index.html' },
    'quizzy': { minPlayers: 2, maxPlayers: 8, url: 'quizzy/index.html' }
};

function startTournament() {
    const numPlayers = parseInt(document.getElementById('playerCount').value);
    const numGames = parseInt(document.getElementById('gameCount').value);

    tournament = {
        players: [],
        scores: {},
        currentGame: 1,
        totalGames: numGames,  // Store the total games properly
        gameHistory: []
    };

    // ...existing code...
}

function selectRandomGame() {
    const numPlayers = tournament.players.length;

    // Filter games based on player count and special rules
    const validGames = Object.entries(availableGames).filter(([game, config]) => {
        if (game === 'chainreaction') {
            // Chain Reaction special rule: only for 3 or 6 players
            return (numPlayers === 3 || numPlayers === 6) &&
                numPlayers >= config.minPlayers &&
                numPlayers <= config.maxPlayers;
        }
        return numPlayers >= config.minPlayers && numPlayers <= config.maxPlayers;
    });

    if (validGames.length === 0) {
        alert('No valid games available for current player count!');
        return null;
    }

    // Select random game from valid games
    const randomIndex = Math.floor(Math.random() * validGames.length);
    return validGames[randomIndex][0]; // Return game ID
}

function updateGameDisplay() {
    const gameTitle = document.getElementById('currentGameTitle');
    if (gameTitle) {
        gameTitle.textContent = `${getTranslation('game')} ${tournament.currentGame} ${getTranslation('of')} ${tournament.totalGames}`;
    }
    // ...existing code...
}

function nextGame() {
    // Ensure we don't lose totalGames when advancing
    tournament.currentGame++;

    if (tournament.currentGame > tournament.totalGames) {
        showFinalResults();
        return;
    }

    updateGameDisplay();
    selectRandomGame();
}

// ...existing code...