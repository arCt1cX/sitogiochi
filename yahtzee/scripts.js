document.addEventListener('DOMContentLoaded', () => {
    // ===== Category configuration =====
    const UPPER = [
        { key: 'ones', face: 1 },
        { key: 'twos', face: 2 },
        { key: 'threes', face: 3 },
        { key: 'fours', face: 4 },
        { key: 'fives', face: 5 },
        { key: 'sixes', face: 6 }
    ];
    const LOWER = ['threeKind', 'fourKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'];
    const ALL_KEYS = [...UPPER.map(u => u.key), ...LOWER];
    const UPPER_BONUS_THRESHOLD = 63;
    const UPPER_BONUS = 35;
    const MAX_ROLLS = 3;

    // ===== DOM =====
    const screens = {
        setup: document.getElementById('setup-screen'),
        intro: document.getElementById('turn-intro-screen'),
        play: document.getElementById('play-screen'),
        gameover: document.getElementById('gameover-screen')
    };
    const playerCountSelect = document.getElementById('player-count');
    const playerNamesContainer = document.getElementById('player-names-container');
    const startGameBtn = document.getElementById('start-game');

    const introPlayerName = document.getElementById('intro-player-name');
    const introPlayerInline = document.getElementById('intro-player-inline');
    const introStandings = document.getElementById('intro-standings');
    const startTurnBtn = document.getElementById('start-turn');

    const turnBanner = document.getElementById('turn-banner');
    const scoreboardChips = document.getElementById('scoreboard-chips');
    const diceRow = document.getElementById('dice-row');
    const diceHint = document.getElementById('dice-hint');
    const rollBtn = document.getElementById('roll-btn');
    const scorecard = document.getElementById('scorecard');

    const winnerNameEl = document.getElementById('winner-name');
    const finalStandings = document.getElementById('final-standings');
    const playAgainBtn = document.getElementById('play-again');

    if (typeof applyGameTranslations === 'function') applyGameTranslations();

    // ===== State =====
    let players = [];           // { name, scores: {key: number|null} }
    let currentPlayer = 0;
    let dice = [];              // { value, held }
    let rollsLeft = MAX_ROLLS;
    let hasRolled = false;
    let isAnimating = false;

    // ===== Helpers =====
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
    }
    function pointsLabel(n) {
        const t = getGameTranslations();
        return Math.abs(n) === 1 ? t.pointSingular : t.pointPlural;
    }
    function randDie() { return 1 + Math.floor(Math.random() * 6); }

    // ===== Scoring =====
    function counts(values) {
        const c = [0, 0, 0, 0, 0, 0, 0];
        values.forEach(v => c[v]++);
        return c;
    }
    function sum(values) { return values.reduce((a, b) => a + b, 0); }

    function scoreFor(key, values) {
        const c = counts(values);
        const s = sum(values);
        switch (key) {
            case 'ones': return c[1] * 1;
            case 'twos': return c[2] * 2;
            case 'threes': return c[3] * 3;
            case 'fours': return c[4] * 4;
            case 'fives': return c[5] * 5;
            case 'sixes': return c[6] * 6;
            case 'threeKind': return c.some(x => x >= 3) ? s : 0;
            case 'fourKind': return c.some(x => x >= 4) ? s : 0;
            case 'fullHouse': {
                const has3 = c.some(x => x === 3);
                const has2 = c.some(x => x === 2);
                return (has3 && has2) ? 25 : 0;
            }
            case 'smallStraight': {
                const set = new Set(values);
                const runs = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
                return runs.some(r => r.every(n => set.has(n))) ? 30 : 0;
            }
            case 'largeStraight': {
                const set = new Set(values);
                const runs = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
                return runs.some(r => r.every(n => set.has(n))) ? 40 : 0;
            }
            case 'yahtzee': return c.some(x => x === 5) ? 50 : 0;
            case 'chance': return s;
            default: return 0;
        }
    }

    function diceValues() { return dice.map(d => d.value); }

    function upperSubtotal(player) {
        return UPPER.reduce((acc, u) => acc + (player.scores[u.key] || 0), 0);
    }
    function upperBonus(player) {
        return upperSubtotal(player) >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS : 0;
    }
    function lowerTotal(player) {
        return LOWER.reduce((acc, k) => acc + (player.scores[k] || 0), 0);
    }
    function playerTotal(player) {
        return upperSubtotal(player) + upperBonus(player) + lowerTotal(player);
    }

    // ===== Setup =====
    function generatePlayerInputs() {
        const t = getGameTranslations();
        const count = parseInt(playerCountSelect.value);
        const existing = {};
        playerNamesContainer.querySelectorAll('input').forEach((inp, i) => existing[i] = inp.value);
        playerNamesContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-name-${i}`;
            input.maxLength = 20;
            input.autocomplete = 'off';
            input.placeholder = t.playerNamePlaceholder.replace('{n}', i + 1);
            if (existing[i]) input.value = existing[i];
            playerNamesContainer.appendChild(input);
        }
    }
    playerCountSelect.addEventListener('change', generatePlayerInputs);
    generatePlayerInputs();

    startGameBtn.addEventListener('click', () => {
        const t = getGameTranslations();
        const count = parseInt(playerCountSelect.value);
        players = [];
        for (let i = 0; i < count; i++) {
            const input = document.getElementById(`player-name-${i}`);
            const name = (input && input.value.trim()) ? input.value.trim() : `${t.player} ${i + 1}`;
            const scores = {};
            ALL_KEYS.forEach(k => scores[k] = null);
            players.push({ name, scores });
        }
        currentPlayer = 0;
        showTurnIntro();
    });

    // ===== Standings =====
    function renderStandings(container) {
        container.innerHTML = '';
        const ranked = players
            .map((p, idx) => ({ name: p.name, total: playerTotal(p), idx }))
            .sort((a, b) => b.total - a.total);
        const top = ranked.length ? ranked[0].total : 0;
        ranked.forEach(p => {
            const row = document.createElement('div');
            row.className = 'standings-row';
            if (p.total === top && top > 0) row.classList.add('leader');
            const name = document.createElement('span');
            name.className = 'rank-name';
            name.textContent = p.name;
            const score = document.createElement('span');
            score.className = 'rank-score';
            score.textContent = `${p.total} ${pointsLabel(p.total)}`;
            row.appendChild(name);
            row.appendChild(score);
            container.appendChild(row);
        });
    }

    function renderScoreboardChips() {
        scoreboardChips.innerHTML = '';
        players.forEach((p, idx) => {
            const chip = document.createElement('div');
            chip.className = 'score-chip' + (idx === currentPlayer ? ' active' : '');
            chip.innerHTML = `<span class="chip-name">${p.name}</span><span class="chip-score">${playerTotal(p)}</span>`;
            scoreboardChips.appendChild(chip);
        });
    }

    // ===== Turn intro =====
    function showTurnIntro() {
        const p = players[currentPlayer];
        introPlayerName.textContent = p.name;
        introPlayerInline.textContent = p.name;
        renderStandings(introStandings);
        showScreen('intro');
    }

    startTurnBtn.addEventListener('click', startTurn);

    function startTurn() {
        rollsLeft = MAX_ROLLS;
        hasRolled = false;
        dice = [0, 1, 2, 3, 4].map(() => ({ value: 0, held: false }));
        renderDice();
        renderBanner();
        renderScoreboardChips();
        renderScorecard();
        updateRollUI();
        showScreen('play');
    }

    function renderBanner() {
        const t = getGameTranslations();
        turnBanner.textContent = `${players[currentPlayer].name}`;
    }

    // ===== Dice =====
    const PIPS = {
        1: [[50, 50]],
        2: [[28, 28], [72, 72]],
        3: [[28, 28], [50, 50], [72, 72]],
        4: [[28, 28], [72, 28], [28, 72], [72, 72]],
        5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
        6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]]
    };

    function dieFaceSVG(value) {
        let pips = '';
        if (value >= 1 && value <= 6) {
            pips = PIPS[value].map(([cx, cy]) =>
                `<circle cx="${cx}" cy="${cy}" r="9" fill="currentColor" />`).join('');
        }
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${pips}</svg>`;
    }

    function renderDice() {
        diceRow.innerHTML = '';
        dice.forEach((d, i) => {
            const die = document.createElement('button');
            die.className = 'die' + (d.held ? ' held' : '') + (d.value === 0 ? ' empty' : '');
            die.setAttribute('aria-label', `die ${i + 1}`);
            die.innerHTML = dieFaceSVG(d.value);
            die.addEventListener('click', () => toggleHold(i));
            diceRow.appendChild(die);
        });
    }

    function toggleHold(i) {
        if (isAnimating || !hasRolled || rollsLeft === 0) return;
        if (dice[i].value === 0) return;
        dice[i].held = !dice[i].held;
        renderDice();
    }

    rollBtn.addEventListener('click', rollDice);

    function rollDice() {
        if (isAnimating || rollsLeft <= 0) return;
        isAnimating = true;
        rollsLeft--;
        hasRolled = true;

        // Mark rolling dice with animation
        const dieEls = diceRow.querySelectorAll('.die');
        dice.forEach((d, i) => {
            if (!d.held) dieEls[i].classList.add('rolling');
        });
        rollBtn.disabled = true;

        setTimeout(() => {
            dice.forEach(d => { if (!d.held) d.value = randDie(); });
            isAnimating = false;
            renderDice();
            renderScorecard();
            updateRollUI();
        }, 450);
    }

    function updateRollUI() {
        const t = getGameTranslations();
        if (!hasRolled) {
            rollBtn.textContent = t.rollBtn;
            diceHint.textContent = t.rollToStart;
        } else {
            const rollNum = MAX_ROLLS - rollsLeft;
            rollBtn.textContent = `${t.rollAgainBtn} (${t.rollLabel} ${rollNum} ${t.of} ${MAX_ROLLS})`;
            diceHint.textContent = rollsLeft > 0 ? t.holdHint : t.chooseHint;
        }
        rollBtn.disabled = rollsLeft <= 0 || isAnimating;
        rollBtn.classList.toggle('disabled', rollBtn.disabled);
    }

    // ===== Scorecard =====
    function renderScorecard() {
        const t = getGameTranslations();
        const p = players[currentPlayer];
        const values = diceValues();
        scorecard.innerHTML = '';

        const makeSectionTitle = (txt) => {
            const h = document.createElement('div');
            h.className = 'section-title';
            h.textContent = txt;
            return h;
        };

        const makeRow = (key, label) => {
            const filled = p.scores[key] !== null;
            const row = document.createElement('button');
            row.className = 'score-row';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'score-name';
            nameSpan.textContent = label;
            const valSpan = document.createElement('span');
            valSpan.className = 'score-value';

            if (filled) {
                row.classList.add('filled');
                valSpan.textContent = p.scores[key];
            } else if (hasRolled) {
                row.classList.add('available');
                const preview = scoreFor(key, values);
                valSpan.textContent = preview;
                valSpan.classList.add('preview');
                if (preview === 0) valSpan.classList.add('zero');
                row.addEventListener('click', () => chooseCategory(key));
            } else {
                row.classList.add('locked');
                valSpan.textContent = '–';
            }
            row.appendChild(nameSpan);
            row.appendChild(valSpan);
            return row;
        };

        // Upper section
        scorecard.appendChild(makeSectionTitle(t.upperSection));
        UPPER.forEach(u => scorecard.appendChild(makeRow(u.key, t.categories[u.key])));

        // Upper subtotal + bonus
        const sub = upperSubtotal(p);
        scorecard.appendChild(makeTotalRow(t.upperTotalLabel, `${sub} / ${UPPER_BONUS_THRESHOLD}`));
        scorecard.appendChild(makeTotalRow(t.bonusLabel, `+${upperBonus(p)}`));

        // Lower section
        scorecard.appendChild(makeSectionTitle(t.lowerSection));
        LOWER.forEach(k => scorecard.appendChild(makeRow(k, t.categories[k])));

        // Grand total
        scorecard.appendChild(makeTotalRow(t.totalLabel, playerTotal(p), true));
    }

    function makeTotalRow(label, value, grand) {
        const row = document.createElement('div');
        row.className = 'total-row' + (grand ? ' grand' : '');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'score-name';
        nameSpan.textContent = label;
        const valSpan = document.createElement('span');
        valSpan.className = 'score-value';
        valSpan.textContent = value;
        row.appendChild(nameSpan);
        row.appendChild(valSpan);
        return row;
    }

    function chooseCategory(key) {
        if (!hasRolled || isAnimating) return;
        const p = players[currentPlayer];
        if (p.scores[key] !== null) return;
        p.scores[key] = scoreFor(key, diceValues());
        endTurn();
    }

    // ===== End turn / game =====
    function endTurn() {
        if (isGameComplete()) {
            showGameOver();
            return;
        }
        currentPlayer = (currentPlayer + 1) % players.length;
        showTurnIntro();
    }

    function isGameComplete() {
        return players.every(p => ALL_KEYS.every(k => p.scores[k] !== null));
    }

    function showGameOver() {
        const ranked = players.slice().sort((a, b) => playerTotal(b) - playerTotal(a));
        const top = playerTotal(ranked[0]);
        const winners = players.filter(p => playerTotal(p) === top);
        winnerNameEl.textContent = winners.map(w => w.name).join(' & ');
        renderStandings(finalStandings);
        showScreen('gameover');
    }

    playAgainBtn.addEventListener('click', () => {
        players.forEach(p => ALL_KEYS.forEach(k => p.scores[k] = null));
        currentPlayer = 0;
        showScreen('setup');
    });
});
