import urllib.request
import zipfile
import os
import shutil

url = "https://github.com/AgriciDaniel/claude-seo/archive/refs/heads/main.zip"
zip_path = ".agents/claude-seo.zip"
extract_path = ".agents/claude-seo-temp"
repo_root = os.path.join(extract_path, "claude-seo-main")
agents_dir = ".agents"

print("Downloading claude-seo framework...")
urllib.request.urlretrieve(url, zip_path)

print("Extracting...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print("Installing skills, scripts, and agents...")
dirs_to_copy = ['skills', 'scripts', 'agents']
for d in dirs_to_copy:
    src = os.path.join(repo_root, d)
    dest = os.path.join(agents_dir, d)
    if os.path.exists(dest):
        shutil.rmtree(dest)  # Clear existing if any
    shutil.copytree(src, dest)

print("Setting up rules...")
os.makedirs(os.path.join(agents_dir, "rules"), exist_ok=True)
shutil.copy(os.path.join(repo_root, "AGENTS.md"), os.path.join(agents_dir, "rules", "seo-framework.md"))

print("Cleaning up temporary files...")
os.remove(zip_path)
shutil.rmtree(extract_path)

print("\nSuccess! The SEO Framework is installed in .agents/")
print("Next, please install the python requirements by running:")
print("pip install -r .agents/scripts/requirements.txt (if applicable)")
