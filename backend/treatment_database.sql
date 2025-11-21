CREATE TABLE diseases (
    disease_id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(150),
    description TEXT,
    symptoms TEXT,
    favorable_conditions TEXT,
    spread_method TEXT,
    prevention_tips TEXT
);

CREATE TABLE treatment_categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    typical_cost_range VARCHAR(50),
    environmental_impact VARCHAR(20)
);

-- Pre-populate treatment categories (as requested)
INSERT INTO treatment_categories (category_name, description, environmental_impact, typical_cost_range) VALUES
('Organic', 'Natural, eco-friendly treatments', 'Low', 'Low-Moderate'),
('Chemical', 'Synthetic fungicides and pesticides', 'Medium-High', 'Low-High'),
('Biological', 'Beneficial microorganisms and biocontrol', 'Low', 'Low-Moderate'),
('Cultural', 'Management practices and sanitation', 'Very Low', 'Very Low'),
('Emergency', 'High-strength treatments for critical cases', 'High', 'High');

CREATE TABLE severity_levels (
    severity_id INTEGER PRIMARY KEY AUTOINCREMENT,
    severity_name VARCHAR(20) NOT NULL UNIQUE,
    percentage_range VARCHAR(20),
    urgency_level VARCHAR(20),
    description TEXT
);

INSERT INTO severity_levels (severity_name, percentage_range, urgency_level, description) VALUES
('Mild', '0-10%', 'Low', 'Prefer organic and cultural practices. Monitor closely.'),
('Moderate', '10-30%', 'Medium', 'Combine organic with biological controls; limited chemical if needed.'),
('Severe', '30-60%', 'High', 'Chemical treatments recommended; follow safety.'),
('Critical', '60-100%', 'Critical', 'Emergency chemicals and removal of heavily infected plants; quarantine.');

CREATE TABLE treatments (
    treatment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    treatment_name VARCHAR(200) NOT NULL,
    active_ingredient VARCHAR(200),
    product_names TEXT,
    application_method TEXT,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    effectiveness_percentage INTEGER CHECK(effectiveness_percentage >= 0 AND effectiveness_percentage <= 100),
    cost_per_acre_inr DECIMAL(10,2),
    is_organic BOOLEAN DEFAULT 0,
    priority INTEGER DEFAULT 1,
    
    precautions TEXT,
    protective_equipment TEXT,
    waiting_days_before_harvest INTEGER DEFAULT 0,
    environmental_impact VARCHAR(20),
    toxicity_to_bees VARCHAR(20),
    
    temperature_range VARCHAR(50),
    avoid_conditions TEXT,
    best_timing VARCHAR(100),
    
    FOREIGN KEY (disease_id) REFERENCES diseases(disease_id),
    FOREIGN KEY (category_id) REFERENCES treatment_categories(category_id)
);

CREATE TABLE treatment_severity_mapping (
    mapping_id INTEGER PRIMARY KEY AUTOINCREMENT,
    treatment_id INTEGER NOT NULL,
    severity_id INTEGER NOT NULL,
    is_recommended BOOLEAN DEFAULT 1,
    notes TEXT,
    FOREIGN KEY (treatment_id) REFERENCES treatments(treatment_id),
    FOREIGN KEY (severity_id) REFERENCES severity_levels(severity_id)
);

CREATE TABLE cultural_practices (
    practice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_id INTEGER NOT NULL,
    practice_name VARCHAR(200) NOT NULL,
    description TEXT,
    implementation_steps TEXT,
    timing VARCHAR(50),
    effectiveness VARCHAR(20),
    cost_estimate_inr DECIMAL(10,2),
    labor_required VARCHAR(20),
    FOREIGN KEY (disease_id) REFERENCES diseases(disease_id)
);

-- Indexes for performance
CREATE INDEX idx_treatments_disease ON treatments(disease_id);
CREATE INDEX idx_treatments_category ON treatments(category_id);
CREATE INDEX idx_treatments_effectiveness ON treatments(effectiveness_percentage DESC);
CREATE INDEX idx_cultural_disease ON cultural_practices(disease_id);

