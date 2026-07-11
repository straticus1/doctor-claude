import { CURB65InputSchema, CentorInputSchema, WellsDVTInputSchema, WellsPEInputSchema, HEARTInputSchema, CHA2DS2VAScInputSchema, GCSInputSchema, QSOFAInputSchema, AlvaradoInputSchema, GlasgowBlatchfordInputSchema, NIHSSInputSchema, SOFAInputSchema, PERCInputSchema, TIMIInputSchema, MELDInputSchema, GAD7InputSchema, GRACEInputSchema, HASBLEDInputSchema, ABCD2InputSchema, } from './schemas.js';
import { calculateCURB65 } from './calculators/curb65.js';
import { calculateCentor } from './calculators/centor.js';
import { calculateWellsDVT } from './calculators/wells-dvt.js';
import { calculateWellsPE } from './calculators/wells-pe.js';
import { calculateHEART } from './calculators/heart.js';
import { calculateCHA2DS2VASc } from './calculators/cha2ds2-vasc.js';
import { calculateGCS } from './calculators/gcs.js';
import { calculateQSOFA } from './calculators/qsofa.js';
import { calculateAlvarado } from './calculators/alvarado.js';
import { calculateGlasgowBlatchford } from './calculators/glasgow-blatchford.js';
import { calculateNIHSS } from './calculators/nihss.js';
import { calculateSOFA } from './calculators/sofa.js';
import { calculatePERC } from './calculators/perc.js';
import { calculateTIMI } from './calculators/timi.js';
import { calculateMELD } from './calculators/meld.js';
import { calculateGAD7 } from './calculators/gad7.js';
import { calculateGRACE } from './calculators/grace.js';
import { calculateHASBLED } from './calculators/has-bled.js';
import { calculateABCD2 } from './calculators/abcd2.js';
const calculatorMap = {
    curb65: {
        schema: CURB65InputSchema,
        calculate: calculateCURB65,
    },
    centor: {
        schema: CentorInputSchema,
        calculate: calculateCentor,
    },
    wells_dvt: {
        schema: WellsDVTInputSchema,
        calculate: calculateWellsDVT,
    },
    wells_pe: {
        schema: WellsPEInputSchema,
        calculate: calculateWellsPE,
    },
    heart: {
        schema: HEARTInputSchema,
        calculate: calculateHEART,
    },
    cha2ds2_vasc: {
        schema: CHA2DS2VAScInputSchema,
        calculate: calculateCHA2DS2VASc,
    },
    gcs: {
        schema: GCSInputSchema,
        calculate: calculateGCS,
    },
    qsofa: {
        schema: QSOFAInputSchema,
        calculate: calculateQSOFA,
    },
    alvarado: {
        schema: AlvaradoInputSchema,
        calculate: calculateAlvarado,
    },
    glasgow_blatchford: {
        schema: GlasgowBlatchfordInputSchema,
        calculate: calculateGlasgowBlatchford,
    },
    nihss: {
        schema: NIHSSInputSchema,
        calculate: calculateNIHSS,
    },
    sofa: {
        schema: SOFAInputSchema,
        calculate: calculateSOFA,
    },
    perc: {
        schema: PERCInputSchema,
        calculate: calculatePERC,
    },
    timi: {
        schema: TIMIInputSchema,
        calculate: calculateTIMI,
    },
    meld: {
        schema: MELDInputSchema,
        calculate: calculateMELD,
    },
    gad7: {
        schema: GAD7InputSchema,
        calculate: calculateGAD7,
    },
    grace: {
        schema: GRACEInputSchema,
        calculate: calculateGRACE,
    },
    has_bled: {
        schema: HASBLEDInputSchema,
        calculate: calculateHASBLED,
    },
    abcd2: {
        schema: ABCD2InputSchema,
        calculate: calculateABCD2,
    },
};
export function calculateClinicalScore(args) {
    const { calculator, inputs } = args;
    const config = calculatorMap[calculator];
    if (!config) {
        throw new Error(`Unknown calculator: ${calculator}`);
    }
    const validated = config.schema.parse(inputs);
    return config.calculate(validated);
}
export { CalculateClinicalScoreSchema } from './schemas.js';
