import { z } from 'zod';

export const CURB65InputSchema = z.object({
  confusion: z.boolean().describe('New onset confusion or altered mental status'),
  urea: z.number().optional().describe('Blood urea nitrogen (BUN) in mg/dL, or urea in mmol/L'),
  respiratoryRate: z.number().min(0).max(100).describe('Respiratory rate (breaths per minute)'),
  bloodPressure: z.object({
    systolic: z.number().min(0).max(300).describe('Systolic blood pressure in mmHg'),
    diastolic: z.number().min(0).max(200).describe('Diastolic blood pressure in mmHg'),
  }).describe('Blood pressure measurement'),
  age: z.number().min(0).max(120).describe('Patient age in years'),
});

export const CentorInputSchema = z.object({
  fever: z.boolean().describe('Temperature > 38°C (100.4°F)'),
  tonsillarExudate: z.boolean().describe('Exudate or swelling on tonsils'),
  tenderAnteriorNodes: z.boolean().describe('Tender anterior cervical lymph nodes'),
  noCough: z.boolean().describe('Absence of cough'),
  age: z.number().min(0).max(120).describe('Patient age in years'),
});

export const WellsDVTInputSchema = z.object({
  activeCancer: z.boolean().describe('Active cancer (treatment ongoing, within 6 months, or palliative)'),
  paralysisOrImmobilization: z.boolean().describe('Paralysis, paresis, or recent plaster immobilization of lower extremities'),
  recentlyBedridden: z.boolean().describe('Recently bedridden >3 days or major surgery within 12 weeks'),
  localizedTenderness: z.boolean().describe('Localized tenderness along deep venous system'),
  entireLegSwollen: z.boolean().describe('Entire leg swollen'),
  calfSwelling: z.boolean().describe('Calf swelling >3cm compared to asymptomatic leg'),
  pittingEdema: z.boolean().describe('Pitting edema confined to symptomatic leg'),
  collateralVeins: z.boolean().describe('Collateral superficial veins (non-varicose)'),
  previousDVT: z.boolean().describe('Previously documented DVT'),
  alternativeDiagnosis: z.boolean().describe('Alternative diagnosis at least as likely as DVT'),
});

export const WellsPEInputSchema = z.object({
  clinicalDVTSigns: z.boolean().describe('Clinical signs and symptoms of DVT (leg swelling, pain with palpation)'),
  peIsLikelyDiagnosis: z.boolean().describe('PE is the most likely diagnosis or equally likely'),
  heartRateOver100: z.boolean().describe('Heart rate >100 bpm'),
  immobilizationOrSurgery: z.boolean().describe('Immobilization ≥3 days or surgery in previous 4 weeks'),
  previousPEorDVT: z.boolean().describe('Previous PE or DVT'),
  hemoptysis: z.boolean().describe('Hemoptysis (coughing up blood)'),
  malignancy: z.boolean().describe('Malignancy (treatment ongoing, within 6 months, or palliative)'),
});

export const HEARTInputSchema = z.object({
  history: z.enum(['highly_suspicious', 'moderately_suspicious', 'slightly_suspicious']).describe('History: highly_suspicious (2pts) - chest pain pressure-like and related to exertion; moderately_suspicious (1pt) - some concerning features but not definitive; slightly_suspicious (0pts) - probably not cardiac'),
  ecg: z.enum(['significant_st_depression', 'nonspecific_changes', 'normal']).describe('ECG: significant_st_depression (2pts), nonspecific_changes (1pt) like T-wave inversion or ST elevation <1mm, normal (0pts)'),
  age: z.number().min(0).max(120).describe('Patient age in years'),
  riskFactors: z.number().min(0).max(10).describe('Number of cardiac risk factors (0-5+): hypertension, hyperlipidemia, diabetes, obesity (BMI>30), smoking (current or quit <3mo), family history of premature CAD'),
  troponin: z.enum(['high', 'moderate', 'normal']).describe('Troponin level: high (2pts) ≥3x normal limit; moderate (1pt) 1-3x normal limit; normal (0pts) ≤normal limit'),
});

