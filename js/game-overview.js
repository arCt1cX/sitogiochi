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

    // Inject CSS styles directly (Cinema theme; scoped under .go-overlay so it
    // overrides the home-page overlay rules in dg-ui.css without conflicts).
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'game-overview-styles';
        style.textContent = `
            .go-overlay.game-info-overlay {
                position: fixed; inset: 0; width: 100%; height: 100vh; height: 100dvh;
                min-height: -webkit-fill-available;
                background:
                    radial-gradient(120% 38% at 50% -6%, rgba(71,60,139,.45), transparent 60%),
                    #0b0810;
                z-index: 10000; display: flex; flex-direction: column;
                opacity: 0; visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                overflow: hidden; overscroll-behavior: contain; transform: none;
                padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);
                font-family: 'Space Grotesk', sans-serif;
            }
            .go-overlay.game-info-overlay.active { opacity: 1; visibility: visible; }
            .go-overlay .game-info-header {
                display: flex; justify-content: flex-end; align-items: center;
                padding: 16px 20px; position: relative; z-index: 2; flex-shrink: 0;
                background: none; height: auto; overflow: visible;
            }
            .go-overlay .game-info-players {
                display: inline-flex; align-items: center; gap: 7px; position: static;
                background: rgba(123,104,238,.16); border: 1px solid rgba(123,104,238,.4);
                padding: 7px 13px; border-radius: 999px; color: #e6dff5; font-weight: 600; font-size: .82rem;
                backdrop-filter: none;
            }
            .go-overlay .game-info-players svg { width: 16px; height: 16px; fill: #9c8bff; }
            .go-overlay .game-info-content {
                flex: 1; overflow-y: auto; overflow-x: hidden; padding: 0 20px 20px;
                position: relative; z-index: 2; -webkit-overflow-scrolling: touch;
            }
            .go-overlay .game-info-title-section {
                position: static; text-align: center; margin: 0 0 22px; padding: 6px 0 0;
            }
            .go-overlay .game-info-icon {
                display: block; width: 108px; height: 108px; object-fit: cover; border-radius: 24px;
                border: 2px solid #7b68ee; box-shadow: 0 0 26px rgba(123,104,238,.45);
                margin: 0 auto 14px;
            }
            .go-overlay .game-info-title {
                font-family: 'Bricolage Grotesque', sans-serif; font-size: 2rem; font-weight: 800;
                text-transform: uppercase; margin: 0 0 6px; color: #fff;
                -webkit-text-fill-color: #fff; background: none; text-shadow: 0 3px 14px rgba(0,0,0,.5);
            }
            .go-overlay .game-info-catchphrase { font-size: .95rem; color: #d8cfe9; font-style: italic; margin: 0; text-shadow: none; }
            .go-overlay .game-info-description,
            .go-overlay .game-info-instructions,
            .go-overlay .game-info-features {
                background: #181122; border-radius: 16px; padding: 18px; margin: 0 0 16px;
                border: 1px solid #33274c;
            }
            .go-overlay .game-info-content h4 {
                font-family: 'Bricolage Grotesque', sans-serif; color: #9c8bff; font-size: 15px;
                margin: 0 0 11px; display: flex; align-items: center; gap: 8px;
                text-transform: uppercase; letter-spacing: .5px; font-weight: 700;
            }
            .go-overlay .section-icon { width: 18px; height: 18px; fill: #7b68ee; flex-shrink: 0; }
            .go-overlay .game-info-description p { color: #cdc4df; line-height: 1.6; font-size: 13.5px; margin: 0; text-align: left; }
            .go-overlay .game-info-instructions ol { padding: 0; margin: 0; counter-reset: instruction-counter; list-style: none; }
            .go-overlay .game-info-instructions li {
                color: #cdc4df; line-height: 1.5; font-size: 13px; margin-bottom: 13px;
                padding: 0 0 0 40px; position: relative; counter-increment: instruction-counter; text-align: left;
            }
            .go-overlay .game-info-instructions li::before {
                content: counter(instruction-counter); position: absolute; left: 0; top: -2px;
                width: 27px; height: 27px; background: linear-gradient(135deg, #7b68ee, #473c8b);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-family: 'Bricolage Grotesque', sans-serif; font-size: 12px; font-weight: 700; color: #fff;
                -webkit-mask: none; mask: none;
            }
            .go-overlay .game-info-features ul { padding: 0; margin: 0; list-style: none; display: flex; flex-direction: column; gap: 9px; }
            .go-overlay .game-info-features li {
                color: #cdc4df; line-height: 1.4; font-size: 13px; margin: 0;
                padding: 0 0 0 26px; position: relative; text-align: left;
            }
            .go-overlay .game-info-features li::before {
                content: '✓'; position: absolute; left: 0; top: 0; width: auto; height: auto;
                color: #9be14d; font-weight: bold; background: none;
                -webkit-mask: none; mask: none; border-radius: 0;
            }
            .go-overlay .game-info-footer {
                display: flex; gap: 12px; padding: 16px 20px calc(16px + env(safe-area-inset-bottom));
                position: relative; z-index: 2; flex-shrink: 0;
                background: linear-gradient(0deg, #0b0810 60%, transparent); border-top: none;
            }
            .go-overlay .game-info-btn {
                flex: 1; padding: 16px 20px; border-radius: 16px; border: none;
                font-family: 'Bricolage Grotesque', sans-serif; font-size: 15px; font-weight: 800;
                cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; letter-spacing: 1px;
                display: flex; align-items: center; justify-content: center; gap: 9px; width: auto;
            }
            .go-overlay .game-info-btn .btn-icon { width: 18px; height: 18px; fill: currentColor; flex-shrink: 0; }
            .go-overlay .game-info-btn-back {
                background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: #e7e0f5; flex: 0 0 auto; width: 58px; padding: 16px 0;
            }
            .go-overlay .game-info-btn-back span { display: none; }
            .go-overlay .game-info-btn-back:hover { background: rgba(255,255,255,.12); }
            .go-overlay .game-info-btn-play {
                background: #7b68ee; color: #fff; flex: 1;
                box-shadow: 0 10px 26px -8px rgba(123,104,238,.7), inset 0 1px 0 rgba(255,255,255,.25);
            }
            .go-overlay .game-info-btn-play:hover { background: #9c8bff; transform: translateY(-1px); }
            body.overlay-open {
                overflow: hidden; position: fixed; width: 100%; height: 100%;
                transform: none !important; animation: none !important;
                -webkit-transform: none !important; -webkit-animation: none !important;
            }
            @media (max-width: 480px) {
                .go-overlay .game-info-content { padding: 0 16px 16px; }
                .go-overlay .game-info-icon { width: 92px; height: 92px; }
                .go-overlay .game-info-title { font-size: 1.6rem; }
                .go-overlay .game-info-btn-back span { display: none; }
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
        overlay.className = 'game-info-overlay go-overlay active';

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
        // If the user launched from the home-page detail, the overview was already
        // shown there — skip it and go straight to the game.
        try {
            if (sessionStorage.getItem('dg_skip_overview') === '1') {
                sessionStorage.removeItem('dg_skip_overview');
                return;
            }
        } catch (e) {}
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
            'taboo': 'taboo.png',
            'yahtzee': 'yahtzee.png',
            'mrdrew': 'mrdrew.png',
            'fakedrew': 'fakedrew.svg',
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
