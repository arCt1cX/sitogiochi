document.addEventListener('DOMContentLoaded', () => {
    // Apply initial language based on user preference
    applyTranslations();

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

    // Games array (data-driven from lang.js — unchanged)
    const games = [
        { id: "drewnking", displayName: getTranslation('drewnking', 'title'), catchphrase: getTranslation('drewnking', 'catchphrase'), image: "picolo.png", players: getTranslation('drewnking', 'players'), time: getTranslation('drewnking', 'time'), difficulty: getTranslation('drewnking', 'difficulty'), description: getTranslation('drewnking', 'description'), features: getTranslation('drewnking', 'features'), instructions: getTranslation('drewnking', 'instructions') },
        { id: "impostor", displayName: getTranslation('impostor', 'title'), catchphrase: getTranslation('impostor', 'catchphrase'), image: "impostor.png", players: getTranslation('impostor', 'players'), time: getTranslation('impostor', 'time'), difficulty: getTranslation('impostor', 'difficulty'), description: getTranslation('impostor', 'description'), features: getTranslation('impostor', 'features'), instructions: getTranslation('impostor', 'instructions') },
        { id: "taboo", displayName: getTranslation('taboo', 'title'), catchphrase: getTranslation('taboo', 'catchphrase'), image: "taboo.png", players: getTranslation('taboo', 'players'), time: getTranslation('taboo', 'time'), difficulty: getTranslation('taboo', 'difficulty'), description: getTranslation('taboo', 'description'), features: getTranslation('taboo', 'features'), instructions: getTranslation('taboo', 'instructions') },
        { id: "yahtzee", displayName: getTranslation('yahtzee', 'title'), catchphrase: getTranslation('yahtzee', 'catchphrase'), image: "yahtzee.png", players: getTranslation('yahtzee', 'players'), time: getTranslation('yahtzee', 'time'), difficulty: getTranslation('yahtzee', 'difficulty'), description: getTranslation('yahtzee', 'description'), features: getTranslation('yahtzee', 'features'), instructions: getTranslation('yahtzee', 'instructions') },
        { id: "mrdrew", displayName: getTranslation('mrdrew', 'title'), catchphrase: getTranslation('mrdrew', 'catchphrase'), image: "mrdrew.png", players: getTranslation('mrdrew', 'players'), time: getTranslation('mrdrew', 'time'), difficulty: getTranslation('mrdrew', 'difficulty'), description: getTranslation('mrdrew', 'description'), features: getTranslation('mrdrew', 'features'), instructions: getTranslation('mrdrew', 'instructions') },
        { id: "fakedrew", displayName: getTranslation('fakedrew', 'title'), catchphrase: getTranslation('fakedrew', 'catchphrase'), image: "fakedrew.svg", players: getTranslation('fakedrew', 'players'), time: getTranslation('fakedrew', 'time'), difficulty: getTranslation('fakedrew', 'difficulty'), description: getTranslation('fakedrew', 'description'), features: getTranslation('fakedrew', 'features'), instructions: getTranslation('fakedrew', 'instructions') },
        { id: "hottakes", displayName: getTranslation('hottakes', 'title'), catchphrase: getTranslation('hottakes', 'catchphrase'), image: "hottakes.png", players: getTranslation('hottakes', 'players'), time: getTranslation('hottakes', 'time'), difficulty: getTranslation('hottakes', 'difficulty'), description: getTranslation('hottakes', 'description'), features: getTranslation('hottakes', 'features'), instructions: getTranslation('hottakes', 'instructions') },
        { id: "indovinaChi", displayName: getTranslation('indovinachi', 'title'), catchphrase: getTranslation('indovinachi', 'catchphrase'), image: "indovinachi.png", players: getTranslation('indovinachi', 'players'), time: getTranslation('indovinachi', 'time'), difficulty: getTranslation('indovinachi', 'difficulty'), description: getTranslation('indovinachi', 'description'), features: getTranslation('indovinachi', 'features'), instructions: getTranslation('indovinachi', 'instructions') },
        { id: "quizzy", displayName: getTranslation('quizzy', 'title'), catchphrase: getTranslation('quizzy', 'catchphrase'), image: "quizzy.png", players: getTranslation('quizzy', 'players'), time: getTranslation('quizzy', 'time'), difficulty: getTranslation('quizzy', 'difficulty'), description: getTranslation('quizzy', 'description'), features: getTranslation('quizzy', 'features'), instructions: getTranslation('quizzy', 'instructions') },
        { id: "guessthepic", displayName: getTranslation('guessthepic', 'title'), catchphrase: getTranslation('guessthepic', 'catchphrase'), image: "guessrush.png", players: getTranslation('guessthepic', 'players'), time: getTranslation('guessthepic', 'time'), difficulty: getTranslation('guessthepic', 'difficulty'), description: getTranslation('guessthepic', 'description'), features: getTranslation('guessthepic', 'features'), instructions: getTranslation('guessthepic', 'instructions') },
        { id: "chainreaction", displayName: getTranslation('chainreaction', 'title'), catchphrase: getTranslation('chainreaction', 'catchphrase'), image: "chainReaction.png", players: getTranslation('chainreaction', 'players'), time: getTranslation('chainreaction', 'time'), difficulty: getTranslation('chainreaction', 'difficulty'), description: getTranslation('chainreaction', 'description'), features: getTranslation('chainreaction', 'features'), instructions: getTranslation('chainreaction', 'instructions') },
        { id: "bluffme", displayName: getTranslation('bluffme', 'title'), catchphrase: getTranslation('bluffme', 'catchphrase'), image: "bluffme.png", players: getTranslation('bluffme', 'players'), time: getTranslation('bluffme', 'time'), difficulty: getTranslation('bluffme', 'difficulty'), description: getTranslation('bluffme', 'description'), features: getTranslation('bluffme', 'features'), instructions: getTranslation('bluffme', 'instructions') },
        { id: "alphabetgame", displayName: getTranslation('alphabetgame', 'title'), catchphrase: getTranslation('alphabetgame', 'catchphrase'), image: "alphabet.png", players: getTranslation('alphabetgame', 'players'), time: getTranslation('alphabetgame', 'time'), difficulty: getTranslation('alphabetgame', 'difficulty'), description: getTranslation('alphabetgame', 'description'), features: getTranslation('alphabetgame', 'features'), instructions: getTranslation('alphabetgame', 'instructions') },
        { id: "timergame", displayName: getTranslation('timergame', 'title'), catchphrase: getTranslation('timergame', 'catchphrase'), image: "wordrace.png", players: getTranslation('timergame', 'players'), time: getTranslation('timergame', 'time'), difficulty: getTranslation('timergame', 'difficulty'), description: getTranslation('timergame', 'description'), features: getTranslation('timergame', 'features'), instructions: getTranslation('timergame', 'instructions') },
        { id: "colorgrid", displayName: getTranslation('colorgrid', 'title'), catchphrase: getTranslation('colorgrid', 'catchphrase'), image: "colorgrid.png", players: getTranslation('colorgrid', 'players'), time: getTranslation('colorgrid', 'time'), difficulty: getTranslation('colorgrid', 'difficulty'), description: getTranslation('colorgrid', 'description'), features: getTranslation('colorgrid', 'features'), instructions: getTranslation('colorgrid', 'instructions') },
        { id: "nonhomai", displayName: getTranslation('nonhomai', 'title'), catchphrase: getTranslation('nonhomai', 'catchphrase'), image: "nonhomai.png", players: getTranslation('nonhomai', 'players'), time: getTranslation('nonhomai', 'time'), difficulty: getTranslation('nonhomai', 'difficulty'), description: getTranslation('nonhomai', 'description'), features: getTranslation('nonhomai', 'features'), instructions: getTranslation('nonhomai', 'instructions') },
        { id: "tictactopics", displayName: getTranslation('tictactopics', 'title'), catchphrase: getTranslation('tictactopics', 'catchphrase'), image: "tictactopics.png", players: getTranslation('tictactopics', 'players'), time: getTranslation('tictactopics', 'time'), difficulty: getTranslation('tictactopics', 'difficulty'), description: getTranslation('tictactopics', 'description'), features: getTranslation('tictactopics', 'features'), instructions: getTranslation('tictactopics', 'instructions') }
    ];

    // Store games globally for overlay access
    window.gamesData = games;

    // Per-game visual meta: hue (card gradient) + category label (it/en)
    const gameMeta = {
        drewnking:    { hue: 286, kind: { it: 'Alcolico', en: 'Drinking' } },
        impostor:     { hue: 258, kind: { it: 'Bluff', en: 'Bluff' } },
        taboo:        { hue: 276, kind: { it: 'Parole', en: 'Words' } },
        yahtzee:      { hue: 252, kind: { it: 'Dadi', en: 'Dice' } },
        mrdrew:       { hue: 274, kind: { it: 'Deduzione', en: 'Deduction' } },
        fakedrew:     { hue: 264, kind: { it: 'Disegno', en: 'Drawing' } },
        hottakes:     { hue: 246, kind: { it: 'Dibattito', en: 'Debate' } },
        indovinaChi:  { hue: 300, kind: { it: 'Parole', en: 'Words' } },
        quizzy:       { hue: 232, kind: { it: 'Quiz', en: 'Quiz' } },
        guessthepic:  { hue: 290, kind: { it: 'Foto', en: 'Photo' } },
        chainreaction:{ hue: 250, kind: { it: 'Squadre', en: 'Teams' } },
        bluffme:      { hue: 268, kind: { it: 'Bluff', en: 'Bluff' } },
        alphabetgame: { hue: 240, kind: { it: 'Parole', en: 'Words' } },
        timergame:    { hue: 296, kind: { it: 'Veloce', en: 'Fast' } },
        colorgrid:    { hue: 262, kind: { it: 'Logica', en: 'Logic' } },
        nonhomai:     { hue: 280, kind: { it: 'Alcolico', en: 'Drinking' } },
        tictactopics: { hue: 244, kind: { it: 'Sfida', en: 'Duel' } }
    };
    window.gameMeta = gameMeta;
    const lang = (typeof getUserLanguage === 'function') ? getUserLanguage() : 'it';

    // Folder name mapping for case sensitivity issues
    const folderNameMap = { 'bluffme': 'BluffMe', 'indovinaChi': 'indovinaChi' };
    window.folderNameMap = folderNameMap;

    const gamesContainer = document.getElementById('gamesContainer');

    const PEOPLE_SVG = '<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';
    const CHEV_SVG = '<svg viewBox="0 0 24 24"><path d="M10 6 8.6 7.4 13.2 12l-4.6 4.6L10 18l6-6z"/></svg>';
    const playLabel = getTranslation('play');

    const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // Create and append cinema cards
    games.forEach((game, index) => {
        const meta = gameMeta[game.id] || { hue: 270 };
        const card = document.createElement('article');
        card.className = 'gcard';
        card.style.background = `linear-gradient(115deg, hsl(${meta.hue} 56% 27%), #120c1f 72%)`;
        card.style.animationDelay = (index * 45) + 'ms';
        card.innerHTML =
            `<img class="bg" src="icone%20per%20giochi/${esc(game.image)}" alt="" onerror="this.style.display='none'">` +
            `<div class="scrim"></div>` +
            `<span class="chip">${PEOPLE_SVG}<span>${esc(game.players || '')}</span></span>` +
            `<div class="txt"><h3>${esc(game.displayName || game.id)}</h3><p>${esc(game.catchphrase || '')}</p></div>` +
            `<span class="gioca">${esc(playLabel)} ${CHEV_SVG}</span>`;
        card.addEventListener('click', () => openGameInfo(game));
        gamesContainer.appendChild(card);
    });

    // "Coming Soon" card
    const soon = document.createElement('article');
    soon.className = 'gcard soon';
    soon.style.background = 'linear-gradient(120deg,#1a1626,#100c18)';
    soon.style.animationDelay = (games.length * 45) + 'ms';
    soon.innerHTML =
        `<img class="bg" src="icone%20per%20giochi/comingsoon.png" alt="" onerror="this.style.display='none'">` +
        `<div class="scrim"></div>` +
        `<div class="txt"><h3>${esc(getTranslation('comingSoon'))}</h3><p>···</p></div>` +
        `<span class="badge">${lang === 'it' ? 'Presto' : 'Soon'}</span>`;
    gamesContainer.appendChild(soon);
});

