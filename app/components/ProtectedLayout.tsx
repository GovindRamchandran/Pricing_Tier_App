'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ✅ If user is NOT logged in and NOT on login page → redirect to login
    if (!user && pathname !== '/login') {
      router.replace('/login');
    }

    // ✅ If user IS logged in and IS on login page → redirect to home
    if (user && pathname === '/login') {
      router.replace('/');
    }
  }, [user, pathname, router]);

  // Optional: show loading screen during auth detection
  if (user === null && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}