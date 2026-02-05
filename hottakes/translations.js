const gameTranslations = {
    'it': {
        'pageTitle': 'Hot Takes - Gioco di opinioni controverse | DrewGames',
        'metaDescription': 'Hot Takes: il gioco dove devi esprimere le tue opinioni più controverse su vari argomenti. Scopri chi ha detto cosa!',
        'home': 'Home',
        'gameTitle': '🔥 Hot Takes 🔥',
        'subtitle': 'Esprimi la tua opinione controversa!',
        'playerCountLabel': 'Numero di Giocatori:',
        'players': 'Giocatori',
        'playerPlaceholder': 'Nome giocatore',
        'startGame': 'Inizia il Gioco!',
        'categoryLabel': 'Categoria:',
        'turnOf': 'Turno di:',
        'passPhone': 'Passa il telefono a questo giocatore!',
        'writePrompt': 'Scrivi la tua Hot Take su questo argomento:',
        'inputPlaceholder': 'Es: Secondo me...',
        'submit': 'Invia',
        'ready': 'Sono pronto!',
        'revealTitle': '🔥 Hot Take Estratta 🔥',
        'revealSubtitle': 'Di chi sarà?',
        'revealAuthor': 'Svela Autore 🕵️',
        'isFrom': 'È di:',
        'nextRound': 'Prossimo Round ➜',
        'alertEmpty': 'Scrivi qualcosa!',
        'changeCategory': 'Cambia categoria'
    },
    'en': {
        'pageTitle': 'Hot Takes - Game of controversial opinions | DrewGames',
        'metaDescription': 'Hot Takes: the game where you have to express your most controversial opinions on various topics. Find out who said what!',
        'home': 'Home',
        'gameTitle': '🔥 Hot Takes 🔥',
        'subtitle': 'Express your controversial opinion!',
        'playerCountLabel': 'Number of Players:',
        'players': 'Players',
        'playerPlaceholder': 'Player Name',
        'startGame': 'Start Game!',
        'categoryLabel': 'Category:',
        'turnOf': 'Turn of:',
        'passPhone': 'Pass the phone to this player!',
        'writePrompt': 'Write your Hot Take on this topic:',
        'inputPlaceholder': 'Ex: In my opinion...',
        'submit': 'Submit',
        'ready': 'I am ready!',
        'revealTitle': '🔥 Hot Take Revealed 🔥',
        'revealSubtitle': 'Whose is it?',
        'revealAuthor': 'Reveal Author 🕵️',
        'isFrom': 'It belongs to:',
        'nextRound': 'Next Round ➜',
        'alertEmpty': 'Write something!',
        'changeCategory': 'Change category'
    }
};

function updateUILanguage() {
    const lang = localStorage.getItem('lang') || 'it';
    const translations = gameTranslations[lang];

    // Update Meta Tags and Title
    document.title = translations.pageTitle;
    document.querySelector('meta[name="description"]').setAttribute('content', translations.metaDescription);

    // Update Home Button
    const homeBtn = document.querySelector('.home-button');
    if (homeBtn) homeBtn.innerHTML = `<span class="home-icon">⌂</span> ${translations.home}`;

    // Update Setup Screen
    document.querySelector('#setup-screen h1').textContent = translations.gameTitle;
    document.querySelector('.subtitle').textContent = translations.subtitle;
    document.querySelector('label[for="player-count"]').textContent = translations.playerCountLabel;

    const countSelect = document.getElementById('player-count');
    // We need to preserve the numbers but update the word "Players"
    // This is tricky because options are static HTML. We can iterate options.
    for (let i = 0; i < countSelect.options.length; i++) {
        const val = countSelect.options[i].value;
        countSelect.options[i].text = `${val} ${translations.players}`;
    }

    const playerInputs = document.querySelectorAll('#player-names-container label');
    playerInputs.forEach(label => {
        // "Giocatore 1:" -> "Player 1:"
        const num = label.getAttribute('for').split('-')[1];
        label.textContent = `${translations.players.slice(0, -1)} ${num}:`; // Player 1
    });

    document.querySelectorAll('#player-names-container input').forEach(input => {
        const num = input.id.split('-')[1];
        input.placeholder = `${translations.playerPlaceholder} ${num}`;
    });

    document.getElementById('start-game').textContent = translations.startGame;

    // Update Input Screen
    document.querySelector('#input-screen h2').textContent = translations.categoryLabel;
    document.getElementById('reroll-category').title = translations.changeCategory;

    // Dynamic content requires updating whenever shown, handled in script.js mostly, 
    // but static parts can be done here.
    document.querySelector('.player-turn-info p:first-child').firstChild.textContent = `${translations.turnOf} `; // Careful not to overwrite span
    document.querySelector('.instruction').textContent = translations.passPhone;
    document.querySelector('.prompt').textContent = translations.writePrompt;
    document.getElementById('hot-take-input').placeholder = translations.inputPlaceholder;
    document.getElementById('submit-take').textContent = translations.submit;
    document.getElementById('reveal-input').textContent = translations.ready;

    // Update Reveal Screen
    document.querySelector('#reveal-screen h1').textContent = translations.revealTitle;
    document.querySelector('#reveal-screen .subtitle').textContent = translations.revealSubtitle;
    document.getElementById('reveal-author').textContent = translations.revealAuthor;

    // "È di:" text node before span
    const authorDisplay = document.getElementById('author-display');
    authorDisplay.firstChild.textContent = `${translations.isFrom} `;

    document.getElementById('next-round').textContent = translations.nextRound;
}