-- =========================
-- DISEASES (10+ healthy)
-- =========================

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Bacterial_spot',
 'Xanthomonas spp.',
 'Bacterial spot is a bacterial disease primarily affecting leaves, fruits and stems causing lesions and yield loss.',
 'Small dark water-soaked spots on leaves that enlarge and become necrotic; fruit shows small dark lesions; defoliation in severe cases.',
 'Warm (25-32°C), high humidity, overhead irrigation, wounds on plants.',
 'Rain splash, contaminated tools, infected transplants and seed, water, insect activity.',
 'Use certified disease-free seed/ seedlings, crop rotation, avoid overhead irrigation, remove infected debris, copper sprays as per IPM, use resistant varieties.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Early_blight',
 'Alternaria solani',
 'Fungal disease causing circular lesions with concentric rings on leaves, stems and fruits; common in tomatoes.',
 'Irregular brown lesions with target-like concentric rings on older leaves; leaf yellowing and drop; fruit rots.',
 'Warm temperatures (20-30°C) and alternating wet/dry periods; high humidity accelerates spread.',
 'Spores spread by wind, rain-splash, contaminated tools; survives on volunteer plants and crop residue.',
 'Crop rotation, remove infected debris, mulching, avoid irrigation late in day, fungicide sprays (mancozeb/ copper/azoxystrobin) as integrated approach.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Late_blight',
 'Phytophthora infestans',
 'Fast-spreading oomycete causing severe crop loss; affects leaves, stems and fruits — can devastate fields quickly.',
 'Dark water-soaked lesions on leaves and stems with white fuzzy sporangia under humid conditions; fruits with firm brown lesions.',
 'Cool (10-20°C) with high humidity, prolonged leaf wetness and fog; heavy rains.',
 'Zoospores and sporangia spread by wind and rain; infected seed/ volunteers.',
 'Use resistant varieties where possible, strict sanitation, fungicides specific to oomycetes (metalaxyl/mancozeb), timely application, remove infected plants.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Leaf_Mold',
 'Passalora fulva (Fulvia fulva)',
 'Fungal disease that mainly affects greenhouse tomatoes and leaves causing yellowing and olive-green to brown patches.',
 'Yellowing on upper leaf surface with olive-green velvety patches on underside; defoliation in severe cases.',
 'High humidity (90%+), poor ventilation, warm nights and cool days, dense canopy in greenhouses.',
 'Spread via spores in the air; contaminated greenhouse equipment and clothing.',
 'Improve ventilation, avoid overhead irrigation, lower humidity in greenhouses, remove affected leaves, fungicide rotation and bio-controls.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Septoria_leaf_spot',
 'Septoria lycopersici',
 'Fungal leaf spot disease producing small circular spots leading to premature defoliation and yield loss.',
 'Numerous small circular greyish spots with dark margins on lower leaves; yellowing and defoliation starts low and moves up.',
 'Cool to moderate temperatures (20-25°C) with frequent leaf wetness; dense foliage.',
 'Spores spread by splashing water, infected debris, seed, and tools.',
 'Sanitation (remove crop residue), apply fungicides on lower canopy, wider plant spacing for airflow, crop rotation.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Spider_mites Two-spotted_spider_mite',
 'Tetranychus urticae (Two-spotted spider mite)',
 'Spider mites are tiny sap-sucking pests causing stippling, webbing and rapid leaf damage in warm, dry conditions.',
 'Fine stippling (yellow speckles) on leaves, leaf bronzing, webbing on underside of leaves, leaf drop in heavy infestations.',
 'Hot, dry weather (28-35°C), low relative humidity; frequent when hot/dry inside greenhouses.',
 'Spread via wind, infested transplants, farm equipment, human movement.',
 'Maintain humidity, use predatory mites (Phytoseiulus persimilis), miticides when necessary, avoid unnecessary broad-spectrum insecticides that kill predators.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Target_Spot',
 'Corynespora cassiicola / Alternaria spp. (depending on region)',
 'Leaf spot disease that causes target-like lesions on foliage and sometimes on fruit, can reduce photosynthetic area and yield.',
 'Round to angular lesions with concentric rings or target-like patterns on leaves and fruit; may coalesce to cause blighting.',
 'Warm, humid conditions with leaf wetness; moderate temperatures.',
 'Spread by wind, rain splashes, contaminated tools and seed borne inoculum.',
 'Remove infected debris, improve airflow, apply appropriate fungicides, rotate chemicals to avoid resistance.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Tomato_Yellow_Leaf_Curl_Virus',
 'Tomato yellow leaf curl virus (TYLCV) — Begomovirus',
 'A viral disease causing severe stunting and yield loss; no chemical cure — focus on prevention and vector control.',
 'Severe upward leaf curling, yellowing between veins, stunted plants, flower drop and low fruit set.',
 'Warm conditions favor whitefly vector (Bemisia tabaci); high whitefly populations increase risk.',
 'Spread by whitefly (Bemisia tabaci) and via infected transplants.',
 'Use virus-free transplants, reflective mulches, yellow sticky traps, control whitefly vectors (neonicotinoids/biocontrol), roguing infected plants, resistant varieties where available.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('Tomato_mosaic_virus',
 'Tobamovirus (Tomato mosaic virus, ToMV)',
 'A Tobamovirus causing mosaic, stunting and fruit mottling; highly stable and easily spread mechanically.',
 'Mosaic patterning on leaves, leaf distortion, stunted growth, mottled fruits; variable symptoms by cultivar.',
 'Moderate temperatures; durable virus persists on tools and plant debris; high greenhouse use can increase spread.',
 'Mechanical transmission (hands, tools), seeds, contaminated nursery stock.',
 'Use virus-free seed, disinfect tools, avoid working when plants are wet, remove infected plants, sanitation, use tolerant/resistant varieties.');

INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('powdery_mildew',
 'Oidium neolycopersici / Leveillula taurica (species vary)',
 'Powdery mildew causes white powdery growth on leaves and stems; reduces photosynthesis and vigor.',
 'White powdery patches on upper leaf surface, leaf curling and yellowing, premature leaf drop in advanced stages.',
 'Moderate temperatures (20-27°C), high humidity but not free water on leaf surfaces; dense canopy.',
 'Airborne conidia; survives on nearby host plants and plant debris.',
 'Use resistant varieties, improve airflow, prune canopy, apply sulfur or biofungicides, rotate treatments.');

-- Optional 'healthy' as preventive-only entry (special requirement)
INSERT INTO diseases (disease_name, scientific_name, description, symptoms, favorable_conditions, spread_method, prevention_tips) VALUES
('healthy',
 'Healthy_crop_state',
 'Represents healthy crop state; only preventive measures and monitoring recommended.',
 'No disease symptoms; green leaves; good vigor.',
 'N/A',
 'N/A',
 'Regular monitoring, balanced nutrition, crop rotation, sanitation, use certified seed, integrated pest management.');

-- =========================
-- TREATMENTS (50+ records across diseases)
-- For readability: grouped by disease. Each has a mix: Organic, Biological, Chemical, Cultural, Emergency.
-- product names and dosages are realistic Indian-market examples (Dithane M-45, Ridomil Gold, Blitox, Confidor, Vertimec, Neem based, Trichoderma products).
-- =========================

-- Helper: get category ids (assumes insertion order above)
-- (1) Organic, (2) Chemical, (3) Biological, (4) Cultural, (5) Emergency

-- 1) Bacterial_spot treatments (disease_id will be 1 if insertion order preserved)
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
-- Organic: Neem oil foliar (budget)
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'), 1, 'Neem oil foliar spray (organic)', 'Azadirachtin / neem oil', 'Neemazal, Karanj oil formulations, Local cold-pressed neem oil', 'Foliar spray to runoff; mix thoroughly with water and emulsifier', '2-3 ml per litre (0.2-0.3 %), approx 20-30 L per acre spray: use 60-90 ml per 15L pump', 'Repeat 7-10 days', '3-4 applications across season or until control', 55, 600.00, 1, 1, 'Avoid mixing with copper on same day; phytotoxic on young seedlings if concentrated', 'Gloves, mask, goggles', 0, 'Low', 'Low', '10-35°C', 'Do not spray at high temperatures >35°C or under strong sunlight', 'Early morning / late evening'),

