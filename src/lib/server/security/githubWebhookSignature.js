//@ts-check
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Verify a GitHub webhook payload against the `X-Hub-Signature-256` header.
 *
 * GitHub computes HMAC-SHA256 over the raw request body using the shared
 * webhook secret and sends the hex digest in the header as `sha256=<hex>`.
 * The comparison is constant-time to defeat timing-based key recovery.
 *
 * Returns false (instead of throwing) for any failure mode so callers can
 * handle "rejected" uniformly, regardless of cause.
 *
 * @param {string} rawBody - the body as a string (NOT the parsed JSON)
 * @param {string|null|undefined} signatureHeader - value of `X-Hub-Signature-256`
 * @param {string|null|undefined} secret - the shared webhook secret
 * @returns {boolean}
 */
export function verifyGithubSignature(rawBody, signatureHeader, secret) {
  if (typeof secret !== 'string' || secret.length === 0) return false;
  if (typeof signatureHeader !== 'string' || !signatureHeader.startsWith('sha256=')) return false;
  if (typeof rawBody !== 'string') return false;

  const provided = signatureHeader.slice('sha256='.length);
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');

  // timingSafeEqual requires equal-length buffers; bail out otherwise.
  if (expected.length !== provided.length) return false;

  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(provided, 'hex'));
  } catch {
    return false;
  }
}
