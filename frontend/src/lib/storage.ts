const hasWindow = typeof window !== "undefined";

export function getStorageItem<T>(key: string, fallbackValue: T): T {
  if (!hasWindow) return fallbackValue;

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) return fallbackValue;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallbackValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (!hasWindow) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op: storage can fail in private mode/quota exceeded
  }
}

export function removeStorageItem(key: string): void {
  if (!hasWindow) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op: storage can fail in private mode/quota exceeded
  }
}
