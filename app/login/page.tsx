'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false); // 👈 Toggle between login/signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignup) {
        // 🔐 Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🎯 Store default subscription tier in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email
        });

        router.push('/'); // Redirect after signup
      } else {
        // 🔐 Login Flow
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {isSignup ? 'Create an Account' : 'Login'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        {errorMsg && (
          <p className="text-sm text-red-500 mb-4">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0E4259] text-white py-2 rounded hover:bg-[#0b3446] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              {isSignup ? 'Signing up' : 'Logging in'}
              <svg
                className="w-5 h-5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </>
          ) : isSignup ? (
            'Sign Up'
          ) : (
            'Login'
          )}
        </button>

        <p className="mt-4 text-sm text-center dark:text-white">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
}
