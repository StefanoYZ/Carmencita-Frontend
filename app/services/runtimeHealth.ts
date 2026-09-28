import type { AppHealthStatus } from '../types/app';

export function getRuntimeHealth(): AppHealthStatus {
  return 'ok';
}
