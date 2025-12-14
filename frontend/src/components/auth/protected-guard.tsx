'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth-service';
import { LoadingScreen } from '../common/loading-screen';

export function ProtectedGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getProfile()
      .then(() => setLoading(false))
      .catch(() => router.replace('/login'));
  }, []);

  if (loading) return <LoadingScreen />; 

  return <>{children}</>;
}
