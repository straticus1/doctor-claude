import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readMedicalDocument, ReadMedicalDocumentSchema } from '../document.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, 'fixtures');
const fx = (name: string) => join(fixtures, name);

describe('readMedicalDocument — PDF reports', () => {
  it('extracts text from a report PDF', async () => {
    const r = await readMedicalDocument({ path: fx('sample-report.pdf'), documentType: 'auto' });
    expect(r.kind).toBe('text');
    if (r.kind !== 'text') throw new Error('expected text');
    expect(r.format).toBe('pdf');
    expect(r.pages).toBe(1);
    expect(r.text).toContain('Lab Report Sodium 140');
    expect(r.bytes).toBeGreaterThan(0);
  });
});

describe('readMedicalDocument — scan images', () => {
  it('returns a PNG as a base64 image block with correct MIME', async () => {
    const r = await readMedicalDocument({ path: fx('pixel.png'), documentType: 'radiology_image' });
    expect(r.kind).toBe('image');
    if (r.kind !== 'image') throw new Error('expected image');
    expect(r.mimeType).toBe('image/png');
    expect(r.documentType).toBe('radiology_image');
    // Round-trips to the PNG magic header bytes.
    expect(Buffer.from(r.base64, 'base64').subarray(0, 4).toString('hex')).toBe('89504e47');
  });
});

describe('readMedicalDocument — text/CSV exports', () => {
  it('reads a plain-text note verbatim', async () => {
    const r = await readMedicalDocument({ path: fx('note.txt'), documentType: 'clinical_note' });
    expect(r.kind).toBe('text');
    if (r.kind !== 'text') throw new Error('expected text');
    expect(r.format).toBe('text');
    expect(r.text).toContain('Troponin negative');
  });
});

describe('readMedicalDocument — rejection & safety', () => {
  it('throws on a missing file', async () => {
    await expect(readMedicalDocument({ path: fx('does-not-exist.pdf'), documentType: 'auto' }))
      .rejects.toThrow(/not found/i);
  });

  it('throws on a directory', async () => {
    await expect(readMedicalDocument({ path: fixtures, documentType: 'auto' }))
      .rejects.toThrow(/not a regular file/i);
  });

  it('throws on an unsupported file type', async () => {
    await expect(readMedicalDocument({ path: fx('data.xyz'), documentType: 'auto' }))
      .rejects.toThrow(/unsupported file type/i);
  });

  it('rejects an empty path at the schema layer', () => {
    expect(() => ReadMedicalDocumentSchema.parse({ path: '' })).toThrow();
  });

  it('defaults documentType to "auto" when omitted', () => {
    const parsed = ReadMedicalDocumentSchema.parse({ path: '/tmp/x.pdf' });
    expect(parsed.documentType).toBe('auto');
  });
});
