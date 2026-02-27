// Simple encryption for demo - use proper encryption in production
export async function encryptMessage(text: string): Promise<string> {
  return btoa(text); // Base64 encode
}

export async function decryptMessage(encrypted: string): Promise<string> {
  try {
    return atob(encrypted); // Base64 decode
  } catch {
    return encrypted; // Return as-is if not encrypted
  }
}
