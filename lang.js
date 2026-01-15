// Language utility for DrewGames
const translations = {
    'it': {
        // Meta data
        'pageTitle': 'DrewGames - Giochi da fare con gli amici offline',
        'pageDescription': 'DrewGames: una collezione di giochi divertenti da fare con gli amici offline. Scopri giochi interattivi come Impostor, ColorGrid, GuessThePic e molti altri!',

        // Common elements across all pages
        'home': 'Home',
        'play': 'Gioca',
        'comingSoon': 'Coming Soon',
        'newGamesComingSoon': 'Nuovi giochi in arrivo...',
        'copyright': '© 2025 partygamesdrew.com - Tutti i diritti riservati',
        'toggleLanguage': 'IT',
        'tagline': 'Svolta la serata con quei rimasti dei tuoi amici 🍺🍁',
        'subtitle': '',
        'buyMeCoffee': 'Offrice una birra',
        'italianOnly': 'Solo Italiano',

        // Navigation Items
        'navHome': 'Home',
        'navGames': 'Giochi',
        'navAbout': 'Chi Siamo',
        'navLegalHeader': 'Legale',
        'navPrivacy': 'Privacy Policy',
        'navTerms': 'Termini di Servizio',
        'navCookies': 'Cookie Policy',
        'navTournament': 'Modalità Torneo',
        'navContactsHeader': 'Contatti',

        // Games Catalog Page
        'gamesPageTitle': 'La Collezione Completa dei Giochi',
        'gamesIntro': 'Benvenuti nella nostra collezione completa di giochi! Qui puoi esplorare ogni gioco nel dettaglio, imparare come si gioca e scoprire suggerimenti per rendere l\'esperienza ancora più divertente. Tutti i nostri giochi sono progettati per essere giocati con amici offline, senza bisogno di internet dopo il caricamento iniziale.',
        'tocTitle': 'Indice dei Giochi',
        'playNow': 'Gioca Ora',
        'features': 'Caratteristiche',
        'howToPlay': 'Come Giocare',
        'playersNeeded': 'Giocatori Necessari',
        'duration': 'Durata',
        'difficulty': 'Difficoltà',
        'beginner': 'Principiante',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzato',
        'minutes': 'minuti',
        'players': 'giocatori',

        // Game titles and descriptions
        'nonhomai': {
            'title': 'Non ho mai...',
            'catchphrase': 'Il classico gioco alcolico delle confessioni!',
            'description': 'Non ho mai è il gioco perfetto per scoprire i segreti dei tuoi amici. Una frase appare sullo schermo: se l\'hai fatto, devi bere! Scegli quante frasi giocare e preparati a ridere (e bere).',
            'players': '2+ giocatori',
            'time': '10-20 minuti',
            'difficulty': 'Facile',
            'features': [
                'Centinaia di domande divertenti',
                'Modalità veloce o lunga',
                'Perfetto per rompere il ghiaccio',
                'Interfaccia stile Impostor'
            ],
            'instructions': [
                'Scegli il numero di frasi per la partita.',
                'Leggi la frase ad alta voce: "Non ho mai..."',
                'Se hai fatto quello che c\'è scritto, BEVI!',
                'Continua fino alla fine delle domande.'
            ]
        },
        'impostor': {
            'title': 'Impostor',
            'catchphrase': 'Scopri chi mente nel gruppo!',
            'description': 'Impostor è un gioco di deduzione sociale dove un giocatore è l\'impostore che non conosce l\'argomento. Gli altri giocatori devono scoprire chi è l\'impostore, mentre l\'impostore cerca di mimetizzarsi e identificare l\'argomento segreto.',
            'players': '4-12 giocatori',
            'time': '10-15 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Modalità di gioco casuale e personalizzata',
                'Centinaia di argomenti predefiniti',
                'Timer integrato per le discussioni',
                'Interfaccia semplice e intuitiva'
            ],
            'instructions': [
                'A tutti i giocatori viene mostrata una domanda segreta',
                'Un giocatore sarà scelto casualmente come impostore ed avrà una domanda simile a quella degli altri giocatori',
                'Dopo che tutti i giocatori hanno letto la domanda, si dice contemporaneamente la risposta',
                'I giocatori, dalle varie risposte, devono cercare di capire chi è l\'impostore e poi votare',
                'L\'impostore vince se non viene individuato o se indovina la domanda, altrimenti vince il gruppo'
            ]
        },
        'colorgrid': {
            'title': 'Color Grid',
            'catchphrase': 'Indovina la cella colorata segreta!',
            'description': 'In Color Grid, i giocatori devono indovinare la posizione di una cella colorata nascosta in una griglia. Ad ogni tentativo, riceveranno un indizio sulla distanza dalla cella segreta. Un gioco di logica e deduzione perfetto per sfidare gli amici!',
            'players': '2-8 giocatori',
            'time': '5-10 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Griglie di diverse dimensioni (da 5x5 a 10x10)',
                'Modalità competitiva e cooperativa',
                'Sistema di punteggi basato sui tentativi',
                'Design colorato e accattivante'
            ],
            'instructions': [
                'Scegli la dimensione della griglia',
                'Un giocatore scelto casualmente vedrà una cella colorata e dovrà scrivere una parola relativa al colore per far indovinare gli altri giocatori',
                'Gli altri giocatori fanno a turno per indovinare',
                'Chi indovina o ci va vicino prende punti',
                'Vince chi ha più punti alla fine'
            ]
        },
        'guessthepic': {
            'title': 'Guess Rush',
            'catchphrase': 'Indovina cosa mostrano le 5 immagini e accumula più punti!',
            'description': 'Guess Rush è un gioco veloce dove dovrai indovinare cosa rappresentano le cinque immagini mostrate sullo schermo. Più immagini indovini, più punti guadagni! Perfetto per mettere alla prova la tua capacità di osservazione e la tua conoscenza generale.',
            'players': '1-10 giocatori',
            'time': '5-10 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Centinaia di immagini diverse',
                'Sistema di punteggio basato sulla velocità',
                'Modalità competitiva e collaborativa',
                'Categorie tematiche variegate'
            ],
            'instructions': [
                'Viene mostrata una serie di 5 immagini sullo schermo',
                'A turno, i giocatori devono indovinare cosa rappresentano le immagini',
                'Scrivi la tua risposta il più velocemente possibile',
                'Guadagni punti in base a quante immagini indovini',
                'Vince il giocatore con più punti alla fine'
            ]
        },
        'timergame': {
            'title': 'Wordrace',
            'catchphrase': 'Corri contro il tempo in questa sfida di parole!',
            'description': 'Wordrace è un gioco frenetico dove dovrai trovare parole di una categoria specifica prima che il tempo finisca. Un ottimo modo per migliorare il tuo vocabolario e la velocità di pensiero sotto pressione!',
            'players': '2-4 giocatori',
            'time': '10-15 minuti',
            'difficulty': 'Intermedio',
            'features': [
                'Timer personalizzabile',
                'Lettera casuale ad ogni round',
                'Categorie tematiche opzionali',
                'Sistema di punteggio integrato'
            ],
            'instructions': [
                'Una categoria casuale viene estratta all\'inizio di ogni round',
                'Il timer parte immediatamente',
                'Ogni giocatore deve dire una parola che appartiene a quella categoria e premere il suo pulsante, cosi da diminuire il tempo degli altri giocatori e aumentare il proprio',
                'Non si possono ripetere parole già dette',
                'Se un giocatore non trova una parola entro il tempo limite, viene eliminato',
                'L\'ultimo giocatore rimasto vince'
            ]
        },
        'chainreaction': {
            'title': 'Chain Reaction',
            'catchphrase': 'Crea concatenazioni di parole in questa sfida a squadre!',
            'description': 'Chain Reaction è un gioco di associazioni di parole a squadre. Ogni giocatore deve dire una parola associata alla precedente, creando una catena che si sviluppa in direzioni inaspettate. Un gioco che stimola la creatività e il pensiero laterale!',
            'players': 'Qualsiasi numero (gruppi di 3)',
            'time': '15-20 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Modalità a squadre competitive',
                'Punteggio basato sulla lunghezza delle catene',
                'Categorie tematiche opzionali',
                'Timer opzionale per aumentare la difficoltà'
            ],
            'instructions': [
                'I giocatori si dividono in squadre da 3 persone',
                'In ogni squadra: 1 giocatore indovina e 2 aiutano',
                'All’inizio del turno viene generata una parola segreta',
                'A turno, i due giocatori che aiutano dicono una sola parola ciascuno',
                'Le parole devono servire a costruire una domanda per aiutare il terzo giocatore a indovinare',
                'La domanda deve iniziare obbligatoriamente con: Chi, Cosa, Come, Quando, Quale o Perché',
                'Il giocatore che indovina deve rispondere entro il tempo limite',
                'Se la risposta è corretta, la squadra guadagna 1 punto',
                'Se la risposta è sbagliata o il tempo scade, la squadra perde 1 punto',
                'È vietato dire sinonimi della parola da indovinare o dire più di una parola per turno',
                'Vince la squadra che totalizza più punti alla fine della partita'
            ]
        },
        'alphabetgame': {
            'title': 'Alphabet Game',
            'catchphrase': 'Trova parole che iniziano con una lettera specifica!',
            'description': 'Alphabet Game è un gioco di vocabolario dove i giocatori devono trovare parole che iniziano con una lettera specifica e appartengono a una categoria scelta. Un gioco stimolante che metterà alla prova la tua conoscenza e velocità di pensiero!',
            'players': '2-8 giocatori',
            'time': '10-15 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Molte categorie diverse tra cui scegliere',
                'Lettere estratte casualmente',
                'Sistema di punteggio con bonus',
                'Facile da imparare e giocare'
            ],
            'instructions': [
                'Viene scelta una categoria (es. animali, città, cibo)',
                'I giocatori a turno devono dire una parola che inizia con una lettera dell\'alfabeto e premere la lettera corrispondente',
                'La lettera diventerà grigia e non si potrà più usare',
                'Se un giocatore non trova una parola entro il tempo, perde un punto',
                'Dopo più round, vince chi ha più punti!'
            ]
        },
        'bluffme': {
            'title': 'BluffMe',
            'catchphrase': 'Riuscirai a bluffare i tuoi amici e vincere la partita?',
            'description': 'BluffMe è un gioco di bluff e intuizione dove devi contare oggetti di una determinata categoria, ma puoi anche mentire! Gli altri giocatori dovranno decidere se crederti o se metterti alla prova. Un gioco di astuzia e psicologia!',
            'players': '3-8 giocatori',
            'time': '15-20 minuti',
            'difficulty': 'Intermedio',
            'features': [
                'Meccaniche di bluff strategico',
                'Centinaia di categorie diverse',
                'Sistema di punteggio e penalità',
                'Dinamiche sociali coinvolgenti'
            ],
            'instructions': [
                'Viene scelta una categoria (es. "animali con la coda")',
                'A turno, ogni giocatore dice un numero (es. "7")',
                'Il numero deve essere maggiore di quello detto dal giocatore precedente',
                'il giocatore seguente può accettare o dubitare, accettando si continua a dire il numero, dubitando costringe il giocatore precedente ad elencare elementi di quella categoria, quanto era il numero che aveva detto',
                'Chi accetta e risponde correttamente nel tempo prestabilito guadagna punti, chi sbaglia ne perde',
                'Chi dubita correttamente guadagna punti, chi sbaglia ne perde',
                'Vince chi raggiunge per primo il punteggio stabilito'
            ]
        },
        'quizzy': {
            'title': 'Quizzy',
            'catchphrase': 'Sfida i tuoi amici in un divertente gioco a quiz!',
            'description': 'Quizzy è un gioco di quiz interattivo con migliaia di domande su vari argomenti: storia, geografia, sport, cinema, musica e molto altro. Testa le tue conoscenze contro gli amici in questa sfida all\'ultimo punto!',
            'players': '2-8 giocatori',
            'time': '15-30 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Migliaia di domande in molte categorie',
                'Livelli di difficoltà personalizzabili',
                'Sistema di punteggio con bonus',
                'Modalità a squadre opzionale'
            ],
            'instructions': [
                'Scegliete le categorie del quiz',
                'A turno, viene mostrata una domanda ai giocatori, che devono scegliere la difficolta o la categoria',
                'Rispondi il più velocemente possibile selezionando l\'opzione corretta',
                'Guadagni punti per ogni risposta corretta',
                'Vince il giocatore che per primo raggiunge i 25 punti'
            ]
        },
        'tictactopics': {
            'title': 'TicTacTopics',
            'catchphrase': 'Tris con argomenti tematici, film, serie TV e molto altro!',
            'description': 'TicTacTopics combina il classico gioco del tris con sfide di conoscenza. Per conquistare una casella, devi rispondere correttamente a una domanda sull\'argomento assegnato. Un mix perfetto di strategia e cultura generale!',
            'players': '2 giocatori',
            'time': '10-15 minuti',
            'difficulty': 'Intermedio',
            'features': [
                'Griglia 3x3 con argomenti diversi in ogni casella',
                'Oltre 20 categorie tematiche',
                'Difficoltà adattiva in base alle risposte',
                'Modalità torneo per più giocatori'
            ],
            'instructions': [
                'La griglia 3x3 contiene un argomento diverso in ogni casella',
                'A turno, i giocatori scelgono una casella da conquistare',
                'Per conquistare la casella, devi trovare una risposta che soddisfa l\'argomento della riga e della colonna',
                'Se rispondi correttamente, conquisti la casella con il tuo simbolo (X o O)',
                'Se sbagli, la casella rimane libera',
                'Vince chi forma per primo una linea di tre simboli'
            ]
        },
        'mrdrew': {
            'title': 'Mr. Drew',
            'catchphrase': 'Scopri chi non conosce la parola segreta!',
            'description': 'Mr. Drew è un gioco di deduzione sociale ispirato a "Mr. White". Un giocatore è Mr. Drew e non conosce la parola segreta, mentre i Civili (e l\'Undercover con più giocatori) devono scoprire chi è. I giocatori descrivono la loro parola a turno, cercando di identificare chi non la conosce!',
            'players': '3-12 giocatori',
            'time': '10-15 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Ruoli dinamici: Civili, Undercover e Mr. Drew',
                'Centinaia di coppie di parole',
                'Meccanica vocale senza scrittura',
                'Interfaccia semplice e intuitiva'
            ],
            'instructions': [
                'Scegli il numero di giocatori (3-10)',
                'Ogni giocatore guarda la propria parola in segreto',
                'Mr. Drew vede "???" perché non conosce la parola, l\'undercover ha una parola simile a quella del gruppo',
                'A turno, ogni giocatore dice UNA parola che descrive o ha a che fare in qualche modo il proprio termine',
                'Discutete e votate chi pensate sia Mr. Drew',
                'Se Mr. Drew viene scoperto, può provare a indovinare la parola per vincere!'
            ]
        },
        'drewnking': {
            'title': 'Drewnking Game',
            'catchphrase': 'Il gioco alcolico definitivo per feste! 🍻',
            'description': 'Drewnking Game è il party game perfetto per serate pazze con gli amici! Sfide imbarazzanti, votazioni esilaranti e regole folli che renderanno la vostra festa indimenticabile. Da giocare responsabilmente!',
            'players': '2-15 giocatori',
            'time': '20-30 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Centinaia di frasi divertenti e scorrette',
                '6 categorie diverse con colori unici',
                'Personalizzazione nomi giocatori',
                'Perfetto per feste e pre-serata'
            ],
            'instructions': [
                'Inserite i nomi dei giocatori e il numero di turni',
                'Ogni turno apparirà una frase sullo schermo',
                'Le frasi possono essere sfide, votazioni, regole o semplici domande',
                'Seguite le istruzioni della frase e divertitevi!',
                'Solo per maggiorenni - bevete responsabilmente! (si come no!)'
            ]
        },
        'hottakes': {
            'title': 'Hot Takes',
            'catchphrase': 'Opinioni controverse e dibattiti infuocati!',
            'description': 'Hot Takes è il gioco dove le opinioni contano! Scrivi la tua opinione più controversa su un argomento e lascia che gli altri indovinino di chi è. Preparati a difendere le tue idee!',
            'players': '3-10 giocatori',
            'time': '15-20 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Centinaia di argomenti diversi',
                'Modalità anonima per il massimo divertimento',
                'Perfetto per rompere il ghiaccio',
                'Scatena dibattiti esilaranti'
            ],
            'instructions': [
                'Viene mostrato un argomento (es. "Pizza con ananas")',
                'A turno, ogni giocatore scrive la sua opinione (Hot Take)',
                'Il gioco ne estrae una a caso',
                'Gli altri devono indovinare chi l\'ha scritta',
                'Si discute e si ride!'
            ]
        },
        'indovinachi': {
            'title': 'Indovina Chi',
            'catchphrase': 'Indovina la parola facendo domande!',
            'description': 'Indovina Chi è un gioco di domande dove devi indovinare una parola segreta facendo domande ai tuoi amici. Meno domande fai, più punti guadagni!',
            'players': '2-12 giocatori',
            'time': '10-20 minuti',
            'difficulty': 'Principiante',
            'features': [
                'Tre modalità di gioco: categorie scelte, casuali o personalizzate',
                'Centinaia di parole in diverse categorie',
                'Contatore domande integrato',
                'Classifica finale con punteggi'
            ],
            'instructions': [
                'Scegli il numero di giocatori e la modalità',
                'In modalità "scelte", ogni giocatore sceglie la propria categoria, in modalità "casuali", una parola random viene estratta automaticamente, in modalità "personalizzate", gli altri giocatori scrivono la parola',
                'Fai domande per indovinare la parola, il contatore tiene traccia',
                'Vince chi indovina con meno domande!'
            ]
        },
        'tournamentTitle': 'Modalità Torneo',
        'numberOfGames': 'Numero di Partite',
        'players': 'Giocatori',
        'numberOfPlayers': 'Numero di Giocatori:',
        'startTournament': 'Inizia Torneo',
        'game': 'Partita',
        'of': 'di',
        'randomGameSelected': 'Gioco Selezionato Casualmente:',
        'playGame': 'Gioca',
        'enterScores': 'Inserisci i Punteggi',
        'submitScores': 'Invia Punteggi',
        'currentRankings': 'Classifica Attuale',
        'nextGame': 'Prossima Partita',
        'endTournament': 'Termina Torneo',
        'tournamentResults': 'Risultati del Torneo',
        'newTournament': 'Nuovo Torneo',
        'points': 'punti',
        'doublePoints': '🎉 PUNTI DOPPI! 🎉',
        'doublePointsMessage': 'I punti di questo round sono stati raddoppiati!'
    },
    'en': {
        // Meta data
        'pageTitle': 'DrewGames - Games to play with friends offline',
        'pageDescription': 'DrewGames: a collection of fun games to play with friends offline. Discover interactive games like Impostor, ColorGrid, GuessThePic and many more!',

        // Common elements across all pages
        'home': 'Home',
        'play': 'Play',
        'comingSoon': 'Coming Soon',
        'newGamesComingSoon': 'New games coming soon...',
        'copyright': '© 2025 partygamesdrew.com - All rights reserved',
        'toggleLanguage': 'EN',
        'tagline': 'Liven up the night with those "fried" friends of yours 🍺🍁',
        'subtitle': '',
        'buyMeCoffee': 'Offrice una birra',
        'italianOnly': 'Italian Only',

        // Navigation Items
        'navHome': 'Home',
        'navGames': 'Games',
        'navAbout': 'About Us',
        'navLegalHeader': 'Legal',
        'navPrivacy': 'Privacy Policy',
        'navTerms': 'Terms of Service',
        'navCookies': 'Cookie Policy',
        'navTournament': 'Tournament Mode',
        'navContactsHeader': 'Contacts',

        // Games Catalog Page
        'gamesPageTitle': 'The Complete Collection of Games',
        'gamesIntro': 'Welcome to our complete collection of games! Here you can explore each game in detail, learn how to play, and discover tips to make the experience even more fun. All our games are designed to be played with friends offline, with no need for internet after the initial loading.',
        'tocTitle': 'Games Index',
        'playNow': 'Play Now',
        'features': 'Features',
        'howToPlay': 'How to Play',
        'playersNeeded': 'Players Needed',
        'duration': 'Duration',
        'difficulty': 'Difficulty',
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'minutes': 'minutes',
        'players': 'players',

        // Game titles and descriptions
        'nonhomai': {
            'title': 'Never Have I Ever',
            'catchphrase': 'The classic drinking game of confessions!',
            'description': 'Never Have I Ever is the perfect game to discover your friends\' secrets. A statement appears on screen: if you\'ve done it, take a drink! Choose how many statements to play and get ready to laugh (and drink).',
            'players': '2+ players',
            'time': '10-20 minutes',
            'difficulty': 'Easy',
            'features': [
                'Hundreds of fun questions',
                'Short or long game modes',
                'Perfect icebreaker',
                'Impostor-style interface'
            ],
            'instructions': [
                'Choose the number of statements for the game.',
                'Read the statement aloud: "Never have I ever..."',
                'If you have done it, DRINK!',
                'Continue until the end of the questions.'
            ]
        },
        'impostor': {
            'title': 'Impostor',
            'catchphrase': 'Find out who is lying in the group!',
            'description': 'Impostor is a social deduction game where one player is the impostor who doesn\'t know the topic. The other players must figure out who the impostor is, while the impostor tries to blend in and identify the secret topic.',
            'players': '4-12 players',
            'time': '10-15 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Random and custom game modes',
                'Hundreds of predefined topics',
                'Built-in timer for discussions',
                'Simple and intuitive interface'
            ],
            'instructions': [
                'One player will be randomly chosen as the impostor',
                'All other players are shown a secret topic',
                'Taking turns, each player must say a word related to the topic',
                'After several rounds, everyone votes for who they think is the impostor',
                'The impostor wins if they remain undetected or guess the topic'
            ]
        },
        'colorgrid': {
            'title': 'Color Grid',
            'catchphrase': 'Guess the secret colored cell!',
            'description': 'In Color Grid, players must guess the position of a hidden colored cell in a grid. With each attempt, they will receive a clue about the distance from the secret cell. A game of logic and deduction perfect for challenging friends!',
            'players': '2-8 players',
            'time': '5-10 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Grids of different sizes (from 5x5 to 10x10)',
                'Competitive and cooperative modes',
                'Scoring system based on attempts',
                'Colorful and engaging design'
            ],
            'instructions': [
                'Choose the grid size',
                'A colored cell is randomly hidden',
                'Players take turns guessing',
                'After each attempt, you\'re shown how close you are',
                'The player who finds the cell with fewer attempts wins'
            ]
        },
        'guessthepic': {
            'title': 'Guess Rush',
            'catchphrase': 'Guess what the 5 images show and score points!',
            'description': 'Guess Rush is a fast-paced game where you need to guess what five images on the screen represent. The faster you guess, the more points you earn! Perfect for testing your observation skills and general knowledge.',
            'players': '2-8 players',
            'time': '5-10 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Hundreds of different images',
                'Speed-based scoring system',
                'Competitive and collaborative modes',
                'Various thematic categories'
            ],
            'instructions': [
                'A series of 5 images is shown on the screen',
                'Players must guess what the images represent',
                'Write your answer as quickly as possible',
                'Earn points based on how quickly you guess',
                'The player with the most points at the end wins'
            ]
        },
        'timergame': {
            'title': 'Wordrace',
            'catchphrase': 'Race against time in this word challenge!',
            'description': 'Wordrace is a frantic game where you need to find words that start with a specific letter before time runs out. A great way to improve your vocabulary and quick thinking under pressure!',
            'players': '2-10 players',
            'time': '10-15 minutes',
            'difficulty': 'Intermediate',
            'features': [
                'Customizable timer',
                'Random letter each round',
                'Optional thematic categories',
                'Integrated scoring system'
            ],
            'instructions': [
                'A random letter is drawn at the beginning of each round',
                'The timer starts immediately',
                'Each player must say a word that starts with that letter',
                'Words cannot be repeated',
                'If a player cannot find a word within the time limit, they are eliminated',
                'The last player remaining wins'
            ]
        },
        'chainreaction': {
            'title': 'Chain Reaction',
            'catchphrase': 'Create word chains in this team challenge!',
            'description': 'Chain Reaction is a team word association game. Each player must say a word associated with the previous one, creating a chain that develops in unexpected directions. A game that stimulates creativity and lateral thinking!',
            'players': 'Any number (groups of 3)',
            'time': '15-20 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Competitive team modes',
                'Score based on chain length',
                'Optional thematic categories',
                'Optional timer to increase difficulty'
            ],
            'instructions': [
                'Players divide into teams',
                'An initial word is chosen',
                'Taking turns, each player must say a word associated with the previously said word',
                'If a player cannot find an association within the time, the chain breaks',
                'The team earns points based on the length of the chain created',
                'The team with the most points wins'
            ]
        },
        'alphabetgame': {
            'title': 'Alphabet Game',
            'catchphrase': 'Find words that start with a specific letter!',
            'description': 'Alphabet Game is a vocabulary game where players must find words that begin with a specific letter and belong to a chosen category. A stimulating game that will test your knowledge and quick thinking!',
            'players': '2-8 players',
            'time': '10-15 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Many different categories to choose from',
                'Randomly drawn letters',
                'Scoring system with bonuses',
                'Easy to learn and play'
            ],
            'instructions': [
                'A category is chosen (e.g., animals, cities, food)',
                'A random letter is drawn',
                'Players take turns saying a word that starts with that letter and belongs to the category',
                'Words cannot be repeated',
                'If a player cannot find a word within the time, they lose a point',
                'After multiple rounds, the player with the most points wins'
            ]
        },
        'bluffme': {
            'title': 'BluffMe',
            'catchphrase': 'Can you bluff your friends and win the game?',
            'description': 'BluffMe is a game of bluffing and intuition where you must count objects in a specific category, but you can also lie! Other players will have to decide whether to believe you or challenge you. A game of cunning and psychology!',
            'players': '3-8 players',
            'time': '15-20 minutes',
            'difficulty': 'Intermediate',
            'features': [
                'Strategic bluffing mechanics',
                'Hundreds of different categories',
                'Scoring and penalty system',
                'Engaging social dynamics'
            ],
            'instructions': [
                'A category is chosen (e.g., "animals with tails")',
                'Taking turns, each player says a number (e.g., "7") and an item in the category (e.g., "cat")',
                'The number must be higher than the one said by the previous player',
                'Other players can accept or doubt',
                'Correct doubters earn points, incorrect ones lose points',
                'The first player to reach the set score wins'
            ]
        },
        'quizzy': {
            'title': 'Quizzy',
            'catchphrase': 'Challenge your friends in a fun quiz game!',
            'description': 'Quizzy is an interactive quiz game with thousands of questions on various topics: history, geography, sports, movies, music, and much more. Test your knowledge against friends in this challenge to the last point!',
            'players': '2-8 players',
            'time': '15-30 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Thousands of questions in many categories',
                'Customizable difficulty levels',
                'Scoring system with bonuses',
                'Optional team mode'
            ],
            'instructions': [
                'Choose the categories and difficulty of the quiz',
                'A question is shown to all players',
                'Answer as quickly as possible by selecting the correct option',
                'Earn points for each correct answer, with bonuses for speed',
                'There may be multiple-choice or true/false questions',
                'The player with the most points at the end wins'
            ]
        },
        'tictactopics': {
            'title': 'TicTacTopics',
            'catchphrase': 'Tic-Tac-Toe with thematic topics, movies, TV shows and more!',
            'description': 'TicTacTopics combines the classic game of tic-tac-toe with knowledge challenges. To capture a square, you must correctly answer a question on the assigned topic. A perfect mix of strategy and general knowledge!',
            'players': '2 players',
            'time': '10-15 minutes',
            'difficulty': 'Intermediate',
            'features': [
                '3x3 grid with different topics in each square',
                'Over 20 thematic categories',
                'Adaptive difficulty based on responses',
                'Tournament mode for more players'
            ],
            'instructions': [
                'The 3x3 grid contains a different topic in each square',
                'Taking turns, players choose a square to capture',
                'To capture the square, you must answer a question on the topic',
                'If you answer correctly, you capture the square with your symbol (X or O)',
                'If you are wrong, the square remains free',
                'The first to form a line of three symbols wins'
            ]
        },
        'mrdrew': {
            'title': 'Mr. Drew',
            'catchphrase': 'Find out who doesn\'t know the secret word!',
            'description': 'Mr. Drew is a social deduction game inspired by "Mr. White". One player is Mr. Drew and doesn\'t know the secret word, while Civilians (and the Undercover with more players) must find out who it is. Players describe their word in turns, trying to identify who doesn\'t know it!',
            'players': '3-12 players',
            'time': '10-15 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Dynamic roles: Civilians, Undercover (6+ players) and Mr. Drew',
                'Hundreds of word pairs',
                'Voice-based gameplay without writing',
                'Simple and intuitive interface'
            ],
            'instructions': [
                'Choose the number of players (3-10)',
                'Each player secretly views their word',
                'Mr. Drew sees "???" because they don\'t know the word',
                'Taking turns, each player says ONE word that describes their term',
                'Discuss and vote on who you think is Mr. Drew',
                'If Mr. Drew is caught, they can try to guess the word to win!'
            ]
        },
        'drewnking': {
            'title': 'Drewnking Game',
            'catchphrase': 'The ultimate drinking game for parties! 🍻',
            'description': 'Drewnking Game is the perfect party game for crazy nights with friends! Embarrassing challenges, hilarious votes and wild rules that will make your party unforgettable. Play responsibly!',
            'players': '2-15 players',
            'time': '20-30 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Hundreds of fun and naughty phrases',
                '6 different categories with unique colors',
                'Player name customization',
                'Perfect for parties and pre-gaming'
            ],
            'instructions': [
                'Enter player names and number of rounds',
                'Each round a phrase will appear on screen',
                'Phrases can be challenges, votes, rules or simple questions',
                'Follow the phrase instructions and have fun!',
                'Adults only - drink responsibly!'
            ]
        },
        'hottakes': {
            'title': 'Hot Takes',
            'catchphrase': 'Controversial opinions and fiery debates!',
            'description': 'Hot Takes is the game where opinions matter! Write your most controversial opinion on a topic and let others guess who wrote it. Get ready to defend your ideas!',
            'players': '3-10 players',
            'time': '15-20 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Hundreds of different topics',
                'Anonymous mode for maximum fun',
                'Perfect icebreaker',
                'Sparks hilarious debates'
            ],
            'instructions': [
                'A topic is shown (e.g. "Pineapple on pizza")',
                'Taking turns, each player writes their opinion (Hot Take)',
                'The game randomly picks one',
                'Others must guess who wrote it',
                'Discuss and laugh!'
            ]
        },
        'indovinachi': {
            'title': 'Guess Who',
            'catchphrase': 'Guess the word by asking questions!',
            'description': 'Guess Who is a question game where you must guess a secret word by asking your friends questions. The fewer questions you ask, the more points you earn!',
            'players': '2-12 players',
            'time': '10-20 minutes',
            'difficulty': 'Beginner',
            'features': [
                'Three game modes: chosen, random or custom categories',
                'Hundreds of words in different categories',
                'Built-in question counter',
                'Final leaderboard with scores'
            ],
            'instructions': [
                'Choose the number of players and game mode',
                'In "chosen" mode, each player picks the category for others',
                'In "random" mode, a random word is automatically selected',
                'In "custom" mode, other players write the word',
                'Ask questions to guess the word, the counter keeps track',
                'The one who guesses with fewer questions wins!'
            ]
        },
        'tournamentTitle': 'Tournament Mode',
        'numberOfGames': 'Number of Games',
        'players': 'Players',
        'numberOfPlayers': 'Number of Players:',
        'startTournament': 'Start Tournament',
        'game': 'Game',
        'of': 'of',
        'randomGameSelected': 'Random Game Selected:',
        'playGame': 'Play Game',
        'enterScores': 'Enter Game Scores',
        'submitScores': 'Submit Scores',
        'currentRankings': 'Current Rankings',
        'nextGame': 'Next Game',
        'endTournament': 'End Tournament',
        'tournamentResults': 'Tournament Results',
        'newTournament': 'New Tournament',
        'points': 'points',
        'doublePoints': '🎉 DOUBLE POINTS! 🎉',
        'doublePointsMessage': 'This round\'s points were doubled!'
    }
};