export const CHA2DS2VAScInputSchema = z.object({
  congestiveHeartFailure: z.boolean().describe('History of congestive heart failure or left ventricular dysfunction (ejection fraction ≤40%)'),
  hypertension: z.boolean().describe('History of hypertension or currently on antihypertensive medication'),
  age: z.number().min(0).max(120).describe('Patient age in years'),
  diabetes: z.boolean().describe('History of diabetes mellitus'),
  strokeTIAThrombus: z.boolean().describe('Previous stroke, TIA, or thromboembolism'),
  vascularDisease: z.boolean().describe('Vascular disease: prior myocardial infarction, peripheral arterial disease, or aortic plaque'),
  sex: z.enum(['male', 'female']).describe('Biological sex'),
});

export const GCSInputSchema = z.object({
  eyeOpening: z.enum(['spontaneous', 'to_speech', 'to_pain', 'none']).describe('Eye opening response: spontaneous (4pts) - eyes open spontaneously; to_speech (3pts) - eyes open to verbal command; to_pain (2pts) - eyes open to painful stimulus; none (1pt) - no eye opening'),
  verbalResponse: z.enum(['oriented', 'confused', 'inappropriate_words', 'incomprehensible', 'none']).describe('Verbal response: oriented (5pts) - oriented to person, place, time; confused (4pts) - confused conversation; inappropriate_words (3pts) - inappropriate words, discernible words; incomprehensible (2pts) - incomprehensible sounds, moaning; none (1pt) - no verbal response'),
  motorResponse: z.enum(['obeys_commands', 'localizes_pain', 'withdraws_from_pain', 'abnormal_flexion', 'abnormal_extension', 'none']).describe('Motor response: obeys_commands (6pts) - obeys commands; localizes_pain (5pts) - localizes to painful stimulus; withdraws_from_pain (4pts) - withdraws from pain; abnormal_flexion (3pts) - abnormal flexion/decorticate posturing; abnormal_extension (2pts) - abnormal extension/decerebrate posturing; none (1pt) - no motor response'),
});

export const QSOFAInputSchema = z.object({
  respiratoryRate: z.number().min(0).max(100).describe('Respiratory rate (breaths per minute)'),
  alteredMentalStatus: z.boolean().describe('Altered mental status (GCS <15, confusion, disorientation, lethargy)'),
  systolicBloodPressure: z.number().min(0).max(300).describe('Systolic blood pressure in mmHg'),
});

export const AlvaradoInputSchema = z.object({
  rlqPain: z.boolean().describe('Right lower quadrant (RLQ) pain present'),
  anorexia: z.boolean().describe('Anorexia or loss of appetite'),
  nauseaVomiting: z.boolean().describe('Nausea or vomiting'),
  rlqTenderness: z.boolean().describe('Tenderness in right lower quadrant on examination'),
  reboundTenderness: z.boolean().describe('Rebound tenderness present'),
  elevatedTemperature: z.boolean().describe('Elevated temperature ≥37.3°C (99.1°F)'),
  leukocytosis: z.boolean().describe('Leukocytosis: white blood cell count >10,000/μL'),
  leftShift: z.boolean().describe('Left shift: neutrophils >75%'),
  migrationPain: z.boolean().describe('Migration of pain from periumbilical area to right lower quadrant'),
});

export const GlasgowBlatchfordInputSchema = z.object({
  bun: z.number().optional().describe('Blood urea nitrogen (BUN) in mg/dL, or urea in mmol/L'),
  hemoglobin: z.number().describe('Hemoglobin in g/dL'),
  systolicBloodPressure: z.number().min(0).max(300).describe('Systolic blood pressure in mmHg'),
  pulse: z.number().min(0).max(300).describe('Heart rate in beats per minute'),
  melena: z.boolean().describe('Presentation with melena (black, tarry stools)'),
  syncope: z.boolean().describe('Presentation with syncope (fainting)'),
  hepaticDisease: z.boolean().describe('History of hepatic disease (cirrhosis, chronic liver disease)'),
  cardiacFailure: z.boolean().describe('History of cardiac failure'),
  sex: z.enum(['male', 'female']).describe('Biological sex (affects hemoglobin scoring)'),
});

