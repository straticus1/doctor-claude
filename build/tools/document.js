import { z } from 'zod';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, basename } from 'node:path';
import { extractText, getDocumentProxy } from 'unpdf';
// Maximum file size we will read into memory. Medical report PDFs and scan
// exports are typically a few MB; this caps pathological inputs so a bad path
// cannot OOM the server.
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25 MB
// Extension → MIME for images we return as viewable image content blocks.
const IMAGE_MIME = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
};
// Plain-text formats we read verbatim (lab CSVs, exported notes, etc.).
const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.markdown', '.csv', '.json', '.rtf']);
export const ReadMedicalDocumentSchema = z.object({
    path: z
        .string()
        .min(1)
        .describe('Absolute (or working-directory-relative) path to a LOCAL medical document: ' +
        'a PDF report (lab results, discharge summary, radiology report), a scan image ' +
        '(PNG/JPG chest X-ray, CT/MRI slice export), or a plain-text/CSV export. ' +
        'The file is read locally and never uploaded anywhere.'),
    documentType: z
        .enum(['auto', 'lab_report', 'imaging_report', 'radiology_image', 'clinical_note', 'other'])
        .default('auto')
        .describe('Optional hint about the document kind. "auto" (default) infers handling from the ' +
        'file extension. Provided purely as context for interpretation; it does not change parsing.'),
});
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
export async function readMedicalDocument(args) {
    const absPath = resolve(args.path);
    let fileStat;
    try {
        fileStat = await stat(absPath);
    }
    catch {
        throw new Error(`File not found: ${absPath}`);
    }
    if (!fileStat.isFile()) {
        throw new Error(`Not a regular file: ${absPath}`);
    }
    if (fileStat.size > MAX_DOCUMENT_BYTES) {
        const mb = (fileStat.size / (1024 * 1024)).toFixed(1);
        throw new Error(`File too large (${mb} MB). Maximum supported size is ${MAX_DOCUMENT_BYTES / (1024 * 1024)} MB.`);
    }
    const ext = extname(absPath).toLowerCase();
    if (ext === '.pdf') {
        const buffer = await readFile(absPath);
        const pdf = await getDocumentProxy(new Uint8Array(buffer));
        const { totalPages, text } = await extractText(pdf, { mergePages: true });
        const merged = Array.isArray(text) ? text.join('\n\n') : text;
        if (!merged.trim()) {
            throw new Error(`No extractable text found in PDF: ${basename(absPath)}. ` +
                'It may be a scanned/image-only PDF. Export the page as an image ' +
                '(PNG/JPG) and read that instead so it can be viewed directly.');
        }
        return {
            kind: 'text',
            path: absPath,
            format: 'pdf',
            documentType: args.documentType,
            pages: totalPages,
            bytes: fileStat.size,
            text: merged,
        };
    }
    if (ext in IMAGE_MIME) {
        const buffer = await readFile(absPath);
        return {
            kind: 'image',
            path: absPath,
            format: 'image',
            documentType: args.documentType,
            mimeType: IMAGE_MIME[ext],
            base64: buffer.toString('base64'),
            bytes: fileStat.size,
        };
    }
    if (TEXT_EXTENSIONS.has(ext)) {
        const text = await readFile(absPath, 'utf-8');
        return {
            kind: 'text',
            path: absPath,
            format: 'text',
            documentType: args.documentType,
            bytes: fileStat.size,
            text,
        };
    }
    const supported = [
        '.pdf',
        ...Object.keys(IMAGE_MIME),
        ...Array.from(TEXT_EXTENSIONS),
    ].join(', ');
    throw new Error(`Unsupported file type "${ext || '(none)'}" for ${basename(absPath)}. Supported: ${supported}.`);
}