// ============================================
// GAME INFO OVERLAY FUNCTIONS
// ============================================

let currentGameData = null;

function openGameInfo(game) {
    currentGameData = game;
    const overlay = document.getElementById('gameInfoOverlay');
    if (!overlay) return;
    updateGameInfoContent(game);
    const content = overlay.querySelector('.game-info-content');
    if (content) content.scrollTop = 0;
    overlay.classList.add('active');
    document.body.classList.add('overlay-open');
    window.overlayScrollY = window.scrollY;
}

function closeGameInfo() {
    const overlay = document.getElementById('gameInfoOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.classList.remove('overlay-open');
    if (window.overlayScrollY !== undefined) {
        window.scrollTo(0, window.overlayScrollY);
    }
    currentGameData = null;
}

function updateGameInfoContent(game) {
    const meta = (window.gameMeta && window.gameMeta[game.id]) || { hue: 270 };

    // Hero image + gradient
    const headerEl = document.querySelector('#gameInfoOverlay .game-info-header');
    if (headerEl) headerEl.style.background = `linear-gradient(120deg, hsl(${meta.hue} 56% 28%), #0b0810 74%)`;
    const headerBg = document.getElementById('gameInfoHeaderBg');
    if (headerBg) { headerBg.src = `icone%20per%20giochi/${game.image}`; headerBg.onerror = function () { this.style.display = 'none'; }; }

    const iconEl = document.getElementById('gameInfoIcon');
    if (iconEl) { iconEl.src = `icone%20per%20giochi/${game.image}`; iconEl.alt = `${game.displayName} Icon`; }

    const titleEl = document.getElementById('gameInfoTitle');
    if (titleEl) titleEl.textContent = game.displayName;

    const catchphraseEl = document.getElementById('gameInfoCatchphrase');
    if (catchphraseEl) catchphraseEl.textContent = game.catchphrase;

    const playersEl = document.getElementById('gameInfoPlayersText');
    if (playersEl) playersEl.textContent = game.players || '2-10 giocatori';

    const timeEl = document.getElementById('gameInfoTime');
    if (timeEl) timeEl.textContent = game.time || '10-15 min';

    const difficultyEl = document.getElementById('gameInfoDifficulty');
    if (difficultyEl) difficultyEl.textContent = game.difficulty || 'Principiante';

    const descEl = document.getElementById('gameInfoDesc');
    if (descEl) descEl.textContent = game.description || '';

    const instructionsEl = document.getElementById('gameInfoInstructions');
    if (instructionsEl && Array.isArray(game.instructions)) {
        instructionsEl.innerHTML = '';
        game.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsEl.appendChild(li);
        });
    }

    const featuresEl = document.getElementById('gameInfoFeatures');
    if (featuresEl && Array.isArray(game.features)) {
        featuresEl.innerHTML = '';
        game.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresEl.appendChild(li);
        });
    }

    // Labels based on language
    const descLabel = document.getElementById('descriptionLabel');
    if (descLabel) descLabel.textContent = getUserLanguage() === 'it' ? 'Descrizione' : 'Description';
    const instrLabel = document.getElementById('instructionsLabel');
    if (instrLabel) instrLabel.textContent = getTranslation('howToPlay') || 'Come Giocare';
    const featLabel = document.getElementById('featuresLabel');
    if (featLabel) featLabel.textContent = getTranslation('features') || 'Caratteristiche';
    const backBtn = document.getElementById('backBtnText');
    if (backBtn) backBtn.textContent = getUserLanguage() === 'it' ? 'Indietro' : 'Back';
    const playBtn = document.getElementById('playBtnText');
    if (playBtn) playBtn.textContent = getUserLanguage() === 'it' ? 'Gioca' : 'Play';

    // Play button → navigate to game
    const playBtnEl = document.getElementById('gameInfoPlayBtn');
    if (playBtnEl) {
        const newPlayBtn = playBtnEl.cloneNode(true);
        playBtnEl.parentNode.replaceChild(newPlayBtn, playBtnEl);
        newPlayBtn.addEventListener('click', () => {
            const folderName = window.folderNameMap[game.id] || game.id;
            // Skip the in-game overview: the detail was already shown here on the home page.
            try { sessionStorage.setItem('dg_skip_overview', '1'); } catch (e) {}
            window.location.href = `${folderName}/index.html`;
        });
    }
}

// Close overlay with Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('gameInfoOverlay');
        if (overlay && overlay.classList.contains('active')) {
            closeGameInfo();
        }
    }
});

// Handle back button (PWA)
window.addEventListener('popstate', function (e) {
    const overlay = document.getElementById('gameInfoOverlay');
    if (overlay && overlay.classList.contains('active')) {
        e.preventDefault();
        closeGameInfo();
    }
});
