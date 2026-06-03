export function validateMiddleware() {
  return (_req: unknown, _res: unknown, next: () => void) => next();
}
