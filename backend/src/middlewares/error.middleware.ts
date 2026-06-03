export function errorMiddleware() {
  return (_req: unknown, _res: unknown, next: () => void) => next();
}
