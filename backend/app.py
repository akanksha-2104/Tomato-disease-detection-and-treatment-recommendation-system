from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import traceback
from datetime import datetime
import sqlite3
from typing import Dict, List, Tuple
from flask_sqlalchemy import SQLAlchemy

# Base dir and configuration (use absolute paths for reliability)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Handle Hugging Face Spaces file structure
# In HF Spaces, files are typically in /home/user/app/
if not os.path.exists(os.path.join(BASE_DIR, 'models')):
    # Try parent directory if models folder doesn't exist
    potential_base = os.path.dirname(BASE_DIR)
    if os.path.exists(os.path.join(potential_base, 'models')):
        BASE_DIR = potential_base

TREATMENT_DB_PATH = os.path.join(BASE_DIR, 'tomato_treatments.db')
# Verify database exists
if not os.path.exists(TREATMENT_DB_PATH):
    print(f"WARNING: Treatment database not found at {TREATMENT_DB_PATH}")
    print(f"   Run 'python create_database.py' to create it.")
else:
    print(f"[OK] Treatment database found at {TREATMENT_DB_PATH}")
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///treatment.db'
db = SQLAlchemy(app)
REL_LEAF_MODEL = os.path.join('models', 'final_leaf_model.keras')
REL_DISEASE_MODEL = os.path.join('models', 'disease_model.keras')
LEAF_MODEL_PATH = os.path.join(BASE_DIR, REL_LEAF_MODEL)
DISEASE_MODEL_PATH = os.path.join(BASE_DIR, REL_DISEASE_MODEL)



IMG_SIZE = (224, 224)  # Adjust based on your model's input size
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Confidence thresholds
LEAF_CONFIDENCE_THRESHOLD = 0.5
DISEASE_CONFIDENCE_THRESHOLD = 0.6

# Disease class names - load from models/class_names.json if present to ensure correct ordering
CLASS_NAMES = None
try:
    class_names_path = os.path.join(BASE_DIR, 'models', 'class_names.json')
    if os.path.exists(class_names_path):
        import json
        with open(class_names_path, 'r', encoding='utf-8') as f:
            CLASS_NAMES = json.load(f)
        print(f"Loaded CLASS_NAMES from {class_names_path}: {len(CLASS_NAMES)} classes")
    else:
        raise FileNotFoundError
except Exception:
    # Fallback (legacy): a generic list — replace with your model's classes if unknown
    CLASS_NAMES = [
        "Bacterial_spot", "Early_blight", "Late_blight", "Leaf_Mold", "Septoria_leaf_spot",
        "Spider_mites Two-spotted_spider_mite", "Target_Spot", "Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato_mosaic_virus", "healthy", "powdery_mildew"
    ]
    print("Warning: Failed to load class_names.json — using fallback CLASS_NAMES (may be incorrect).")

DISEASE_NAME_MAPPING = {
    'Bacterial_spot': 'Bacterial_spot',
    'bacterial_spot': 'Bacterial_spot',
    'Tomato_Bacterial_spot': 'Bacterial_spot',
    'Early_blight': 'Early_blight',
    'early_blight': 'Early_blight',
    'Tomato_Early_blight': 'Early_blight',
    'Late_blight': 'Late_blight',
    'late_blight': 'Late_blight',
    'Tomato_Late_blight': 'Late_blight',
    'Leaf_Mold': 'Leaf_Mold',
    'leaf_mold': 'Leaf_Mold',
    'Tomato_Leaf_Mold': 'Leaf_Mold',
    'Septoria_leaf_spot': 'Septoria_leaf_spot',
    'septoria_leaf_spot': 'Septoria_leaf_spot',
    'Tomato_Septoria_leaf_spot': 'Septoria_leaf_spot',
    'Spider_mites Two-spotted_spider_mite': 'Spider_mites Two-spotted_spider_mite',
    'Tomato_Spider_mites_Two_spotted_spider_mite': 'Spider_mites Two-spotted_spider_mite',
    'spider_mites': 'Spider_mites Two-spotted_spider_mite',
    'Target_Spot': 'Target_Spot',
    'target_spot': 'Target_Spot',
    'Tomato_Target_Spot': 'Target_Spot',
    'Tomato_Yellow_Leaf_Curl_Virus': 'Tomato_Yellow_Leaf_Curl_Virus',
    'yellow_leaf_curl': 'Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato_mosaic_virus': 'Tomato_mosaic_virus',
    'mosaic_virus': 'Tomato_mosaic_virus',
    'healthy': 'healthy',
    'Healthy': 'healthy',
    'Tomato_healthy': 'healthy',
    'powdery_mildew': 'powdery_mildew',
    'Powdery_mildew': 'powdery_mildew',
}

