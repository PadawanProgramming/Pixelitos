import { UserSession } from '../types';

const SECURITY_SALT = 'pixelitos_pedagogical_vault_salt_2026_xyz';

/**
 * Computes a simple, robust hash string of a payload with a salt.
 * This is used to sign and verify localStorage sessions client-side
 * to completely block simple privilege escalation.
 */
export function computeHash(payload: string): string {
  let hash = 5381;
  const saltedPayload = payload + SECURITY_SALT;
  for (let i = 0; i < saltedPayload.length; i++) {
    hash = (hash * 33) ^ saltedPayload.charCodeAt(i);
  }
  // Convert to absolute hex string representation
  return Math.abs(hash).toString(16);
}

/**
 * Generates a session object containing a secure signature.
 */
export function signSession(session: UserSession): UserSession & { signature: string } {
  const payload = `${session.role}|${session.studentLevel || ''}|${session.studentName || ''}`;
  const signature = computeHash(payload);
  return {
    ...session,
    signature,
  };
}

/**
 * Verifies if a signed session is untampered.
 */
export function verifySession(session: any): boolean {
  if (!session || typeof session !== 'object') return false;
  if (!session.role) return false;
  if (!session.signature) return false;

  const payload = `${session.role}|${session.studentLevel || ''}|${session.studentName || ''}`;
  const computed = computeHash(payload);
  return session.signature === computed;
}