// Flag SVGs for language toggle
const flagSVGs = {
    'it': `
        <!-- Italian flag -->
        <rect width="640" height="480" fill="#ffffff"/>
        <rect width="213.3" height="480" fill="#009246"/>
        <rect width="213.3" height="480" x="426.7" fill="#ce2b37"/>
    `,
    'en': `
        <!-- UK flag (Union Jack) - Improved version -->
        <rect width="640" height="480" fill="#012169"/>
        <path d="M0,0 L640,480 M640,0 L0,480" stroke="#ffffff" stroke-width="96"/>
        <path d="M0,0 L640,480 M640,0 L0,480" stroke="#c8102e" stroke-width="64"/>
        <rect width="640" height="96" y="192" fill="#ffffff"/>
        <rect width="96" height="480" x="272" fill="#ffffff"/>
        <rect width="640" height="48" y="216" fill="#c8102e"/>
        <rect width="48" height="480" x="296" fill="#c8102e"/>
    `
};

// Function to get user's language preference
function getUserLanguage() {
    // Check if language is specified in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang === 'en' || urlLang === 'it') {
        // Store the URL language preference in localStorage
        localStorage.setItem('lang', urlLang);
        return urlLang;
    }

    // Check if a language is stored in localStorage
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
        return storedLang;
    }

    // If no stored preference, try to detect based on browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    console.log('Detected browser language:', browserLang);

    // More specific check for Italian language
    if (browserLang === 'it' || browserLang === 'it-it' || browserLang.startsWith('it-')) {
        localStorage.setItem('lang', 'it');
        return 'it';
    } else {
        // Default to English for any other language
        localStorage.setItem('lang', 'en');
        return 'en';
    }
}