# Load the models
leaf_model = None
disease_model = None

try:
    # Try loading with compile=False to avoid optimizer issues
    print(f"Attempting to load leaf model from: {LEAF_MODEL_PATH} (exists: {os.path.exists(LEAF_MODEL_PATH)})")
    leaf_model = tf.keras.models.load_model(LEAF_MODEL_PATH, compile=False)
    # Recompile the model
    leaf_model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    print(f"[OK] Leaf detector model loaded successfully from {LEAF_MODEL_PATH}")
except Exception as e:
    print(f"[ERROR] Error loading leaf model: {str(e)}")
    print("Full traceback for leaf model load:")
    traceback.print_exc()
    print("Check that the path is correct, the file is not corrupted, and TensorFlow/Keras versions are compatible.")

try:
    # Try loading with compile=False to avoid BatchNormalization issues
    print(f"Attempting to load disease model from: {DISEASE_MODEL_PATH} (exists: {os.path.exists(DISEASE_MODEL_PATH)})")
    disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH, compile=False)
    # Recompile the model
    disease_model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    print(f"[OK] Disease detection model loaded successfully from {DISEASE_MODEL_PATH}")
except Exception as e:
    print(f"[ERROR] Error loading disease model: {str(e)}")
    print("Full traceback for disease model load:")
    traceback.print_exc()
    print("If this persists, consider re-saving the model with the current TensorFlow version or restoring weights into a fresh architecture.")


def preprocess_image(image, img_size=IMG_SIZE):
    """
    Preprocess the image for model prediction
    
    Args:
        image: PIL Image object
        img_size: Target size tuple (width, height)
    
    Returns:
        Preprocessed numpy array
    """
    try:
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image
        image = image.resize(img_size)
        
        # Convert to array and normalize
        img_array = tf.keras.preprocessing.image.img_to_array(image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize to [0,1]
        
        return img_array
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")


def is_tomato_leaf(image, model=leaf_model, threshold=LEAF_CONFIDENCE_THRESHOLD):
    """
    Check if the uploaded image is a tomato leaf    
    Args:
        image: PIL Image object
        model: Trained leaf detector model
        threshold: Confidence threshold for leaf detection    
    Returns:
        dict: {
            'is_leaf': bool,
            'confidence': float,
            'label': str,
            'raw_probability': float
        }
    """
    if model is None:
        raise Exception("Leaf detection model not loaded")   
     
    try:
        # Preprocess image
        img_array = preprocess_image(image)
        # Predict
        prob = model.predict(img_array, verbose=0)[0][0]
        # Interpret prediction
        # Assuming: 0 = 'leaf', 1 = 'non_leaf' (alphabetical order)
        is_leaf = prob < 0.5  # If prob < 0.5, it's leaf (class 0)
        confidence = (1 - prob) if is_leaf else prob
        label = "Tomato Leaf" if is_leaf else "Not a Tomato Leaf"
        
        return {
            'is_leaf': bool(is_leaf),
            'confidence': float(confidence),
            'label': label,
            'raw_probability': float(prob)
        } 
    
    except Exception as e:
        raise Exception(f"Error in leaf detection: {str(e)}")


def detect_disease(image, model=disease_model, class_names=CLASS_NAMES, 
                   threshold=DISEASE_CONFIDENCE_THRESHOLD):
    """
    Detect disease in tomato leaf image    
    Args:
        image: PIL Image object
        model: Trained disease detection model
        class_names: List of disease class names
        threshold: Confidence threshold for disease prediction    
    Returns:
        dict: Disease prediction results
    """
    if model is None:
        raise Exception("Disease detection model not loaded")
    
    try:
        # Preprocess image
        img_array = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)[0]
        
        # Get top prediction
        predicted_class_idx = np.argmax(predictions)
        predicted_disease = class_names[predicted_class_idx]
        confidence = float(predictions[predicted_class_idx])
        
        # Get all predictions sorted by confidence
        all_predictions = [
            {
                'disease': class_names[i],
                'confidence': round(float(predictions[i]) * 100, 2)
            }
            for i in range(len(class_names))
        ]
        all_predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        return {
            'disease': predicted_disease,
            'confidence': confidence,
            'confidence_percent': round(confidence * 100, 2),
            'is_confident': confidence >= threshold,
            'all_predictions': all_predictions
        }
        
    except Exception as e:
        raise Exception(f"Error in disease detection: {str(e)}")


