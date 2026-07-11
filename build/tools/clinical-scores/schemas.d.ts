import { z } from 'zod';
export declare const CURB65InputSchema: z.ZodEffects<z.ZodObject<{
    confusion: z.ZodBoolean;
    urea: z.ZodOptional<z.ZodNumber>;
    ureaUnit: z.ZodOptional<z.ZodEnum<["mg/dL", "mmol/L"]>>;
    respiratoryRate: z.ZodNumber;
    bloodPressure: z.ZodObject<{
        systolic: z.ZodNumber;
        diastolic: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        systolic: number;
        diastolic: number;
    }, {
        systolic: number;
        diastolic: number;
    }>;
    age: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    age: number;
    confusion: boolean;
    respiratoryRate: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    urea?: number | undefined;
    ureaUnit?: "mg/dL" | "mmol/L" | undefined;
}, {
    age: number;
    confusion: boolean;
    respiratoryRate: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    urea?: number | undefined;
    ureaUnit?: "mg/dL" | "mmol/L" | undefined;
}>, {
    age: number;
    confusion: boolean;
    respiratoryRate: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    urea?: number | undefined;
    ureaUnit?: "mg/dL" | "mmol/L" | undefined;
}, {
    age: number;
    confusion: boolean;
    respiratoryRate: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    urea?: number | undefined;
    ureaUnit?: "mg/dL" | "mmol/L" | undefined;
}>;
export declare const CentorInputSchema: z.ZodObject<{
    fever: z.ZodBoolean;
    tonsillarExudate: z.ZodBoolean;
    tenderAnteriorNodes: z.ZodBoolean;
    noCough: z.ZodBoolean;
    age: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    age: number;
    fever: boolean;
    tonsillarExudate: boolean;
    tenderAnteriorNodes: boolean;
    noCough: boolean;
}, {
    age: number;
    fever: boolean;
    tonsillarExudate: boolean;
    tenderAnteriorNodes: boolean;
    noCough: boolean;
}>;
export declare const WellsDVTInputSchema: z.ZodObject<{
    activeCancer: z.ZodBoolean;
    paralysisOrImmobilization: z.ZodBoolean;
    recentlyBedridden: z.ZodBoolean;
    localizedTenderness: z.ZodBoolean;
    entireLegSwollen: z.ZodBoolean;
    calfSwelling: z.ZodBoolean;
    pittingEdema: z.ZodBoolean;
    collateralVeins: z.ZodBoolean;
    previousDVT: z.ZodBoolean;
    alternativeDiagnosis: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    activeCancer: boolean;
    paralysisOrImmobilization: boolean;
    recentlyBedridden: boolean;
    localizedTenderness: boolean;
    entireLegSwollen: boolean;
    calfSwelling: boolean;
    pittingEdema: boolean;
    collateralVeins: boolean;
    previousDVT: boolean;
    alternativeDiagnosis: boolean;
}, {
    activeCancer: boolean;
    paralysisOrImmobilization: boolean;
    recentlyBedridden: boolean;
    localizedTenderness: boolean;
    entireLegSwollen: boolean;
    calfSwelling: boolean;
    pittingEdema: boolean;
    collateralVeins: boolean;
    previousDVT: boolean;
    alternativeDiagnosis: boolean;
}>;
export declare const WellsPEInputSchema: z.ZodObject<{
    clinicalDVTSigns: z.ZodBoolean;
    peIsLikelyDiagnosis: z.ZodBoolean;
    heartRateOver100: z.ZodBoolean;
    immobilizationOrSurgery: z.ZodBoolean;
    previousPEorDVT: z.ZodBoolean;
    hemoptysis: z.ZodBoolean;
    malignancy: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    clinicalDVTSigns: boolean;
    peIsLikelyDiagnosis: boolean;
    heartRateOver100: boolean;
    immobilizationOrSurgery: boolean;
    previousPEorDVT: boolean;
    hemoptysis: boolean;
    malignancy: boolean;
}, {
    clinicalDVTSigns: boolean;
    peIsLikelyDiagnosis: boolean;
    heartRateOver100: boolean;
    immobilizationOrSurgery: boolean;
    previousPEorDVT: boolean;
    hemoptysis: boolean;
    malignancy: boolean;
}>;
export declare const HEARTInputSchema: z.ZodObject<{
    history: z.ZodEnum<["highly_suspicious", "moderately_suspicious", "slightly_suspicious"]>;
    ecg: z.ZodEnum<["significant_st_depression", "nonspecific_changes", "normal"]>;
    age: z.ZodNumber;
    riskFactors: z.ZodNumber;
    troponin: z.ZodEnum<["high", "moderate", "normal"]>;
}, "strip", z.ZodTypeAny, {
    age: number;
    history: "highly_suspicious" | "moderately_suspicious" | "slightly_suspicious";
    ecg: "significant_st_depression" | "nonspecific_changes" | "normal";
    riskFactors: number;
    troponin: "normal" | "high" | "moderate";
}, {
    age: number;
    history: "highly_suspicious" | "moderately_suspicious" | "slightly_suspicious";
    ecg: "significant_st_depression" | "nonspecific_changes" | "normal";
    riskFactors: number;
    troponin: "normal" | "high" | "moderate";
}>;
export declare const CHA2DS2VAScInputSchema: z.ZodObject<{
    congestiveHeartFailure: z.ZodBoolean;
    hypertension: z.ZodBoolean;
    age: z.ZodNumber;
    diabetes: z.ZodBoolean;
    strokeTIAThrombus: z.ZodBoolean;
    vascularDisease: z.ZodBoolean;
    sex: z.ZodEnum<["male", "female"]>;
}, "strip", z.ZodTypeAny, {
    age: number;
    sex: "male" | "female";
    congestiveHeartFailure: boolean;
    hypertension: boolean;
    diabetes: boolean;
    strokeTIAThrombus: boolean;
    vascularDisease: boolean;
}, {
    age: number;
    sex: "male" | "female";
    congestiveHeartFailure: boolean;
    hypertension: boolean;
    diabetes: boolean;
    strokeTIAThrombus: boolean;
    vascularDisease: boolean;
}>;
export declare const GCSInputSchema: z.ZodObject<{
    eyeOpening: z.ZodEnum<["spontaneous", "to_speech", "to_pain", "none"]>;
    verbalResponse: z.ZodEnum<["oriented", "confused", "inappropriate_words", "incomprehensible", "none"]>;
    motorResponse: z.ZodEnum<["obeys_commands", "localizes_pain", "withdraws_from_pain", "abnormal_flexion", "abnormal_extension", "none"]>;
}, "strip", z.ZodTypeAny, {
    eyeOpening: "spontaneous" | "to_speech" | "to_pain" | "none";
    verbalResponse: "none" | "oriented" | "confused" | "inappropriate_words" | "incomprehensible";
    motorResponse: "none" | "obeys_commands" | "localizes_pain" | "withdraws_from_pain" | "abnormal_flexion" | "abnormal_extension";
}, {
    eyeOpening: "spontaneous" | "to_speech" | "to_pain" | "none";
    verbalResponse: "none" | "oriented" | "confused" | "inappropriate_words" | "incomprehensible";
    motorResponse: "none" | "obeys_commands" | "localizes_pain" | "withdraws_from_pain" | "abnormal_flexion" | "abnormal_extension";
}>;
export declare const QSOFAInputSchema: z.ZodObject<{
    respiratoryRate: z.ZodNumber;
    alteredMentalStatus: z.ZodBoolean;
    systolicBloodPressure: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    respiratoryRate: number;
    alteredMentalStatus: boolean;
    systolicBloodPressure: number;
}, {
    respiratoryRate: number;
    alteredMentalStatus: boolean;
    systolicBloodPressure: number;
}>;
export declare const AlvaradoInputSchema: z.ZodObject<{
    rlqPain: z.ZodBoolean;
    anorexia: z.ZodBoolean;
    nauseaVomiting: z.ZodBoolean;
    rlqTenderness: z.ZodBoolean;
    reboundTenderness: z.ZodBoolean;
    elevatedTemperature: z.ZodBoolean;
    leukocytosis: z.ZodBoolean;
    leftShift: z.ZodBoolean;
    migrationPain: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    rlqPain: boolean;
    anorexia: boolean;
    nauseaVomiting: boolean;
    rlqTenderness: boolean;
    reboundTenderness: boolean;
    elevatedTemperature: boolean;
    leukocytosis: boolean;
    leftShift: boolean;
    migrationPain: boolean;
}, {
    rlqPain: boolean;
    anorexia: boolean;
    nauseaVomiting: boolean;
    rlqTenderness: boolean;
    reboundTenderness: boolean;
    elevatedTemperature: boolean;
    leukocytosis: boolean;
    leftShift: boolean;
    migrationPain: boolean;
}>;
export declare const GlasgowBlatchfordInputSchema: z.ZodEffects<z.ZodObject<{
    bun: z.ZodOptional<z.ZodNumber>;
    bunUnit: z.ZodOptional<z.ZodEnum<["mg/dL", "mmol/L"]>>;
    hemoglobin: z.ZodNumber;
    systolicBloodPressure: z.ZodNumber;
    pulse: z.ZodNumber;
    melena: z.ZodBoolean;
    syncope: z.ZodBoolean;
    hepaticDisease: z.ZodBoolean;
    cardiacFailure: z.ZodBoolean;
    sex: z.ZodEnum<["male", "female"]>;
}, "strip", z.ZodTypeAny, {
    sex: "male" | "female";
    systolicBloodPressure: number;
    hemoglobin: number;
    pulse: number;
    melena: boolean;
    syncope: boolean;
    hepaticDisease: boolean;
    cardiacFailure: boolean;
    bun?: number | undefined;
    bunUnit?: "mg/dL" | "mmol/L" | undefined;
}, {
    sex: "male" | "female";
    systolicBloodPressure: number;
    hemoglobin: number;
    pulse: number;
    melena: boolean;
    syncope: boolean;
    hepaticDisease: boolean;
    cardiacFailure: boolean;
    bun?: number | undefined;
    bunUnit?: "mg/dL" | "mmol/L" | undefined;
}>, {
    sex: "male" | "female";
    systolicBloodPressure: number;
    hemoglobin: number;
    pulse: number;
    melena: boolean;
    syncope: boolean;
    hepaticDisease: boolean;
    cardiacFailure: boolean;
    bun?: number | undefined;
    bunUnit?: "mg/dL" | "mmol/L" | undefined;
}, {
    sex: "male" | "female";
    systolicBloodPressure: number;
    hemoglobin: number;
    pulse: number;
    melena: boolean;
    syncope: boolean;
    hepaticDisease: boolean;
    cardiacFailure: boolean;
    bun?: number | undefined;
    bunUnit?: "mg/dL" | "mmol/L" | undefined;
}>;
export declare const NIHSSInputSchema: z.ZodObject<{
    levelOfConsciousness: z.ZodEnum<["alert", "arouses_minor", "arouses_repeated", "coma"]>;
    locQuestions: z.ZodEnum<["both_correct", "one_correct", "neither_correct"]>;
    locCommands: z.ZodEnum<["both_correct", "one_correct", "neither_correct"]>;
    bestGaze: z.ZodEnum<["normal", "partial_palsy", "forced_deviation"]>;
    visual: z.ZodEnum<["no_loss", "partial_hemianopia", "complete_hemianopia", "bilateral_hemianopia"]>;
    facialPalsy: z.ZodEnum<["normal", "minor", "partial", "complete"]>;
    motorArmLeft: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
    motorArmRight: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
    motorLegLeft: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
    motorLegRight: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
    limbAtaxia: z.ZodEnum<["absent", "present_one", "present_two"]>;
    sensory: z.ZodEnum<["normal", "mild_loss", "severe_loss"]>;
    bestLanguage: z.ZodEnum<["no_aphasia", "mild_aphasia", "severe_aphasia", "mute"]>;
    dysarthria: z.ZodEnum<["normal", "mild", "severe", "intubated"]>;
    extinctionInattention: z.ZodEnum<["no_abnormality", "visual_tactile_spatial", "profound_hemi_inattention"]>;
}, "strip", z.ZodTypeAny, {
    levelOfConsciousness: "alert" | "arouses_minor" | "arouses_repeated" | "coma";
    locQuestions: "both_correct" | "one_correct" | "neither_correct";
    locCommands: "both_correct" | "one_correct" | "neither_correct";
    bestGaze: "normal" | "partial_palsy" | "forced_deviation";
    visual: "no_loss" | "partial_hemianopia" | "complete_hemianopia" | "bilateral_hemianopia";
    facialPalsy: "normal" | "minor" | "partial" | "complete";
    motorArmLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    motorArmRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    motorLegLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    motorLegRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    limbAtaxia: "absent" | "present_one" | "present_two";
    sensory: "normal" | "mild_loss" | "severe_loss";
    bestLanguage: "no_aphasia" | "mild_aphasia" | "severe_aphasia" | "mute";
    dysarthria: "normal" | "mild" | "severe" | "intubated";
    extinctionInattention: "no_abnormality" | "visual_tactile_spatial" | "profound_hemi_inattention";
}, {
    levelOfConsciousness: "alert" | "arouses_minor" | "arouses_repeated" | "coma";
    locQuestions: "both_correct" | "one_correct" | "neither_correct";
    locCommands: "both_correct" | "one_correct" | "neither_correct";
    bestGaze: "normal" | "partial_palsy" | "forced_deviation";
    visual: "no_loss" | "partial_hemianopia" | "complete_hemianopia" | "bilateral_hemianopia";
    facialPalsy: "normal" | "minor" | "partial" | "complete";
    motorArmLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    motorArmRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    motorLegLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    motorLegRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
    limbAtaxia: "absent" | "present_one" | "present_two";
    sensory: "normal" | "mild_loss" | "severe_loss";
    bestLanguage: "no_aphasia" | "mild_aphasia" | "severe_aphasia" | "mute";
    dysarthria: "normal" | "mild" | "severe" | "intubated";
    extinctionInattention: "no_abnormality" | "visual_tactile_spatial" | "profound_hemi_inattention";
}>;
export declare const SOFAInputSchema: z.ZodObject<{
    pao2: z.ZodOptional<z.ZodNumber>;
    fio2: z.ZodOptional<z.ZodNumber>;
    mechanicalVentilation: z.ZodBoolean;
    platelets: z.ZodNumber;
    bilirubin: z.ZodNumber;
    meanArterialPressure: z.ZodOptional<z.ZodNumber>;
    vasopressors: z.ZodEnum<["none", "dopamine_low", "dopamine_medium_or_epi_norepi_low", "dopamine_high_or_epi_norepi_high"]>;
    glasgowComaScale: z.ZodNumber;
    creatinine: z.ZodNumber;
    urineOutput: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    mechanicalVentilation: boolean;
    platelets: number;
    bilirubin: number;
    vasopressors: "none" | "dopamine_low" | "dopamine_medium_or_epi_norepi_low" | "dopamine_high_or_epi_norepi_high";
    glasgowComaScale: number;
    creatinine: number;
    pao2?: number | undefined;
    fio2?: number | undefined;
    meanArterialPressure?: number | undefined;
    urineOutput?: number | undefined;
}, {
    mechanicalVentilation: boolean;
    platelets: number;
    bilirubin: number;
    vasopressors: "none" | "dopamine_low" | "dopamine_medium_or_epi_norepi_low" | "dopamine_high_or_epi_norepi_high";
    glasgowComaScale: number;
    creatinine: number;
    pao2?: number | undefined;
    fio2?: number | undefined;
    meanArterialPressure?: number | undefined;
    urineOutput?: number | undefined;
}>;
export declare const PERCInputSchema: z.ZodObject<{
    age: z.ZodNumber;
    heartRate: z.ZodNumber;
    oxygenSaturation: z.ZodNumber;
    unilateralLegSwelling: z.ZodBoolean;
    hemoptysis: z.ZodBoolean;
    recentSurgeryOrTrauma: z.ZodBoolean;
    priorPEorDVT: z.ZodBoolean;
    hormoneUse: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    age: number;
    hemoptysis: boolean;
    heartRate: number;
    oxygenSaturation: number;
    unilateralLegSwelling: boolean;
    recentSurgeryOrTrauma: boolean;
    priorPEorDVT: boolean;
    hormoneUse: boolean;
}, {
    age: number;
    hemoptysis: boolean;
    heartRate: number;
    oxygenSaturation: number;
    unilateralLegSwelling: boolean;
    recentSurgeryOrTrauma: boolean;
    priorPEorDVT: boolean;
    hormoneUse: boolean;
}>;
export declare const TIMIInputSchema: z.ZodObject<{
    age: z.ZodNumber;
    riskFactors: z.ZodNumber;
    knownCAD: z.ZodBoolean;
    aspirinUse: z.ZodBoolean;
    severeAngina: z.ZodBoolean;
    stChanges: z.ZodBoolean;
    elevatedCardiacMarkers: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    age: number;
    riskFactors: number;
    knownCAD: boolean;
    aspirinUse: boolean;
    severeAngina: boolean;
    stChanges: boolean;
    elevatedCardiacMarkers: boolean;
}, {
    age: number;
    riskFactors: number;
    knownCAD: boolean;
    aspirinUse: boolean;
    severeAngina: boolean;
    stChanges: boolean;
    elevatedCardiacMarkers: boolean;
}>;
export declare const MELDInputSchema: z.ZodObject<{
    bilirubin: z.ZodNumber;
    inr: z.ZodNumber;
    creatinine: z.ZodNumber;
    dialysis: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    bilirubin: number;
    creatinine: number;
    inr: number;
    dialysis: boolean;
}, {
    bilirubin: number;
    creatinine: number;
    inr: number;
    dialysis: boolean;
}>;
export declare const GAD7InputSchema: z.ZodObject<{
    nervous: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
    stopWorrying: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
    worryingTooMuch: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
    troubleRelaxing: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
    restless: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
    easilyAnnoyed: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
    feelingAfraid: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
}, "strip", z.ZodTypeAny, {
    nervous: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    stopWorrying: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    worryingTooMuch: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    troubleRelaxing: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    restless: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    easilyAnnoyed: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    feelingAfraid: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
}, {
    nervous: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    stopWorrying: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    worryingTooMuch: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    troubleRelaxing: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    restless: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    easilyAnnoyed: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    feelingAfraid: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
}>;
export declare const GRACEInputSchema: z.ZodObject<{
    age: z.ZodNumber;
    heartRate: z.ZodNumber;
    systolicBloodPressure: z.ZodNumber;
    creatinine: z.ZodNumber;
    killipClass: z.ZodNumber;
    cardiacArrest: z.ZodBoolean;
    stDeviation: z.ZodBoolean;
    elevatedCardiacMarkers: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    age: number;
    systolicBloodPressure: number;
    creatinine: number;
    heartRate: number;
    elevatedCardiacMarkers: boolean;
    killipClass: number;
    cardiacArrest: boolean;
    stDeviation: boolean;
}, {
    age: number;
    systolicBloodPressure: number;
    creatinine: number;
    heartRate: number;
    elevatedCardiacMarkers: boolean;
    killipClass: number;
    cardiacArrest: boolean;
    stDeviation: boolean;
}>;
export declare const HASBLEDInputSchema: z.ZodObject<{
    hypertension: z.ZodBoolean;
    abnormalRenalFunction: z.ZodBoolean;
    abnormalLiverFunction: z.ZodBoolean;
    stroke: z.ZodBoolean;
    bleedingHistory: z.ZodBoolean;
    labileINR: z.ZodBoolean;
    age: z.ZodNumber;
    medications: z.ZodBoolean;
    alcoholUse: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    age: number;
    medications: boolean;
    hypertension: boolean;
    abnormalRenalFunction: boolean;
    abnormalLiverFunction: boolean;
    stroke: boolean;
    bleedingHistory: boolean;
    labileINR: boolean;
    alcoholUse: boolean;
}, {
    age: number;
    medications: boolean;
    hypertension: boolean;
    abnormalRenalFunction: boolean;
    abnormalLiverFunction: boolean;
    stroke: boolean;
    bleedingHistory: boolean;
    labileINR: boolean;
    alcoholUse: boolean;
}>;
export declare const ABCD2InputSchema: z.ZodObject<{
    age: z.ZodNumber;
    bloodPressure: z.ZodObject<{
        systolic: z.ZodNumber;
        diastolic: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        systolic: number;
        diastolic: number;
    }, {
        systolic: number;
        diastolic: number;
    }>;
    clinicalFeatures: z.ZodEnum<["unilateral_weakness", "speech_impairment", "neither"]>;
    duration: z.ZodEnum<["less_than_10", "10_to_59", "60_or_more"]>;
    diabetes: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    age: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    diabetes: boolean;
    clinicalFeatures: "unilateral_weakness" | "speech_impairment" | "neither";
    duration: "less_than_10" | "10_to_59" | "60_or_more";
}, {
    age: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    diabetes: boolean;
    clinicalFeatures: "unilateral_weakness" | "speech_impairment" | "neither";
    duration: "less_than_10" | "10_to_59" | "60_or_more";
}>;
export declare const CalculateClinicalScoreSchema: z.ZodObject<{
    calculator: z.ZodEnum<["curb65", "centor", "wells_dvt", "wells_pe", "heart", "cha2ds2_vasc", "gcs", "qsofa", "alvarado", "glasgow_blatchford", "nihss", "sofa", "perc", "timi", "meld", "gad7", "grace", "has_bled", "abcd2"]>;
    inputs: z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        confusion: z.ZodBoolean;
        urea: z.ZodOptional<z.ZodNumber>;
        ureaUnit: z.ZodOptional<z.ZodEnum<["mg/dL", "mmol/L"]>>;
        respiratoryRate: z.ZodNumber;
        bloodPressure: z.ZodObject<{
            systolic: z.ZodNumber;
            diastolic: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            systolic: number;
            diastolic: number;
        }, {
            systolic: number;
            diastolic: number;
        }>;
        age: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        age: number;
        confusion: boolean;
        respiratoryRate: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        urea?: number | undefined;
        ureaUnit?: "mg/dL" | "mmol/L" | undefined;
    }, {
        age: number;
        confusion: boolean;
        respiratoryRate: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        urea?: number | undefined;
        ureaUnit?: "mg/dL" | "mmol/L" | undefined;
    }>, {
        age: number;
        confusion: boolean;
        respiratoryRate: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        urea?: number | undefined;
        ureaUnit?: "mg/dL" | "mmol/L" | undefined;
    }, {
        age: number;
        confusion: boolean;
        respiratoryRate: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        urea?: number | undefined;
        ureaUnit?: "mg/dL" | "mmol/L" | undefined;
    }>, z.ZodObject<{
        fever: z.ZodBoolean;
        tonsillarExudate: z.ZodBoolean;
        tenderAnteriorNodes: z.ZodBoolean;
        noCough: z.ZodBoolean;
        age: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        age: number;
        fever: boolean;
        tonsillarExudate: boolean;
        tenderAnteriorNodes: boolean;
        noCough: boolean;
    }, {
        age: number;
        fever: boolean;
        tonsillarExudate: boolean;
        tenderAnteriorNodes: boolean;
        noCough: boolean;
    }>, z.ZodObject<{
        activeCancer: z.ZodBoolean;
        paralysisOrImmobilization: z.ZodBoolean;
        recentlyBedridden: z.ZodBoolean;
        localizedTenderness: z.ZodBoolean;
        entireLegSwollen: z.ZodBoolean;
        calfSwelling: z.ZodBoolean;
        pittingEdema: z.ZodBoolean;
        collateralVeins: z.ZodBoolean;
        previousDVT: z.ZodBoolean;
        alternativeDiagnosis: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        activeCancer: boolean;
        paralysisOrImmobilization: boolean;
        recentlyBedridden: boolean;
        localizedTenderness: boolean;
        entireLegSwollen: boolean;
        calfSwelling: boolean;
        pittingEdema: boolean;
        collateralVeins: boolean;
        previousDVT: boolean;
        alternativeDiagnosis: boolean;
    }, {
        activeCancer: boolean;
        paralysisOrImmobilization: boolean;
        recentlyBedridden: boolean;
        localizedTenderness: boolean;
        entireLegSwollen: boolean;
        calfSwelling: boolean;
        pittingEdema: boolean;
        collateralVeins: boolean;
        previousDVT: boolean;
        alternativeDiagnosis: boolean;
    }>, z.ZodObject<{
        clinicalDVTSigns: z.ZodBoolean;
        peIsLikelyDiagnosis: z.ZodBoolean;
        heartRateOver100: z.ZodBoolean;
        immobilizationOrSurgery: z.ZodBoolean;
        previousPEorDVT: z.ZodBoolean;
        hemoptysis: z.ZodBoolean;
        malignancy: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        clinicalDVTSigns: boolean;
        peIsLikelyDiagnosis: boolean;
        heartRateOver100: boolean;
        immobilizationOrSurgery: boolean;
        previousPEorDVT: boolean;
        hemoptysis: boolean;
        malignancy: boolean;
    }, {
        clinicalDVTSigns: boolean;
        peIsLikelyDiagnosis: boolean;
        heartRateOver100: boolean;
        immobilizationOrSurgery: boolean;
        previousPEorDVT: boolean;
        hemoptysis: boolean;
        malignancy: boolean;
    }>, z.ZodObject<{
        history: z.ZodEnum<["highly_suspicious", "moderately_suspicious", "slightly_suspicious"]>;
        ecg: z.ZodEnum<["significant_st_depression", "nonspecific_changes", "normal"]>;
        age: z.ZodNumber;
        riskFactors: z.ZodNumber;
        troponin: z.ZodEnum<["high", "moderate", "normal"]>;
    }, "strip", z.ZodTypeAny, {
        age: number;
        history: "highly_suspicious" | "moderately_suspicious" | "slightly_suspicious";
        ecg: "significant_st_depression" | "nonspecific_changes" | "normal";
        riskFactors: number;
        troponin: "normal" | "high" | "moderate";
    }, {
        age: number;
        history: "highly_suspicious" | "moderately_suspicious" | "slightly_suspicious";
        ecg: "significant_st_depression" | "nonspecific_changes" | "normal";
        riskFactors: number;
        troponin: "normal" | "high" | "moderate";
    }>, z.ZodObject<{
        congestiveHeartFailure: z.ZodBoolean;
        hypertension: z.ZodBoolean;
        age: z.ZodNumber;
        diabetes: z.ZodBoolean;
        strokeTIAThrombus: z.ZodBoolean;
        vascularDisease: z.ZodBoolean;
        sex: z.ZodEnum<["male", "female"]>;
    }, "strip", z.ZodTypeAny, {
        age: number;
        sex: "male" | "female";
        congestiveHeartFailure: boolean;
        hypertension: boolean;
        diabetes: boolean;
        strokeTIAThrombus: boolean;
        vascularDisease: boolean;
    }, {
        age: number;
        sex: "male" | "female";
        congestiveHeartFailure: boolean;
        hypertension: boolean;
        diabetes: boolean;
        strokeTIAThrombus: boolean;
        vascularDisease: boolean;
    }>, z.ZodObject<{
        eyeOpening: z.ZodEnum<["spontaneous", "to_speech", "to_pain", "none"]>;
        verbalResponse: z.ZodEnum<["oriented", "confused", "inappropriate_words", "incomprehensible", "none"]>;
        motorResponse: z.ZodEnum<["obeys_commands", "localizes_pain", "withdraws_from_pain", "abnormal_flexion", "abnormal_extension", "none"]>;
    }, "strip", z.ZodTypeAny, {
        eyeOpening: "spontaneous" | "to_speech" | "to_pain" | "none";
        verbalResponse: "none" | "oriented" | "confused" | "inappropriate_words" | "incomprehensible";
        motorResponse: "none" | "obeys_commands" | "localizes_pain" | "withdraws_from_pain" | "abnormal_flexion" | "abnormal_extension";
    }, {
        eyeOpening: "spontaneous" | "to_speech" | "to_pain" | "none";
        verbalResponse: "none" | "oriented" | "confused" | "inappropriate_words" | "incomprehensible";
        motorResponse: "none" | "obeys_commands" | "localizes_pain" | "withdraws_from_pain" | "abnormal_flexion" | "abnormal_extension";
    }>, z.ZodObject<{
        respiratoryRate: z.ZodNumber;
        alteredMentalStatus: z.ZodBoolean;
        systolicBloodPressure: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        respiratoryRate: number;
        alteredMentalStatus: boolean;
        systolicBloodPressure: number;
    }, {
        respiratoryRate: number;
        alteredMentalStatus: boolean;
        systolicBloodPressure: number;
    }>, z.ZodObject<{
        rlqPain: z.ZodBoolean;
        anorexia: z.ZodBoolean;
        nauseaVomiting: z.ZodBoolean;
        rlqTenderness: z.ZodBoolean;
        reboundTenderness: z.ZodBoolean;
        elevatedTemperature: z.ZodBoolean;
        leukocytosis: z.ZodBoolean;
        leftShift: z.ZodBoolean;
        migrationPain: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        rlqPain: boolean;
        anorexia: boolean;
        nauseaVomiting: boolean;
        rlqTenderness: boolean;
        reboundTenderness: boolean;
        elevatedTemperature: boolean;
        leukocytosis: boolean;
        leftShift: boolean;
        migrationPain: boolean;
    }, {
        rlqPain: boolean;
        anorexia: boolean;
        nauseaVomiting: boolean;
        rlqTenderness: boolean;
        reboundTenderness: boolean;
        elevatedTemperature: boolean;
        leukocytosis: boolean;
        leftShift: boolean;
        migrationPain: boolean;
    }>, z.ZodEffects<z.ZodObject<{
        bun: z.ZodOptional<z.ZodNumber>;
        bunUnit: z.ZodOptional<z.ZodEnum<["mg/dL", "mmol/L"]>>;
        hemoglobin: z.ZodNumber;
        systolicBloodPressure: z.ZodNumber;
        pulse: z.ZodNumber;
        melena: z.ZodBoolean;
        syncope: z.ZodBoolean;
        hepaticDisease: z.ZodBoolean;
        cardiacFailure: z.ZodBoolean;
        sex: z.ZodEnum<["male", "female"]>;
    }, "strip", z.ZodTypeAny, {
        sex: "male" | "female";
        systolicBloodPressure: number;
        hemoglobin: number;
        pulse: number;
        melena: boolean;
        syncope: boolean;
        hepaticDisease: boolean;
        cardiacFailure: boolean;
        bun?: number | undefined;
        bunUnit?: "mg/dL" | "mmol/L" | undefined;
    }, {
        sex: "male" | "female";
        systolicBloodPressure: number;
        hemoglobin: number;
        pulse: number;
        melena: boolean;
        syncope: boolean;
        hepaticDisease: boolean;
        cardiacFailure: boolean;
        bun?: number | undefined;
        bunUnit?: "mg/dL" | "mmol/L" | undefined;
    }>, {
        sex: "male" | "female";
        systolicBloodPressure: number;
        hemoglobin: number;
        pulse: number;
        melena: boolean;
        syncope: boolean;
        hepaticDisease: boolean;
        cardiacFailure: boolean;
        bun?: number | undefined;
        bunUnit?: "mg/dL" | "mmol/L" | undefined;
    }, {
        sex: "male" | "female";
        systolicBloodPressure: number;
        hemoglobin: number;
        pulse: number;
        melena: boolean;
        syncope: boolean;
        hepaticDisease: boolean;
        cardiacFailure: boolean;
        bun?: number | undefined;
        bunUnit?: "mg/dL" | "mmol/L" | undefined;
    }>, z.ZodObject<{
        levelOfConsciousness: z.ZodEnum<["alert", "arouses_minor", "arouses_repeated", "coma"]>;
        locQuestions: z.ZodEnum<["both_correct", "one_correct", "neither_correct"]>;
        locCommands: z.ZodEnum<["both_correct", "one_correct", "neither_correct"]>;
        bestGaze: z.ZodEnum<["normal", "partial_palsy", "forced_deviation"]>;
        visual: z.ZodEnum<["no_loss", "partial_hemianopia", "complete_hemianopia", "bilateral_hemianopia"]>;
        facialPalsy: z.ZodEnum<["normal", "minor", "partial", "complete"]>;
        motorArmLeft: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
        motorArmRight: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
        motorLegLeft: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
        motorLegRight: z.ZodEnum<["no_drift", "drift", "some_effort", "no_effort", "no_movement", "amputation"]>;
        limbAtaxia: z.ZodEnum<["absent", "present_one", "present_two"]>;
        sensory: z.ZodEnum<["normal", "mild_loss", "severe_loss"]>;
        bestLanguage: z.ZodEnum<["no_aphasia", "mild_aphasia", "severe_aphasia", "mute"]>;
        dysarthria: z.ZodEnum<["normal", "mild", "severe", "intubated"]>;
        extinctionInattention: z.ZodEnum<["no_abnormality", "visual_tactile_spatial", "profound_hemi_inattention"]>;
    }, "strip", z.ZodTypeAny, {
        levelOfConsciousness: "alert" | "arouses_minor" | "arouses_repeated" | "coma";
        locQuestions: "both_correct" | "one_correct" | "neither_correct";
        locCommands: "both_correct" | "one_correct" | "neither_correct";
        bestGaze: "normal" | "partial_palsy" | "forced_deviation";
        visual: "no_loss" | "partial_hemianopia" | "complete_hemianopia" | "bilateral_hemianopia";
        facialPalsy: "normal" | "minor" | "partial" | "complete";
        motorArmLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorArmRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        limbAtaxia: "absent" | "present_one" | "present_two";
        sensory: "normal" | "mild_loss" | "severe_loss";
        bestLanguage: "no_aphasia" | "mild_aphasia" | "severe_aphasia" | "mute";
        dysarthria: "normal" | "mild" | "severe" | "intubated";
        extinctionInattention: "no_abnormality" | "visual_tactile_spatial" | "profound_hemi_inattention";
    }, {
        levelOfConsciousness: "alert" | "arouses_minor" | "arouses_repeated" | "coma";
        locQuestions: "both_correct" | "one_correct" | "neither_correct";
        locCommands: "both_correct" | "one_correct" | "neither_correct";
        bestGaze: "normal" | "partial_palsy" | "forced_deviation";
        visual: "no_loss" | "partial_hemianopia" | "complete_hemianopia" | "bilateral_hemianopia";
        facialPalsy: "normal" | "minor" | "partial" | "complete";
        motorArmLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorArmRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        limbAtaxia: "absent" | "present_one" | "present_two";
        sensory: "normal" | "mild_loss" | "severe_loss";
        bestLanguage: "no_aphasia" | "mild_aphasia" | "severe_aphasia" | "mute";
        dysarthria: "normal" | "mild" | "severe" | "intubated";
        extinctionInattention: "no_abnormality" | "visual_tactile_spatial" | "profound_hemi_inattention";
    }>, z.ZodObject<{
        pao2: z.ZodOptional<z.ZodNumber>;
        fio2: z.ZodOptional<z.ZodNumber>;
        mechanicalVentilation: z.ZodBoolean;
        platelets: z.ZodNumber;
        bilirubin: z.ZodNumber;
        meanArterialPressure: z.ZodOptional<z.ZodNumber>;
        vasopressors: z.ZodEnum<["none", "dopamine_low", "dopamine_medium_or_epi_norepi_low", "dopamine_high_or_epi_norepi_high"]>;
        glasgowComaScale: z.ZodNumber;
        creatinine: z.ZodNumber;
        urineOutput: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        mechanicalVentilation: boolean;
        platelets: number;
        bilirubin: number;
        vasopressors: "none" | "dopamine_low" | "dopamine_medium_or_epi_norepi_low" | "dopamine_high_or_epi_norepi_high";
        glasgowComaScale: number;
        creatinine: number;
        pao2?: number | undefined;
        fio2?: number | undefined;
        meanArterialPressure?: number | undefined;
        urineOutput?: number | undefined;
    }, {
        mechanicalVentilation: boolean;
        platelets: number;
        bilirubin: number;
        vasopressors: "none" | "dopamine_low" | "dopamine_medium_or_epi_norepi_low" | "dopamine_high_or_epi_norepi_high";
        glasgowComaScale: number;
        creatinine: number;
        pao2?: number | undefined;
        fio2?: number | undefined;
        meanArterialPressure?: number | undefined;
        urineOutput?: number | undefined;
    }>, z.ZodObject<{
        age: z.ZodNumber;
        heartRate: z.ZodNumber;
        oxygenSaturation: z.ZodNumber;
        unilateralLegSwelling: z.ZodBoolean;
        hemoptysis: z.ZodBoolean;
        recentSurgeryOrTrauma: z.ZodBoolean;
        priorPEorDVT: z.ZodBoolean;
        hormoneUse: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        age: number;
        hemoptysis: boolean;
        heartRate: number;
        oxygenSaturation: number;
        unilateralLegSwelling: boolean;
        recentSurgeryOrTrauma: boolean;
        priorPEorDVT: boolean;
        hormoneUse: boolean;
    }, {
        age: number;
        hemoptysis: boolean;
        heartRate: number;
        oxygenSaturation: number;
        unilateralLegSwelling: boolean;
        recentSurgeryOrTrauma: boolean;
        priorPEorDVT: boolean;
        hormoneUse: boolean;
    }>, z.ZodObject<{
        age: z.ZodNumber;
        riskFactors: z.ZodNumber;
        knownCAD: z.ZodBoolean;
        aspirinUse: z.ZodBoolean;
        severeAngina: z.ZodBoolean;
        stChanges: z.ZodBoolean;
        elevatedCardiacMarkers: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        age: number;
        riskFactors: number;
        knownCAD: boolean;
        aspirinUse: boolean;
        severeAngina: boolean;
        stChanges: boolean;
        elevatedCardiacMarkers: boolean;
    }, {
        age: number;
        riskFactors: number;
        knownCAD: boolean;
        aspirinUse: boolean;
        severeAngina: boolean;
        stChanges: boolean;
        elevatedCardiacMarkers: boolean;
    }>, z.ZodObject<{
        bilirubin: z.ZodNumber;
        inr: z.ZodNumber;
        creatinine: z.ZodNumber;
        dialysis: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        bilirubin: number;
        creatinine: number;
        inr: number;
        dialysis: boolean;
    }, {
        bilirubin: number;
        creatinine: number;
        inr: number;
        dialysis: boolean;
    }>, z.ZodObject<{
        nervous: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
        stopWorrying: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
        worryingTooMuch: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
        troubleRelaxing: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
        restless: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
        easilyAnnoyed: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
        feelingAfraid: z.ZodEnum<["not_at_all", "several_days", "more_than_half", "nearly_every_day"]>;
    }, "strip", z.ZodTypeAny, {
        nervous: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        stopWorrying: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        worryingTooMuch: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        troubleRelaxing: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        restless: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        easilyAnnoyed: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        feelingAfraid: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    }, {
        nervous: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        stopWorrying: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        worryingTooMuch: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        troubleRelaxing: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        restless: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        easilyAnnoyed: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        feelingAfraid: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    }>, z.ZodObject<{
        age: z.ZodNumber;
        heartRate: z.ZodNumber;
        systolicBloodPressure: z.ZodNumber;
        creatinine: z.ZodNumber;
        killipClass: z.ZodNumber;
        cardiacArrest: z.ZodBoolean;
        stDeviation: z.ZodBoolean;
        elevatedCardiacMarkers: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        age: number;
        systolicBloodPressure: number;
        creatinine: number;
        heartRate: number;
        elevatedCardiacMarkers: boolean;
        killipClass: number;
        cardiacArrest: boolean;
        stDeviation: boolean;
    }, {
        age: number;
        systolicBloodPressure: number;
        creatinine: number;
        heartRate: number;
        elevatedCardiacMarkers: boolean;
        killipClass: number;
        cardiacArrest: boolean;
        stDeviation: boolean;
    }>, z.ZodObject<{
        hypertension: z.ZodBoolean;
        abnormalRenalFunction: z.ZodBoolean;
        abnormalLiverFunction: z.ZodBoolean;
        stroke: z.ZodBoolean;
        bleedingHistory: z.ZodBoolean;
        labileINR: z.ZodBoolean;
        age: z.ZodNumber;
        medications: z.ZodBoolean;
        alcoholUse: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        age: number;
        medications: boolean;
        hypertension: boolean;
        abnormalRenalFunction: boolean;
        abnormalLiverFunction: boolean;
        stroke: boolean;
        bleedingHistory: boolean;
        labileINR: boolean;
        alcoholUse: boolean;
    }, {
        age: number;
        medications: boolean;
        hypertension: boolean;
        abnormalRenalFunction: boolean;
        abnormalLiverFunction: boolean;
        stroke: boolean;
        bleedingHistory: boolean;
        labileINR: boolean;
        alcoholUse: boolean;
    }>, z.ZodObject<{
        age: z.ZodNumber;
        bloodPressure: z.ZodObject<{
            systolic: z.ZodNumber;
            diastolic: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            systolic: number;
            diastolic: number;
        }, {
            systolic: number;
            diastolic: number;
        }>;
        clinicalFeatures: z.ZodEnum<["unilateral_weakness", "speech_impairment", "neither"]>;
        duration: z.ZodEnum<["less_than_10", "10_to_59", "60_or_more"]>;
        diabetes: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        age: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        diabetes: boolean;
        clinicalFeatures: "unilateral_weakness" | "speech_impairment" | "neither";
        duration: "less_than_10" | "10_to_59" | "60_or_more";
    }, {
        age: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        diabetes: boolean;
        clinicalFeatures: "unilateral_weakness" | "speech_impairment" | "neither";
        duration: "less_than_10" | "10_to_59" | "60_or_more";
    }>]>;
}, "strip", z.ZodTypeAny, {
    calculator: "curb65" | "centor" | "wells_dvt" | "wells_pe" | "heart" | "cha2ds2_vasc" | "gcs" | "qsofa" | "alvarado" | "glasgow_blatchford" | "nihss" | "sofa" | "perc" | "timi" | "meld" | "gad7" | "grace" | "has_bled" | "abcd2";
    inputs: {
        age: number;
        confusion: boolean;
        respiratoryRate: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        urea?: number | undefined;
        ureaUnit?: "mg/dL" | "mmol/L" | undefined;
    } | {
        age: number;
        fever: boolean;
        tonsillarExudate: boolean;
        tenderAnteriorNodes: boolean;
        noCough: boolean;
    } | {
        activeCancer: boolean;
        paralysisOrImmobilization: boolean;
        recentlyBedridden: boolean;
        localizedTenderness: boolean;
        entireLegSwollen: boolean;
        calfSwelling: boolean;
        pittingEdema: boolean;
        collateralVeins: boolean;
        previousDVT: boolean;
        alternativeDiagnosis: boolean;
    } | {
        clinicalDVTSigns: boolean;
        peIsLikelyDiagnosis: boolean;
        heartRateOver100: boolean;
        immobilizationOrSurgery: boolean;
        previousPEorDVT: boolean;
        hemoptysis: boolean;
        malignancy: boolean;
    } | {
        age: number;
        history: "highly_suspicious" | "moderately_suspicious" | "slightly_suspicious";
        ecg: "significant_st_depression" | "nonspecific_changes" | "normal";
        riskFactors: number;
        troponin: "normal" | "high" | "moderate";
    } | {
        age: number;
        sex: "male" | "female";
        congestiveHeartFailure: boolean;
        hypertension: boolean;
        diabetes: boolean;
        strokeTIAThrombus: boolean;
        vascularDisease: boolean;
    } | {
        eyeOpening: "spontaneous" | "to_speech" | "to_pain" | "none";
        verbalResponse: "none" | "oriented" | "confused" | "inappropriate_words" | "incomprehensible";
        motorResponse: "none" | "obeys_commands" | "localizes_pain" | "withdraws_from_pain" | "abnormal_flexion" | "abnormal_extension";
    } | {
        respiratoryRate: number;
        alteredMentalStatus: boolean;
        systolicBloodPressure: number;
    } | {
        rlqPain: boolean;
        anorexia: boolean;
        nauseaVomiting: boolean;
        rlqTenderness: boolean;
        reboundTenderness: boolean;
        elevatedTemperature: boolean;
        leukocytosis: boolean;
        leftShift: boolean;
        migrationPain: boolean;
    } | {
        sex: "male" | "female";
        systolicBloodPressure: number;
        hemoglobin: number;
        pulse: number;
        melena: boolean;
        syncope: boolean;
        hepaticDisease: boolean;
        cardiacFailure: boolean;
        bun?: number | undefined;
        bunUnit?: "mg/dL" | "mmol/L" | undefined;
    } | {
        levelOfConsciousness: "alert" | "arouses_minor" | "arouses_repeated" | "coma";
        locQuestions: "both_correct" | "one_correct" | "neither_correct";
        locCommands: "both_correct" | "one_correct" | "neither_correct";
        bestGaze: "normal" | "partial_palsy" | "forced_deviation";
        visual: "no_loss" | "partial_hemianopia" | "complete_hemianopia" | "bilateral_hemianopia";
        facialPalsy: "normal" | "minor" | "partial" | "complete";
        motorArmLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorArmRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        limbAtaxia: "absent" | "present_one" | "present_two";
        sensory: "normal" | "mild_loss" | "severe_loss";
        bestLanguage: "no_aphasia" | "mild_aphasia" | "severe_aphasia" | "mute";
        dysarthria: "normal" | "mild" | "severe" | "intubated";
        extinctionInattention: "no_abnormality" | "visual_tactile_spatial" | "profound_hemi_inattention";
    } | {
        mechanicalVentilation: boolean;
        platelets: number;
        bilirubin: number;
        vasopressors: "none" | "dopamine_low" | "dopamine_medium_or_epi_norepi_low" | "dopamine_high_or_epi_norepi_high";
        glasgowComaScale: number;
        creatinine: number;
        pao2?: number | undefined;
        fio2?: number | undefined;
        meanArterialPressure?: number | undefined;
        urineOutput?: number | undefined;
    } | {
        age: number;
        hemoptysis: boolean;
        heartRate: number;
        oxygenSaturation: number;
        unilateralLegSwelling: boolean;
        recentSurgeryOrTrauma: boolean;
        priorPEorDVT: boolean;
        hormoneUse: boolean;
    } | {
        age: number;
        riskFactors: number;
        knownCAD: boolean;
        aspirinUse: boolean;
        severeAngina: boolean;
        stChanges: boolean;
        elevatedCardiacMarkers: boolean;
    } | {
        bilirubin: number;
        creatinine: number;
        inr: number;
        dialysis: boolean;
    } | {
        nervous: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        stopWorrying: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        worryingTooMuch: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        troubleRelaxing: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        restless: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        easilyAnnoyed: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        feelingAfraid: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    } | {
        age: number;
        systolicBloodPressure: number;
        creatinine: number;
        heartRate: number;
        elevatedCardiacMarkers: boolean;
        killipClass: number;
        cardiacArrest: boolean;
        stDeviation: boolean;
    } | {
        age: number;
        medications: boolean;
        hypertension: boolean;
        abnormalRenalFunction: boolean;
        abnormalLiverFunction: boolean;
        stroke: boolean;
        bleedingHistory: boolean;
        labileINR: boolean;
        alcoholUse: boolean;
    } | {
        age: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        diabetes: boolean;
        clinicalFeatures: "unilateral_weakness" | "speech_impairment" | "neither";
        duration: "less_than_10" | "10_to_59" | "60_or_more";
    };
}, {
    calculator: "curb65" | "centor" | "wells_dvt" | "wells_pe" | "heart" | "cha2ds2_vasc" | "gcs" | "qsofa" | "alvarado" | "glasgow_blatchford" | "nihss" | "sofa" | "perc" | "timi" | "meld" | "gad7" | "grace" | "has_bled" | "abcd2";
    inputs: {
        age: number;
        confusion: boolean;
        respiratoryRate: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        urea?: number | undefined;
        ureaUnit?: "mg/dL" | "mmol/L" | undefined;
    } | {
        age: number;
        fever: boolean;
        tonsillarExudate: boolean;
        tenderAnteriorNodes: boolean;
        noCough: boolean;
    } | {
        activeCancer: boolean;
        paralysisOrImmobilization: boolean;
        recentlyBedridden: boolean;
        localizedTenderness: boolean;
        entireLegSwollen: boolean;
        calfSwelling: boolean;
        pittingEdema: boolean;
        collateralVeins: boolean;
        previousDVT: boolean;
        alternativeDiagnosis: boolean;
    } | {
        clinicalDVTSigns: boolean;
        peIsLikelyDiagnosis: boolean;
        heartRateOver100: boolean;
        immobilizationOrSurgery: boolean;
        previousPEorDVT: boolean;
        hemoptysis: boolean;
        malignancy: boolean;
    } | {
        age: number;
        history: "highly_suspicious" | "moderately_suspicious" | "slightly_suspicious";
        ecg: "significant_st_depression" | "nonspecific_changes" | "normal";
        riskFactors: number;
        troponin: "normal" | "high" | "moderate";
    } | {
        age: number;
        sex: "male" | "female";
        congestiveHeartFailure: boolean;
        hypertension: boolean;
        diabetes: boolean;
        strokeTIAThrombus: boolean;
        vascularDisease: boolean;
    } | {
        eyeOpening: "spontaneous" | "to_speech" | "to_pain" | "none";
        verbalResponse: "none" | "oriented" | "confused" | "inappropriate_words" | "incomprehensible";
        motorResponse: "none" | "obeys_commands" | "localizes_pain" | "withdraws_from_pain" | "abnormal_flexion" | "abnormal_extension";
    } | {
        respiratoryRate: number;
        alteredMentalStatus: boolean;
        systolicBloodPressure: number;
    } | {
        rlqPain: boolean;
        anorexia: boolean;
        nauseaVomiting: boolean;
        rlqTenderness: boolean;
        reboundTenderness: boolean;
        elevatedTemperature: boolean;
        leukocytosis: boolean;
        leftShift: boolean;
        migrationPain: boolean;
    } | {
        sex: "male" | "female";
        systolicBloodPressure: number;
        hemoglobin: number;
        pulse: number;
        melena: boolean;
        syncope: boolean;
        hepaticDisease: boolean;
        cardiacFailure: boolean;
        bun?: number | undefined;
        bunUnit?: "mg/dL" | "mmol/L" | undefined;
    } | {
        levelOfConsciousness: "alert" | "arouses_minor" | "arouses_repeated" | "coma";
        locQuestions: "both_correct" | "one_correct" | "neither_correct";
        locCommands: "both_correct" | "one_correct" | "neither_correct";
        bestGaze: "normal" | "partial_palsy" | "forced_deviation";
        visual: "no_loss" | "partial_hemianopia" | "complete_hemianopia" | "bilateral_hemianopia";
        facialPalsy: "normal" | "minor" | "partial" | "complete";
        motorArmLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorArmRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegLeft: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        motorLegRight: "no_drift" | "drift" | "some_effort" | "no_effort" | "no_movement" | "amputation";
        limbAtaxia: "absent" | "present_one" | "present_two";
        sensory: "normal" | "mild_loss" | "severe_loss";
        bestLanguage: "no_aphasia" | "mild_aphasia" | "severe_aphasia" | "mute";
        dysarthria: "normal" | "mild" | "severe" | "intubated";
        extinctionInattention: "no_abnormality" | "visual_tactile_spatial" | "profound_hemi_inattention";
    } | {
        mechanicalVentilation: boolean;
        platelets: number;
        bilirubin: number;
        vasopressors: "none" | "dopamine_low" | "dopamine_medium_or_epi_norepi_low" | "dopamine_high_or_epi_norepi_high";
        glasgowComaScale: number;
        creatinine: number;
        pao2?: number | undefined;
        fio2?: number | undefined;
        meanArterialPressure?: number | undefined;
        urineOutput?: number | undefined;
    } | {
        age: number;
        hemoptysis: boolean;
        heartRate: number;
        oxygenSaturation: number;
        unilateralLegSwelling: boolean;
        recentSurgeryOrTrauma: boolean;
        priorPEorDVT: boolean;
        hormoneUse: boolean;
    } | {
        age: number;
        riskFactors: number;
        knownCAD: boolean;
        aspirinUse: boolean;
        severeAngina: boolean;
        stChanges: boolean;
        elevatedCardiacMarkers: boolean;
    } | {
        bilirubin: number;
        creatinine: number;
        inr: number;
        dialysis: boolean;
    } | {
        nervous: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        stopWorrying: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        worryingTooMuch: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        troubleRelaxing: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        restless: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        easilyAnnoyed: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
        feelingAfraid: "not_at_all" | "several_days" | "more_than_half" | "nearly_every_day";
    } | {
        age: number;
        systolicBloodPressure: number;
        creatinine: number;
        heartRate: number;
        elevatedCardiacMarkers: boolean;
        killipClass: number;
        cardiacArrest: boolean;
        stDeviation: boolean;
    } | {
        age: number;
        medications: boolean;
        hypertension: boolean;
        abnormalRenalFunction: boolean;
        abnormalLiverFunction: boolean;
        stroke: boolean;
        bleedingHistory: boolean;
        labileINR: boolean;
        alcoholUse: boolean;
    } | {
        age: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        diabetes: boolean;
        clinicalFeatures: "unilateral_weakness" | "speech_impairment" | "neither";
        duration: "less_than_10" | "10_to_59" | "60_or_more";
    };
}>;
export type CalculateClinicalScoreInput = z.infer<typeof CalculateClinicalScoreSchema>;
