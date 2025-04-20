import os
import json

def slugify(text):
    """Convert text to lowercase and replace spaces with underscores"""
    return text.strip().lower().replace(' ', '_')

def main():
    print("Checking for missing images...")
    
    # Get categories data
    try:
        with open('categories.json', 'r', encoding='utf-8') as f:
            categories = json.load(f)
    except Exception as e:
        print(f"Error reading categories.json: {e}")
        print("Using default categories from txt files...")
        
        # Read from category txt files instead
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
    
    # Check for missing images in each category
    missing_images = []
    
    for category in categories:
        category_name = category["name"]
        img_dir = os.path.join('img', category_name)
        
        # Create the directory if it doesn't exist
        if not os.path.exists(img_dir):
            os.makedirs(img_dir, exist_ok=True)
        
        print(f"\nChecking category: {category_name}")
        
        for item in category["items"]:
            filename = f"{slugify(item)}.jpg"
            filepath = os.path.join(img_dir, filename)
            
            if not os.path.exists(filepath):
                print(f"Missing: {item}")
                missing_images.append({
                    "category": category_name,
                    "item": item,
                    "filepath": filepath
                })
    
    # Print summary
    if missing_images:
        print(f"\nFound {len(missing_images)} missing images:")
        
        # Group by category
        by_category = {}
        for img in missing_images:
            if img["category"] not in by_category:
                by_category[img["category"]] = []
            by_category[img["category"]].append(img["item"])
        
        # Print each category
        for category, items in by_category.items():
            print(f"\n{category.upper()}:")
            for item in items:
                filename = f"{slugify(item)}.jpg"
                print(f"  - {item} → img/{category}/{filename}")
                
        print("\nRun the helper script to generate a guide for manual downloading:")
        print("python create_image_folders.py")
    else:
        print("\nAll images are present! Your game is ready to play.")

if __name__ == "__main__":
    main() 