def get_disease_info(disease_name):
    
    disease_info = {
        'Bacterial_spot': {
            'description': 'Bacterial spot causes dark, greasy-looking spots on leaves and fruit.',
        },
        'Early_blight': {
            'description': 'Early blight causes dark spots with concentric rings on older leaves.',
        },
        'Late_blight': {
            'description': 'Late blight causes water-soaked spots that turn brown and can kill plants quickly.',
        },
        'Leaf_Mold': {
            'description': 'Leaf mold causes pale green to yellowish spots on upper leaf surfaces.',
        },
        'Septoria_leaf_spot': {
            'description': 'Septoria leaf spot causes small circular spots with dark borders on leaves.',
        },
        'Spider_mites Two-spotted_spider_mite': {
            'description': 'Spider mites cause stippling, yellowing, and webbing on leaves.',
        },
        'Target_Spot': {
            'description': 'Target spot causes brown spots with concentric rings on leaves.',
        },
        'Tomato_Yellow_Leaf_Curl_Virus': {
            'description': 'Yellow leaf curl virus causes upward curling and yellowing of leaves.',
        },
        'Tomato_mosaic_virus': {
            'description': 'Mosaic virus causes mottled light and dark green patterns on leaves.',
        },
        'healthy': {
            'description': 'The plant appears healthy with no signs of disease.',
        },
        'powdery_mildew': {
            'description': 'Powdery mildew appears as white powdery spots on leaves.',
        }
    }
    
    return disease_info.get(disease_name, {
        'description': 'Information not available',
    })




