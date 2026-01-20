import crypto from "crypto";

const algorithm: crypto.CipherGCMTypes = "aes-128-gcm";
const ivSize = 16;

export const encryptToken = (
  token: string,
  encryptionKey: string
): { iv: Buffer; encrypted: string; authTag: Buffer } => {
  const iv = crypto.randomBytes(ivSize);
  const key = Buffer.from(encryptionKey, "hex");
  const cipher = crypto.createCipheriv(algorithm, new Uint8Array(key), new Uint8Array(iv));
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return { iv, encrypted, authTag };
};

export const decryptToken = (encryptedToken: string, iv: Buffer, authTag: Buffer, encryptionKey: string): string => {
  const key = Buffer.from(encryptionKey, "hex");
  const decipher = crypto.createDecipheriv(algorithm, new Uint8Array(key), new Uint8Array(iv));

  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedToken, "hex", "utf8");

  decrypted += decipher.final("utf8");
  return decrypted;
};
