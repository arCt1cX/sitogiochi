# 🍺 Drewnking Game

## Descrizione
Drewnking Game è il party game definitivo per serate pazze con gli amici! Un gioco alcolico divertente con sfide imbarazzanti, votazioni esilaranti e regole folli.

⚠️ **ATTENZIONE**: Gioco riservato ai maggiorenni. Bevi responsabilmente!

## 🎮 Come Giocare

1. **Setup**: Inserisci il numero di giocatori (2-10) e i loro nomi
2. **Scegli i turni**: Decidi quanti turni giocare (15, 20, 25 o 30)
3. **Inizia**: Ogni turno apparirà una frase sullo schermo
4. **Segui le istruzioni**: Completa le sfide o bevi come indicato
5. **Prossima frase**: Clicca il pulsante per passare alla frase successiva

## 📋 Tipologie di Frasi

### 🍷 Normal (Rosso scuro - #8B0000)
Frasi standard per far bere i giocatori, possono essere:
- **Singole**: Rivolte a un giocatore specifico
- **Di gruppo**: Rivolte a tutti i giocatori

Esempi:
- "{player} deve bere un sorso se si è mai pisciato addosso"
- "Tutti bevono se hanno mai fatto l'autostop"

### 💪 Challenge (Arancione - #FF4500)
Sfide da completare o bere, possono essere:
- **Singole**: Un giocatore deve fare qualcosa
- **Di gruppo**: Tutti i giocatori partecipano

Esempi:
- "{player} deve fare 10 flessioni o bere 3 sorsi"
- "Tutti devono mostrare l'ultimo messaggio inviato o bere"

### 🗳️ Vote (Blu - #1E90FF)
Solo di gruppo - votazioni dove qualcuno deve bere

Esempi:
- "Chi tra voi è più probabile che diventi ricco? L'ultimo a indicare qualcuno beve 2 sorsi"
- "Chi tra voi bacia peggio? Votate, il vincitore beve"

### 📜 Rule (Rosa fucsia - #FF1493)
Nuove regole da seguire durante il gioco, possono essere:
- **Singole**: Un giocatore crea una regola
- **Di gruppo**: Regola valida per tutti

Esempi:
- "{player} crea una nuova regola: ogni volta che qualcuno dice 'io' deve bere"
- "Nuova regola: vietato dire parolacce, chi sbaglia beve"

## 📁 Struttura File

```
drewnking/
├── index.html          # Pagina principale del gioco
├── styles.css          # Stili con colori per ogni categoria
├── script.js           # Logica del gioco
├── phrases.json        # Database frasi
└── README.md          # Questa documentazione
```

## 📝 Formato JSON Frasi

```json
{
  "category_name": {
    "color": "#HEXCOLOR",
    "phrases": [
      "Frase con {player} placeholder",
      "Frase senza placeholder per tutti"
    ]
  }
}
```

### Placeholder `{player}`
- Viene sostituito automaticamente con il nome di un giocatore casuale
- Usa `{player}` per frasi rivolte a un singolo giocatore
- Ometti `{player}` per frasi rivolte a tutti

## ✨ Caratteristiche

- ✅ Responsive design ottimizzato per mobile
- ✅ Personalizzazione nomi giocatori
- ✅ Scelta numero turni (15-30)
- ✅ 4 categorie con colori distinti
- ✅ Oltre 45 frasi di esempio
- ✅ Sistema anti-ripetizione frasi
- ✅ Animazioni smooth
- ✅ Integrazione con modalità torneo

## 🎨 Palette Colori

| Categoria | Colore | Hex |
|-----------|--------|-----|
| Normal | Rosso scuro | #8B0000 |
| Challenge | Arancione | #FF4500 |
| Vote | Blu | #1E90FF |
| Rule | Rosa fucsia | #FF1493 |

## 🔧 Aggiungere Nuove Frasi

Per aggiungere nuove frasi, modifica il file `phrases.json`:

1. Scegli la categoria appropriata
2. Aggiungi la frase all'array `phrases`
3. Usa `{player}` se vuoi che sia personalizzata
4. Salva il file

Esempio:
```json
{
  "normal": {
    "color": "#8B0000",
    "phrases": [
      "{player} deve bere se ha mai fatto bungee jumping",
      "Tutti bevono se hanno mai viaggiato all'estero"
    ]
  }
}
```

## 🎯 Best Practices

- ⚠️ Gioca solo con maggiorenni
- 💧 Bevi acqua tra un drink e l'altro
- 🚗 Non guidare dopo aver giocato
- 👥 Rispetta i limiti di tutti
- 🎉 Divertiti responsabilmente!

## 🌍 Multilingua

Al momento il gioco è disponibile solo in italiano. Il supporto multilingua potrebbe essere aggiunto in futuro.

## 📱 Compatibilità

- ✅ Chrome/Edge (consigliato)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ PWA compatible

## 🎮 Modalità Torneo

Il gioco è compatibile con la modalità torneo di DrewGames:
- Accetta parametro `?mode=tournament`
- Mostra pulsante "Return to Tournament"
- Integrato nel sistema di rotazione giochi

---

**Creato da DrewGames** | [partygamesdrew.com](https://www.partygamesdrew.com)
