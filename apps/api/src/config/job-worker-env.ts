const JOB_WORKER_SECRET_KEY = "JOB_WORKER_SECRET";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

export function getJobWorkerSecret(): string | undefined {
  return readEnv(JOB_WORKER_SECRET_KEY);
}

export function isJobWorkerConfigured(): boolean {
  return Boolean(getJobWorkerSecret());
}

export function requireJobWorkerSecret(): string {
  const secret = getJobWorkerSecret();

  if (!secret) {
    throw new Error("JOB_WORKER_SECRET is not configured");
  }

  return secret;
}
