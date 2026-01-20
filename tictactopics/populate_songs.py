# --- CONFIGURATION ---
LASTFM_API_KEY = "YOUR_LASTFM_API_KEY" 
JSON_PATH = r"d:\GitHubDesktop\repository\sitogiochi\tictactopics\combinazioni_canzoni.json"

# --- MAPPATURA TEMI (Modifica qui per aggiungere nuovi sinonimi) ---
# Formato: "nome_su_lastfm": "Tuo_Tema_JSON"
THEME_SYNONYMS = {
    # Esistenti
    "love": "Amore", "romance": "Amore", "romantic": "Amore",
    "sad": "Dolore", "heartbreak": "Rottura", "breakup": "Rottura",
    "party": "Festa", "dance": "Festa", "club": "Festa",
    "rebel": "Ribellione", "rebellion": "Ribellione", "protest": "Politica",
    "summer": "Estate", "beach": "Estate", "sunny": "Estate",
    "money": "Denaro", "rich": "Denaro", "wealth": "Ricchezza",
    "street": "Vita di strada", "gangsta": "Vita di strada", "hood": "Vita di strada",
    "workout": "Sport", "gym": "Sport", "fitness": "Sport",
    "car": "Macchine", "cars": "Macchine", "driving": "Macchine",
    "drugs": "Droga", "high": "Droga", "weed": "Droga",
    "power": "Successo", "ambition": "Successo", "successful": "Successo",
    "fame": "Fama", "famous": "Fama", "celebrity": "Fama",
    "freedom": "Libertà", "liberty": "Libertà",
    "lonely": "Solitudine", "loneliness": "Solitudine",
    "nostalgia": "Nostalgia", "nostalgic": "Nostalgia", "oldies": "Nostalgia",
    "social justice": "Giustizia sociale", "society": "Società",
    "god": "Religione", "faith": "Religione", "christian": "Religione",
    "war": "Guerra", "peace": "Pace",
    "death": "Morte", "funeral": "Morte",
    "mental health": "Salute mentale", "depressing": "Depressione",
    "sex": "Sessualità", "sexy": "Sessualità",
    "friendship": "Amicizia", "friends": "Amicizia",
    "growing up": "Crescita", "growth": "Crescita",
    "fun": "Divertimento", "entertainment": "Divertimento",
    "hope": "Speranza", "optimistic": "Speranza",
    "family": "Famiglia", "parents": "Famiglia",
    "respect": "Rispetto",
    "youth": "Gioventù", "teen": "Gioventù", "young": "Gioventù",
    "change": "Cambiamento",
    "obsession": "Ossessione", "obsessive": "Ossessione",
    "luxury": "Lusso", "expensive": "Lusso",
    "betrayal": "Tradimento", "cheating": "Tradimento",
    "ambition": "Ambizione",
    "lifestyle": "Stile di vita",
    "addiction": "Dipendenza", "addictive": "Dipendenza",
    "passion": "Passione", "passionate": "Passione",
    "reflection": "Riflessione", "thoughtful": "Riflessione",
    "trust": "Fiducia", "confidence": "Fiducia",
    "violence": "Violenza", "violent": "Violenza",
    "redemption": "Riscatto", "comeback": "Riscatto",
    "racism": "Razzismo", "racial": "Razzismo",
    "poverty": "Povertà", "poor": "Povertà",
    "survival": "Sopravvivenza", "survive": "Sopravvivenza",
    "pride": "Orgoglio", "proud": "Orgoglio",
    "insecurity": "Insicurezza", "insecure": "Insicurezza",
    "female empowerment": "Empowerment femminile", "girl power": "Empowerment femminile",
    "justice": "Giustizia",
    "football": "Calcio", "soccer": "Calcio",
    "suicide": "Suicidio",
    "mourning": "Lutto", "loss": "Lutto",
    "revenge": "Vendetta", "vengeful": "Vendetta",
    "anger": "Rabbia", "angry": "Rabbia", "rage": "Rabbia"
}

