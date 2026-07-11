import { z } from 'zod';
import { ABCD2InputSchema } from '../schemas.js';
import type { ScoreResult } from '../types.js';
export declare function calculateABCD2(inputs: z.infer<typeof ABCD2InputSchema>): ScoreResult;
