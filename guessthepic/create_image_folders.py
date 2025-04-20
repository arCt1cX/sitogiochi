import os
import json

def slugify(text):
    """Convert text to lowercase and replace spaces with underscores"""
    return text.strip().lower().replace(' ', '_')

def main():
    print("Setting up folders for manual image downloading...")
    
    # Create main image directory
    os.makedirs('img', exist_ok=True)
    
    # Read categories.json
    try:
        with open('categories.json', 'r', encoding='utf-8') as f:
            categories = json.load(f)
    except Exception as e:
        print(f"Error reading categories.json: {e}")
        print("Using default categories instead.")
        categories = [
            {"name": "actors", "items": []},
            {"name": "monuments", "items": []},
            {"name": "singers", "items": []},
            {"name": "politicians", "items": []},
            {"name": "cartoons", "items": []}
        ]
        
        # Try to read from txt files
        categories_dir = 'categories'
        for category in categories:
            category_file = os.path.join(categories_dir, f"{category['name']}.txt")
            if os.path.isfile(category_file):
                with open(category_file, 'r', encoding='utf-8') as f:
                    category['items'] = [line.strip() for line in f if line.strip()]
    
    # Create folder for each category
    for category in categories:
        category_dir = os.path.join('img', category['name'])
        os.makedirs(category_dir, exist_ok=True)
        print(f"Created directory: {category_dir}")
    
    # Create helper HTML file with instructions
    html_content = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Image Download Helper</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        h1, h2, h3 { color: #2c3e50; }
        .category { margin-bottom: 30px; }
        .item { margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; }
        .filename { font-family: monospace; background-color: #e9ecef; padding: 3px 6px; border-radius: 3px; }
        .instructions { background-color: #d4edda; padding: 15px; border-radius: 5px; margin-bottom: 30px; }
        .filename-example { background-color: #e9ecef; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Image Download Helper</h1>
    
    <div class="instructions">
        <h2>Instructions:</h2>
        <ol>
            <li>For each item below, search for a good representative image on Google Images.</li>
            <li>Download the image and save it with the <strong>exact filename</strong> shown.</li>
            <li>Save all images in their respective category folders under the "img" directory.</li>
            <li>Images should be JPG format (ending with .jpg).</li>
            <li>After downloading all images, run the game by opening index.html</li>
        </ol>
        
        <h3>Example:</h3>
        <div class="filename-example">
            For "Keanu Reeves" in actors category:<br>
            Save as: <code>img/actors/keanu_reeves.jpg</code>
        </div>
    </div>
"""
    
    # Add each category and item to the HTML
    for category in categories:
        html_content += f'<div class="category">\n'
        html_content += f'    <h2>{category["name"].capitalize()}</h2>\n'
        
        for item in category['items']:
            filename = slugify(item) + '.jpg'
            filepath = f"img/{category['name']}/{filename}"
            
            html_content += f'    <div class="item">\n'
            html_content += f'        <strong>{item}</strong><br>\n'
            html_content += f'        Save as: <span class="filename">{filepath}</span>\n'
            html_content += f'    </div>\n'
        
        html_content += '</div>\n'
    
    html_content += """
</body>
</html>
"""
    
    # Write the HTML file
    with open('download_helper.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("\nSetup complete!")
    print("A helper file has been created: download_helper.html")
    print("Open this file in your browser for instructions on manually downloading the images.")

if __name__ == "__main__":
    main() 