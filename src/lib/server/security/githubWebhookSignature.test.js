import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyGithubSignature } from './githubWebhookSignature.js';

const SECRET = 'super-secret-key';
const BODY = JSON.stringify({ action: 'closed', pull_request: { merged: true } });

function sign(body, secret = SECRET) {
  return 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
}

describe('verifyGithubSignature', () => {
  it('returns true for a valid signature', () => {
    expect(verifyGithubSignature(BODY, sign(BODY), SECRET)).toBe(true);
  });

  it('returns false for a tampered body', () => {
    const original = sign(BODY);
    expect(verifyGithubSignature(BODY + 'x', original, SECRET)).toBe(false);
  });

  it('returns false for a wrong secret', () => {
    expect(verifyGithubSignature(BODY, sign(BODY, 'other-secret'), SECRET)).toBe(false);
  });

  it('returns false when the secret is missing or empty', () => {
    expect(verifyGithubSignature(BODY, sign(BODY), '')).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(verifyGithubSignature(BODY, sign(BODY), null)).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(verifyGithubSignature(BODY, sign(BODY), undefined)).toBe(false);
  });

  it('returns false when the signature header is missing or malformed', () => {
    expect(verifyGithubSignature(BODY, '', SECRET)).toBe(false);
    expect(verifyGithubSignature(BODY, null, SECRET)).toBe(false);
    expect(verifyGithubSignature(BODY, undefined, SECRET)).toBe(false);
    expect(verifyGithubSignature(BODY, 'not-a-sha256', SECRET)).toBe(false);
  });

  it('returns false when the prefix is wrong (e.g. legacy sha1=)', () => {
    const sig = createHmac('sha1', SECRET).update(BODY).digest('hex');
    expect(verifyGithubSignature(BODY, 'sha1=' + sig, SECRET)).toBe(false);
  });

  it('returns false when the hex digest length is wrong', () => {
    expect(verifyGithubSignature(BODY, 'sha256=abc', SECRET)).toBe(false);
  });

  it('returns false when the body is not a string', () => {
    // @ts-expect-error testing runtime guard
    expect(verifyGithubSignature(null, sign(BODY), SECRET)).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(verifyGithubSignature(undefined, sign(BODY), SECRET)).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(verifyGithubSignature({ a: 1 }, sign(BODY), SECRET)).toBe(false);
  });

  it('does not throw on garbage hex characters', () => {
    expect(() => verifyGithubSignature(BODY, 'sha256=' + 'z'.repeat(64), SECRET)).not.toThrow();
    expect(verifyGithubSignature(BODY, 'sha256=' + 'z'.repeat(64), SECRET)).toBe(false);
  });
});
