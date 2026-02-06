/**
 * Game Overview Script
 * Adds the game overview screen to individual game pages
 * This script should be loaded before the game's own script
 */

(function () {
    'use strict';

    // Get the game ID from body data attribute
    const gameId = document.body.dataset.gameId;
    if (!gameId) {
        console.warn('game-overview.js: No data-game-id found on body element');
        return;
    }

    // Wait for lang.js to load (provides getTranslation and getUserLanguage)
    function waitForTranslations(callback) {
        if (typeof getTranslation === 'function' && typeof getUserLanguage === 'function') {
            callback();
        } else {
            setTimeout(() => waitForTranslations(callback), 50);
        }
    }

    // Folder name mapping for case sensitivity
    const folderNameMap = {
        'bluffme': 'BluffMe',
        'indovinaChi': 'indovinaChi'
    };

    // Create and inject the overview HTML
    function createOverlay(gameData) {
        const lang = getUserLanguage();
        const isItalian = lang === 'it';

        const overlay = document.createElement('div');
        overlay.id = 'gameInfoOverlay';
        overlay.className = 'game-info-overlay active';

        overlay.innerHTML = `
            <div class="game-info-header">
                <div class="game-info-players" id="gameInfoPlayers">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span id="gameInfoPlayersText">${gameData.players || '2-10 giocatori'}</span>
                </div>
            </div>

            <div class="game-info-content">
                <div class="game-info-title-section">
                    <img id="gameInfoIcon" class="game-info-icon" src="../icone%20per%20giochi/${gameData.image}" alt="${gameData.displayName} Icon">
                    <h2 id="gameInfoTitle" class="game-info-title">${gameData.displayName}</h2>
                    <p id="gameInfoCatchphrase" class="game-info-catchphrase">${gameData.catchphrase || ''}</p>
                </div>

                <div class="game-info-description">
                    <h4><svg class="section-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                        </svg> <span id="descriptionLabel">${isItalian ? 'Descrizione' : 'Description'}</span></h4>
                    <p id="gameInfoDesc">${gameData.description || ''}</p>
                </div>

                <div class="game-info-instructions">
                    <h4><svg class="section-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                        </svg> <span id="instructionsLabel">${isItalian ? 'Come Giocare' : 'How to Play'}</span></h4>
                    <ol id="gameInfoInstructions">
                        ${(gameData.instructions || []).map(instr => `<li>${instr}</li>`).join('')}
                    </ol>
                </div>

                <div class="game-info-features">
                    <h4><svg class="section-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg> <span id="featuresLabel">${isItalian ? 'Caratteristiche' : 'Features'}</span></h4>
                    <ul id="gameInfoFeatures">
                        ${(gameData.features || []).map(feat => `<li>${feat}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="game-info-footer">
                <button class="game-info-btn game-info-btn-back" id="gameOverviewBackBtn">
                    <svg class="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    <span id="backBtnText">${isItalian ? 'Indietro' : 'Back'}</span>
                </button>
                <button class="game-info-btn game-info-btn-play" id="gameOverviewPlayBtn">
                    <span id="playBtnText">${isItalian ? 'Gioca' : 'Play'}</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
            </div>
        `;

        // Insert at the beginning of body
        document.body.insertBefore(overlay, document.body.firstChild);

        // Add body class to prevent scrolling
        document.body.classList.add('overlay-open');

        // Setup button handlers
        document.getElementById('gameOverviewBackBtn').addEventListener('click', function () {
            window.location.href = '../';
        });

        document.getElementById('gameOverviewPlayBtn').addEventListener('click', function () {
            // Hide overlay and show game
            overlay.classList.remove('active');
            document.body.classList.remove('overlay-open');

            // Remove overlay after animation
            setTimeout(() => {
                overlay.remove();
            }, 300);
        });

        // Handle Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                window.location.href = '../';
            }
        });
    }

    // Initialize when DOM is ready
    function init() {
        waitForTranslations(function () {
            // Get game data from translations
            const gameIdLower = gameId.toLowerCase();
            const gameData = {
                displayName: getTranslation(gameIdLower, 'title') || gameId,
                catchphrase: getTranslation(gameIdLower, 'catchphrase') || '',
                players: getTranslation(gameIdLower, 'players') || '',
                time: getTranslation(gameIdLower, 'time') || '',
                difficulty: getTranslation(gameIdLower, 'difficulty') || '',
                description: getTranslation(gameIdLower, 'description') || '',
                features: getTranslation(gameIdLower, 'features') || [],
                instructions: getTranslation(gameIdLower, 'instructions') || [],
                image: getGameImage(gameIdLower)
            };

            createOverlay(gameData);
        });
    }

    // Game image mapping (same as in script.js)
    function getGameImage(gameId) {
        const imageMap = {
            'drewnking': 'picolo.png',
            'impostor': 'impostor.png',
            'mrdrew': 'mrdrew.png',
            'hottakes': 'hottakes.png',
            'indovinachi': 'indovinachi.png',
            'quizzy': 'quizzy.png',
            'guessthepic': 'guessrush.png',
            'chainreaction': 'chainReaction.png',
            'bluffme': 'bluffme.png',
            'alphabetgame': 'alphabet.png',
            'timergame': 'wordrace.png',
            'colorgrid': 'colorgrid.png',
            'nonhomai': 'nonhomai.png',
            'tictactopics': 'tictactopics.png'
        };
        return imageMap[gameId] || 'chainReaction.png';
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