export const NIHSSInputSchema = z.object({
  levelOfConsciousness: z.enum(['alert', 'arouses_minor', 'arouses_repeated', 'coma']).describe('1a. Level of consciousness: alert (0pts) - alert and responsive; arouses_minor (1pt) - arousable with minor stimulation; arouses_repeated (2pts) - arousable only with repeated or painful stimulation; coma (3pts) - unresponsive or only reflex responses'),
  locQuestions: z.enum(['both_correct', 'one_correct', 'neither_correct']).describe('1b. LOC Questions (month and age): both_correct (0pts) - answers both correctly; one_correct (1pt) - answers one correctly; neither_correct (2pts) - answers neither correctly'),
  locCommands: z.enum(['both_correct', 'one_correct', 'neither_correct']).describe('1c. LOC Commands (open/close eyes, grip hand): both_correct (0pts) - performs both correctly; one_correct (1pt) - performs one correctly; neither_correct (2pts) - performs neither correctly'),
  bestGaze: z.enum(['normal', 'partial_palsy', 'forced_deviation']).describe('2. Best Gaze (horizontal eye movements): normal (0pts) - normal horizontal movements; partial_palsy (1pt) - partial gaze palsy, abnormal in one or both eyes; forced_deviation (2pts) - forced deviation or total gaze paresis'),
  visual: z.enum(['no_loss', 'partial_hemianopia', 'complete_hemianopia']).describe('3. Visual Fields: no_loss (0pts) - no visual loss; partial_hemianopia (1pt) - partial hemianopia; complete_hemianopia (3pts) - complete hemianopia or bilateral blindness'),
  facialPalsy: z.enum(['normal', 'minor', 'partial', 'complete']).describe('4. Facial Palsy: normal (0pts) - normal facial movements; minor (1pt) - minor paralysis (flattened nasolabial fold, asymmetry on smiling); partial (2pts) - partial paralysis (total or near-total lower face); complete (3pts) - complete paralysis (absence of facial movement upper and lower face)'),
  motorArmLeft: z.enum(['no_drift', 'drift', 'some_effort', 'no_effort', 'no_movement', 'amputation']).describe('5a. Motor Left Arm (extend arm 90° if sitting, 45° if supine for 10 seconds): no_drift (0pts) - no drift; drift (1pt) - drift but doesn\'t hit bed; some_effort (2pts) - some effort against gravity but can\'t sustain; no_effort (3pts) - no effort against gravity, arm falls; no_movement (4pts) - no movement; amputation (0pts) - amputation or joint fusion'),
  motorArmRight: z.enum(['no_drift', 'drift', 'some_effort', 'no_effort', 'no_movement', 'amputation']).describe('5b. Motor Right Arm (extend arm 90° if sitting, 45° if supine for 10 seconds): no_drift (0pts) - no drift; drift (1pt) - drift but doesn\'t hit bed; some_effort (2pts) - some effort against gravity but can\'t sustain; no_effort (3pts) - no effort against gravity, arm falls; no_movement (4pts) - no movement; amputation (0pts) - amputation or joint fusion'),
  motorLegLeft: z.enum(['no_drift', 'drift', 'some_effort', 'no_effort', 'no_movement', 'amputation']).describe('6a. Motor Left Leg (hold leg at 30° for 5 seconds): no_drift (0pts) - no drift; drift (1pt) - drift but doesn\'t hit bed; some_effort (2pts) - some effort against gravity but can\'t sustain; no_effort (3pts) - no effort against gravity, leg falls; no_movement (4pts) - no movement; amputation (0pts) - amputation or joint fusion'),
  motorLegRight: z.enum(['no_drift', 'drift', 'some_effort', 'no_effort', 'no_movement', 'amputation']).describe('6b. Motor Right Leg (hold leg at 30° for 5 seconds): no_drift (0pts) - no drift; drift (1pt) - drift but doesn\'t hit bed; some_effort (2pts) - some effort against gravity but can\'t sustain; no_effort (3pts) - no effort against gravity, leg falls; no_movement (4pts) - no movement; amputation (0pts) - amputation or joint fusion'),
  limbAtaxia: z.enum(['absent', 'present_one', 'present_two']).describe('7. Limb Ataxia (finger-nose and heel-shin tests): absent (0pts) - no ataxia or ataxia in patient who can\'t understand; present_one (1pt) - present in one limb; present_two (2pts) - present in two limbs'),
  sensory: z.enum(['normal', 'mild_loss', 'severe_loss']).describe('8. Sensory (pinprick sensation): normal (0pts) - normal, no sensory loss; mild_loss (1pt) - mild to moderate sensory loss (patient feels pinprick less sharp or dull on affected side); severe_loss (2pts) - severe to total sensory loss (patient unaware of being touched)'),
  bestLanguage: z.enum(['no_aphasia', 'mild_aphasia', 'severe_aphasia', 'mute']).describe('9. Best Language/Aphasia: no_aphasia (0pts) - no aphasia, normal; mild_aphasia (1pt) - mild to moderate aphasia (some fluency loss or comprehension difficulty); severe_aphasia (2pts) - severe aphasia (fragmentary expression, great need for inference); mute (3pts) - mute, global aphasia, or coma'),
  dysarthria: z.enum(['normal', 'mild', 'severe', 'intubated']).describe('10. Dysarthria (articulation): normal (0pts) - normal articulation; mild (1pt) - mild to moderate dysarthria (slurring but can be understood); severe (2pts) - severe dysarthria (unintelligible or mute); intubated (0pts) - intubated or other physical barrier'),
  extinctionInattention: z.enum(['no_abnormality', 'visual_tactile_spatial', 'profound_hemi_inattention']).describe('11. Extinction and Inattention (neglect): no_abnormality (0pts) - no abnormality; visual_tactile_spatial (1pt) - visual, tactile, auditory, spatial, or personal inattention/extinction to bilateral simultaneous stimulation in one sensory modality; profound_hemi_inattention (2pts) - profound hemi-inattention or extinction to more than one modality'),
});

