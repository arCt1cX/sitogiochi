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
    // Distinct, dark-bg-friendly colour per player
    const PLAYER_COLORS = ['#bb86fc', '#03dac6', '#f4be67', '#ff7eb6', '#4da3ff', '#7bd88f', '#ff8a5c', '#c08bff'];

    function hexToRgba(hex, a) {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // ===== DOM =====
    const screens = {
        setup: document.getElementById('setup-screen'),
        play: document.getElementById('play-screen'),
        gameover: document.getElementById('gameover-screen')
    };
    const playerCountSelect = document.getElementById('player-count');
    const playerNamesContainer = document.getElementById('player-names-container');
    const startGameBtn = document.getElementById('start-game');

    const turnBanner = document.getElementById('turn-banner');
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
    let animateTurn = false;    // play the "new player" animation on next render

    // ===== Helpers =====
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
        // Lock the page to the viewport while playing so the board scrolls
        // internally and the dice stay pinned at the bottom.
        document.body.classList.toggle('playing', name === 'play');
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
            players.push({ name, scores, color: PLAYER_COLORS[i % PLAYER_COLORS.length] });
        }
        currentPlayer = 0;
        startTurn();
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

    // ===== Turn start =====
    function startTurn() {
        rollsLeft = MAX_ROLLS;
        hasRolled = false;
        animateTurn = true;     // trigger the player-change animation
        dice = [0, 1, 2, 3, 4].map(() => ({ value: 0, held: false }));
        showScreen('play');
        renderDice();
        renderBanner();
        renderScorecard();
        updateRollUI();
    }

    function renderBanner() {
        const t = getGameTranslations();
        const p = players[currentPlayer];
        turnBanner.innerHTML = `<span class="banner-dot" style="background:${p.color}"></span>` +
            `<span class="banner-name" style="color:${p.color}">${p.name}</span>`;
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

    // ===== Scorecard (full board: all players as columns) =====
    function renderScorecard() {
        const t = getGameTranslations();
        const values = diceValues();
        const cur = players[currentPlayer];

        const table = document.createElement('table');
        table.className = 'board' + (animateTurn ? ' turn-enter' : '');
        table.style.setProperty('--current-color', cur.color);
        table.style.setProperty('--current-soft', hexToRgba(cur.color, 0.16));
        table.style.setProperty('--current-soft2', hexToRgba(cur.color, 0.28));

        // ---- Header: category column + one column per player ----
        const thead = document.createElement('thead');
        const hr = document.createElement('tr');
        const corner = document.createElement('th');
        corner.className = 'cat-head';
        hr.appendChild(corner);
        players.forEach((p, idx) => {
            const th = document.createElement('th');
            th.className = 'player-head' + (idx === currentPlayer ? ' current' : '');
            th.style.borderTopColor = p.color;
            if (idx === currentPlayer) {
                th.style.background = p.color;
            } else {
                th.style.color = p.color;
            }
            th.textContent = p.name;
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        const sectionRow = (txt) => {
            const tr = document.createElement('tr');
            tr.className = 'section';
            const td = document.createElement('td');
            td.colSpan = players.length + 1;
            td.textContent = txt;
            tr.appendChild(td);
            tbody.appendChild(tr);
        };

        const dataRow = (key, label) => {
            const tr = document.createElement('tr');
            const labelTd = document.createElement('td');
            labelTd.className = 'cat' + (label.length > 8 ? ' long' : '');
            labelTd.textContent = label;
            tr.appendChild(labelTd);

            players.forEach((p, idx) => {
                const td = document.createElement('td');
                td.className = 'cell';
                if (idx === currentPlayer) td.classList.add('current-col');
                const filled = p.scores[key] !== null;

                if (filled) {
                    td.classList.add('scored');
                    td.textContent = p.scores[key];
                } else if (idx === currentPlayer && hasRolled) {
                    const preview = scoreFor(key, values);
                    td.classList.add('preview');
                    if (preview === 0) td.classList.add('zero');
                    td.textContent = preview;
                    td.addEventListener('click', () => chooseCategory(key));
                } else {
                    td.classList.add('empty');
                    td.textContent = '·';
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        };

        const totalRow = (label, valueFn, cls) => {
            const tr = document.createElement('tr');
            tr.className = cls;
            const labelTd = document.createElement('td');
            labelTd.className = 'cat' + (label.length > 8 ? ' long' : '');
            labelTd.textContent = label;
            tr.appendChild(labelTd);
            players.forEach((p, idx) => {
                const td = document.createElement('td');
                td.className = 'cell';
                if (idx === currentPlayer) td.classList.add('current-col');
                td.textContent = valueFn(p);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        };

        // Upper section
        sectionRow(t.upperSection);
        UPPER.forEach(u => dataRow(u.key, t.categories[u.key]));
        totalRow(t.upperTotalLabel, p => `${upperSubtotal(p)}/${UPPER_BONUS_THRESHOLD}`, 'subtotal');
        totalRow(t.bonusLabel, p => `+${upperBonus(p)}`, 'subtotal');

        // Lower section
        sectionRow(t.lowerSection);
        LOWER.forEach(k => dataRow(k, t.categories[k]));

        // Grand total
        totalRow(t.totalLabel, p => playerTotal(p), 'grand');

        table.appendChild(tbody);
        scorecard.innerHTML = '';
        scorecard.appendChild(table);
        animateTurn = false;    // one-shot: don't replay on subsequent re-renders (rolls)
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
        startTurn();
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
