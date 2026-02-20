/**
 * AuthContext — Clerk auth scaffolding with guest mode
 * Bridges Clerk authentication with a local 'Guest' mode
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';

interface User {
  id: string;
  name: string;
  email: string;
  mode: 'guest' | 'registered';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkUserLoaded } = useUser();
  const { isLoaded: clerkAuthLoaded, signOut: clerkSignOut } = useClerkAuth();
  const { signIn: clerkSignIn, setActive: clerkSetSignInActive } = useSignIn();
  const { signUp: clerkSignUp, setActive: clerkSetSignUpActive } = useSignUp();
  
  const [user, setUser] = useState<User | null>(null);

  // Sync with Clerk User
  useEffect(() => {
    if (clerkUser) {
      setUser({
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        mode: 'registered',
      });
    } else if (user?.mode !== 'guest') {
      setUser(null);
    }
  }, [clerkUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!clerkSignIn || !clerkSetSignInActive) return;
    
    const signInAttempt = await clerkSignIn.create({
      identifier: email,
      password,
    });

    if (signInAttempt.status === 'complete') {
      await clerkSetSignInActive({
        session: signInAttempt.createdSessionId,
      });
    } else {
      throw new Error('Sign in incomplete: ' + signInAttempt.status);
    }
  }, [clerkSignIn, clerkSetSignInActive]);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!clerkSignUp || !clerkSetSignUpActive) return;
    
    // Clerk uses firstName/lastName or just a full setup.
    // For simplicity, we just use email and password as the basic sign up.
    const signUpAttempt = await clerkSignUp.create({
      emailAddress: email,
      password,
    });
    
    // In a real app, you'd handle email verification here.
    // Assuming 'complete' for this implementation bridge.
    if (signUpAttempt.status === 'complete') {
      await clerkSetSignUpActive({
        session: signUpAttempt.createdSessionId,
      });
    } else {
      throw new Error('Sign up incomplete: ' + signUpAttempt.status);
    }
  }, [clerkSignUp, clerkSetSignUpActive]);

  const continueAsGuest = useCallback(() => {
    setUser({
      id: `guest-${Date.now()}`,
      name: 'Guest',
      email: '',
      mode: 'guest',
    });
  }, []);

  const signOut = useCallback(async () => {
    if (clerkUser) {
      await clerkSignOut();
    }
    setUser(null);
  }, [clerkUser, clerkSignOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoaded: clerkAuthLoaded && clerkUserLoaded,
        signIn,
        signUp,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
