export interface Request {
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
}

export interface Response {
  status: (code: number) => Response;
  json: (body: unknown) => void;
}

export type NextFunction = (error?: unknown) => void;
