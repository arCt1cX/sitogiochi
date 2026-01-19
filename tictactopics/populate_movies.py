import requests
import json
import os
import re
import time
from datetime import datetime

# CONFIGURATION
API_KEY = "your_api_key"
TARGET_FILE = r"d:\GitHubDesktop\repository\sitogiochi\tictactopics\combinazioni_film_e_serie.json"
BASE_URL = "https://api.themoviedb.org/3"
LANGUAGE = "it-IT"

# THRESHOLDS
MIN_VOTES_MOVIE = 2000
MIN_VOTES_TV = 1500

# EXCLUSIONS
FORBIDDEN_KEYWORDS = ["Making of", "Anniversary", "BTS", "Special", "Commemorative", "Torneo", "20° anniversario", "25° anniversario"]
FORBIDDEN_GENRES = ["Documentario"]

# MAPPINGS
GENRE_MAP = {
    28: "Azione", 12: "Avventura", 16: "Animazione", 35: "Commedia",
    80: "Crime", 99: "Documentario", 18: "Dramma", 14: "Fantasy",
    36: "Storico", 27: "Horror", 10402: "Musica", 9648: "Mistero",
    10749: "Romantico", 878: "Fantascienza", 53: "Thriller",
    37: "Western", 10752: "Guerra",
    10759: ["Azione", "Avventura"], 10765: ["Fantascienza", "Fantasy"],
    10768: ["Guerra", "Politica"], 10762: "Animazione", 10751: "Famiglia"
}

LANG_MAP = {
    "en": "Inglese", "it": "Italiano", "fr": "Francese",
    "es": "Spagnolo", "ja": "Giapponese", "ko": "Coreano"
}

KEYWORD_THEME_MAP = {
    "space": "Avventura spaziale", "spazio": "Avventura spaziale",
    "robot": "Robot/AI", "artificial intelligence": "Robot/AI",
    "magic": "Magia", "magia": "Magia",
    "mafia": "Mafia", "crime": "Crimine", "criminalità": "Crimine",
    "future": "Futuristico", "futuro": "Futuristico",
    "coming of age": "Coming of Age",
    "supernatural": "Soprannaturale", "soprannaturale": "Soprannaturale",
    "post-apocalyptic": "Post-apocalittico", "post apocalittico": "Post-apocalittico",
    "politics": "Politica", "politica": "Politica",
    "survival": "Sopravvivenza", "soprannaturale": "Soprannaturale",
    "friendship": "Amicizia", "family": "Famiglia", "love": "Amore",
    "mystery": "Mistero", "time travel": "Viaggi nel tempo",
    "revenge": "Vendetta", "superhero": "Supereroi", "medical": "Medicina",
    "law": "Legge", "school": "Scuola/Università", "animals": "Animali",
    "police": "Poliziesco", "prison": "Carcere", "sport": "Sport",
    "videogame": "Videogiochi", "cooking": "Cucina", "cars": "Auto",
    "vampire": "Vampiri", "zombie": "Zombie", "alien": "Alieni", "drug": "Droghe",
    "espionage": "Spionaggio", "spy": "Spionaggio"
}

# CURATED LIST OF CLASSICS/MUST-HAVES
MUST_SEARCH = [
    # User requests
    "Spider-Man", "Sleepers", "On the Waterfront", "Buen Camino", "Red Rooms", "Detachment", "Spider",
    # Mainstream Icons
    "Il Padrino", "Pulp Fiction", "Schindler's List", "Il Cavaliere Oscuro", "Forrest Gump",
    "Inception", "Il Signore degli Anelli", "Matrix", "Quei Bravi Ragazzi", "Star Wars",
    "Seven", "Il Silenzio degli Innocenti", "La Vita è Bella", "Salvate il Soldato Ryan",
    "Interstellar", "Il Miglio Verde", "Fight Club", "Ritorno al Futuro", "Indiana Jones",
    "Titanic", "Alien", "I Predatori dell'Arca Perduta", "Gladiatore", "Shining",
    "Django Unchained", "The Departed", "C'era una volta in America", "Nuovo Cinema Paradiso",
    "Psycho", "Il Buono, il Brutto, il Cattivo", "Apocalypse Now", "2001: Odissea nello spazio",
    "Taxi Driver", "Arancia Meccanica", "Wall-E", "Toy Story", "Il Re Leone",
    "Alla ricerca di Nemo", "Joker", "Parasite", "The Wolf of Wall Street", "Braveheart",
    "Gran Torino", "Shutter Island", "V per Vendetta", "Truman Show", "Eternal Sunshine of the Spotless Mind",
    "Sesto Senso", "Up", "Monsters & Co.", "Ratatouille", "Guerre Stellari", "Aliens",
    "Top Gun", "Die Hard", "Arma Letale", "Rambo", "Rocky", "Terminator", "Jurassic Park",
    "Harry Potter", "Il Gladiatore", "Blade Runner", "Vertigo", "Quarto Potere",
    "Casablanca", "La finestra sul cortile", "Eva contro Eva", "Viale del tramonto",
    "A qualcuno piace caldo", "Cantando sotto la pioggia", "Il mago di Oz",
    "Ben-Hur", "Lawrence d'Arabia", "Il dottor Zivago", "Spartacus", "I dieci comandamenti",
    # Series
    "Breaking Bad", "The Wire", "I Soprano", "Game of Thrones", "Better Call Saul",
    "Succession", "The Bear", "The Office", "Friends", "Seinfeld", "The Crown",
    "Chernobyl", "True Detective", "Stranger Things", "Narcos", "Dark", "Mindhunter",
    "Black Mirror", "Lost", "The Last of Us", "Arcane", "Bojack Horseman", "Fargo"
]