# --- ARTIST LISTS (Puoi aggiungere o cambiare tutti i nomi che vuoi qui sotto) ---
ARTISTS_IT = [
    "Vasco Rossi", "Ligabue", "Marracash", "Fedez", "Sfera Ebbasta", "Jovanotti", "Laura Pausini", 
    "Eros Ramazzotti", "Tiziano Ferro", "Elodie", "Mahmood", "Mina", "Adriano Celentano", 
    "Lucio Dalla", "Fabrizio De André", "Francesco De Gregori", "Zucchero", "Claudio Baglioni", 
    "Antonello Venditti", "Renato Zero", "Marco Mengoni", "Giorgia", "Elisa", "Måneskin",
    "Blanco", "Salmo", "Guè", "Ghali", "Rkomi", "Madame", "Achille Lauro", "Pinguini Tattici Nucleari",
    "Ultimo", "Irama", "Caparezza", "Subsonica", "Afterhours", "Litfiba", "883", "Max Pezzali",
    "Gigi D'Alessio", "Biagio Antonacci", "Gianluca Grignani", "Nek", "Paolo Conte", "Vinicio Capossela"
]

ARTISTS_ES = [
    "Julio Iglesias", "Enrique Iglesias", "Rosalía", "Alejandro Sanz", "David Bisbal", "Pablo Alborán",
    "Shakira", "J Balvin", "Bad Bunny", "Maluma", "Daddy Yankee", "Karol G", "Ricky Martin", 
    "Luis Fonsi", "Juanes", "Camila Cabello", "Becky G", "Ozuna", "Anuel AA", "Rauw Alejandro",
    "Manu Chao", "Jarabe de Palo", "Héroes del Silencio", "La Oreja de Van Gogh", "Amaral", 
    "Estopa", "Mecano", "Camilo Sesto", "Nino Bravo", "Raphael", "Joan Manuel Serrat"
]

ARTISTS_EN = [
    "The Beatles", "Queen", "Michael Jackson", "Madonna", "Prince", "David Bowie", "The Rolling Stones",
    "Led Zeppelin", "Pink Floyd", "Nirvana", "Drake", "The Weeknd", "Taylor Swift", "Ed Sheeran",
    "Adele", "Eminem", "Kanye West", "Travis Scott", "Kendrick Lamar", "Beyoncé", "Rihanna",
    "Coldplay", "U2", "Radiohead", "Oasis", "Arctic Monkeys", "The Smiths", "The Cure", "Depeche Mode",
    "Billie Eilish", "Dua Lipa", "Ariana Grande", "Justin Bieber", "Post Malone", "Harry Styles",
    "Bruno Mars", "Lady Gaga", "Katy Perry", "Maroon 5", "Imagine Dragons", "Linkin Park",
    "Metallica", "AC/DC", "Guns N' Roses", "Red Hot Chili Peppers", "Green Day", "Foo Fighters",
    "Bruce Springsteen", "Bob Dylan", "Elvis Presley", "Frank Sinatra", "Stevie Wonder", "Aretha Franklin"
]

# --- UTILS ---
def load_data():
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_track_info(artist, title):
    if LASTFM_API_KEY == "YOUR_LASTFM_API_KEY": return None
    url = "http://ws.audioscrobbler.com/2.0/"
    params = {"method": "track.getInfo", "api_key": LASTFM_API_KEY, "artist": artist, "track": title, "format": "json"}
    try:
        response = requests.get(url, params=params)
        return response.json()
    except: return None

def get_artist_top_tracks(artist, limit=20):
    if LASTFM_API_KEY == "YOUR_LASTFM_API_KEY": return []
    url = "http://ws.audioscrobbler.com/2.0/"
    params = {"method": "artist.getTopTracks", "api_key": LASTFM_API_KEY, "artist": artist, "limit": limit, "format": "json"}
    try:
        response = requests.get(url, params=params)
        return response.json().get('toptracks', {}).get('track', [])
    except: return []

