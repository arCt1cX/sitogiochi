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

    // Inject CSS styles directly (to avoid importing main styles.css which affects layout)
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'game-overview-styles';
        style.textContent = `
            /* Game Info Overlay - Full Screen Modal */
            .game-info-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                height: 100vh;
                height: 100dvh;
                min-height: -webkit-fill-available;
                background: #000000;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                overflow: hidden;
                overscroll-behavior: contain;
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
                font-family: 'Poppins', 'Segoe UI', sans-serif;
            }
            .game-info-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .game-info-header {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding: 15px 20px;
                position: relative;
                z-index: 2;
                flex-shrink: 0;
            }
            .game-info-players {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(111, 42, 192, 0.3);
                border: 2px solid rgba(111, 42, 192, 0.6);
                padding: 10px 18px;
                border-radius: 25px;
                color: white;
                font-weight: 600;
                font-size: 0.95rem;
            }
            .game-info-players svg {
                width: 22px;
                height: 22px;
                fill: #6F2AC0;
            }
            .game-info-content {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 0 20px 20px 20px;
                position: relative;
                z-index: 2;
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }
            .game-info-title-section {
                text-align: center;
                margin-bottom: 25px;
                padding-top: 10px;
            }
            .game-info-icon {
                width: 120px;
                height: 120px;
                object-fit: contain;
                filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
                margin-bottom: 15px;
            }
            .game-info-title {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 8px;
                background: linear-gradient(90deg, #6F2AC0, #9B4DCA);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .game-info-catchphrase {
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.8);
                font-style: italic;
                margin-bottom: 5px;
            }
            .game-info-description,
            .game-info-instructions,
            .game-info-features {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .game-info-description h4,
            .game-info-instructions h4,
            .game-info-features h4 {
                color: #9B4DCA;
                font-size: 1.1rem;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .section-icon {
                width: 20px;
                height: 20px;
                fill: #6F2AC0;
                flex-shrink: 0;
            }
            .game-info-description p {
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.6;
                font-size: 0.95rem;
                margin: 0;
                text-align: left;
            }
            .game-info-instructions ol {
                padding-left: 0;
                margin: 0;
                counter-reset: instruction-counter;
                list-style: none;
            }
            .game-info-instructions li {
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.5;
                font-size: 0.9rem;
                margin-bottom: 12px;
                padding-left: 35px;
                position: relative;
                counter-increment: instruction-counter;
                text-align: left;
            }
            .game-info-instructions li::before {
                content: counter(instruction-counter);
                position: absolute;
                left: 0;
                top: 0;
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #6F2AC0, #9B4DCA);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                font-weight: 700;
                color: white;
            }
            .game-info-features ul {
                padding-left: 0;
                margin: 0;
                list-style: none;
            }
            .game-info-features li {
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.5;
                font-size: 0.9rem;
                margin-bottom: 10px;
                padding-left: 28px;
                position: relative;
                text-align: left;
            }
            .game-info-features li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #6F2AC0;
                font-weight: bold;
            }
            .game-info-footer {
                display: flex;
                gap: 15px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
                z-index: 2;
                flex-shrink: 0;
                padding-bottom: calc(20px + env(safe-area-inset-bottom));
            }
            .game-info-btn {
                flex: 1;
                padding: 16px 20px;
                border-radius: 15px;
                font-family: 'Poppins', sans-serif;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .game-info-btn .btn-icon {
                width: 20px;
                height: 20px;
                fill: white;
                flex-shrink: 0;
            }
            .game-info-btn-back {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
            }
            .game-info-btn-back:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-2px);
            }
            .game-info-btn-play {
                background: linear-gradient(135deg, #6F2AC0 0%, #9B4DCA 100%);
                border: none;
                color: white;
                box-shadow: 0 4px 15px rgba(111, 42, 192, 0.4);
            }
            .game-info-btn-play:hover {
                background: linear-gradient(135deg, #8035D9 0%, #A85FD4 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(111, 42, 192, 0.6);
            }
            body.overlay-open {
                overflow: hidden;
                position: fixed;
                width: 100%;
                height: 100%;
                /* Critical fix for iOS: prevent body transform from breaking fixed positioning */
                transform: none !important;
                animation: none !important;
                -webkit-transform: none !important;
                -webkit-animation: none !important;
            }
            @media (max-width: 480px) {
                .game-info-header { padding: 12px 15px; }
                .game-info-content { padding: 0 15px 15px 15px; }
                .game-info-icon { width: 90px; height: 90px; }
                .game-info-title { font-size: 1.6rem; }
                .game-info-catchphrase { font-size: 0.9rem; }
                .game-info-description,
                .game-info-instructions,
                .game-info-features { padding: 15px; }
                .game-info-description p,
                .game-info-instructions li,
                .game-info-features li { font-size: 0.85rem; }
                .game-info-footer { padding: 15px; gap: 10px; padding-bottom: calc(15px + env(safe-area-inset-bottom)); }
                .game-info-btn { padding: 14px 15px; font-size: 1rem; }
            }
        `;
        document.head.appendChild(style);
    }

    // Inject styles immediately
    injectStyles();

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
