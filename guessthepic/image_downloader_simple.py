import os
import time
import random
import requests
import re
import argparse
from bs4 import BeautifulSoup
from urllib.parse import quote

def slugify(text):
    """Convert text to lowercase and replace spaces with underscores"""
    return text.strip().lower().replace(' ', '_')

def get_google_image(query, retries=3):
    """Search for an image using Google Images via basic scraping"""
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
    ]
    
    # Format query for URL
    search_url = f"https://www.google.com/search?q={quote(query)}&tbm=isch&source=lnms"
    
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': random.choice(user_agents),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            
            response = requests.get(search_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Method 1: Look for image tags
            for img in soup.find_all('img'):
                if img.get('src') and img.get('src').startswith('http') and '.jpg' in img.get('src'):
                    return img['src']
            
            # Method 2: Extract image URLs from the page
            # Look for common patterns in Google Image search results
            img_urls = re.findall(r'https?://[^"\']+\.(?:jpg|jpeg|png)', response.text)
            if img_urls:
                # Filter out Google UI images and thumbnails
                for url in img_urls:
                    if 'gstatic.com' not in url and len(url) > 40:
                        return url
            
            # Method 3: Look for data-src attributes (lazy-loaded images)
            for img in soup.find_all('img', {'data-src': True}):
                if img.get('data-src').startswith('http'):
                    return img.get('data-src')
                    
            print(f"No image found for '{query}' on attempt {attempt+1}")
            
            # Add a random delay between attempts
            time.sleep(random.uniform(1.0, 3.0))
            
        except Exception as e:
            print(f"Error searching for '{query}': {e}")
            if attempt < retries - 1:
                time.sleep(random.uniform(1.0, 3.0))
    
    return None

def download_image(url, filepath, retries=3):
    """Download an image from a URL"""
    if not url:
        return False
    
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com/'
            }
            
            response = requests.get(url, headers=headers, stream=True, timeout=10)
            response.raise_for_status()
            
            # Check if content is actually an image
            content_type = response.headers.get('Content-Type', '')
            if not content_type.startswith('image/'):
                print(f"URL does not contain an image. Content-Type: {content_type}")
                return False
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"Downloaded image for '{os.path.basename(filepath)}'")
            return True
            
        except Exception as e:
            print(f"Error downloading image: {e}")
            if attempt < retries - 1:
                print(f"Retrying ({attempt+2}/{retries})...")
                time.sleep(random.uniform(1.0, 2.0))
    
    return False

def process_category(category_file, delay_min=1.0, delay_max=3.0):
    """Process a category file and download images for each item"""
    category_name = os.path.splitext(os.path.basename(category_file))[0]
    print(f"\nProcessing category: {category_name}")
    
    success_count = 0
    skip_count = 0
    fail_count = 0
    
    try:
        # Create target directory
        img_dir = os.path.join('img', category_name)
        os.makedirs(img_dir, exist_ok=True)
        
        # Read names from the category file
        with open(category_file, 'r', encoding='utf-8') as f:
            names = [line.strip() for line in f if line.strip()]
        
        print(f"Found {len(names)} items in {category_name}")
        
        for name in names:
            # Create filename
            filename = f"{slugify(name)}.jpg"
            filepath = os.path.join(img_dir, filename)
            
            # Skip if file already exists
            if os.path.exists(filepath):
                print(f"Image for '{name}' already exists, skipping.")
                skip_count += 1
                continue
            
            # Search for the image
            print(f"Searching for image of '{name}'...")
            image_url = get_google_image(f"{name} {category_name}")
            
            if image_url:
                # Download the image
                print(f"Downloading image for '{name}'...")
                if download_image(image_url, filepath):
                    success_count += 1
                else:
                    fail_count += 1
            else:
                print(f"Could not find an image for '{name}'.")
                fail_count += 1
            
            # Add a random delay to avoid rate limiting
            delay = random.uniform(delay_min, delay_max)
            print(f"Waiting {delay:.1f} seconds...")
            time.sleep(delay)
    
    except Exception as e:
        print(f"Error processing category {category_name}: {e}")
    
    return success_count, skip_count, fail_count

def main():
    parser = argparse.ArgumentParser(description='Download images for categories using Google Images')
    parser.add_argument('--delay-min', type=float, default=1.0, help='Minimum delay between requests in seconds (default: 1.0)')
    parser.add_argument('--delay-max', type=float, default=3.0, help='Maximum delay between requests in seconds (default: 3.0)')
    parser.add_argument('--category', type=str, help='Process only a specific category (e.g. "actors")')
    args = parser.parse_args()
    
    print("Warning: This script uses basic web scraping techniques which may be unreliable.")
    print("If you encounter issues, consider using the manual download approach with create_image_folders.py")
    print("")
    
    # Create main image directory
    os.makedirs('img', exist_ok=True)
    
    # Get category files
    categories_dir = 'categories'
    
    if args.category:
        category_file = os.path.join(categories_dir, f"{args.category}.txt")
        if os.path.isfile(category_file):
            category_files = [category_file]
        else:
            print(f"Category file '{args.category}.txt' not found.")
            return
    else:
        category_files = [os.path.join(categories_dir, f) for f in os.listdir(categories_dir) 
                         if f.endswith('.txt') and os.path.isfile(os.path.join(categories_dir, f))]
    
    if not category_files:
        print("No category files found.")
        return
    
    total_success = 0
    total_skip = 0
    total_fail = 0
    
    print(f"Found {len(category_files)} category files")
    
    for category_file in category_files:
        success, skip, fail = process_category(
            category_file, 
            delay_min=args.delay_min, 
            delay_max=args.delay_max
        )
        total_success += success
        total_skip += skip
        total_fail += fail
    
    print("\nSUMMARY:")
    print(f"Total images successfully downloaded: {total_success}")
    print(f"Total images skipped (already existed): {total_skip}")
    print(f"Total images failed to download: {total_fail}")
    
    if total_fail > 0:
        print("\nFor any failed images, consider downloading them manually.")
        print("You can run 'python create_image_folders.py' to generate a helper HTML file.")
    
    print("\nDone! You can now open index.html in your browser to play the game.")

if __name__ == "__main__":
    main() 