// Function to set the user's language preference
function setUserLanguage(lang) {
    if (lang !== 'en' && lang !== 'it') {
        lang = 'en'; // Default to English for invalid values
    }
    localStorage.setItem('lang', lang);
    return lang;
}

// Function to toggle between languages
function toggleLanguage() {
    const currentLang = getUserLanguage();
    const newLang = currentLang === 'it' ? 'en' : 'it';
    setUserLanguage(newLang);

    // Update URL if needed
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
}

// Function to get a translation
function getTranslation(key, subKey = null) {
    const lang = getUserLanguage();

    if (subKey) {
        // For nested translations like game titles/descriptions
        if (translations[lang][key] && translations[lang][key][subKey]) {
            return translations[lang][key][subKey];
        }
        // Fallback to English if translation not found
        return translations['en'][key][subKey];
    } else {
        // For top-level translations
        if (translations[lang][key]) {
            return translations[lang][key];
        }
        // Fallback to English if translation not found
        return translations['en'][key];
    }
}

// Function to check if we're on the main page
function isMainPage() {
    // If we're at the root or index.html, it's the main page
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/index.html') || path === '/sitogiochi/' || path.endsWith('/sitogiochi/index.html');
}

// Function to set the flag icon based on current language
function setFlagIcon() {
    const currentFlag = document.getElementById('currentFlag');
    if (currentFlag) {
        const lang = getUserLanguage();
        currentFlag.innerHTML = flagSVGs[lang];

        // Set aria-label for accessibility
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            const nextLang = lang === 'it' ? 'en' : 'it';
            languageToggle.setAttribute('aria-label', `Switch to ${nextLang === 'en' ? 'English' : 'Italian'}`);
        }
    }
}

// Apply translations to the current page
function applyTranslations() {
    // Debug language detection
    console.log('Language detection debug:');
    console.log('- URL parameter:', new URLSearchParams(window.location.search).get('lang'));
    console.log('- localStorage lang:', localStorage.getItem('lang'));
    console.log('- navigator.language:', navigator.language);
    console.log('- navigator.userLanguage:', navigator.userLanguage);
    console.log('- document.documentElement.lang:', document.documentElement.lang);
    console.log('- Selected language:', getUserLanguage());

    const lang = getUserLanguage();
    document.documentElement.lang = lang;

    // Update meta tags if they exist
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        document.title = getTranslation('pageTitle');
    }

    const pageDescription = document.getElementById('pageDescription');
    if (pageDescription) {
        pageDescription.setAttribute('content', getTranslation('pageDescription'));
    }

    // Handle language toggle - only show on main page
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        if (isMainPage()) {
            languageToggle.style.display = 'flex';
            setFlagIcon();
        } else {
            languageToggle.style.display = 'none';
        }
    }
}