def is_western(text):
    if not text: return True
    cjk_pattern = re.compile(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\uac00-\ud7af]')
    return not bool(cjk_pattern.search(text))

def load_json(filepath):
    if not os.path.exists(filepath): return None
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def fetch_data(endpoint, params={}):
    params['api_key'] = API_KEY
    params['language'] = params.get('language', LANGUAGE)
    response = requests.get(f"{BASE_URL}/{endpoint}", params=params)
    if response.status_code == 200: return response.json()
    return None

def get_western_string(text, tmdb_id, type_str):
    if is_western(text): return text
    res = fetch_data(f"{type_str}/{tmdb_id}", {'language': 'en-US'})
    if res:
        alt = res.get('title') if type_str == 'movie' else res.get('name')
        if is_western(alt): return alt
    return text

def get_western_name(person_id):
    res = fetch_data(f"person/{person_id}", {'language': 'en-US'})
    if not res: return None
    name = res.get('name')
    if is_western(name): return name
    for alias in res.get('also_known_as', []):
        if is_western(alias): return alias
    return name

def get_decade(date_str):
    try:
        if not date_str: return None
        year = int(date_str.split('-')[0])
        if 1960 <= year < 1970: return "Anni '60"
        if 1970 <= year < 1980: return "Anni '70"
        if 1980 <= year < 1990: return "Anni '80"
        if 1990 <= year < 2000: return "Anni '90"
        if 2000 <= year < 2010: return "Anni 2000"
        if 2010 <= year < 2020: return "Anni 2010"
        if 2020 <= year < 2030: return "Anni 2020"
        return None 
    except: return None

def map_entry(item, type_str, bypass_threshold=False):
    is_movie = type_str == 'movie'
    tmdb_id = item['id']
    
    # 1. POPULARITY FILTER
    vote_count = item.get('vote_count', 0)
    vote_min = MIN_VOTES_MOVIE if is_movie else MIN_VOTES_TV
    if not bypass_threshold and vote_count < vote_min: return None
    
    # 2. KEYWORD FILTER (Anniversaries, Specials, etc.)
    title = item.get('title') if is_movie else item.get('name')
    if not title: return None
    for fk in FORBIDDEN_KEYWORDS:
        if fk.lower() in title.lower(): return None

    # 3. GENRE FILTER
    mapped_genres = set()
    for gid in item.get('genre_ids', []):
        val = GENRE_MAP.get(gid)
        if val == "Documentario": return None # Skip Documentaries
        if isinstance(val, list): mapped_genres.update(val)
        elif val: mapped_genres.add(val)
    if not mapped_genres: return None

    # 4. BASIC MAPPINGS
    title = get_western_string(title, tmdb_id, type_str)
    date_key = 'release_date' if is_movie else 'first_air_date'
    decade = get_decade(item.get(date_key))
    if not decade: return None

    orig_lang = item.get('original_language')
    lang = LANG_MAP.get(orig_lang, "Inglese" if orig_lang == 'en' else None)
    if not lang: return None

    # Credits & Westernization
    credits = fetch_data(f"{type_str}/{tmdb_id}/credits")
    people = []
    if credits:
        for c in credits.get('cast', [])[:4]:
            p_name = get_western_name(c['id'])
            if p_name: people.append(p_name)
        if is_movie:
            for c in credits.get('crew', []):
                if c['job'] == 'Director':
                    p_name = get_western_name(c['id'])
                    if p_name: people.append(p_name)
        else:
            details = fetch_data(f"tv/{tmdb_id}")
            if details:
                for c in details.get('created_by', []):
                    p_name = get_western_name(c['id'])
                    if p_name: people.append(p_name)
    people = list(set(people))
    
    # Keywords
    kw_endpoint = f"{type_str}/{tmdb_id}/keywords"
    kw_data = fetch_data(kw_endpoint)
    themes = set()
    if kw_data:
        kws = kw_data.get('keywords' if is_movie else 'results', [])
        for k in kws:
            name = k['name'].lower()
            if name in KEYWORD_THEME_MAP:
                themes.add(KEYWORD_THEME_MAP[name])
    
    if not themes:
        if "Guerra" in mapped_genres: themes.add("Guerra")
        if "Crime" in mapped_genres: themes.add("Crimine")
        if "Fantasy" in mapped_genres: themes.add("Fantasy")

    return {
        "title": title,
        "tipo": "Film" if is_movie else "Serie TV",
        "genere": list(mapped_genres),
        "lingua": lang,
        "decennio": decade,
        "regista o attore": people if len(people) > 1 else (people[0] if people else []),
        "tema": list(themes) if len(themes) > 1 else (list(themes)[0] if themes else "")
    }

