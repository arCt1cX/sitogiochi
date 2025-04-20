import os
import time
import random
import requests
import re
import argparse
import urllib.parse
from bs4 import BeautifulSoup
from urllib.parse import quote, urlencode

def slugify(text):
    """Convert text to lowercase and replace spaces with underscores"""
    return text.strip().lower().replace(' ', '_')

def get_duck_duck_go_image(query, retries=3):
    """Search for an image using DuckDuckGo"""
    encoded_query = urllib.parse.quote_plus(query)
    search_url = f"https://duckduckgo.com/?q={encoded_query}&iax=images&ia=images"
    
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
    ]
    
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': random.choice(user_agents),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': 'https://duckduckgo.com/',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
            }
            
            response = requests.get(search_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Search for image URLs in the page
            img_urls = re.findall(r'https://external-content\.duckduckgo\.com/iu/\?u=([^&]+)&', response.text)
            if img_urls:
                # URL decode the matched URLs
                for url in img_urls:
                    decoded_url = urllib.parse.unquote(url)
                    if decoded_url.endswith(('.jpg', '.jpeg', '.png')):
                        return decoded_url
            
            # If no external content URLs found, try to find other image URLs
            img_urls = re.findall(r'(https?://[^"\'>]*\.(?:jpg|jpeg|png))', response.text)
            if img_urls:
                for url in img_urls:
                    if 'logo' not in url.lower() and 'icon' not in url.lower():
                        return url
            
            print(f"No image found on DuckDuckGo for '{query}' on attempt {attempt+1}")
            time.sleep(random.uniform(1.0, 3.0))
            
        except Exception as e:
            print(f"Error searching on DuckDuckGo for '{query}': {e}")
            if attempt < retries - 1:
                time.sleep(random.uniform(1.0, 3.0))
    
    return None

def get_bing_image(query, retries=3):
    """Search for an image using Bing Images without API"""
    encoded_query = urllib.parse.quote_plus(query)
    search_url = f"https://www.bing.com/images/search?q={encoded_query}&form=HDRSC2&first=1"
    
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
    ]
    
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': random.choice(user_agents),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': 'https://www.bing.com/',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            
            response = requests.get(search_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Look for the image URLs in the page
            for img in soup.find_all('img', {'class': 'mimg'}):
                if img.get('src') and img['src'].startswith('http'):
                    return img['src']
                if img.get('data-src') and img['data-src'].startswith('http'):
                    return img['data-src']
            
            # If not found in img tags, look in the page source
            img_urls = re.findall(r'"murl":"([^"]+)"', response.text)
            if img_urls:
                return img_urls[0].replace('\\', '')
            
            print(f"No image found on Bing for '{query}' on attempt {attempt+1}")
            time.sleep(random.uniform(1.0, 3.0))
            
        except Exception as e:
            print(f"Error searching on Bing for '{query}': {e}")
            if attempt < retries - 1:
                time.sleep(random.uniform(1.0, 3.0))
    
    return None

def get_image_url(query, category_name, max_retries=3):
    """Try multiple search engines to find an image"""
    # Format the query for better results
    formatted_query = f"{query} {category_name}"
    print(f"Searching for image of '{formatted_query}'...")
    
    # Try DuckDuckGo first
    image_url = get_duck_duck_go_image(formatted_query, retries=max_retries)
    if image_url:
        return image_url
    
    # If DuckDuckGo fails, try Bing
    image_url = get_bing_image(formatted_query, retries=max_retries)
    if image_url:
        return image_url
    
    # If both fail, try with just the name without category
    print(f"Trying to search for just '{query}'...")
    image_url = get_duck_duck_go_image(query, retries=max_retries)
    if image_url:
        return image_url
    
    image_url = get_bing_image(query, retries=max_retries)
    if image_url:
        return image_url
    
    return None

def download_image(url, filepath, retries=3):
    """Download an image from a URL"""
    if not url:
        return False
    
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com/',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            }
            
            response = requests.get(url, headers=headers, stream=True, timeout=15)
            response.raise_for_status()
            
            # Check if content is actually an image
            content_type = response.headers.get('Content-Type', '')
            if not content_type.startswith('image/'):
                print(f"URL does not contain an image. Content-Type: {content_type}")
                if attempt == retries - 1:
                    # On last attempt, try to save it anyway if it's binary data
                    if 'text/html' not in content_type:
                        pass
                    else:
                        return False
                else:
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

def process_missing_images(missing_file_list=None, delay_min=1.0, delay_max=3.0, max_retries=3):
    """Process missing images from a list or check all categories"""
    
    if missing_file_list:
        # Process specific missing files from list
        missing_images = []
        with open(missing_file_list, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    parts = line.split(',')
                    if len(parts) >= 2:
                        category = parts[0].strip()
                        item = parts[1].strip()
                        missing_images.append({
                            "category": category,
                            "item": item
                        })
        
        print(f"Found {len(missing_images)} missing images to download")
    else:
        # Check for missing images in all categories
        missing_images = []
        try:
            with open('categories.json', 'r', encoding='utf-8') as f:
                categories = json.load(f)
        except Exception as e:
            print(f"Error reading categories.json: {e}")
            print("Reading from txt files instead...")
            
            categories = []
            categories_dir = 'categories'
            if os.path.exists(categories_dir):
                for filename in os.listdir(categories_dir):
                    if filename.endswith('.txt'):
                        category_name = os.path.splitext(filename)[0]
                        category_file = os.path.join(categories_dir, filename)
                        
                        with open(category_file, 'r', encoding='utf-8') as f:
                            items = [line.strip() for line in f if line.strip()]
                        
                        categories.append({
                            "name": category_name,
                            "items": items
                        })
        
        for category in categories:
            category_name = category["name"]
            img_dir = os.path.join('img', category_name)
            
            # Create the directory if it doesn't exist
            if not os.path.exists(img_dir):
                os.makedirs(img_dir, exist_ok=True)
            
            for item in category["items"]:
                filename = f"{slugify(item)}.jpg"
                filepath = os.path.join(img_dir, filename)
                
                if not os.path.exists(filepath):
                    missing_images.append({
                        "category": category_name,
                        "item": item
                    })
    
    # Download missing images
    success_count = 0
    fail_count = 0
    
    print(f"Starting download of {len(missing_images)} missing images")
    
    for idx, img_info in enumerate(missing_images):
        category = img_info["category"]
        item = img_info["item"]
        
        print(f"\nProcessing {idx+1}/{len(missing_images)}: {item} ({category})")
        
        # Create filename and path
        filename = f"{slugify(item)}.jpg"
        img_dir = os.path.join('img', category)
        
        # Create dir if it doesn't exist
        if not os.path.exists(img_dir):
            os.makedirs(img_dir, exist_ok=True)
            
        filepath = os.path.join(img_dir, filename)
        
        # Skip if file already exists
        if os.path.exists(filepath):
            print(f"Image for '{item}' already exists, skipping.")
            continue
        
        # Search for the image
        image_url = get_image_url(item, category, max_retries=max_retries)
        
        if image_url:
            # Download the image
            print(f"Downloading image for '{item}'...")
            if download_image(image_url, filepath, retries=max_retries):
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"Could not find an image for '{item}'.")
            fail_count += 1
        
        # Add a random delay to avoid rate limiting
        delay = random.uniform(delay_min, delay_max)
        print(f"Waiting {delay:.1f} seconds...")
        time.sleep(delay)
    
    # Print summary
    print("\nDOWNLOAD SUMMARY:")
    print(f"Total images successfully downloaded: {success_count}")
    print(f"Total images failed to download: {fail_count}")
    
    if fail_count > 0:
        print("\nFor any remaining failed images, consider downloading them manually.")
        print("Run 'python create_image_folders.py' to generate a helper HTML file.")
    
    print("\nDone! You can now open index.html in your browser to play the game.")

def main():
    parser = argparse.ArgumentParser(description='Download missing images for categories using multiple search engines')
    parser.add_argument('--delay-min', type=float, default=1.0, help='Minimum delay between requests in seconds (default: 1.0)')
    parser.add_argument('--delay-max', type=float, default=3.0, help='Maximum delay between requests in seconds (default: 3.0)')
    parser.add_argument('--retries', type=int, default=3, help='Maximum number of retries per image (default: 3)')
    parser.add_argument('--file', type=str, help='Optional file containing list of missing images in format: category,item')
    args = parser.parse_args()
    
    print("Enhanced Image Downloader - Using multiple search engines")
    print("This version tries harder to find and download missing images.")
    
    process_missing_images(
        missing_file_list=args.file,
        delay_min=args.delay_min,
        delay_max=args.delay_max,
        max_retries=args.retries
    )

if __name__ == "__main__":
    import json  # Import json here for file processing
    main() 