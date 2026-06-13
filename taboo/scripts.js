document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    const screens = {
        setup: document.getElementById('setup-screen'),
        intro: document.getElementById('turn-intro-screen'),
        play: document.getElementById('play-screen'),
        summary: document.getElementById('summary-screen'),
        victory: document.getElementById('victory-screen')
    };

    const modeSelect = document.getElementById('mode-select');
    const teamCountLabel = document.getElementById('teamCountLabel');
    const teamCountSelect = document.getElementById('team-count');
    const teamNamesContainer = document.getElementById('team-names-container');
    const roundTimeSelect = document.getElementById('round-time');
    const targetScoreSelect = document.getElementById('target-score');
    const skipPenaltySelect = document.getElementById('skip-penalty');
    const startGameBtn = document.getElementById('start-game');

    const introTitle = document.getElementById('turnIntroTitleText');
    const introTeamName = document.getElementById('intro-team-name');
    const introTeamNameInline = document.getElementById('intro-team-name-inline');
    const passToDescriberText = document.getElementById('passToDescriberText');
    const describerHintText = document.getElementById('describerHintText');
    const ffaRoles = document.getElementById('ffa-roles');
    const roleDescriber = document.getElementById('role-describer');
    const roleGuesser = document.getElementById('role-guesser');
    const roleControllers = document.getElementById('role-controllers');
    const introStandings = document.getElementById('intro-standings');
    const startTurnBtn = document.getElementById('start-turn');

    const playTeamName = document.getElementById('play-team-name');
    const timerDisplay = document.getElementById('timer-display');
    const timerBar = document.getElementById('timer-bar');
    const roundScoreEl = document.getElementById('round-score');
    const guessWord = document.getElementById('guess-word');
    const tabooList = document.getElementById('taboo-list');
    const correctBtn = document.getElementById('correct-btn');
    const skipBtn = document.getElementById('skip-btn');
    const tabooBtn = document.getElementById('taboo-btn');

    const summaryResult = document.getElementById('summary-result');
    const summaryStandings = document.getElementById('summary-standings');
    const nextTeamBtn = document.getElementById('next-team');

    const winnerName = document.getElementById('winner-name');
    const finalStandings = document.getElementById('final-standings');
    const playAgainBtn = document.getElementById('play-again');

    // Apply translations as soon as possible
    if (typeof applyGameTranslations === 'function') applyGameTranslations();

    // ===== Game State =====
    let cards = [];
    let deck = [];           // shuffled indexes still to be drawn
    let gameState = {
        mode: 'teams',          // 'teams' | 'ffa'
        teams: [],              // participants: { name, score } (teams or individual players)
        turnCount: 0,
        currentIndex: 0,        // active team (teams mode)
        describerIndex: 0,      // active describer (ffa mode)
        guesserIndex: 1,        // active guesser (ffa mode)
        roundTime: 60,
        targetScore: 20,
        skipPenalty: 0,
        roundScore: 0,
        currentCard: null
    };
    let timerId = null;
    let timeLeft = 0;

    // ===== Load Cards =====
    async function loadCards() {
        try {
            const t = (typeof getGameTranslations === 'function')
                ? getGameTranslations()
                : { cardsFile: 'taboo_cards_it.txt' };
            const response = await fetch(t.cardsFile);
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim().length > 0);
            cards = lines.map(line => {
                const [word, tabooPart] = line.split('|');
                const tabooWords = (tabooPart || '').split(',').map(w => w.trim()).filter(Boolean);
                return { word: word.trim(), tabooWords };
            }).filter(c => c.word);
            console.log(`Loaded ${cards.length} taboo cards`);
        } catch (err) {
            console.error('Error loading taboo cards:', err);
            cards = [];
        }
    }
    loadCards();

    // ===== Helpers =====
    function shuffle(array) {
        const a = array.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function buildDeck() {
        deck = shuffle(cards.map((_, i) => i));
    }

    function drawCard() {
        if (deck.length === 0) buildDeck();
        const idx = deck.pop();
        return cards[idx];
    }

    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
    }

    function pointsLabel(n) {
        const t = getGameTranslations();
        return Math.abs(n) === 1 ? t.pointSingular : t.pointPlural;
    }

    function isFFA() {
        return gameState.mode === 'ffa';
    }

    // ===== Setup: mode + count + name inputs =====
    function generateNameInputs() {
        const t = getGameTranslations();
        const count = parseInt(teamCountSelect.value);
        const ffa = modeSelect.value === 'ffa';
        const placeholder = ffa ? t.playerNamePlaceholder : t.teamNamePlaceholder;
        const existing = {};
        teamNamesContainer.querySelectorAll('input').forEach((input, i) => {
            existing[i] = input.value;
        });
        teamNamesContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `team-name-${i}`;
            input.maxLength = 20;
            input.placeholder = placeholder.replace('{n}', i + 1);
            input.autocomplete = 'off';
            if (existing[i]) input.value = existing[i];
            teamNamesContainer.appendChild(input);
        }
    }

    function updateModeUI() {
        const t = getGameTranslations();
        const ffa = modeSelect.value === 'ffa';
        teamCountLabel.textContent = ffa ? t.playerCountLabel : t.teamCountLabel;

        const prev = parseInt(teamCountSelect.value);
        const min = ffa ? 3 : 2;
        const max = ffa ? 10 : 4;
        teamCountSelect.innerHTML = '';
        for (let v = min; v <= max; v++) {
            const o = document.createElement('option');
            o.value = String(v);
            o.textContent = `${v} ${ffa ? t.players : t.teams}`;
            teamCountSelect.appendChild(o);
        }
        teamCountSelect.value = (prev >= min && prev <= max) ? String(prev) : String(ffa ? 3 : 2);
        generateNameInputs();
    }

    modeSelect.addEventListener('change', updateModeUI);
    teamCountSelect.addEventListener('change', generateNameInputs);
    updateModeUI();

    // ===== Standings rendering =====
    function renderStandings(container) {
        container.innerHTML = '';
        const sorted = gameState.teams
            .map((team, idx) => ({ ...team, idx }))
            .sort((a, b) => b.score - a.score);
        const topScore = sorted.length ? sorted[0].score : 0;
        sorted.forEach(team => {
            const row = document.createElement('div');
            row.className = 'standings-row';
            if (team.score === topScore && topScore > 0) row.classList.add('leader');
            const name = document.createElement('span');
            name.className = 'rank-name';
            name.textContent = team.name;
            const score = document.createElement('span');
            score.className = 'rank-score';
            score.textContent = `${team.score} ${pointsLabel(team.score)}`;
            row.appendChild(name);
            row.appendChild(score);
            container.appendChild(row);
        });
    }

    // ===== Free-for-all role assignment =====
    function computeFFARoles() {
        const n = gameState.teams.length;
        const d = gameState.turnCount % n;
        let g = (d + 1 + Math.floor(gameState.turnCount / n)) % n;
        if (g === d) g = (g + 1) % n;
        return { d, g };
    }

    // ===== Start Game =====
    startGameBtn.addEventListener('click', () => {
        const t = getGameTranslations();
        const count = parseInt(teamCountSelect.value);
        gameState.mode = modeSelect.value;
        const unit = isFFA() ? t.player : t.team;
        const teams = [];
        for (let i = 0; i < count; i++) {
            const input = document.getElementById(`team-name-${i}`);
            const name = (input && input.value.trim())
                ? input.value.trim()
                : `${unit} ${i + 1}`;
            teams.push({ name, score: 0 });
        }
        gameState.teams = teams;
        gameState.turnCount = 0;
        gameState.currentIndex = 0;
        gameState.roundTime = parseInt(roundTimeSelect.value);
        gameState.targetScore = parseInt(targetScoreSelect.value);
        gameState.skipPenalty = parseInt(skipPenaltySelect.value);

        buildDeck();
        showTurnIntro();
    });

    // ===== Turn Intro =====
    function showTurnIntro() {
        const t = getGameTranslations();
        if (isFFA()) {
            const { d, g } = computeFFARoles();
            gameState.describerIndex = d;
            gameState.guesserIndex = g;
            const describer = gameState.teams[d];
            const guesser = gameState.teams[g];
            const controllers = gameState.teams
                .filter((_, i) => i !== d && i !== g)
                .map(p => p.name);

            introTitle.textContent = t.turnIntroTitleFFA;
            introTeamName.textContent = describer.name;
            ffaRoles.classList.remove('hidden');
            roleDescriber.textContent = describer.name;
            roleGuesser.textContent = guesser.name;
            roleControllers.textContent = controllers.length ? controllers.join(', ') : '—';
            passToDescriberText.textContent = t.passToDescriberFFA;
            introTeamNameInline.textContent = describer.name;
            describerHintText.textContent = t.describerHintFFA;
        } else {
            gameState.currentIndex = gameState.turnCount % gameState.teams.length;
            const team = gameState.teams[gameState.currentIndex];
            introTitle.textContent = t.turnIntroTitle;
            introTeamName.textContent = team.name;
            ffaRoles.classList.add('hidden');
            passToDescriberText.textContent = t.passToDescriber;
            introTeamNameInline.textContent = team.name;
            describerHintText.textContent = t.describerHint;
        }
        renderStandings(introStandings);
        showScreen('intro');
    }

    startTurnBtn.addEventListener('click', startRound);

    // ===== Round Play =====
    function startRound() {
        const t = getGameTranslations();
        gameState.roundScore = 0;
        roundScoreEl.textContent = '0';

        if (isFFA()) {
            const describer = gameState.teams[gameState.describerIndex];
            const guesser = gameState.teams[gameState.guesserIndex];
            playTeamName.textContent = `${describer.name} ${t.playVs} ${guesser.name}`;
        } else {
            playTeamName.textContent = gameState.teams[gameState.currentIndex].name;
        }

        timeLeft = gameState.roundTime;
        updateTimerUI();
        showScreen('play');
        nextCard();

        if (timerId) clearInterval(timerId);
        timerId = setInterval(tick, 1000);
    }

    function tick() {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) endRound();
    }

    function updateTimerUI() {
        timerDisplay.textContent = Math.max(timeLeft, 0);
        const pct = Math.max((timeLeft / gameState.roundTime) * 100, 0);
        timerBar.style.width = `${pct}%`;
        timerDisplay.classList.toggle('low', timeLeft <= 10);
    }

    function nextCard() {
        const card = drawCard();
        gameState.currentCard = card;
        guessWord.textContent = card.word;
        tabooList.innerHTML = '';
        card.tabooWords.forEach(w => {
            const li = document.createElement('li');
            li.textContent = w;
            tabooList.appendChild(li);
        });
    }

    // Apply a score delta to the player(s) earning points this turn.
    // In teams mode the active team earns; in FFA both describer and guesser earn.
    function awardPoints(delta, describerOnly) {
        if (isFFA()) {
            gameState.teams[gameState.describerIndex].score += delta;
            if (!describerOnly) gameState.teams[gameState.guesserIndex].score += delta;
        } else {
            gameState.teams[gameState.currentIndex].score += delta;
        }
    }

    correctBtn.addEventListener('click', () => {
        awardPoints(1, false);          // both describer and guesser earn
        gameState.roundScore += 1;
        roundScoreEl.textContent = gameState.roundScore;
        nextCard();
    });

    skipBtn.addEventListener('click', () => {
        if (gameState.skipPenalty > 0) {
            awardPoints(-gameState.skipPenalty, true);
            gameState.roundScore -= gameState.skipPenalty;
            roundScoreEl.textContent = gameState.roundScore;
        }
        nextCard();
    });

    tabooBtn.addEventListener('click', () => {
        awardPoints(-1, true);          // only the describer is penalised
        gameState.roundScore -= 1;
        roundScoreEl.textContent = gameState.roundScore;
        nextCard();
    });

    // ===== End Round =====
    function endRound() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        const t = getGameTranslations();

        if (isFFA()) {
            const describer = gameState.teams[gameState.describerIndex];
            const guesser = gameState.teams[gameState.guesserIndex];
            summaryResult.innerHTML =
                `<span class="team-highlight">${describer.name}</span> ${t.roundResultAnd} ` +
                `<span class="team-highlight">${guesser.name}</span> ${t.roundResultTextFFA} ` +
                `<span class="points-highlight">${gameState.roundScore}</span> ${t.pointsThisRound}.`;
            nextTeamBtn.textContent = t.nextTeamBtnFFA;
        } else {
            const team = gameState.teams[gameState.currentIndex];
            summaryResult.innerHTML =
                `<span class="team-highlight">${team.name}</span> ${t.roundResultText} ` +
                `<span class="points-highlight">${gameState.roundScore}</span> ${t.pointsThisRound}.`;
            nextTeamBtn.textContent = t.nextTeamBtn;
        }

        renderStandings(summaryStandings);

        const winners = gameState.teams.filter(tm => tm.score >= gameState.targetScore);
        if (winners.length > 0) {
            showVictory();
        } else {
            showScreen('summary');
        }
    }

    nextTeamBtn.addEventListener('click', () => {
        gameState.turnCount++;
        showTurnIntro();
    });

    // ===== Victory =====
    function showVictory() {
        const sorted = gameState.teams.slice().sort((a, b) => b.score - a.score);
        const top = sorted[0].score;
        const winners = sorted.filter(tm => tm.score === top);
        winnerName.textContent = winners.map(w => w.name).join(' & ');
        renderStandings(finalStandings);
        showScreen('victory');
    }

    playAgainBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        gameState.teams.forEach(tm => tm.score = 0);
        gameState.turnCount = 0;
        gameState.currentIndex = 0;
        gameState.roundScore = 0;
        showScreen('setup');
    });
});
