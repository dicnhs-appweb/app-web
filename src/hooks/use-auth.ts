import { AuthContext } from '@/features/auth/authenticate/auth-context';
import { useContext, useMemo } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return useMemo(() => context, [context]);
}