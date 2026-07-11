import { z } from 'zod';
export declare const MAX_DOCUMENT_BYTES: number;
export declare const ReadMedicalDocumentSchema: z.ZodObject<{
    path: z.ZodString;
    documentType: z.ZodDefault<z.ZodEnum<["auto", "lab_report", "imaging_report", "radiology_image", "clinical_note", "other"]>>;
}, "strip", z.ZodTypeAny, {
    path: string;
    documentType: "other" | "auto" | "lab_report" | "imaging_report" | "radiology_image" | "clinical_note";
}, {
    path: string;
    documentType?: "other" | "auto" | "lab_report" | "imaging_report" | "radiology_image" | "clinical_note" | undefined;
}>;
export type ReadMedicalDocumentInput = z.infer<typeof ReadMedicalDocumentSchema>;
export type MedicalDocumentResult = {
    kind: 'text';
    path: string;
    format: 'pdf' | 'text';
    documentType: ReadMedicalDocumentInput['documentType'];
    pages?: number;
    bytes: number;
    text: string;
} | {
    kind: 'image';
    path: string;
    format: 'image';
    documentType: ReadMedicalDocumentInput['documentType'];
    mimeType: string;
    base64: string;
    bytes: number;
};
/**
 * Read a local medical document and return its content in a model-consumable
 * form:
 *   - PDF  → extracted text (report PDFs: labs, discharge summaries, radiology reports)
 *   - image → base64 + MIME so the model can VIEW the scan (X-ray, CT/MRI export)
 *   - text/CSV → verbatim UTF-8
 *
 * Local files only — there is no network fetch here, keeping patient data on the
 * user's machine. This is an EDUCATIONAL aid: extracted text and images are for
 * discussion, not a diagnostic-grade report, and image interpretation is the
 * reader's responsibility, not a validated automated read.
 */
export declare function readMedicalDocument(args: ReadMedicalDocumentInput): Promise<MedicalDocumentResult>;