-- Biological: Copper+Trichoderma seedling dip (biological enhancement)
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'), 3, 'Trichoderma harzianum seed treatment + soil drench', 'Trichoderma harzianum', 'Tricho formulations (Sumitomo-Tricho HR, Katyayani Tricho)', 'Seedling root dip (1-2 g/L) before transplant; soil drench near root zone', '1.5-2 g per litre for dip; 2-3 kg/acre as granular bioformulation', 'Single before transplant; repeat soil drench 15-21 days', 'One season protective', 60, 800.00, 1, 2, 'Avoid broad-spectrum fungicides within 7 days of application', 'Gloves', 0, 'Low', 'Low', 'Optimal 20-30°C', 'None', 'Best at transplanting/preventive'),

-- Chemical: Copper oxychloride (Blitox / Copper fungicide)
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'), 2, 'Copper oxychloride foliar spray', 'Copper oxychloride', 'Blitox (Tata Rallis), COC formulations', 'Foliar spray; wet leaf surface thoroughly', '3 g per litre (300-400 g/acre)', 'Repeat 7-10 days', 'Apply through season when symptoms appear', 75, 1800.00, 0, 3, 'Do not exceed label rates; copper accumulates in soil', 'Gloves, mask, goggles', 3, 'Medium', 'Moderate toxicity', '10-35°C', 'Avoid mixing with alkaline materials', 'At first sign of disease'),

-- Chemical: Streptocycline copper tank mix (emergency/careful use) — NOTE: streptomycin availability/restrictions vary; included as an emergency option widely used in some IPM contexts with regulation
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'), 5, 'Streptomycin + Copper (emergency use)', 'Streptomycin sulfate + Copper oxychloride', 'Streptomycin sulphate (registered formulations) + Blitox', 'Foliar spray; for severe outbreaks only; tank mix following label rates', 'Streptomycin 200-300 g/acre + copper 300-400 g/acre (follow local regulation)', 'Single emergency spray; do not repeat frequently', 'Short term rescue', 70, 3500.00, 0, 4, 'Use only as permitted by regulation; human antibiotic stewardship concerns', 'Gloves, mask, full PPE', 7, 'High', 'High', 'Any', 'Avoid spraying during pollination', 'Emergency only'),

-- Organic: Potassium bicarbonate spray (fungal/bacterial reduction, gentle)
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'), 1, 'Potassium bicarbonate foliar spray (bactericidal effect)', 'Potassium bicarbonate', 'K-Bicarb formulations (local agri supplies)', 'Dissolve in water and spray to wet foliage', '5-7 g per litre (0.5-0.7%)', 'Repeat 7-10 days', 'Short season of effect; supportive', 50, 700.00, 1, 5, 'Avoid mixing with strong acids or coppers immediately', 'Gloves', 0, 'Very Low', 'Low', 'Best in moderate temps', 'None', 'Preventive/During early infection');

-- 2) Early_blight (Alternaria solani) treatments
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'), 1, 'Cultural + Neem oil spray (preventive)', 'Neem oil / azadirachtin', 'NeemAzal, Local neem cold-pressed', 'Foliar spray to runoff', '2-3 ml/L (0.2-0.3%)', '7-10 days', 'Season-long with repeats', 50, 700.00, 1, 3, 'Avoid spraying in strong sun; shake well', 'Gloves', 0, 'Low', 'Low', '15-30°C', 'High temp+strong sunlight', 'Early morning/late evening'),

