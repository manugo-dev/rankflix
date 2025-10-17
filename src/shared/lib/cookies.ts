export interface CookieOptions {
  maxAge?: number; // segundos
  path?: string;
  sameSite?: "Lax" | "None" | "Strict";
  secure?: boolean;
}

const DEFAULT_OPTIONS: CookieOptions = {
  maxAge: 365 * 24 * 60 * 60, // 1 año
  path: "/",
  sameSite: "Lax",
};

export function setCookie(name: string, value: string, options?: Partial<CookieOptions>): void {
  const options_ = { ...DEFAULT_OPTIONS, ...options };

  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Max-Age=${options_.maxAge}`,
    `Path=${options_.path}`,
    `SameSite=${options_.sameSite}`,
  ];

  if (options_.secure) {
    parts.push("Secure");
  }
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = parts.join("; ");
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  }
  return null;
}

export function deleteCookie(name: string, path: string = "/"): void {
  setCookie(name, "", { maxAge: 0, path });
}

export function clearCookies(): void {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos === -1 ? cookie : cookie.slice(0, Math.max(0, eqPos));
    deleteCookie(name);
  }
}
