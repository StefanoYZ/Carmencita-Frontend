import { getRuntimeHealth } from '../services/runtimeHealth';

export function BootstrapFeature() {
  return <p data-testid="health-status">{getRuntimeHealth()}</p>;
}
