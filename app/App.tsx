import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './routes/appRouter';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
