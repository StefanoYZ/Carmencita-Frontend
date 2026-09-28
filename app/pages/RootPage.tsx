import { AppShell } from '../components/AppShell';
import { BootstrapFeature } from '../features/BootstrapFeature';
import { appMetadata } from '../lib/appMetadata';

export function RootPage() {
  return (
    <AppShell>
      <BootstrapFeature />
      <h1>{appMetadata.name}</h1>
      <p>{appMetadata.bootstrapMessage}</p>
    </AppShell>
  );
}