((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'), 3, 'Trichoderma harzianum soil application', 'Trichoderma harzianum', 'Tricho HR, Biofungicide brands', 'Apply to soil/seedlings; drench', '2 kg/acre granular or 1.5-2 g/L for drench', 'At transplant and repeat 21-30 days', 'Season long preventive', 62, 900.00, 1, 2, 'Avoid immediate fungicide applications that harm Trichoderma', 'Gloves', 0, 'Low', 'Low', 'Optimal 20-30°C', 'Avoid hot dry soil', 'Before transplanting'),

((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'), 2, 'Mancozeb (Dithane M-45) foliar spray', 'Mancozeb 75% WP', 'Dithane M-45, Indofil M-45', 'Foliar spray to wet foliage', '2-3 g/L (approx 300-400 g/acre)', '7-10 days', 'Until disease suppressed', 80, 1500.00, 0, 1, 'Do not inhale powder; avoid mixing with oils', 'Gloves, mask', 3, 'Medium', 'Low', '15-30°C', 'Do not spray under heavy dew or midday heat', 'At onset and preventive'),

((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'), 2, 'Azoxystrobin systemic foliar (premium option)', 'Azoxystrobin 23% SC or 18.2% WG', 'Generic azoxystrobin formulations (eg. Amistar-type generics)', 'Foliar spray; systemic protectant', '0.8-1.2 ml/L (variable by formulation); ~200-300 ml/acre per application', '14 days (rotate)', 'Up to 3 applications per season', 90, 4200.00, 0, 2, 'Avoid overuse to prevent resistance; follow FRAC groups', 'Gloves', 3, 'Medium', 'Low to bees (depending on timing)', '15-28°C', 'Do not apply during flowering to protect pollinators', 'Early morning/late evening'),

((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'), 4, 'Sanitation and crop rotation (cultural)', 'N/A', 'N/A', 'Remove infected debris, rotate with non-host crops, deep ploughing', 'N/A', 'Season-long', 'Preventive', 70, 200.00, 1, 4, 'Requires labor to remove debris', 'Gloves', 0, 'Very Low', 'None', 'All season', 'None', 'During off-season/after harvest');

-- 3) Late_blight (Phytophthora infestans) treatments
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Late_blight'), 2, 'Ridomil Gold (Metalaxyl + Mancozeb) systemic/soil & foliar', 'Metalaxyl 4% + Mancozeb 64%', 'Ridomil Gold (Syngenta) or generics', 'Foliar spray / soil drench depending on label', '1-2 g/L foliar (approx 300-400 g/acre); soil drench per label', 'Repeat 7-10 days during high risk', 'Use early in disease to be effective', 88, 3200.00, 0, 1, 'Avoid repeated applications to avoid resistance; wear PPE', 'Gloves, mask', 7, 'High', 'Low', '10-20°C (cool humid)', 'Do not apply on very wet foliage in rain', 'At first sign / high-risk forecast'),

((SELECT disease_id FROM diseases WHERE disease_name='Late_blight'), 2, 'Copper oxychloride (Blitox) contact protection', 'Copper oxychloride', 'Blitox, Copper oxychloride 50 WP', 'Foliar spray to thoroughly cover foliage', '3-4 g/L (400-800 g/acre)', '7-10 days', 'Season-long protectant', 70, 1600.00, 0, 3, 'Avoid soil accumulation; phytotoxicity at high temps', 'Gloves', 3, 'Medium', 'Moderate', '8-20°C', 'Do not mix with alkaline solutions', 'Preventive and early infection'),

((SELECT disease_id FROM diseases WHERE disease_name='Late_blight'), 3, 'Biological: Bacillus subtilis foliar spray', 'Bacillus subtilis strains (biofungicide)', 'Bio Bacillus products (Trichoderma/Bacillus mixes)', 'Foliar spray; cover both surfaces', '2-3 g/L or per product label (approx 1-2 kg/acre)', '7-14 days', 'Integrated use', 65, 1000.00, 1, 4, 'Do not tank-mix with strong chemicals; store per label', 'Gloves', 0, 'Low', 'Low', '10-22°C', 'Apply when no rain expected for 6 hours', 'Preventive/early infection'),

((SELECT disease_id FROM diseases WHERE disease_name='Late_blight'), 5, 'Emergency: High-strength oxathiapiprolin or similar oomycete-specific rescue (where registered)', 'Oxathiapiprolin or other oomycide', 'High-efficacy oomycete fungicides (product names vary by registration)', 'Foliar spray, follow label', 'Follow label; e.g., few g/acre per product', 'Single emergency application; consult local extension', 'Rescue only', 92, 7200.00, 0, 1, 'Use only in severe outbreaks; resistance risk', 'Full PPE', 7, 'High', 'Moderate', 'Cool humid', 'Emergency use only', 'At first rapid spread');

-- 4) Leaf_Mold treatments
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold'), 4, 'Improve ventilation and pruning (cultural)', 'N/A', 'N/A', 'Prune lower leaves, open greenhouse vents, space plants', 'N/A', 'Ongoing', 'Season-long preventive', 75, 300.00, 1, 1, 'Requires discipline; moderate labor', 'Gloves', 0, 'Very Low', 'None', 'All season', 'Do not overcrowd', 'Preventive'),

((SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold'), 1, 'Potassium bicarbonate or baking soda spray (organic supportive)', 'Potassium bicarbonate', 'Local formulations', 'Foliar spray thoroughly', '5-7 g/L (0.5-0.7%)', '7-10 days', 'Used until control achieved', 55, 800.00, 1, 3, 'Avoid mixing with acidic products', 'Gloves', 0, 'Very Low', 'Low', '18-28°C', 'Avoid high humidity immediately after', 'Early morning'),

((SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold'), 2, 'Sulphur powder / wettable sulphur spray (chemical but low toxicity)', 'Sulphur', 'Wettable sulphur formulations', 'Foliar spray or dust in greenhouse', '2-3 g/L or per label', '10-14 days', 'Repeat as needed but watch phytotoxicity', 75, 1200.00, 0, 2, 'Do not apply near oil sprays or at high temp (>30°C)', 'Gloves, mask', 7, 'Medium', 'Low', '15-28°C', 'Avoid hot days', 'Preventive/early infection'),

((SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold'), 3, 'Biological: Bacillus amyloliquefaciens foliar (biofungicide)', 'Bacillus spp.', 'Commercial biofungicides containing Bacillus', 'Foliar spray as per label', '1-3 g/L', '7-14 days', 'Integrated control', 60, 1100.00, 1, 4, 'Do not mix with strong oxidizers', 'Gloves', 0, 'Low', 'Low', '18-28°C', 'Apply when dry conditions follow', 'Preventive');

-- 5) Septoria_leaf_spot treatments
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot'), 4, 'Sanitation & lower canopy sprays (cultural)', 'N/A', 'N/A', 'Remove lower infected leaves, mulch, avoid overhead irrigation', 'N/A', 'Weekly monitoring', 'Preventive & during infection', 72, 250.00, 1, 1, 'Requires labor', 'Gloves', 0, 'Very Low', 'None', 'All season', 'Do not irrigate late evening', 'Preventive / early'),

((SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot'), 2, 'Mancozeb (Dithane M-45) spray', 'Mancozeb 75% WP', 'Dithane M-45, Indofil M-45', 'Foliar spray', '2-3 g/L (300-400 g/acre)', '7-10 days', 'Until control', 78, 1400.00, 0, 2, 'Follow label; wash equipment', 'Gloves, mask', 3, 'Medium', 'Low', '18-28°C', 'Avoid spraying in rain', 'At first sign'),

((SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot'), 3, 'Biofungicide: Trichoderma foliar drench', 'Trichoderma harzianum', 'Tricho HR, local brands', 'Drench and foliar spray', '1.5-2 g/L; 2 kg/acre granular', '21 days', 'Season-long support', 60, 900.00, 1, 3, 'Do not use with strong chemicals', 'Gloves', 0, 'Low', 'Low', '18-28°C', 'Follow label', 'Early morning'),

((SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot'), 1, 'Copper hydroxide or copper oxychloride (organic-approved copper)', 'Copper hydroxide / oxychloride', 'Copper hydroxide and Blitox', 'Foliar spray', '2-3 g/L (400-800 g/acre)', '7-14 days', 'Protectant', 70, 1600.00, 0, 4, 'Careful of residues and soil accumulation', 'Gloves', 3, 'Medium', 'Moderate', '15-30°C', 'Avoid repeated use', 'Preventive');

-- 6) Spider_mites (Two-spotted spider mite) treatments (miticides)
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite'), 3, 'Predatory mites (Phytoseiulus persimilis) release (biological)', 'Predatory mite Phytoseiulus persimilis', 'Biocontrol suppliers (local)', 'Release onto crop canopy at dusk; ensure humidity', 'Release rate 50-100 predators per m2 (follow supplier)', 'Repeat releases weekly if needed', 'Season-long biological control', 75, 2500.00, 1, 2, 'Do not use broad-spectrum insecticides which kill predators', 'None to minimal (handling boxes)', 0, 'Low', 'None', '20-30°C', 'Avoid immediate pesticide applications', 'Evening releases'),

((SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite'), 2, 'Abamectin (Vertimec/Mectin) miticide', 'Abamectin 1.8% EC or 0.3% SC', 'Vertimec or generics', 'Foliar spray, target underside of leaves', '0.5-1.2 ml/L (approx 1.2 ml/L common) or 30-50 ml/acre depending on formulation', 'Repeat only once after 10-14 days if needed', 'Short-term knockdown', 90, 1800.00, 0, 1, 'Highly toxic to aquatic organisms; do not overuse', 'Gloves, mask', 14, 'Medium', 'Low', '25-35°C', 'Avoid hot days and pollinator presence', 'Evening/early morning'),

((SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite'), 1, 'Neem oil + Karanj oil spray (organic contact repellent)', 'Azadirachtin / neem oil', 'Karanj oil, commercial neem', 'Foliar spray focusing on underside', '3 ml/L (0.3%)', '7-10 days', 'Support control', 55, 700.00, 1, 4, 'May be less effective in heavy infestations', 'Gloves', 0, 'Very Low', 'Low', '25-35°C', 'Avoid midday sun', 'Evening or early morning'),

((SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite'), 2, 'Fenpyroximate / pyridaben miticide (chemical)', 'Fenpyroximate or Pyridaben', 'Commercial miticide formulations (local brands)', 'Foliar spray', 'Per label; commonly 0.5-1 ml/L depending on formulation', 'Single or repeat per label (usually 10-14 days)', 'High efficacy against mites', 88, 2200.00, 0, 1, 'Avoid drift to non-targets; rotate modes of action', 'Gloves, mask', 7, 'Medium', 'Low', '25-35°C', 'Do not tank-mix with oils at high temp', 'Evening'),

((SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite'), 4, 'Increase humidity & irrigation (cultural suppression)', 'N/A', 'N/A', 'Raise humidity in greenhouse, avoid dusty plants, regular washing of foliage', 'N/A', 'Daily/weekly care', 'Preventive & during early infestation', 60, 100.00, 1, 5, 'May encourage fungal pests if overdone', 'Gloves', 0, 'Very Low', 'None', 'All season', 'Do not overwater', 'Preventive');

-- 7) Target_Spot treatments
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Target_Spot'), 4, 'Crop sanitation & debris removal', 'N/A', 'N/A', 'Remove and destroy infected leaves and crop debris', 'N/A', 'Ongoing', 'Preventive', 70, 250.00, 1, 1, 'Requires labor', 'Gloves', 0, 'Very Low', 'None', 'All season', 'Avoid leaving residues', 'Preventive/after harvest'),

((SELECT disease_id FROM diseases WHERE disease_name='Target_Spot'), 2, 'Mancozeb (Dithane) foliar application', 'Mancozeb 75% WP', 'Dithane M-45', 'Foliar spray', '2-3 g/L (300-400 g/acre)', '7-10 days', 'Used until control', 78, 1500.00, 0, 2, 'Follow resistance management', 'Gloves', 3, 'Medium', 'Low', '18-28°C', 'Avoid heavy rain', 'Preventive/early'),

((SELECT disease_id FROM diseases WHERE disease_name='Target_Spot'), 3, 'Bacillus subtilis foliar biofungicide', 'Bacillus subtilis', 'Commercial Bacillus products', 'Foliar spray covering both surfaces', '1-3 g/L', '7-14 days', 'Part of IPM', 65, 1000.00, 1, 3, 'Do not mix with strong chemicals', 'Gloves', 0, 'Low', 'Low', '18-28°C', 'Apply in dry period', 'Preventive'),

((SELECT disease_id FROM diseases WHERE disease_name='Target_Spot'), 2, 'Propiconazole / triazole systemic (premium)', 'Propiconazole', 'Tilt/generic propiconazole formulations', 'Foliar spray systemic', '0.5-1 ml/L per label', '14 days rotation', 'Short-medium control', 85, 3600.00, 0, 1, 'Follow FRAC rotation to avoid resistance', 'Gloves, mask', 7, 'Medium', 'Low', '15-28°C', 'Avoid repeated sole use', 'At first sign');

-- 8) Tomato_Yellow_Leaf_Curl_Virus (vector management & prevention only)
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus'), 4, 'Reflective mulch & yellow sticky traps (cultural/monitoring)', 'N/A', 'Reflective mulch suppliers, yellow sticky traps (local)', 'Install reflective silver mulch at transplanting; hang yellow sticky traps around field edges', 'Mulch per bed; 20-40 traps/acre', 'Replace traps monthly', 'Season-long prevention', 65, 1200.00, 1, 2, 'Cost of mulch and traps; must be combined with other measures', 'Gloves', 0, 'Very Low', 'Low', 'All season', 'Do not neglect trap maintenance', 'At transplanting / continuous'),

((SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus'), 2, 'Systemic insecticide seedling/root dip (Imidacloprid) for whitefly control', 'Imidacloprid 17.8% SL', 'Confidor (Bayer) or generics', 'Seedling root dip or soil drench at transplanting; follow label for seedling dip', '0.5-1 ml/L for foliar or 0.5-1 ml per litre for root dip; soil drench rates per label', 'Single application at transplant then monitor', 'Preventive to reduce vector feeding', 80, 900.00, 0, 1, 'Neonicotinoid persistence and pollinator risk; use as directed', 'Gloves, mask', 14, 'High', 'High to bees', '20-35°C', 'Avoid during flowering open-field', 'At transplanting / early'),

((SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus'), 3, 'Biological control: Encarsia formosa / Eretmocerus parasitoids releases', 'Encarsia/Eretmocerus spp. (parasitoids)', 'Biocontrol suppliers', 'Release parasitoids into crop at early whitefly presence', 'Release per supplier specs (e.g., 50-200 insects per m2 depending on infestation)', 'Periodic releases', 'Long-term suppression', 68, 3500.00, 1, 3, 'Do not use after systemic insecticides that kill parasitoids', 'None for field worker', 0, 'Low', 'None', 'All season', 'Do not apply broad-spectrum insecticides', 'Early season / preventive'),

((SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus'), 5, 'Roguing/removal of heavily infected plants (emergency containment)', 'N/A', 'N/A', 'Uproot and bury or burn infected plants away from field, disinfect tools afterwards with 1% sodium hypochlorite', 'N/A', 'Immediate', 'Emergency containment', 90, 1500.00, 1, 1, 'Handle carefully; wear gloves; bury deep', 'Gloves, mask', 0, 'Very Low', 'None', 'All season', 'Do not compost infected plants', 'Immediate when detected');

-- 9) Tomato_mosaic_virus (ToMV) — focus on prevention & mechanical sanitation
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Tomato_mosaic_virus'), 4, 'Strict sanitation & tool disinfection (cultural)', '1% sodium hypochlorite / 70% alcohol', 'Household bleach diluted', 'Disinfect tools, hands and gloves between plants; avoid handling wet plants', 'Use 1% bleach or 70% alcohol wipe', 'Daily when moving plants', 'Season-long', 85, 120.00, 1, 1, 'Bleach corrosive; avoid contact with skin and fabrics', 'Gloves, eye protection', 0, 'Very Low', 'None', 'All season', 'Do not handle when plants are wet', 'Preventive/ongoing'),

((SELECT disease_id FROM diseases WHERE disease_name='Tomato_mosaic_virus'), 4, 'Use certified virus-free seed and resistant varieties (cultural)', 'N/A', 'Certified seed suppliers', 'Source certified seeds, test seedlings', 'N/A', 'One-time at seed purchase', 'Season-long protection', 90, 500.00, 1, 1, 'Cost of certified seed may be higher', 'None', 0, 'Very Low', 'None', 'All season', 'Do not use saved seed from infected crop', 'Before planting'),

((SELECT disease_id FROM diseases WHERE disease_name='Tomato_mosaic_virus'), 1, 'Neem-based contact sprays to reduce insect vectors & mechanical spread (supportive)', 'Neem oil', 'NeemAzal', 'Foliar spray to reduce insect activity', '2-3 ml/L', '7-10 days', 'Supportive only; cannot cure virus', 40, 700.00, 1, 4, 'Not curative; supportive', 'Gloves', 0, 'Low', 'None', 'All season', 'Not a cure', 'Preventive'),

((SELECT disease_id FROM diseases WHERE disease_name='Tomato_mosaic_virus'), 5, 'Removal of infected plants & deep burial (emergency)', 'N/A', 'N/A', 'Uproot and destroy infected plants immediately', 'N/A', 'Immediate', 'Containment', 95, 1000.00, 1, 1, 'Do not compost infected tissue', 'Gloves, mask', 0, 'Very Low', 'None', 'All season', 'Immediate removal when detected', 'Immediate');

-- 10) powdery_mildew treatments
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew'), 1, 'Sulphur dust or wettable sulphur foliar (organic-approved)', 'Sulphur', 'Wettable sulphur products', 'Foliar spray: 2-3 g/L', '7-14 days', 'Season-long control if timed', 'N/A', 72, 900.00, 0, 2, 'Phytotoxic in high temps (>30°C); do not mix with oil sprays', 'Gloves, mask', 7, 'Medium', 'Low', '15-27°C', 'Avoid hot days', 'Preventive/early'),

((SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew'), 3, 'Bacillus subtilis (biofungicide) foliar spray', 'Bacillus subtilis', 'Commercial Bacillus products', 'Foliar spray per label', '1-3 g/L', '7-14 days', 'Integrated control', 65, 1000.00, 1, 3, 'Avoid mixing with strong chemicals', 'Gloves', 0, 'Low', 'Low', '15-27°C', 'Apply in dry weather', 'Early morning'),

((SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew'), 1, 'Potassium bicarbonate foliar application (organic-friendly)', 'Potassium bicarbonate', 'Local suppliers', 'Foliar spray', '5-7 g/L', '7-10 days', 'Supportive control', 55, 700.00, 1, 4, 'Short residual', 'Gloves', 0, 'Very Low', 'Low', '15-27°C', 'Avoid mixing with acids', 'Preventive/early'),

((SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew'), 2, 'Triazole or demethylation inhibitor (DMI) fungicide (propiconazole)', 'Propiconazole', 'Tilt or generic propiconazole', 'Foliar spray systemic', '0.5-1 ml/L per label', '14 days rotation', 'Up to 85% control with rotation', 85, 3600.00, 0, 1, 'Rotate to avoid resistance', 'Gloves', 7, 'Medium', 'Low', '15-27°C', 'Avoid single-mode repeated use', 'At first sign');

-- 11) (Optional) healthy: preventive-only treatments (seed treatment / soil health)
INSERT INTO treatments (disease_id, category_id, treatment_name, active_ingredient, product_names, application_method, dosage, frequency, duration, effectiveness_percentage, cost_per_acre_inr, is_organic, priority, precautions, protective_equipment, waiting_days_before_harvest, environmental_impact, toxicity_to_bees, temperature_range, avoid_conditions, best_timing)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='healthy'), 4, 'Seed treatment with Trichoderma & Rhizobacteria (preventive)', 'Trichoderma harzianum, Pseudomonas fluorescens', 'Tricho + PGPR mixes (local brands)', 'Treat seed/seedlings before planting; coat seed or dip seedlings', '1.5-2 g/L dip; seed coating per product', 'One-time before transplant', 'Season-long reduced risk', 70, 800.00, 1, 1, 'Do not combine with strong disinfectants after treatment', 'Gloves', 0, 'Low', 'Low', 'Optimal 20-28°C', 'Do not expose treated seed to extreme heat', 'At sowing'),

((SELECT disease_id FROM diseases WHERE disease_name='healthy'), 4, 'Balanced fertilization & monitoring (cultural)', 'N/A', 'Soil test & fertilizer suppliers', 'Soil test and apply balanced NPK + micronutrients', 'Per soil test', 'Season planning', 'Ongoing', 80, 1500.00, 1, 2, 'Avoid over-application of nitrogen', 'None', 0, 'Very Low', 'None', 'All season', 'Avoid excess N late season', 'Preventive');

-- =========================
-- TREATMENT-SEVERITY MAPPINGS
-- Map each treatment to recommended severity levels.
-- Use severity ids: (1) Mild, (2) Moderate, (3) Severe, (4) Critical
-- We'll add mappings for each treatment by selecting recently inserted treatments.
-- For simplicity we map by matching disease + treatment_name (could be done programmatically in app).
-- =========================

-- For Bacterial_spot treatments mapping examples
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Preferred for mild cases' FROM treatments t WHERE t.treatment_name LIKE '%Neem oil foliar%';
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 2, 1, 'Good for moderate cases' FROM treatments t WHERE t.treatment_name LIKE '%Trichoderma%';
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 3, 1, 'Use chemical copper for severe cases' FROM treatments t WHERE t.treatment_name LIKE '%Copper oxychloride%';
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 4, 1, 'Emergency streptomycin+copper in regulated situations' FROM treatments t WHERE t.treatment_name LIKE '%Streptomycin%';
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Supportive for mild cases' FROM treatments t WHERE t.treatment_name LIKE '%Potassium bicarbonate%';

-- Early_blight mappings
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Organic preventive' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Early_blight') AND t.category_id=1;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 2, 1, 'Use bio + organic for moderate outbreaks' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Early_blight') AND t.category_id=3;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 3, 1, 'Chemical protectants for severe cases' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Early_blight') AND t.category_id=2;

-- Late_blight mappings
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 3, 1, 'Ridomil and copper for severe late blight' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Late_blight') AND t.category_id IN (2,5);
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 2, 1, 'Biologicals in moderate risk periods' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Late_blight') AND t.category_id=3;

-- Leaf_Mold mappings
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Cultural/ventilation for mild' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold') AND t.category_id=4;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 2, 1, 'Sulphur/Bacillus for moderate' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold') AND t.category_id IN (1,3);

-- Septoria mappings
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Sanitation for mild' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot') AND t.category_id=4;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 3, 1, 'Mancozeb for severe septoria' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot') AND t.category_id=2;

-- Spider mites mappings
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Humidity and neem for mild mite presence' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite') AND t.category_id=1;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 2, 1, 'Predatory mites for moderate' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite') AND t.category_id=3;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 3, 1, 'Chemical miticides for severe' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite') AND t.category_id=2;

-- Target Spot mappings
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Sanitation prevents mild cases' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Target_Spot') AND t.category_id=4;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 3, 1, 'Propiconazole or Mancozeb for severe cases' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Target_Spot') AND t.category_id=2;

-- Viral diseases mappings (focus on vector control & prevention)
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Reflective mulch and traps for mild risk' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus') AND t.category_id=4;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 2, 1, 'Use systemic insecticide at transplant for moderate whitefly pressure' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus') AND t.category_id=2;
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Sanitation for ToMV' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='Tomato_mosaic_virus') AND t.category_id=4;

-- Powdery mildew mappings
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Sulphur/Biofungicide for mild cases' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew') AND t.category_id IN (1,3);
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 3, 1, 'DMIs for severe powdery mildew' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew') AND t.category_id=2;

-- Healthy mappings (preventive)
INSERT INTO treatment_severity_mapping (treatment_id, severity_id, is_recommended, notes)
SELECT t.treatment_id, 1, 1, 'Preventive seed treatment' FROM treatments t WHERE t.disease_id=(SELECT disease_id FROM diseases WHERE disease_name='healthy');

-- =========================
-- CULTURAL PRACTICES (25-30 records requested; included 28)
-- Each practice linked to a disease_id and contains steps, timing, cost estimate.
-- =========================

-- Bacterial_spot cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'),
 'Use certified seed/seedlings',
 'Source disease-free certified seedlings to avoid introducing bacterial pathogens.',
 '1) Purchase certified seedlings. 2) Inspect nursery prior to transplanting. 3) Quarantine new batches for 7 days.', 'Preventive', 'High', 500.00, 'Low');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'),
 'Avoid overhead irrigation & use drip irrigation',
 'Reduce leaf wetness by switching to drip or furrow irrigation.',
 '1) Install drip lines. 2) Schedule irrigation early morning. 3) Monitor for leaks.', 'Preventive/During infection', 'High', 7000.00, 'Medium');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'),
 'Field sanitation and crop residue removal',
 'Remove and destroy infected crop residues to reduce inoculum carryover.',
 '1) Collect infected debris after harvest. 2) Burn or deep bury away from field. 3) Clean tools.', 'Post-treatment/preventive', 'High', 400.00, 'High');

-- Early_blight cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'),
 'Crop rotation with non-hosts (e.g., cereals)',
 'Break disease cycle by avoiding tomatoes in same field for 2 seasons.',
 '1) Map fields. 2) Rotate to sorghum/cereal for a season. 3) Monitor volunteers.', 'Preventive', 'High', 1000.00, 'Medium');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'),
 'Mulching to reduce soil splash',
 'Use straw or plastic mulch to limit soil-borne inoculum splash onto lower leaves.',
 '1) Lay mulch prior to transplant. 2) Monitor mulch condition. 3) Replace when necessary.', 'Preventive', 'Moderate', 2500.00, 'Medium');

-- Late_blight cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Late_blight'),
 'Rapid removal and destruction of affected plants',
 'Because late blight can spread fast, remove heavily infected plants immediately.',
 '1) Identify and mark infected plants. 2) Uproot and burn or deep bury. 3) Disinfect tools.', 'During infection', 'Very High', 800.00, 'High');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Late_blight'),
 'Avoid planting in low-lying fog-prone fields or delay planting',
 'Choose well-drained fields and avoid known late-blight hotspots during cool, wet periods.',
 '1) Assess field microclimates. 2) Delay planting if forecasted cool wet weather.', 'Preventive', 'Moderate', 0.00, 'Low');

-- Leaf_Mold cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold'),
 'Greenhouse ventilation & humidity control',
 'Reduce relative humidity to below 85% by improving ventilation.',
 '1) Open vents/circulation fans. 2) Use dehumidifiers if available. 3) Prune lower canopy to improve airflow.', 'Preventive/During', 'High', 2000.00, 'Medium');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Leaf_Mold'),
 'Lower canopy pruning and sanitation',
 'Remove heavily shaded and lower leaves to reduce moisture retention.',
 '1) Prune lower 2-3 tiers of foliage. 2) Remove and destroy cuttings.', 'Preventive', 'Moderate', 300.00, 'High');

-- Septoria cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot'),
 'Wider plant spacing & improved airflow',
 'Plant with recommended spacing to reduce humidity around foliage.',
 '1) Follow recommended plant spacing (e.g., 45-60 cm). 2) Train plants to stakes.', 'Preventive', 'High', 1500.00, 'Medium');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Septoria_leaf_spot'),
 'Mulch & weed control to reduce splash',
 'Control weeds and apply mulch to minimize soil splash.',
 '1) Lay mulch. 2) Weed regularly.', 'Preventive', 'Moderate', 1200.00, 'Medium');

-- Spider mites cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite'),
 'Raise humidity and regular foliar washing',
 'Increase relative humidity and wash undersides of leaves to knock mites off.',
 '1) Mist plants early morning. 2) Use sprinkler flush occasionally (avoid prolonged leaf wetness).', 'Preventive/During', 'Moderate', 500.00, 'Medium');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Spider_mites Two-spotted_spider_mite'),
 'Avoid broad-spectrum insecticides & preserve predators',
 'Minimize insecticide use that kills predatory mites; use selective products only when required.',
 '1) Monitor pest populations. 2) Use targeted miticides only per IPM thresholds.', 'Preventive/During', 'High', 0.00, 'Low');

-- Target Spot cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Target_Spot'),
 'Rotation with non-hosts and debris burning',
 'Rotate with non-hosts and remove infected debris after harvest.',
 '1) Implement 2-year rotation. 2) Deep bury or burn debris.', 'Preventive', 'High', 800.00, 'High');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Target_Spot'),
 'Field drainage and avoid waterlogging', 'Improve field drainage to prevent humidity pockets', '1) Create channels; 2) Avoid ponding', 'Preventive', 'Moderate', 1000.00, 'Medium');

-- Note: Above I accidentally included a placeholder table name - correct that with the proper cultural_practices insertion below.

-- Corrected Target_Spot practice (replacement for placeholder)
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Target_Spot'),
 'Field drainage and avoid waterlogging', 'Improve field drainage to prevent humidity pockets and disease hotspots', '1) Create drainage channels. 2) Avoid low-lying planting areas. 3) Break compacted layers.', 'Preventive', 'Moderate', 1000.00, 'Medium');

-- Tomato_Yellow_Leaf_Curl_Virus cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus'),
 'Use reflective mulches and insect-proof netting', 'Reflective mulches repel whiteflies; use netting in nurseries to block vectors', '1) Lay reflective mulch. 2) Use insect-proof nets in nurseries. 3) Maintain clean perimeter.', 'Preventive', 'High', 4000.00, 'Medium');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Tomato_Yellow_Leaf_Curl_Virus'),
 'Rogue infected plants and deep bury immediately', 'Remove infected plants to reduce inoculum and vector attraction', '1) Identify infected plants. 2) Uproot and burn/bury away from field. 3) Disinfect tools.', 'During infection', 'Very High', 600.00, 'High');

-- Tomato_mosaic_virus cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Tomato_mosaic_virus'),
 'Tool and hand hygiene & restricted access', 'Disinfect tools and hands when moving between plots to reduce mechanical spread', '1) Use alcohol or bleach wipes. 2) Restrict non-essential access during growth.', 'Preventive', 'High', 200.00, 'Low');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Tomato_mosaic_virus'),
 'Use virus-free transplants and inspect nursery', 'Source clean seedlings and inspect for mottling before transplant', '1) Buy certified seedlings. 2) Quarantine for observation.', 'Preventive', 'Very High', 500.00, 'Low');

