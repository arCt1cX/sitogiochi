import json
import os
import re

# Path to the categories.json file
json_file_path = 'categories.json'

# Path to the categories directory
categories_dir = 'categories'

# Read the categories.json file
with open(json_file_path, 'r', encoding='utf-8') as f:
    categories_data = json.load(f)

# Process each category
for category in categories_data:
    category_name = category['name']
    items = category['items']
    
    # Handle special cases where category name might be different from file name
    file_name = category_name.lower()
    
    # Replace invalid filename characters
    if " and " in file_name:
        file_name = file_name.replace(" and ", " ")
    
    # Replace forward slashes with spaces or hyphens
    if "/" in file_name:
        file_name = file_name.replace("/", "-")
    
    # General cleanup of other potentially problematic characters
    file_name = re.sub(r'[\\/*?:"<>|]', '', file_name)
    
    # Create the path to the category file
    category_file_path = os.path.join(categories_dir, f"{file_name}.txt")
    
    try:
        # Write the items to the category file
        with open(category_file_path, 'w', encoding='utf-8') as f:
            for item in items:
                f.write(f"{item}\n")
        
        print(f"Updated {category_file_path} with {len(items)} items")
    except Exception as e:
        print(f"Error updating {category_file_path}: {e}")

print("All category files have been updated successfully!") 