export const SOFAInputSchema = z.object({
  pao2: z.number().optional().describe('PaO2 (partial pressure of oxygen in arterial blood) in mmHg'),
  fio2: z.number().optional().describe('FiO2 (fraction of inspired oxygen) as decimal (0.21-1.0) or percentage (21-100)'),
  mechanicalVentilation: z.boolean().describe('Patient is mechanically ventilated'),
  platelets: z.number().describe('Platelet count in thousands/μL (×10³/μL)'),
  bilirubin: z.number().describe('Total bilirubin in mg/dL'),
  meanArterialPressure: z.number().optional().describe('Mean arterial pressure (MAP) in mmHg. Can be calculated as: (Systolic + 2×Diastolic)/3'),
  vasopressors: z.enum(['none', 'dopamine_low', 'dopamine_medium', 'dopamine_high_epi_norepi']).describe('Vasopressor use: none (0pts) - no vasopressors; dopamine_low (2pts) - dopamine ≤5 or dobutamine any dose; dopamine_medium (3pts) - dopamine >5-15; dopamine_high_epi_norepi (4pts) - dopamine >15 OR epinephrine/norepinephrine any dose. Doses in μg/kg/min'),
  glasgowComaScale: z.number().min(3).max(15).describe('Glasgow Coma Scale score (3-15)'),
  creatinine: z.number().describe('Serum creatinine in mg/dL'),
  urineOutput: z.number().optional().describe('Urine output in mL/day'),
});

export const PERCInputSchema = z.object({
  age: z.number().min(0).max(120).describe('Patient age in years'),
  heartRate: z.number().min(0).max(300).describe('Heart rate in beats per minute'),
  oxygenSaturation: z.number().min(0).max(100).describe('Oxygen saturation (SpO2) on room air as percentage (e.g., 95 for 95%)'),
  unilateralLegSwelling: z.boolean().describe('Unilateral leg swelling present'),
  hemoptysis: z.boolean().describe('Hemoptysis (coughing up blood)'),
  recentSurgeryOrTrauma: z.boolean().describe('Recent surgery or trauma within 4 weeks requiring treatment with general anesthesia'),
  priorPEorDVT: z.boolean().describe('Prior history of pulmonary embolism (PE) or deep vein thrombosis (DVT)'),
  hormoneUse: z.boolean().describe('Hormone use: oral contraceptives, hormone replacement therapy, or estrogenic hormones in males or females'),
});

