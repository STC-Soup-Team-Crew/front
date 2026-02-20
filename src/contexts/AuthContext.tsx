/**
 * AuthContext — Clerk auth scaffolding with guest mode
 * Replace TODO stubs with real Clerk calls when ready
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  mode: 'guest' | 'registered';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (email: string, _password: string) => {
    // TODO: Replace with Clerk
    // import { useSignIn } from '@clerk/clerk-expo';
    // const { signIn, setActive } = useSignIn();
    // const result = await signIn.create({ identifier: email, password });
    // await setActive({ session: result.createdSessionId });
    setUser({
      id: 'registered-user',
      name: email.split('@')[0],
      email,
      mode: 'registered',
    });
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    // TODO: Replace with Clerk
    // import { useSignUp } from '@clerk/clerk-expo';
    // const { signUp, setActive } = useSignUp();
    // const result = await signUp.create({ firstName: name, emailAddress: email, password });
    // await setActive({ session: result.createdSessionId });
    setUser({
      id: 'registered-user',
      name,
      email,
      mode: 'registered',
    });
  }, []);

  const continueAsGuest = useCallback(() => {
    setUser({
      id: `guest-${Date.now()}`,
      name: 'Guest',
      email: '',
      mode: 'guest',
    });
  }, []);

  const signOut = useCallback(() => {
    // TODO: Replace with Clerk
    // import { useAuth } from '@clerk/clerk-expo';
    // const { signOut } = useAuth();
    // await signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
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