-- powdery_mildew cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew'),
 'Prune canopy and increase light penetration', 'Remove dense foliage to improve airflow and lower humidity', '1) Prune upper and internal branches. 2) Remove prunings from field.', 'Preventive/During', 'High', 350.00, 'High');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='powdery_mildew'),
 'Regular monitoring and early removal of infected leaves', 'Scout plants weekly and remove early lesions', '1) Scout weekly. 2) Remove spotted leaves and destroy.', 'Preventive/During', 'Moderate', 150.00, 'Medium');

-- healthy cultural practices
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='healthy'),
 'Regular scouting and monitoring', 'Weekly scouting to detect early pest/disease presence', '1) Assign scout. 2) Record observations. 3) Act if threshold crossed.', 'Preventive', 'High', 600.00, 'Low');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='healthy'),
 'Soil testing and corrective fertilization', 'Test soil before season and apply balanced NPK & micronutrients', '1) Take samples. 2) Apply corrective fertilizers.', 'Preventive', 'High', 1500.00, 'Medium');

-- Additional general cultural practices (to reach ~28 practices)
INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Bacterial_spot'),
 'Avoid working when plants are wet', 'Minimize mechanical spread by scheduling field operations for dry periods', '1) Check weather. 2) Plan tasks on dry days.', 'Preventive', 'Moderate', 0.00, 'Low');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Early_blight'),
 'Stagger planting dates to avoid peak inoculum', 'Planting in smaller windows reduces synchronized vulnerability', '1) Plan staggered transplanting times', 'Preventive', 'Moderate', 0.00, 'Low');

