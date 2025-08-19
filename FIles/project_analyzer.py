import os
import json

PROJECT_PATH = r'C:\Users\HP\Desktop\Apps\my-website-project'

def analyze_project_structure(root_path):
    if not os.path.exists(root_path):
        print(f"Error: Path '{root_path}' does not exist!")
        return None
    project_structure = {}

    for dirpath, dirnames, filenames in os.walk(root_path):
        rel_path = os.path.relpath(dirpath, root_path)
        if rel_path == '.':
            current_dict = project_structure
        else:
            path_parts = rel_path.split(os.sep)
            current_dict = project_structure
            for part in path_parts:
                if part not in current_dict:
                    current_dict[part] = {}
                current_dict = current_dict[part]
        if filenames:
            current_dict['_files'] = sorted(filenames)
        if dirnames:
            current_dict['_subdirs'] = sorted(dirnames)
    return project_structure

def save_structure_to_file(structure, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, indent=2, ensure_ascii=False)

def main():
    structure = analyze_project_structure(PROJECT_PATH)
    if structure is None:
        return
    output_file = os.path.join(PROJECT_PATH, 'folderstruct.json')
    save_structure_to_file(structure, output_file)
    print(f"Folder structure saved to {output_file}")

if __name__ == "__main__":
    main()