def map_tags(tags, allowed_genres, allowed_themes):
    """Weighted mapping: a theme/genre is confirmed if its 'weight' passes a threshold."""
    found_genres = {} 
    found_themes = {} 
    
    genre_map = {g.lower(): g for g in allowed_genres}
    theme_map = {t.lower(): t for t in allowed_themes}
    
    # Mapping table for genres not already in theme_synonyms
    genre_synonyms = {
        "soul": "R&B", "electronic": "Elettronica", "hip-hop": "Hip Hop", "rap": "Rap"
    }

    for i, tag in enumerate(tags):
        tag_name = tag['name'].lower()
        rank_weight = 1.0 / (i + 1)
        
        # 1. Direct Match
        if tag_name in genre_map:
            g = genre_map[tag_name]
            found_genres[g] = found_genres.get(g, 0) + rank_weight
        elif tag_name in theme_map:
            t = theme_map[tag_name]
            found_themes[t] = found_themes.get(t, 0) + rank_weight
            
        # 2. Theme Synonym Match (Using the global THEME_SYNONYMS)
        elif tag_name in THEME_SYNONYMS:
            mapped = THEME_SYNONYMS[tag_name]
            if mapped in allowed_themes:
                found_themes[mapped] = found_themes.get(mapped, 0) + rank_weight
        
        # 3. Genre Synonym Match
        elif tag_name in genre_synonyms:
            mapped = genre_synonyms[tag_name]
            if mapped in allowed_genres:
                found_genres[mapped] = found_genres.get(mapped, 0) + rank_weight

    # Filter by weight
    final_g = [g for g, w in found_genres.items() if w > 0.05]
    final_t = [t for t, w in found_themes.items() if w > 0.05]
    
    # --- FALLBACK LOGIC ---
    # Se non troviamo temi, ne assegnamo uno basato sulla popolarità del tag o uno generico
    if not final_t:
        # Se non troviamo nulla, mettiamo placeholder come richiesto per facilitare la revisione manuale
        final_t = ["placeholder"] 
        
    if not final_g:
        final_g = ["Pop"] # Default genre
        
    return final_g, final_t

# --- MAIN LOOP ---
def process_artists(artist_list, language, data, limit_per_artist=20):
    allowed_genres = data['categories']['genere']
    allowed_themes = data['categories']['tema']
    existing_titles = {e['title'].lower() + e['autore'].lower() for e in data['entries']}
    new_entries = []

    for autore in artist_list:
        print(f"[{language}] Processing: {autore}...")
        tracks = get_artist_top_tracks(autore, limit=limit_per_artist)
        
        for track in tracks:
            title = track['name']
            if (title.lower() + autore.lower()) in existing_titles: continue
            
            print(f"  - Fetching metadata for: {title}")
            track_data = get_track_info(autore, title)
            if not track_data or 'track' not in track_data: continue
            
            tags = track_data['track'].get('toptags', {}).get('tag', [])
            genres, themes = map_tags(tags, allowed_genres, allowed_themes)
            
            # (Rimosso il skip: ora abbiamo sempre un tema di default)

            # Decade estimation (Last.fm lacks this, so we use a safe default or user can fix)
            # Future improvement: cross-reference with Spotify or MusicBrainz
            decade = "2020s" 
            
            entry = {
                "title": title,
                "autore": autore,
                "lingua": language,
                "genere": genres if len(genres) > 1 else (genres[0] if genres else "Pop"),
                "tema": themes[:3], # Keep max 3 themes for quality
                "anni": decade,
                "feat": "yes" if "feat" in title.lower() or "with" in title.lower() else "no"
            }
            new_entries.append(entry)
            existing_titles.add(title.lower() + autore.lower())
            time.sleep(0.3)

    return new_entries

def main():
    data = load_data()
    
    if LASTFM_API_KEY == "YOUR_LASTFM_API_KEY":
        print("!!! API KEY REQUIRED: https://www.last.fm/api/account/create")
        return

    all_new = []
    
    # Process Italian (Target 500 total)
    print("\n--- STARTING ITALIAN ---")
    all_new.extend(process_artists(ARTISTS_IT, "Italiano", data, limit_per_artist=15))
    
    # Process Spanish (Target 500 total shared with Italian)
    print("\n--- STARTING SPANISH ---")
    all_new.extend(process_artists(ARTISTS_ES, "Spagnolo", data, limit_per_artist=15))
    
    # Process English (Target 1000 total)
    print("\n--- STARTING ENGLISH ---")
    all_new.extend(process_artists(ARTISTS_EN, "Inglese", data, limit_per_artist=25))
    
    if all_new:
        print(f"\nSUCCESS! Added {len(all_new)} new unique entries.")
        data['entries'].extend(all_new)
        save_data(data)
    else:
        print("\nNo new entries found.")

if __name__ == "__main__":
    main()