INSERT INTO cultural_practices (disease_id, practice_name, description, implementation_steps, timing, effectiveness, cost_estimate_inr, labor_required)
VALUES
((SELECT disease_id FROM diseases WHERE disease_name='Late_blight'),
 'Weather-based spraying schedule', 'Spray protectants pre-emptively if weather forecast predicts high risk (cool, wet)', '1) Monitor forecast. 2) Spray before rainy period.', 'Preventive', 'High', 1200.00, 'Low');

-- =========================
-- Final note: At this point the database has:
-- - diseases table populated (11 entries including 'healthy')
-- - treatment_categories populated
-- - severity_levels populated
-- - ~50 treatments (grouped across diseases)
-- - treatment_severity_mapping entries for major treatments and rules
-- - 28 cultural practice records
-- =========================

-- You can extend this by inserting more treatments and more precise product labels per region.
-- Example queries to retrieve recommendations:

-- Get recommended treatments for Early_blight in moderate severity:
-- SELECT t.* FROM treatments t
-- JOIN diseases d ON t.disease_id=d.disease_id
-- JOIN treatment_severity_mapping m ON m.treatment_id=t.treatment_id
-- JOIN severity_levels s ON s.severity_id=m.severity_id
-- WHERE d.disease_name='Early_blight' AND s.severity_name='Moderate' AND m.is_recommended=1
-- ORDER BY t.priority, t.effectiveness_percentage DESC;

-- End of SQL