@app.route('/')
def home():
    """
    Health check endpoint
    """
    models_status = {
        'leaf_model': {
            'loaded': leaf_model is not None,
            'path': LEAF_MODEL_PATH,
            'status': 'Ready' if leaf_model is not None else 'Failed to load'
        },
        'disease_model': {
            'loaded': disease_model is not None,
            'path': DISEASE_MODEL_PATH,
            'status': 'Ready' if disease_model is not None else 'Failed to load'
        }
    }
    
    api_ready = leaf_model is not None and disease_model is not None
    
    return jsonify({
        'status': 'success' if api_ready else 'partial',
        'message': 'Tomato Disease Detection API is running' if api_ready else 'API running but some models failed to load',
        'api_ready': api_ready,
        'models': models_status,
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint with two-stage detection:
    1. Check if image is a tomato leaf
    2. If yes, detect disease
    """
    # Check if models are loaded
    if leaf_model is None or disease_model is None:
        return jsonify({
            'status': 'error',
            'message': 'One or more models not loaded',
            'leaf_model_loaded': leaf_model is not None,
            'disease_model_loaded': disease_model is not None
        }), 500
    
    # Check if image file is present
    if 'image' not in request.files:
        return jsonify({
            'status': 'error',
            'message': 'No image file provided'
        }), 400
    
    file = request.files['image']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({
            'status': 'error',
            'message': 'No file selected'
        }), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({
            'status': 'error',
            'message': f'File size exceeds {MAX_FILE_SIZE / (1024*1024)}MB limit'
        }), 400
    
    try:
        # Read and process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        print(f"\n{'='*60}")
        print(f"Processing uploaded image: {file.filename}")
        print(f"{'='*60}")
        
        # ==================== STAGE 1: LEAF DETECTION ====================
        print("\n[STAGE 1] Checking if image is a tomato leaf...")
        leaf_result = is_tomato_leaf(image)
        
        print(f"  → Result: {leaf_result['label']}")
        print(f"  → Confidence: {leaf_result['confidence']*100:.2f}%")
        
        # If not a leaf, return early
        if not leaf_result['is_leaf']:
            response = {
                'status': 'rejected',
                'stage': 'leaf_detection',
                'message': f"The uploaded image does not appear to be a tomato leaf (confidence: {leaf_result['confidence']*100:.2f}%). Please upload a clear image of a tomato leaf.",
                'leaf_detection': leaf_result,
                'timestamp': datetime.now().isoformat()
            }
            print(f"\n[ERROR] Image rejected: Not a tomato leaf")
            print(f"{'='*60}\n")
            return jsonify(response), 200
        
        # ==================== STAGE 2: DISEASE DETECTION ====================
        print("\n[STAGE 2] Detecting disease in tomato leaf...")
        disease_result = detect_disease(image)
        
        print(f"  → Detected Disease: {disease_result['disease']}")
        print(f"  → Confidence: {disease_result['confidence_percent']:.2f}%")
        
        # Get disease information
        disease_info = get_disease_info(disease_result['disease'])
        
        # Prepare success response
        response = {
            'status': 'success',
            'stage': 'disease_detection',
            'message': f"Tomato leaf detected and disease identified successfully.",
            'leaf_detection': leaf_result,
            'disease_detection': {
                'disease': disease_result['disease'],
                'confidence': disease_result['confidence_percent'],
                'is_confident': disease_result['is_confident'],
                'disease_info': disease_info,
                'top_predictions': disease_result['all_predictions'][:5]  # Top 5 predictions
            },
            # 'recommendations': get_treatment_recommendations(disease_result['disease']),  # COMMENTED
            'timestamp': datetime.now().isoformat()
        }
        
        # Add warning if confidence is low
        if not disease_result['is_confident']:
            response['warning'] = f"Disease prediction confidence is below threshold ({DISEASE_CONFIDENCE_THRESHOLD*100}%). Consider uploading a clearer image for more accurate results."
            print(f"\n[WARNING] Warning: Low confidence prediction")
        else:
            print(f"\n[OK] Disease detected successfully")
        
        print(f"\n[TOP 3 PREDICTIONS]:")
        for i, pred in enumerate(disease_result['all_predictions'][:3], 1):
            print(f"  {i}. {pred['disease']}: {pred['confidence']:.2f}%")
        
        print(f"{'='*60}\n")
        
        return jsonify(response), 200
        
    except Exception as e:
        error_response = {
            'status': 'error',
            'message': f'Prediction failed: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }
        print(f"\n[ERROR] Error during prediction: {str(e)}")
        print(f"{'='*60}\n")
        return jsonify(error_response), 500


@app.route('/api/predict-disease-only', methods=['POST'])
def predict_disease_only():
    """
    Direct disease prediction endpoint (skips leaf detection)
    Use this if you're sure the image is a tomato leaf
    """
    if disease_model is None:
        return jsonify({
            'status': 'error',
            'message': 'Disease model not loaded'
        }), 500
    
    if 'image' not in request.files:
        return jsonify({
            'status': 'error',
            'message': 'No image file provided'
        }), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({
            'status': 'error',
            'message': 'No file selected'
        }), 400
    
    try:
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Direct disease detection
        disease_result = detect_disease(image)
        disease_info = get_disease_info(disease_result['disease'])
        
        response = {
            'status': 'success',
            'prediction': {
                'disease': disease_result['disease'],
                'confidence': disease_result['confidence_percent'],
                'disease_info': disease_info
            },
            'all_predictions': disease_result['all_predictions'],
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Prediction failed: {str(e)}'
        }), 500


@app.route('/api/classes', methods=['GET'])
def get_classes():
    """
    Get all available disease classes
    """
    return jsonify({
        'status': 'success',
        'classes': CLASS_NAMES,
        'total_classes': len(CLASS_NAMES)
    })


@app.route('/api/model-info', methods=['GET'])
def model_info():
    """
    Get model information
    """
    info = {
        'status': 'success',
        'models': {
            'leaf_detector': {
                'loaded': leaf_model is not None,
                'path': LEAF_MODEL_PATH,
                'confidence_threshold': LEAF_CONFIDENCE_THRESHOLD
            },
            'disease_detector': {
                'loaded': disease_model is not None,
                'path': DISEASE_MODEL_PATH,
                'confidence_threshold': DISEASE_CONFIDENCE_THRESHOLD,
                'model_name': 'MobileNetV2 Fine-tuned',
                'total_classes': len(CLASS_NAMES)
            }
        },
        'configuration': {
            'image_size': IMG_SIZE,
            'max_file_size_mb': MAX_FILE_SIZE / (1024*1024)
        }
    }
    
    if disease_model is not None:
        try:
            info['models']['disease_detector']['input_shape'] = str(disease_model.input_shape)
            info['models']['disease_detector']['output_shape'] = str(disease_model.output_shape)
        except:
            pass
    
    return jsonify(info)


@app.route('/api/predict_disease', methods=['POST'])
def predict_disease():
    """Create database connection"""
    conn = sqlite3.connect(TREATMENT_DB_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def get_severity(affected_percentage: float) -> Tuple[int, str]:
    """Determine severity level from affected percentage"""
    if affected_percentage <= 10:
        return (1, "Mild")
    elif affected_percentage <= 30:
        return (2, "Moderate")
    elif affected_percentage <= 60:
        return (3, "Severe")
    else:
        return (4, "Critical")
    
def calculate_treatment_score(treatment: Dict, farming_type: str, budget: str) -> float:
    """
    Calculate treatment score based on user preferences
    Score range: 0-100
    """
    score = float(treatment['effectiveness_percentage'])
    
    # Adjust for farming type preference (±25 points)
    if farming_type == "organic":
        if treatment['is_organic']:
            score += 25
        else:
            score -= 20
    elif farming_type == "chemical":
        if not treatment['is_organic']:
            score += 15
    # "mixed" gets no adjustment
    
    # Adjust for budget (±15 points)
    cost = float(treatment['cost_per_acre_inr']) if treatment['cost_per_acre_inr'] else 1000
    if budget == "low":
        if cost < 1000:
            score += 15
        elif cost > 2000:
            score -= 15
    elif budget == "high":
        if cost > 2000:
            score += 5
    
    # Priority bonus (±10 points)
    priority = int(treatment['priority']) if treatment['priority'] else 3
    priority_bonus = (5 - priority) * 2
    score += priority_bonus
    
    return max(0, min(100, score))


def get_db_connection():
    """Create database connection"""
    conn = sqlite3.connect(TREATMENT_DB_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn


def get_recommendations_from_db(disease_name: str, 
                               affected_percentage: float,
                               farming_type: str = "mixed",
                               budget: str = "medium") -> Dict:
    
    disease_name = DISEASE_NAME_MAPPING.get(disease_name, disease_name)
    """
    Get treatment recommendations from database
    
    Args:
        disease_name: Name of detected disease
        affected_percentage: Percentage of plants affected (0-100)
        farming_type: "organic", "chemical", or "mixed"
        budget: "low", "medium", or "high"
    
    Returns:
        Dictionary with recommendations
    """
    
    # Normalize disease name (handle underscores vs spaces)
    disease_name_normalized = disease_name.replace('_', ' ').strip()
    
    # Determine severity
    severity_id, severity_name = get_severity(affected_percentage)
    
    # Urgency messages
    urgency_messages = {
        1: "[CAUTION] Act within 3-7 days. Early intervention prevents spread.",
        2: "[CAUTION] Act within 1-3 days. Disease is spreading actively.",
        3: "[URGENT] Act immediately (within 24 hours). Significant crop damage occurring.",
        4: "[URGENT] URGENT: Act immediately. Crop failure risk is high. Consult an expert."
    }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get disease info
        cursor.execute("""
            SELECT * FROM diseases 
            WHERE disease_name = ? OR REPLACE(disease_name, '_', ' ') = ?
        """, (disease_name, disease_name_normalized))
        
        disease = cursor.fetchone()
        
        if not disease:
            conn.close()
            return {
                "error": f"Disease '{disease_name}' not found in database. Available diseases can be checked in the system."
            }
        
        disease_id = disease['disease_id']
        
        # Get treatments for this disease
        cursor.execute("""
            SELECT 
                t.*,
                tc.category_name
            FROM treatments t
            JOIN treatment_categories tc ON t.category_id = tc.category_id
            WHERE t.disease_id = ?
            ORDER BY t.priority, t.effectiveness_percentage DESC
        """, (disease_id,))
        
        treatments = [dict(row) for row in cursor.fetchall()]
        
        if not treatments:
            conn.close()
            return {
                "error": f"No treatments found for '{disease_name}' in database."
            }
        
        # Filter treatments by severity (get treatments suitable for this severity)
        cursor.execute("""
            SELECT treatment_id FROM treatment_severity_mapping
            WHERE severity_id = ? AND is_recommended = 1
        """, (severity_id,))
        
        recommended_treatment_ids = [row['treatment_id'] for row in cursor.fetchall()]
        
        # If we have severity mappings, filter by them
        if recommended_treatment_ids:
            treatments = [t for t in treatments if t['treatment_id'] in recommended_treatment_ids]
        
        # If no treatments for this severity, use all available treatments
        if not treatments:
            cursor.execute("""
                SELECT 
                    t.*,
                    tc.category_name
                FROM treatments t
                JOIN treatment_categories tc ON t.category_id = tc.category_id
                WHERE t.disease_id = ?
                ORDER BY t.priority, t.effectiveness_percentage DESC
            """, (disease_id,))
            treatments = [dict(row) for row in cursor.fetchall()]
        
        # Score and rank treatments
        scored_treatments = []
        for treatment in treatments:
            score = calculate_treatment_score(treatment, farming_type, budget)
            treatment_copy = dict(treatment)
            treatment_copy['recommendation_score'] = round(score, 1)
            scored_treatments.append(treatment_copy)
        
        # Sort by score
        scored_treatments.sort(key=lambda x: x['recommendation_score'], reverse=True)
        
        # Get cultural practices
        cursor.execute("""
            SELECT * FROM cultural_practices
            WHERE disease_id = ?
            ORDER BY effectiveness DESC
        """, (disease_id,))
        
        cultural_practices = [dict(row) for row in cursor.fetchall()]
        
        # Format treatments for response
        formatted_treatments = []
        for t in scored_treatments[:3]:  # Top 3
            formatted_treatments.append({
                'name': t['treatment_name'],
                'type': t['category_name'],
                'recommendation_score': t['recommendation_score'],
                'effectiveness': t['effectiveness_percentage'],
                'is_organic': bool(t['is_organic']),
                'details': {
                    'active_ingredient': t['active_ingredient'] or 'N/A',
                    'products': t['product_names'] or 'N/A',
                    'how_to_apply': t['application_method'] or 'Follow product label',
                    'dosage': t['dosage'] or 'As per recommendation',
                    'frequency': t['frequency'] or 'As needed',
                    'duration': t['duration'] or 'Until recovery',
                    'cost_per_acre': f"₹{t['cost_per_acre_inr']:.0f}" if t['cost_per_acre_inr'] else "₹N/A"
                },
                'safety': {
                    'precautions': t['precautions'] or 'Follow safety guidelines',
                    'waiting_days_before_harvest': t['waiting_days_before_harvest'] or 0
                }
            })
        
        # Format cultural practices
        formatted_practices = []
        for p in cultural_practices:
            formatted_practices.append({
                'practice_name': p['practice_name'],
                'description': p['description'],
                'timing': p['timing'],
                'effectiveness': p['effectiveness']
            })
        
        # Immediate actions based on severity
        immediate_actions = [
            "Remove and destroy heavily infected leaves/plants immediately",
            "Isolate affected area to prevent spread",
            "Sanitize all tools and equipment with disinfectant"
        ]
        
        if severity_id >= 3:
            immediate_actions.extend([
                "Stop overhead irrigation immediately to reduce humidity",
                "Improve field drainage and air circulation",
                "Consider consulting agricultural extension officer"
            ])
        
        # Monitoring schedule
        monitoring_frequencies = {
            1: "Every 3-4 days",
            2: "Every 2 days",
            3: "Daily",
            4: "Twice daily"
        }
        
        monitoring_durations = {
            1: "2-3 weeks",
            2: "3-4 weeks",
            3: "4-6 weeks",
            4: "6-8 weeks"
        }
        
        # Build final response
        response = {
            'disease_info': {
                'name': disease['disease_name'],
                'description': disease['description'],
                'symptoms': disease['symptoms'],
                'affected_percentage': affected_percentage,
                'severity': severity_name,
                'urgency': urgency_messages[severity_id]
            },
            'treatments': formatted_treatments,
            'cultural_practices': formatted_practices,
            'immediate_actions': immediate_actions,
            'monitoring': {
                'frequency': monitoring_frequencies[severity_id],
                'duration': monitoring_durations[severity_id],
                'what_to_check': 'Disease spread, new spots, plant health, treatment effectiveness'
            },
            'preferences': {
                'farming_type': farming_type,
                'budget': budget
            }
        }
        
        conn.close()
        return response
        
    except Exception as e:
        print(f"Database error: {str(e)}")
        return {
            'error': f'Failed to get recommendations: {str(e)}'
        }


@app.route('/api/get_recommendations', methods=['POST'])
def get_recommendations():
    """
    Get treatment recommendations from database
    
    Expected JSON:
    {
        "disease_name": "Bacterial_spot",
        "affected_percentage": 25.0,
        "farming_type": "organic",
        "budget": "medium"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'disease_name' not in data or 'affected_percentage' not in data:
            return jsonify({
                'error': 'Missing required fields: disease_name and affected_percentage'
            }), 400
        
        disease_name = data['disease_name']
        affected_percentage = float(data['affected_percentage'])
        farming_type = data.get('farming_type', 'mixed')
        budget = data.get('budget', 'medium')
        
        # Get recommendations from database
        recommendations = get_recommendations_from_db(
            disease_name=disease_name,
            affected_percentage=affected_percentage,
            farming_type=farming_type,
            budget=budget
        )
        
        if 'error' in recommendations:
            return jsonify(recommendations), 400
        
        return jsonify(recommendations), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid data type: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


if __name__ == '__main__':
    print("\n" + "="*60)
    print("TOMATO DISEASE DETECTION API")
    print("="*60)
    print(f"Leaf Model: {'[OK] Loaded' if leaf_model else '[ERROR] Not Loaded'}")
    print(f"  Path: {LEAF_MODEL_PATH} (exists: {os.path.exists(LEAF_MODEL_PATH)})")
    print(f"Disease Model: {'[OK] Loaded' if disease_model else '[ERROR] Not Loaded'}")
    print(f"  Path: {DISEASE_MODEL_PATH} (exists: {os.path.exists(DISEASE_MODEL_PATH)})")
    
    # Use environment variable for port (Hugging Face Spaces uses port 7860)
    port = int(os.environ.get('PORT', 7860))
    host = '0.0.0.0'
    
    print(f"Server starting on http://{host}:{port}")
    print("="*60 + "\n")
    
    app.run(debug=False, host=host, port=port)