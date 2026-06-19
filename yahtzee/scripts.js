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

    // Tournament mode detection (self-contained, read-only)
    const __isTournament = new URLSearchParams(location.search).get('mode') === 'tournament';
    let __tPlayers = [];
    if (__isTournament) { try { __tPlayers = (JSON.parse(localStorage.getItem('tournamentState')) || {}).players || []; } catch (e) {} }
    const __tNames = __tPlayers.map(p => p.name);
    const __tCount = __tNames.length;

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

    // Tournament mode: pre-fill the roster and auto-start, skipping the setup
    // screen (Yahtzee has no required human choice — names + count are enough).
    if (__isTournament && __tCount > 0) {
        const opts = Array.from(playerCountSelect.options).map(o => parseInt(o.value));
        const lo = Math.min(...opts), hi = Math.max(...opts);
        const c = Math.min(Math.max(__tCount, lo), hi);
        playerCountSelect.value = String(c);
        generatePlayerInputs();
        __tNames.slice(0, c).forEach((n, i) => {
            const inp = document.getElementById(`player-name-${i}`);
            if (inp && n) inp.value = n;
        });
        setTimeout(() => startGameBtn.click(), 0);
    }

    // Orient the play screen toward the current player. Because we only set
    // the transform to each player's side, it animates (spins) only when the
    // side actually changes between consecutive turns.
    function applyOrientation() {
        const flipped = !!players[currentPlayer].flip;
        screens.play.style.transform = flipped ? 'rotate(180deg)' : 'rotate(0deg)';
        var hb = document.querySelector('.home-button');
        if (hb) {
            hb.style.transition = 'transform 0.6s ease';
            if (flipped) {
                // move the button to the opposite corner so it lands top-left for the flipped player
                hb.style.top = 'auto';
                hb.style.left = 'auto';
                hb.style.bottom = 'max(12px, env(safe-area-inset-bottom))';
                hb.style.right = '12px';
                hb.style.transform = 'rotate(180deg)';
            } else {
                hb.style.top = '';
                hb.style.left = '';
                hb.style.bottom = '';
                hb.style.right = '';
                hb.style.transform = 'rotate(0deg)';
            }
        }
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

    // ===== Category icons (drawn as a real die / clean symbols) =====
    const UPPER_FACE = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 };
    // Standard dice pip layout on a 0..100 grid (columns/rows at 28/50/72)
    const DIE_PIPS = {
        1: [[50, 50]],
        2: [[30, 30], [70, 70]],
        3: [[30, 30], [50, 50], [70, 70]],
        4: [[30, 30], [70, 30], [30, 70], [70, 70]],
        5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
        6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]]
    };

    function svg(inner, w = 100, h = 100) {
        return `<svg class="cat-icon" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    }

    // A horizontal row of equal-spaced shapes in a wide viewBox so they stay
    // big and never touch. types: 'circle' | 'square' | 'diamond' | 'star'
    function rowIcon(types) {
        const D = 30, G = 9, M = 8, r = D / 2, cy = 50;
        const m = types.length;
        const vbW = 2 * M + m * D + (m - 1) * G;
        let inner = '';
        types.forEach((tp, i) => {
            const cx = M + r + i * (D + G);
            if (tp === 'circle') inner += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor"/>`;
            else if (tp === 'square') inner += `<rect x="${cx - r}" y="${cy - r}" width="${D}" height="${D}" rx="5" fill="currentColor"/>`;
            else if (tp === 'diamond') inner += `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" fill="currentColor"/>`;
            else if (tp === 'star') inner += star(cx, cy, r);
        });
        return svg(inner, vbW, 100);
    }

    // A white die with dark pips (like the reference). `content` overrides pips.
    function dieIcon(face, questionMark) {
        const body = `<rect x="8" y="8" width="84" height="84" rx="18" fill="#eef0f7" stroke="#c4c6d4" stroke-width="2"/>`;
        let inner = '';
        if (questionMark) {
            inner = `<text x="50" y="72" font-size="62" font-weight="800" text-anchor="middle" fill="#2b2b3a" font-family="Montserrat, Arial, sans-serif">?</text>`;
        } else {
            inner = DIE_PIPS[face].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="8.5" fill="#2b2b3a"/>`).join('');
        }
        return svg(body + inner);
    }

    function star(cx, cy, R) {
        const r = R * 0.4;
        let pts = '';
        for (let i = 0; i < 10; i++) {
            const ang = -Math.PI / 2 + i * Math.PI / 5;
            const rad = i % 2 === 0 ? R : r;
            pts += `${(cx + Math.cos(ang) * rad).toFixed(1)},${(cy + Math.sin(ang) * rad).toFixed(1)} `;
        }
        return `<polygon points="${pts.trim()}" fill="currentColor"/>`;
    }

    function categoryIconSVG(key) {
        if (UPPER_FACE[key] !== undefined) return dieIcon(UPPER_FACE[key], false);

        switch (key) {
            case 'threeKind':
                return rowIcon(['square', 'square', 'square']);
            case 'fourKind':
                return rowIcon(['circle', 'circle', 'circle', 'circle']);
            case 'fullHouse':
                // three diamonds + two squares, all on one row (like the reference)
                return rowIcon(['diamond', 'diamond', 'diamond', 'square', 'square']);
            case 'smallStraight':
            case 'largeStraight': {
                // rising bars (a run); 4 bars for small, 5 for large.
                // Bars keep the SAME width in both so the large straight's
                // bars aren't thinner than the small straight's.
                const n = key === 'smallStraight' ? 4 : 5;
                let s = '';
                const w = 14, gap = 6, base = 88;
                const total = n * w + (n - 1) * gap;
                const startX = (100 - total) / 2;
                for (let i = 0; i < n; i++) {
                    const x = startX + i * (w + gap);
                    const h = 30 + i * (58 / (n - 1));
                    s += `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="3" fill="currentColor"/>`;
                }
                return svg(s);
            }
            case 'yahtzee':
                // five stars on a single row, big and spaced
                return rowIcon(['star', 'star', 'star', 'star', 'star']);
            case 'chance':
                return dieIcon(0, true);
            default:
                return '';
        }
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
        // minmax(0,..) lets the columns shrink so long names never push the
        // board wider than the screen (they ellipsize instead).
        board.style.gridTemplateColumns = `minmax(0, 1.4fr) repeat(${players.length}, minmax(0, 1fr))`;
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

        // Smaller name font as the number of players grows, so names fit
        const nameFont = players.length <= 4 ? '0.8rem' : players.length <= 6 ? '0.7rem' : '0.62rem';

        // ---- Header: empty corner + one cell per player ----
        addCell('gc cathead');
        players.forEach((p, idx) => {
            const th = addCell('gc phead' + (idx === currentPlayer ? ' current' : ''));
            th.style.borderTopColor = p.color;
            if (idx === currentPlayer) th.style.background = p.color;
            else th.style.color = p.color;
            const nameSpan = document.createElement('span');
            nameSpan.className = 'phead-name';
            nameSpan.style.fontSize = nameFont;
            nameSpan.textContent = p.name;
            th.appendChild(nameSpan);
        });

        let dataIndex = 0;
        const dataRow = (key, label) => {
            const stripe = (dataIndex++ % 2 === 1) ? ' stripe' : '';
            const labelCell = addCell('gc cat icon-cell' + stripe);
            labelCell.innerHTML = categoryIconSVG(key);
            labelCell.setAttribute('aria-label', label);
            labelCell.title = label;
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

        // Upper section (dice-face icons, no section header)
        UPPER.forEach(u => dataRow(u.key, t.categories[u.key]));
        totalRow(t.upperTotalLabel, p => `${upperSubtotal(p)}/${UPPER_BONUS_THRESHOLD}`, 'subtotal');
        totalRow(t.bonusLabel, p => `+${upperBonus(p)}`, 'subtotal');

        // Lower section (symbol icons)
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
