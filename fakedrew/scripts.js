document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const playerTurnScreen = document.getElementById('player-turn-screen');
    const drawingScreen = document.getElementById('drawing-screen');
    const discussScreen = document.getElementById('discuss-screen');
    const revealScreen = document.getElementById('reveal-screen');

    const playerCountInput = document.getElementById('player-count');
    const roundsSelect = document.getElementById('rounds-select');
    const startGameBtn = document.getElementById('start-game');
    const roleInfoTextEl = document.getElementById('roleInfoText');
    const playerNamesContainer = document.getElementById('player-names-container');

    const currentPlayerNum = document.getElementById('current-player-num');
    const currentPlayerNumText = document.getElementById('current-player-num-text');
    const showWordBtn = document.getElementById('show-word');
    const wordContainer = document.getElementById('word-container');
    const playerWord = document.getElementById('player-word');
    const playerRole = document.getElementById('player-role');
    const cardThemeValue = document.getElementById('card-theme-value');
    const fakeHint = document.getElementById('fake-hint');
    const hideWordBtn = document.getElementById('hide-word');

    const drawThemeEl = document.getElementById('draw-theme');
    const drawRoundEl = document.getElementById('draw-round');
    const drawPlayerEl = document.getElementById('draw-player');
    const turnDot = document.getElementById('turn-dot');
    const turnBanner = document.getElementById('turn-banner');
    const paperHint = document.getElementById('paper-hint');
    const canvas = document.getElementById('paper');
    const ctx = canvas.getContext('2d');
    const undoStrokeBtn = document.getElementById('undo-stroke');
    const undoStrokeText = document.getElementById('undoStrokeText');
    const nextTurnBtn = document.getElementById('next-turn');
    const nextTurnText = document.getElementById('nextTurnText');

    const drawingPreviewImg = document.getElementById('drawing-preview-img');
    const revealPreviewImg = document.getElementById('reveal-preview-img');
    const discussThemeEl = document.getElementById('discuss-theme');
    const revealRolesBtn = document.getElementById('reveal-roles');

    const fakeNum = document.getElementById('fake-num');
    const secretWord = document.getElementById('secret-word');
    const revealWordBtn = document.getElementById('reveal-word');
    const playAgainBtn = document.getElementById('play-again');

    // Apply game translations
    if (typeof applyGameTranslations === 'function') {
        applyGameTranslations();
    }

    const t = () => gameTranslations[getUserLanguage()] || gameTranslations['en'];

    // One ink colour per player, readable on the paper background
    const PLAYER_COLORS = [
        '#1f6fd0', '#d63b3b', '#2f9e5f', '#e08a17', '#8c4bd8', '#c2408f',
        '#0f9aa8', '#7a4b2a', '#4f7d1f', '#d2456b', '#3b4ea8', '#5b6270'
    ];
    const PAPER_BG = '#fdfcf7';

    // Tournament mode detection (self-contained, read-only)
    const __isTournament = new URLSearchParams(location.search).get('mode') === 'tournament';
    let __tPlayers = [];
    if (__isTournament) { try { __tPlayers = (JSON.parse(localStorage.getItem('tournamentState')) || {}).players || []; } catch (e) {} }
    const __tNames = __tPlayers.map(p => p.name);   // array of strings
    const __tCount = __tNames.length;

    // Game State
    let gameState = {
        playerCount: 4,
        currentPlayer: 1,
        fakeIndex: -1,
        word: '',
        theme: '',
        strokesPerPlayer: 2,
        turnOrder: [],
        turnIndex: 0,
        playerNames: [],
        allWords: [],
        shuffledWords: [],
        shuffleIndex: 0
    };

    // Drawing state. Points are normalised against the canvas width (both axes),
    // so a resize or a rotation never distorts what has already been drawn.
    let strokes = [];
    let currentStroke = null;
    let activePointerId = null;
    let turnPhase = 'idle';   // 'idle' → 'drawing' → 'done'
    let cssW = 0, cssH = 0;

    // Fisher-Yates shuffle
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Get next word without repeats until the whole list has been used
    function getNextWord() {
        if (gameState.shuffledWords.length === 0 || gameState.shuffleIndex >= gameState.shuffledWords.length) {
            gameState.shuffledWords = shuffleArray(gameState.allWords);
            gameState.shuffleIndex = 0;
        }
        const entry = gameState.shuffledWords[gameState.shuffleIndex];
        gameState.shuffleIndex++;
        return entry;
    }

    function playerLabel(index) {
        return gameState.playerNames[index] || `${t().player} ${index + 1}`;
    }

    function updatePlayerNameInputs() {
        // In tournament mode names come from the roster: don't render name inputs.
        if (__isTournament && __tCount > 0) {
            playerNamesContainer.innerHTML = '';
            return;
        }

        const count = parseInt(playerCountInput.value) || 4;
        const currentInputs = playerNamesContainer.querySelectorAll('input');
        const currentValues = Array.from(currentInputs).map(input => input.value);

        playerNamesContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-name-${i}`;
            input.className = 'form-control';

            if (i < currentValues.length) {
                input.value = currentValues[i];
            }

            let placeholder = t().playerNamePlaceholder || `Player ${i + 1}`;
            placeholder = placeholder.replace('{n}', i + 1);
            input.placeholder = placeholder;

            playerNamesContainer.appendChild(input);
        }
    }

    // Load the drawable words from the text file
    async function loadWords() {
        try {
            const response = await fetch(t().phrasesFile);
            const text = await response.text();

            const lines = text.split('\n').filter(line => line.trim().length > 0);

            gameState.allWords = lines.map(line => {
                const parts = line.split('|').map(part => part.trim());
                return { word: parts[0] || '', theme: parts[1] || '' };
            }).filter(entry => entry.word);

            console.log(`Loaded ${gameState.allWords.length} words`);
        } catch (error) {
            console.error('Error loading words:', error);
            const errorMsg = getUserLanguage() === 'it'
                ? 'Errore nel caricamento delle parole. Ricarica la pagina per riprovare.'
                : 'Error loading words. Reload the page to try again.';
            alert(errorMsg);
        }
    }

    // Update role breakdown display
    function updateRoleBreakdown() {
        const playerCount = (__isTournament && __tCount > 0)
            ? __tCount
            : (parseInt(playerCountInput.value) || 4);
        const translations = t();

        const numArtists = playerCount - 1;
        const breakdown = `${numArtists} ${numArtists === 1 ? translations.roleArtist : translations.roleArtists}, 1 ${translations.roleFake}`;

        roleInfoTextEl.innerHTML = `${translations.roleInfoText} <strong><span id="roleBreakdown"></span></strong>`;
        document.getElementById('roleBreakdown').textContent = breakdown;
    }

    // Initialize the game
    function initGame() {
        if (__isTournament && __tCount > 0) {
            // Player count is fixed by the tournament roster.
            gameState.playerCount = __tCount;
        } else {
            gameState.playerCount = parseInt(playerCountInput.value) || 4;
            if (gameState.playerCount < 3) {
                gameState.playerCount = 3;
                playerCountInput.value = 3;
            }
        }

        gameState.strokesPerPlayer = parseInt(roundsSelect.value) || 2;

        // Capture player names
        if (__isTournament && __tCount > 0) {
            gameState.playerNames = __tNames.slice();
        } else {
            const nameInputs = playerNamesContainer.querySelectorAll('input');
            gameState.playerNames = Array.from(nameInputs).map(input => input.value.trim());
        }

        gameState.currentPlayer = 1;

        // Randomly select the Fake Artist
        gameState.fakeIndex = Math.floor(Math.random() * gameState.playerCount);

        // Select the next word (no repeats until all have been used)
        const entry = getNextWord() || { word: '???', theme: '' };
        gameState.word = entry.word;
        gameState.theme = entry.theme || '';

        // Turn order: random starting player, then always around the same circle
        const startingPlayer = Math.floor(Math.random() * gameState.playerCount);
        gameState.turnOrder = [];
        for (let round = 0; round < gameState.strokesPerPlayer; round++) {
            for (let step = 0; step < gameState.playerCount; step++) {
                gameState.turnOrder.push((startingPlayer + step) % gameState.playerCount);
            }
        }
        gameState.turnIndex = 0;

        // Reset the sheet
        strokes = [];
        currentStroke = null;
        activePointerId = null;
        turnPhase = 'idle';

        updatePlayerTurnUI();
        showScreen(playerTurnScreen);
    }

    // Update player turn UI (word reveal phase)
    function updatePlayerTurnUI() {
        const currentPlayerName = gameState.playerNames[gameState.currentPlayer - 1];
        const lang = getUserLanguage();
        const translations = t();

        const turnH2 = document.querySelector('#player-turn-screen h2');
        const passP = document.querySelector('#player-turn-screen p');

        if (currentPlayerName) {
            if (lang === 'it') {
                turnH2.innerHTML = `Turno di <span id="current-player-num"></span>`;
                passP.innerHTML = `Passa il telefono a <span id="current-player-num-text"></span>`;
            } else {
                turnH2.innerHTML = `<span id="current-player-num"></span>'s Turn`;
                passP.innerHTML = `Pass the phone to <span id="current-player-num-text"></span>`;
            }
            document.getElementById('current-player-num').textContent = currentPlayerName;
            document.getElementById('current-player-num-text').textContent = currentPlayerName;
        } else {
            turnH2.innerHTML = `<span id="playerTurnText">${translations.playerTurnText}</span> <span id="current-player-num">${gameState.currentPlayer}</span>`;
            passP.innerHTML = `<span id="passPhoneText">${translations.passPhoneText}</span> <span id="current-player-num-text">${gameState.currentPlayer}</span>`;
        }

        // Hide word container initially
        wordContainer.classList.add('hidden');
        showWordBtn.classList.remove('hidden');
    }

    // Show word for current player
    function showWord() {
        const translations = t();
        const currentIndex = gameState.currentPlayer - 1;
        const isFake = currentIndex === gameState.fakeIndex;

        playerWord.textContent = isFake ? translations.wordFake : gameState.word;
        playerRole.textContent = isFake ? translations.roleFake : translations.roleArtist;
        playerRole.className = 'role-badge ' + (isFake ? 'fake' : 'artist');
        cardThemeValue.textContent = gameState.theme || '???';
        fakeHint.textContent = translations.fakeHintText;
        fakeHint.classList.toggle('hidden', !isFake);

        wordContainer.classList.remove('hidden');
        showWordBtn.classList.add('hidden');
    }

    // Move to next player or to the drawing sheet
    function nextPlayerOrDrawing() {
        if (gameState.currentPlayer < gameState.playerCount) {
            gameState.currentPlayer++;
            updatePlayerTurnUI();
        } else {
            startDrawingPhase();
        }
    }

    // ---------- drawing sheet ----------

    function startDrawingPhase() {
        drawThemeEl.textContent = gameState.theme || '???';
        showScreen(drawingScreen);
        // The canvas has just become visible: size it, then set up the first turn.
        requestAnimationFrame(() => {
            resizeCanvas();
            beginTurn();
        });
    }

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = window.devicePixelRatio || 1;
        cssW = rect.width;
        cssH = rect.height;
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redraw();
    }

    function lineWidth() {
        return Math.max(2.5, cssW * 0.011);
    }

    function strokePath(stroke) {
        const pts = stroke.pts;
        if (!pts.length) return;
        ctx.strokeStyle = stroke.color;
        ctx.fillStyle = stroke.color;
        ctx.lineWidth = lineWidth();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (pts.length === 1) {
            ctx.beginPath();
            ctx.arc(pts[0][0] * cssW, pts[0][1] * cssW, lineWidth() / 2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(pts[0][0] * cssW, pts[0][1] * cssW);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i][0] * cssW, pts[i][1] * cssW);
        }
        ctx.stroke();
    }

    function redraw() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = PAPER_BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        strokes.forEach(strokePath);
    }

    function currentDrawerIndex() {
        return gameState.turnOrder[gameState.turnIndex];
    }

    function playerColor(index) {
        return PLAYER_COLORS[index % PLAYER_COLORS.length];
    }

    function beginTurn() {
        const translations = t();
        const drawer = currentDrawerIndex();

        turnPhase = 'idle';
        currentStroke = null;
        activePointerId = null;

        drawPlayerEl.textContent = playerLabel(drawer);
        turnDot.style.background = playerColor(drawer);
        turnBanner.classList.remove('done');

        const round = Math.floor(gameState.turnIndex / gameState.playerCount) + 1;
        drawRoundEl.textContent = `${round}/${gameState.strokesPerPlayer}`;

        paperHint.textContent = translations.paperHintText;
        paperHint.classList.remove('hidden');

        undoStrokeBtn.classList.add('hidden');
        nextTurnBtn.disabled = true;
        nextTurnText.textContent = translations.drawPromptText;
    }

    function endTurnStroke() {
        const translations = t();
        turnPhase = 'done';
        activePointerId = null;
        currentStroke = null;

        turnBanner.classList.add('done');
        paperHint.textContent = translations.paperDoneHintText;
        paperHint.classList.remove('hidden');

        undoStrokeBtn.classList.remove('hidden');
        undoStrokeText.textContent = translations.undoStrokeText;

        nextTurnBtn.disabled = false;
        const isLastTurn = gameState.turnIndex >= gameState.turnOrder.length - 1;
        if (isLastTurn) {
            nextTurnText.textContent = translations.finishDrawingText;
        } else {
            const nextDrawer = gameState.turnOrder[gameState.turnIndex + 1];
            nextTurnText.textContent = `${translations.nextTurnText} ${playerLabel(nextDrawer)}`;
        }
    }

    // Normalised against the canvas width on both axes, so the drawing keeps its
    // proportions even if the sheet is resized between one stroke and the next.
    function pointerPos(event) {
        const rect = canvas.getBoundingClientRect();
        return [
            (event.clientX - rect.left) / cssW,
            (event.clientY - rect.top) / cssW
        ];
    }

    function onPointerDown(event) {
        if (turnPhase !== 'idle') return;
        event.preventDefault();
        activePointerId = event.pointerId;
        try { canvas.setPointerCapture(event.pointerId); } catch (e) {}

        turnPhase = 'drawing';
        paperHint.classList.add('hidden');

        currentStroke = { color: playerColor(currentDrawerIndex()), pts: [pointerPos(event)] };
        strokes.push(currentStroke);
        strokePath(currentStroke);
    }

    function onPointerMove(event) {
        if (turnPhase !== 'drawing' || event.pointerId !== activePointerId) return;
        event.preventDefault();

        const pts = currentStroke.pts;
        const last = pts[pts.length - 1];
        const point = pointerPos(event);

        // Skip micro-movements to keep the stroke light
        if (Math.abs(point[0] - last[0]) * cssW < 1 && Math.abs(point[1] - last[1]) * cssW < 1) return;

        pts.push(point);

        // Draw only the new segment instead of repainting everything
        ctx.strokeStyle = currentStroke.color;
        ctx.lineWidth = lineWidth();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(last[0] * cssW, last[1] * cssW);
        ctx.lineTo(point[0] * cssW, point[1] * cssW);
        ctx.stroke();
    }

    function onPointerUp(event) {
        if (turnPhase !== 'drawing' || event.pointerId !== activePointerId) return;
        event.preventDefault();
        try { canvas.releasePointerCapture(event.pointerId); } catch (e) {}
        endTurnStroke();
    }

    function undoStroke() {
        if (turnPhase !== 'done') return;
        strokes.pop();
        redraw();
        beginTurn();
    }

    function nextTurn() {
        if (turnPhase !== 'done') return;

        if (gameState.turnIndex < gameState.turnOrder.length - 1) {
            gameState.turnIndex++;
            beginTurn();
        } else {
            finishDrawing();
        }
    }

    function finishDrawing() {
        const dataUrl = canvas.toDataURL('image/png');
        drawingPreviewImg.src = dataUrl;
        revealPreviewImg.src = dataUrl;
        discussThemeEl.textContent = gameState.theme || '???';
        showScreen(discussScreen);
    }

    // ---------- reveal ----------

    function revealRoles() {
        fakeNum.textContent = playerLabel(gameState.fakeIndex);

        // Hide the "The player" prefix when a custom name is used
        const playerText = document.getElementById('playerText');
        playerText.style.display = gameState.playerNames[gameState.fakeIndex] ? 'none' : 'inline';

        // Hide the word first: the Fake Artist still gets a chance to guess it
        secretWord.textContent = gameState.word;
        secretWord.classList.add('hidden');
        revealWordBtn.classList.remove('hidden');

        showScreen(revealScreen);
    }

    function revealWord() {
        secretWord.classList.remove('hidden');
        revealWordBtn.classList.add('hidden');
    }

    // Helper to show a specific screen and hide others
    function showScreen(screenToShow) {
        [setupScreen, playerTurnScreen, drawingScreen, discussScreen, revealScreen]
            .forEach(screen => screen.classList.remove('active'));
        screenToShow.classList.add('active');
    }

    // Event Listeners
    startGameBtn.addEventListener('click', initGame);
    showWordBtn.addEventListener('click', showWord);
    hideWordBtn.addEventListener('click', nextPlayerOrDrawing);

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    undoStrokeBtn.addEventListener('click', undoStroke);
    nextTurnBtn.addEventListener('click', nextTurn);

    revealRolesBtn.addEventListener('click', revealRoles);
    revealWordBtn.addEventListener('click', revealWord);

    playAgainBtn.addEventListener('click', () => {
        showScreen(setupScreen);
    });

    window.addEventListener('resize', () => {
        if (drawingScreen.classList.contains('active')) resizeCanvas();
    });
    window.addEventListener('orientationchange', () => {
        if (drawingScreen.classList.contains('active')) setTimeout(resizeCanvas, 250);
    });

    playerCountInput.addEventListener('change', () => {
        updateRoleBreakdown();
        updatePlayerNameInputs();
    });

    // Initial load
    loadWords();

    // Tournament mode: the roster fixes the players, so the count is locked and
    // the name inputs are skipped. The user only picks the strokes per player.
    if (__isTournament && __tCount > 0) {
        gameState.playerCount = __tCount;
        gameState.playerNames = __tNames.slice();

        const optionExists = Array.from(playerCountInput.options)
            .some(opt => parseInt(opt.value) === __tCount);
        if (optionExists) {
            playerCountInput.value = String(__tCount);
        }
        playerCountInput.disabled = true;
    }

    updateRoleBreakdown();
    updatePlayerNameInputs();
});