export const TIMIInputSchema = z.object({
  age: z.number().min(0).max(120).describe('Patient age in years'),
  riskFactors: z.number().min(0).max(5).describe('Number of CAD risk factors (0-5): hypertension, hyperlipidemia, diabetes, family history of premature CAD, current smoking'),
  knownCAD: z.boolean().describe('Known coronary artery disease (prior MI, PCI, CABG, or coronary stenosis ≥50%)'),
  aspirinUse: z.boolean().describe('Aspirin use in the past 7 days'),
  severeAngina: z.boolean().describe('Severe angina: ≥2 episodes of angina at rest within the past 24 hours'),
  stChanges: z.boolean().describe('ST-segment changes ≥0.5mm on ECG'),
  elevatedCardiacMarkers: z.boolean().describe('Elevated cardiac biomarkers (troponin or CK-MB)'),
});

export const MELDInputSchema = z.object({
  bilirubin: z.number().positive().describe('Total serum bilirubin in mg/dL'),
  inr: z.number().positive().describe('International Normalized Ratio (INR) for prothrombin time'),
  creatinine: z.number().positive().describe('Serum creatinine in mg/dL'),
  dialysis: z.boolean().describe('Patient received dialysis twice in the past week OR received 24+ hours of CVVHD (continuous veno-venous hemodialysis) in the past week'),
});

export const GAD7InputSchema = z.object({
  nervous: z.enum(['not_at_all', 'several_days', 'more_than_half', 'nearly_every_day']).describe('Feeling nervous, anxious, or on edge: not_at_all (0pts), several_days (1pt), more_than_half (2pts), nearly_every_day (3pts)'),
  stopWorrying: z.enum(['not_at_all', 'several_days', 'more_than_half', 'nearly_every_day']).describe('Not being able to stop or control worrying: not_at_all (0pts), several_days (1pt), more_than_half (2pts), nearly_every_day (3pts)'),
  worryingTooMuch: z.enum(['not_at_all', 'several_days', 'more_than_half', 'nearly_every_day']).describe('Worrying too much about different things: not_at_all (0pts), several_days (1pt), more_than_half (2pts), nearly_every_day (3pts)'),
  troubleRelaxing: z.enum(['not_at_all', 'several_days', 'more_than_half', 'nearly_every_day']).describe('Trouble relaxing: not_at_all (0pts), several_days (1pt), more_than_half (2pts), nearly_every_day (3pts)'),
  restless: z.enum(['not_at_all', 'several_days', 'more_than_half', 'nearly_every_day']).describe('Being so restless that it is hard to sit still: not_at_all (0pts), several_days (1pt), more_than_half (2pts), nearly_every_day (3pts)'),
  easilyAnnoyed: z.enum(['not_at_all', 'several_days', 'more_than_half', 'nearly_every_day']).describe('Becoming easily annoyed or irritable: not_at_all (0pts), several_days (1pt), more_than_half (2pts), nearly_every_day (3pts)'),
  feelingAfraid: z.enum(['not_at_all', 'several_days', 'more_than_half', 'nearly_every_day']).describe('Feeling afraid, as if something awful might happen: not_at_all (0pts), several_days (1pt), more_than_half (2pts), nearly_every_day (3pts)'),
});

export const GRACEInputSchema = z.object({
  age: z.number().min(0).max(120).describe('Patient age in years'),
  heartRate: z.number().min(0).max(300).describe('Heart rate in beats per minute'),
  systolicBloodPressure: z.number().min(0).max(300).describe('Systolic blood pressure in mmHg'),
  creatinine: z.number().positive().describe('Serum creatinine in mg/dL'),
  killipClass: z.number().min(1).max(4).describe('Killip class (1-4): 1 = no heart failure, 2 = rales or JVD, 3 = pulmonary edema, 4 = cardiogenic shock'),
  cardiacArrest: z.boolean().describe('Cardiac arrest at admission'),
  stDeviation: z.boolean().describe('ST-segment deviation on ECG'),
  elevatedCardiacMarkers: z.boolean().describe('Elevated cardiac biomarkers (troponin or CK-MB)'),
});