def process_results(results, type_str, existing_titles, new_entries, bypass_threshold=False):
    for item in results:
        title = item.get('title') if type_str == 'movie' else item.get('name')
        if not title: continue
        norm_title = title.lower().strip()
        if norm_title in existing_titles: continue
        
        entry = map_entry(item, type_str, bypass_threshold=bypass_threshold)
        if entry:
            new_entries.append(entry)
            existing_titles.add(entry['title'].lower().strip())
            print(f"Added {entry['tipo']}: {entry['title']} ({item.get('vote_count')} votes)")

def populate():
    data = load_json(TARGET_FILE)
    if not data: return

    # --- CLEANUP PHASE ---
    # (Skip print for brevity)
    original_count = len(data['entries'])
    cleaned_entries = []
    removed_junk = 0
    for e in data['entries']:
        # 1. Remove non-western
        western_ok = is_western(e['title'])
        # 2. Remove Forbidden keywords in title
        keyword_ok = True
        for fk in FORBIDDEN_KEYWORDS:
            if fk.lower() in e['title'].lower():
                keyword_ok = False
                break
        # 3. Remove Documentaries (explicitly in genere list)
        genre_list = e.get('genere', [])
        if isinstance(genre_list, str): genre_list = [genre_list]
        doc_ok = "Documentario" not in genre_list
        
        if western_ok and keyword_ok and doc_ok:
            cleaned_entries.append(e)
        else:
            removed_junk += 1
    
    data['entries'] = cleaned_entries
    print(f"Cleanup: Removed {removed_junk} low-quality/non-Western/Documentary entries.")
    
    existing_titles = set(entry['title'].lower().strip() for entry in data['entries'])
    new_entries = []

    # --- POPULATION PHASE ---
    # 1. CURATED SEARCH
    print("\n--- RUNNING CURATED SEARCH ---")
    for query in MUST_SEARCH:
        res = fetch_data("search/multi", {'query': query})
        if res:
            for item in res.get('results', []):
                t = item.get('media_type')
                if t in ['movie', 'tv']:
                    process_results([item], t, existing_titles, new_entries, bypass_threshold=True)

    # 2. TOP RATED FETCHING
    print("\n--- FETCHING TOP RATED CONTENT ---")
    endpoints = [
        ("movie/top_rated", "movie"),
        ("tv/top_rated", "tv")
    ]
    for endpoint, t in endpoints:
        print(f"Fetching {endpoint}...")
        for page in range(1, 20): # 20 pages
            res = fetch_data(endpoint, {'page': page})
            if not res: break
            process_results(res.get('results', []), t, existing_titles, new_entries, bypass_threshold=False)

    # Final Save
    data['entries'].extend(new_entries)
    save_json(TARGET_FILE, data)
    print(f"\nDone! Added {len(new_entries)} High-Quality entries.")
    print(f"Final entry count: {len(data['entries'])}")

if __name__ == "__main__":
    populate()
