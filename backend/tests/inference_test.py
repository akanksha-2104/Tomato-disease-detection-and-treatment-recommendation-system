import os
import glob
from PIL import Image
import traceback

# Import the app to reuse preprocessing, class names and loaded models
# This will execute top-level model loading in app.py but will not start the server.
import sys
from pathlib import Path
# Ensure the backend directory is on sys.path so we can import app.py as a module
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
try:
    import app as app_module
except Exception as e:
    print('Failed to import backend.app module. Traceback:')
    traceback.print_exc()
    raise

MODEL_LOADED = app_module.disease_model is not None
print(f"Disease model loaded in app module: {MODEL_LOADED}")
print(f"Total classes (from CLASS_NAMES): {len(app_module.CLASS_NAMES)}")
print(f"CLASS_NAMES: {app_module.CLASS_NAMES}\n")

# Find candidate images in the repo (common image folders)
search_paths = [
    os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'frontend', 'public'),
    os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'uploads'),
]

# Normalize and dedupe
search_paths = [os.path.normpath(p) for p in search_paths]
paths = []
for p in search_paths:
    if os.path.isdir(p):
        paths.append(p)

# Add cwd just in case
paths.append(os.getcwd())

image_files = []
for p in paths:
    for ext in ('*.png', '*.jpg', '*.jpeg'):
        image_files.extend(glob.glob(os.path.join(p, ext)))

# Dedupe and sort
image_files = sorted(list(dict.fromkeys(image_files)))

if not image_files:
    print('No candidate images found in expected locations. Place labeled test images in backend/tests or uploads/ and re-run.')
    raise SystemExit(0)

print(f'Found {len(image_files)} image(s) for testing:')
for f in image_files:
    print(' -', f)

print('\nRunning predictions using app.detect_disease (uses same preprocessing and class mapping).\n')

for f in image_files:
    try:
        img = Image.open(f)
        result = app_module.detect_disease(img)
        print(f"Image: {os.path.basename(f)}")
        print(f"  → Predicted disease: {result['disease']}")
        print(f"  → Confidence: {result['confidence_percent']:.2f}%")
        print(f"  → Top 3 predictions: {result['all_predictions'][:3]}")
        print('-'*60)
    except Exception as e:
        print(f"Failed to predict for {f}: {e}")
        traceback.print_exc()
        print('-'*60)

print('Done.')
