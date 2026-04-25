import crypto from 'crypto';

/**
 * Generates a short ID from a long URL by hashing it.
 * This ensures that the same long URL always generates the same short ID,
 * helping with deduplication.
 */
export function generateShortId(longUrl: string): string {
  // Create an MD5 hash of the long URL
  const hash = crypto.createHash('md5').update(longUrl).digest('base64url');
  
  // Take the first 7 characters for the short ID
  // Base64Url avoids characters like + and / which aren't URL safe
  return hash.substring(0, 7);
}

/**
 * Fallback generator in case of a highly unlikely hash collision
 * (or if you just want a random string)
 */
export function generateRandomShortId(): string {
  return crypto.randomBytes(5).toString('base64url').substring(0, 7);
}
