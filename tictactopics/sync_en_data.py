import requests
import json
import os
import time

# CONFIGURATION
API_KEY = "d64b0e74dd3da4c49477add8eefea0ee"
IT_FILE = r"d:\GitHubDesktop\repository\sitogiochi\tictactopics\combinazioni_film_e_serie.json"
EN_FILE = r"d:\GitHubDesktop\repository\sitogiochi\tictactopics\combinazioni_film_e_serie_en.json"
BASE_URL = "https://api.themoviedb.org/3"

MIN_VOTES_IT_FOR_EN = 5000

# REVERSE MAPPINGS (IT -> EN)
GENRE_MAP_IT_EN = {
    "Azione": "Action", "Commedia": "Comedy", "Fantascienza": "Sci-Fi",
    "Dramma": "Drama", "Horror": "Horror", "Animazione": "Animation",
    "Avventura": "Adventure", "Thriller": "Thriller", "Romantico": "Romance",
    "Documentario": "Documentary", "Supereroi": "Superhero", "Fantasy": "Fantasy",
    "Crime": "Crime", "Storico": "Historical", "Sociale": "Social",
    "Filosofico": "Philosophical", "Noir": "Noir", "Western": "Western",
    "Biografico": "Biographical", "Satira": "Satire", "Gotico": "Gothic",
    "Slasher": "Slasher", "Guerra": "War", "Famiglia": "Family", "Politica": "Politics"
}

LANG_MAP_IT_EN = {
    "Inglese": "English", "Giapponese": "Japanese", "Coreano": "Korean",
    "Italiano": "Italian", "Francese": "French", "Spagnolo": "Spanish"
}

DECADE_MAP_IT_EN = {
    "Anni '60": "60s", "Anni '70": "70s", "Anni '80": "80s",
    "Anni '90": "90s", "Anni 2000": "2000s", "Anni 2010": "2010s",
    "Anni 2020": "2020s"
}

# Theme mapping is more complex, we'll try to find the English equivalent or use a dictionary
THEME_MAP_IT_EN = {
    "Avventura spaziale": "Space Adventure", "Robot/AI": "Robots/AI", "Magia": "Magic",
    "Mafia": "Mafia", "Crimine": "Crime", "Futuristico": "Futuristic",
    "Coming of Age": "Coming of Age", "Soprannaturale": "Supernatural",
    "Post-apocalittico": "Post-apocalyptic", "Politica": "Politics",
    "Sopravvivenza": "Survival", "Amicizia": "Friendship", "Famiglia": "Family",
    "Amore": "Love", "Mistero": "Mystery", "Viaggi nel tempo": "Time Travel",
    "Vendetta": "Revenge", "Supereroi": "Superheroes", "Medicina": "Medicine",
    "Legge": "Law", "Scuola/Università": "School/University", "Animali": "Animals",
    "Poliziesco": "Police", "Thriller psicologico": "Psychological Thriller",
    "Gangster": "Gangster", "Commedia romantica": "Romantic Comedy",
    "Ufficio/Lavoro": "Office/Work", "Spionaggio": "Espionage", "Musica": "Music",
    "Carcere": "Prison", "Sport": "Sports", "Videogiochi": "Video Games",
    "Auto": "Cars", "Cucina": "Cooking", "Zombie": "Zombies", "Vampiri": "Vampires",
    "Alieni": "Aliens", "Droghe": "Drugs", "Disturbi mentali": "Mental disorders",
    "Body Horror": "Body Horror"
}

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def fetch_data(endpoint, params={}):
    params['api_key'] = API_KEY
    response = requests.get(f"{BASE_URL}/{endpoint}", params=params)
    if response.status_code == 200: return response.json()
    return None

def get_en_title(query, it_title):
    # Try searching for the movie/tv by title to get the EN version
    res = fetch_data("search/multi", {'query': query, 'language': 'en-US'})
    if res and res.get('results'):
        best = res['results'][0]
        # Check vote count for Italian films
        if best.get('original_language') == 'it':
            if best.get('vote_count', 0) < MIN_VOTES_IT_FOR_EN:
                return None, None # Skip non-famous Italian
        
        title = best.get('title') if best.get('media_type') == 'movie' else best.get('name')
        return title, best.get('media_type')
    return None, None

def sync():
    it_data = load_json(IT_FILE)
    en_data = load_json(EN_FILE)
    
    en_existing_titles = set(e['title'].lower().strip() for e in en_data['entries'])
    new_en_entries = []
    
    print(f"Syncing from {len(it_data['entries'])} Italian entries...")
    
    for i, it_entry in enumerate(it_data['entries']):
        it_title = it_entry['title']
        
        # Mapping categories
        en_genres = []
        it_genres = it_entry.get('genere', [])
        if isinstance(it_genres, str): it_genres = [it_genres]
        for g in it_genres:
            if g in GENRE_MAP_IT_EN: en_genres.append(GENRE_MAP_IT_EN[g])
        
        en_lang = LANG_MAP_IT_EN.get(it_entry.get('lingua'), it_entry.get('lingua'))
        en_decade = DECADE_MAP_IT_EN.get(it_entry.get('decennio'), it_entry.get('decennio'))
        en_tipo = "Movie" if it_entry.get('tipo') == "Film" else "TV Series"
        
        it_themes = it_entry.get('tema', [])
        if isinstance(it_themes, str): it_themes = [it_themes]
        en_themes = []
        for t in it_themes:
            if t in THEME_MAP_IT_EN: en_themes.append(THEME_MAP_IT_EN[t])
            elif t: en_themes.append(t) # Fallback if already known

        # Get English Title
        # Optimization: If language is English, the title might already be in English in IT file
        # But we must verify.
        en_title, media_type = get_en_title(it_title, it_title)
        
        if not en_title or en_title.lower().strip() in en_existing_titles:
            continue
            
        # Re-fetch actors if needed? Or just use translated names if possible.
        # Actually, person names are already Westernized in IT file.
        people = it_entry.get('regista o attore', [])
        
        new_entry = {
            "title": en_title,
            "tipo": en_tipo,
            "genere": en_genres,
            "lingua": en_lang,
            "decennio": en_decade,
            "regista o attore": people,
            "tema": en_themes if len(en_themes) > 1 else (en_themes[0] if en_themes else "")
        }
        
        new_en_entries.append(new_entry)
        en_existing_titles.add(en_title.lower().strip())
        print(f"[{i}] Added EN: {en_title}")
        
        # Sleep to avoid rate limiting
        if i % 10 == 0:
            time.sleep(0.1)

    print(f"Finished sync. Added {len(new_en_entries)} new entries.")
    en_data['entries'].extend(new_en_entries)
    
    # Sync global categories for actors
    all_actors = set()
    for e in en_data['entries']:
        p = e.get('regista o attore', [])
        if isinstance(p, str): all_actors.add(p)
        else: all_actors.update(p)
    
    # Keep some manually added ones if they exist
    en_data['categories']['regista o attore'] = sorted(list(all_actors))
    
    save_json(EN_FILE, en_data)
    print("Saved English JSON.")

if __name__ == "__main__":
    sync()
