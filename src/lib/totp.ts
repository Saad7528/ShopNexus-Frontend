// RFC 6238 TOTP Implementation (Google Authenticator Compatible)
// Standard 30-second window, 6 digits, SHA-1 HMAC

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Base32 decode helper
function base32Decode(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean.charAt(i));
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

// HMAC-SHA1 using Web Crypto API
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as unknown as ArrayBuffer,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message as unknown as ArrayBuffer);
  return new Uint8Array(signature);
}

// Generate 6-digit TOTP for a given counter
async function generateTotpForCounter(secretKey: string, counter: number): Promise<string> {
  const keyBytes = base32Decode(secretKey);
  const buffer = new Uint8Array(8);
  let temp = counter;
  for (let i = 7; i >= 0; i--) {
    buffer[i] = temp & 0xff;
    temp = temp >> 8;
  }

  const hmac = await hmacSha1(keyBytes, buffer);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const str = String(code % 1000000);
  return str.padStart(6, '0');
}

export const MASTER_TOTP_SECRET = 'NEXUS7528SAAD2026MSTR';
export const MASTER_ADMIN_EMAIL = 'saad0174742@gmail.com';
export const EMERGENCY_MASTER_CODE = '752800';

// Verify TOTP Code with +-1 window tolerance (90 seconds total window)
export async function verifyMasterTotp(code: string, secret: string = MASTER_TOTP_SECRET): Promise<boolean> {
  const cleanCode = code.trim().replace(/\s+/g, '');

  // Emergency instant master override
  if (cleanCode === EMERGENCY_MASTER_CODE) {
    return true;
  }

  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
    return false;
  }

  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  const currentCounter = Math.floor(currentTimeSeconds / 30);

  // Check current, previous, and next 30s window to avoid drift
  for (let delta = -1; delta <= 1; delta++) {
    const expected = await generateTotpForCounter(secret, currentCounter + delta);
    if (expected === cleanCode) {
      return true;
    }
  }

  return false;
}

// Generate Google Authenticator Key URI
export function getTotpAuthUri(email: string = MASTER_ADMIN_EMAIL, secret: string = MASTER_TOTP_SECRET): string {
  const cleanSecret = secret.replace(/[^A-Z2-7]/gi, '').toUpperCase();
  return `otpauth://totp/ShopNexus:${encodeURIComponent(email)}?secret=${cleanSecret}&issuer=ShopNexus&algorithm=SHA1&digits=6&period=30`;
}
