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

    const diceRow = document.getElementById('dice-row');
    const rollBtn = document.getElementById('roll-btn');
    const scorecard = document.getElementById('scorecard');
    const sparkleLayer = document.getElementById('sparkle-layer');

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
    let autoRotate = true;      // rotate the screen for players on the opposite side

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
        const rotateSel = document.getElementById('auto-rotate');
        autoRotate = rotateSel ? rotateSel.value === 'on' : true;
        // Players split into two table sides: the first half sit on one side
        // (upright), the second half on the opposite side (flipped 180°).
        const half = Math.ceil(count / 2);
        players = [];
        for (let i = 0; i < count; i++) {
            const input = document.getElementById(`player-name-${i}`);
            const name = (input && input.value.trim()) ? input.value.trim() : `${t.player} ${i + 1}`;
            const scores = {};
            ALL_KEYS.forEach(k => scores[k] = null);
            players.push({
                name,
                scores,
                color: PLAYER_COLORS[i % PLAYER_COLORS.length],
                flip: autoRotate && i >= half   // sits on the opposite side
            });
        }
        currentPlayer = 0;
        startTurn();
    });

    // Orient the play screen toward the current player. Because we only set
    // the transform to each player's side, it animates (spins) only when the
    // side actually changes between consecutive turns.
    function applyOrientation() {
        const flipped = !!players[currentPlayer].flip;
        screens.play.style.transform = flipped ? 'rotate(180deg)' : 'rotate(0deg)';
    }

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
        applyOrientation();
        renderDice();
        renderScorecard();
        updateRollUI();
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
            // Star celebration only when the five dice make a Yahtzee.
            if (counts(diceValues()).some(c => c === 5)) spawnSparkles(true);
        }, 450);
    }

    function updateRollUI() {
        const t = getGameTranslations();
        if (!hasRolled) {
            rollBtn.textContent = t.rollBtn;
        } else {
            const rollNum = MAX_ROLLS - rollsLeft;
            rollBtn.textContent = `${t.rollAgainBtn} (${t.rollLabel} ${rollNum} ${t.of} ${MAX_ROLLS})`;
        }
        rollBtn.disabled = rollsLeft <= 0 || isAnimating;
        rollBtn.classList.toggle('disabled', rollBtn.disabled);
        // Colour the roll button with the current player's colour so it's
        // always clear whose turn it is (greys out when no rolls are left).
        if (rollBtn.disabled) {
            rollBtn.style.background = '';
            rollBtn.style.color = '';
        } else {
            rollBtn.style.background = players[currentPlayer].color;
            rollBtn.style.color = '#15151f';
        }
    }

    // ===== Sparkle effect =====
    function spawnSparkles(big) {
        if (!sparkleLayer) return;
        const colors = big
            ? ['#ffd166', '#ffe9a8', '#ffffff', players[currentPlayer].color]
            : [players[currentPlayer].color, '#ffd166', '#ffffff'];
        const count = big ? 28 : 12;
        for (let i = 0; i < count; i++) {
            const s = document.createElement('span');
            s.className = 'sparkle';
            const size = (big ? 14 : 8) + Math.random() * (big ? 16 : 10);
            s.style.width = s.style.height = `${size}px`;
            s.style.left = `${5 + Math.random() * 90}%`;
            s.style.top = `${Math.random() * 75}%`;
            s.style.background = colors[Math.floor(Math.random() * colors.length)];
            s.style.setProperty('--dx', `${(Math.random() - 0.5) * (big ? 120 : 70)}px`);
            s.style.setProperty('--dy', `${-20 - Math.random() * (big ? 90 : 50)}px`);
            s.style.setProperty('--rot', `${(Math.random() - 0.5) * 240}deg`);
            s.style.animationDelay = `${Math.random() * (big ? 180 : 100)}ms`;
            sparkleLayer.appendChild(s);
            setTimeout(() => s.remove(), 1000);
        }
    }

    // ===== Scorecard (full board: all players as columns, CSS grid) =====
    function renderScorecard() {
        const t = getGameTranslations();
        const values = diceValues();
        const cur = players[currentPlayer];

        const board = document.createElement('div');
        board.className = 'board' + (animateTurn ? ' turn-enter' : '');
        board.style.gridTemplateColumns = `1.5fr repeat(${players.length}, 1fr)`;
        board.style.setProperty('--current-color', cur.color);
        board.style.setProperty('--current-soft', hexToRgba(cur.color, 0.16));
        board.style.setProperty('--current-soft2', hexToRgba(cur.color, 0.28));

        const addCell = (cls, text) => {
            const d = document.createElement('div');
            d.className = cls;
            if (text !== undefined) d.textContent = text;
            board.appendChild(d);
            return d;
        };

        // ---- Header: empty corner + one cell per player ----
        addCell('gc cathead');
        players.forEach((p, idx) => {
            const th = addCell('gc phead' + (idx === currentPlayer ? ' current' : ''), p.name);
            th.style.borderTopColor = p.color;
            if (idx === currentPlayer) th.style.background = p.color;
            else th.style.color = p.color;
        });

        const section = (txt) => addCell('gc section', txt);

        let dataIndex = 0;
        const dataRow = (key, label) => {
            const stripe = (dataIndex++ % 2 === 1) ? ' stripe' : '';
            addCell('gc cat' + (label.length > 8 ? ' long' : '') + stripe, label);
            players.forEach((p, idx) => {
                const isCur = idx === currentPlayer;
                const base = 'gc cell' + stripe + (isCur ? ' current-col' : '');
                const filled = p.scores[key] !== null;
                if (filled) {
                    addCell(base + ' scored', p.scores[key]);
                } else if (isCur && hasRolled) {
                    const preview = scoreFor(key, values);
                    const c = addCell(base + ' preview' + (preview === 0 ? ' zero' : ''), preview);
                    c.addEventListener('click', () => chooseCategory(key));
                } else {
                    addCell(base + ' empty', '·');
                }
            });
        };

        const totalRow = (label, valueFn, cls) => {
            addCell('gc cat ' + cls + (label.length > 8 ? ' long' : ''), label);
            players.forEach((p, idx) => {
                addCell('gc cell ' + cls + (idx === currentPlayer ? ' current-col' : ''), valueFn(p));
            });
        };

        // Upper section
        section(t.upperSection);
        UPPER.forEach(u => dataRow(u.key, t.categories[u.key]));
        totalRow(t.upperTotalLabel, p => `${upperSubtotal(p)}/${UPPER_BONUS_THRESHOLD}`, 'subtotal');
        totalRow(t.bonusLabel, p => `+${upperBonus(p)}`, 'subtotal');

        // Lower section
        section(t.lowerSection);
        LOWER.forEach(k => dataRow(k, t.categories[k]));

        // Grand total
        totalRow(t.totalLabel, p => playerTotal(p), 'grand');

        scorecard.innerHTML = '';
        scorecard.appendChild(board);
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