export const HASBLEDInputSchema = z.object({
  hypertension: z.boolean().describe('Hypertension (uncontrolled, systolic BP >160 mmHg)'),
  abnormalRenalFunction: z.boolean().describe('Abnormal renal function: dialysis, transplant, or serum creatinine >2.26 mg/dL (>200 μmol/L)'),
  abnormalLiverFunction: z.boolean().describe('Abnormal liver function: cirrhosis, bilirubin >2x normal, AST/ALT/alkaline phosphatase >3x normal'),
  stroke: z.boolean().describe('History of stroke or TIA'),
  bleedingHistory: z.boolean().describe('Prior major bleeding or predisposition to bleeding (e.g., bleeding diathesis, anemia)'),
  labileINR: z.boolean().describe('Labile INR (if on warfarin): unstable/high INRs, time in therapeutic range <60%'),
  age: z.number().min(0).max(120).describe('Patient age in years'),
  medications: z.boolean().describe('Medications predisposing to bleeding: concomitant antiplatelet agents (aspirin, clopidogrel) or NSAIDs'),
  alcoholUse: z.boolean().describe('Alcohol use: ≥8 drinks per week'),
});

export const ABCD2InputSchema = z.object({
  age: z.number().min(0).max(120).describe('Patient age in years'),
  bloodPressure: z.object({
    systolic: z.number().min(0).max(300).describe('Systolic blood pressure in mmHg'),
    diastolic: z.number().min(0).max(200).describe('Diastolic blood pressure in mmHg'),
  }).describe('Blood pressure at presentation'),
  clinicalFeatures: z.enum(['unilateral_weakness', 'speech_impairment', 'neither']).describe('Clinical features of TIA: unilateral_weakness (2pts) - unilateral weakness with or without speech impairment; speech_impairment (1pt) - speech disturbance without weakness; neither (0pts) - other symptoms'),
  duration: z.enum(['less_than_10', '10_to_59', '60_or_more']).describe('Duration of TIA symptoms: less_than_10 (0pts) - symptoms lasted <10 minutes; 10_to_59 (1pt) - symptoms lasted 10-59 minutes; 60_or_more (2pts) - symptoms lasted ≥60 minutes'),
  diabetes: z.boolean().describe('History of diabetes mellitus'),
});

export const CalculateClinicalScoreSchema = z.object({
  calculator: z.enum(['curb65', 'centor', 'wells_dvt', 'wells_pe', 'heart', 'cha2ds2_vasc', 'gcs', 'qsofa', 'alvarado', 'glasgow_blatchford', 'nihss', 'sofa', 'perc', 'timi', 'meld', 'gad7', 'grace', 'has_bled', 'abcd2']).describe('Which clinical calculator to use: curb65 (pneumonia severity/mortality risk), centor (streptococcal pharyngitis probability), wells_dvt (DVT probability), wells_pe (PE probability), heart (chest pain cardiac event risk), cha2ds2_vasc (stroke risk in atrial fibrillation), gcs (Glasgow Coma Scale for consciousness), qsofa (sepsis screening), alvarado (appendicitis risk), glasgow_blatchford (upper GI bleeding risk), nihss (NIH Stroke Scale for stroke severity), sofa (Sequential Organ Failure Assessment for ICU mortality), perc (Pulmonary Embolism Rule-out Criteria), timi (TIMI Risk Score for NSTEMI/UA), meld (Model for End-Stage Liver Disease), gad7 (Generalized Anxiety Disorder-7 for anxiety screening), grace (GRACE Score for ACS risk stratification), has_bled (HAS-BLED bleeding risk on anticoagulation), abcd2 (ABCD2 Score for TIA stroke risk prediction)'),
  inputs: z.union([CURB65InputSchema, CentorInputSchema, WellsDVTInputSchema, WellsPEInputSchema, HEARTInputSchema, CHA2DS2VAScInputSchema, GCSInputSchema, QSOFAInputSchema, AlvaradoInputSchema, GlasgowBlatchfordInputSchema, NIHSSInputSchema, SOFAInputSchema, PERCInputSchema, TIMIInputSchema, MELDInputSchema, GAD7InputSchema, GRACEInputSchema, HASBLEDInputSchema, ABCD2InputSchema]).describe('Input parameters for the selected calculator'),
});

export type CalculateClinicalScoreInput = z.infer<typeof CalculateClinicalScoreSchema>;
