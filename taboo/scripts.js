document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    const screens = {
        setup: document.getElementById('setup-screen'),
        intro: document.getElementById('turn-intro-screen'),
        play: document.getElementById('play-screen'),
        summary: document.getElementById('summary-screen'),
        victory: document.getElementById('victory-screen')
    };

    const teamCountSelect = document.getElementById('team-count');
    const teamNamesContainer = document.getElementById('team-names-container');
    const roundTimeSelect = document.getElementById('round-time');
    const targetScoreSelect = document.getElementById('target-score');
    const skipPenaltySelect = document.getElementById('skip-penalty');
    const startGameBtn = document.getElementById('start-game');

    const introTeamName = document.getElementById('intro-team-name');
    const introTeamNameInline = document.getElementById('intro-team-name-inline');
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
        teams: [],           // { name, score }
        currentTeamIndex: 0,
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

    // ===== Setup: generate team name inputs =====
    function generateTeamInputs() {
        const t = getGameTranslations();
        const count = parseInt(teamCountSelect.value);
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
            input.placeholder = t.teamNamePlaceholder.replace('{n}', i + 1);
            input.autocomplete = 'off';
            if (existing[i]) input.value = existing[i];
            teamNamesContainer.appendChild(input);
        }
    }

    teamCountSelect.addEventListener('change', generateTeamInputs);
    generateTeamInputs();

    // ===== Standings rendering =====
    function renderStandings(container, highlightLeader = true) {
        const t = getGameTranslations();
        container.innerHTML = '';
        const sorted = gameState.teams
            .map((team, idx) => ({ ...team, idx }))
            .sort((a, b) => b.score - a.score);
        const topScore = sorted.length ? sorted[0].score : 0;
        sorted.forEach(team => {
            const row = document.createElement('div');
            row.className = 'standings-row';
            if (highlightLeader && team.score === topScore && topScore > 0) {
                row.classList.add('leader');
            }
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

    // ===== Start Game =====
    startGameBtn.addEventListener('click', () => {
        const t = getGameTranslations();
        const count = parseInt(teamCountSelect.value);
        const teams = [];
        for (let i = 0; i < count; i++) {
            const input = document.getElementById(`team-name-${i}`);
            const name = (input && input.value.trim())
                ? input.value.trim()
                : `${t.team} ${i + 1}`;
            teams.push({ name, score: 0 });
        }
        gameState.teams = teams;
        gameState.currentTeamIndex = 0;
        gameState.roundTime = parseInt(roundTimeSelect.value);
        gameState.targetScore = parseInt(targetScoreSelect.value);
        gameState.skipPenalty = parseInt(skipPenaltySelect.value);

        buildDeck();
        showTurnIntro();
    });

    // ===== Turn Intro =====
    function showTurnIntro() {
        const team = gameState.teams[gameState.currentTeamIndex];
        introTeamName.textContent = team.name;
        introTeamNameInline.textContent = team.name;
        renderStandings(introStandings);
        showScreen('intro');
    }

    startTurnBtn.addEventListener('click', startRound);

    // ===== Round Play =====
    function startRound() {
        const team = gameState.teams[gameState.currentTeamIndex];
        gameState.roundScore = 0;
        roundScoreEl.textContent = '0';
        playTeamName.textContent = team.name;
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
        if (timeLeft <= 0) {
            endRound();
        }
    }

    function updateTimerUI() {
        timerDisplay.textContent = Math.max(timeLeft, 0);
        const pct = Math.max((timeLeft / gameState.roundTime) * 100, 0);
        timerBar.style.width = `${pct}%`;
        if (timeLeft <= 10) {
            timerDisplay.classList.add('low');
        } else {
            timerDisplay.classList.remove('low');
        }
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

    correctBtn.addEventListener('click', () => {
        gameState.roundScore += 1;
        roundScoreEl.textContent = gameState.roundScore;
        nextCard();
    });

    skipBtn.addEventListener('click', () => {
        if (gameState.skipPenalty > 0) {
            gameState.roundScore -= gameState.skipPenalty;
            roundScoreEl.textContent = gameState.roundScore;
        }
        nextCard();
    });

    tabooBtn.addEventListener('click', () => {
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
        const team = gameState.teams[gameState.currentTeamIndex];
        team.score += gameState.roundScore;

        const t = getGameTranslations();
        summaryResult.innerHTML =
            `<span class="team-highlight">${team.name}</span> ${t.roundResultText} ` +
            `<span class="points-highlight">${gameState.roundScore}</span> ${t.pointsThisRound}.`;
        renderStandings(summaryStandings);

        // Check victory
        const winners = gameState.teams.filter(tm => tm.score >= gameState.targetScore);
        if (winners.length > 0) {
            showVictory();
        } else {
            showScreen('summary');
        }
    }

    nextTeamBtn.addEventListener('click', () => {
        gameState.currentTeamIndex =
            (gameState.currentTeamIndex + 1) % gameState.teams.length;
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
        gameState.currentTeamIndex = 0;
        gameState.roundScore = 0;
        showScreen('setup');
    });
});
