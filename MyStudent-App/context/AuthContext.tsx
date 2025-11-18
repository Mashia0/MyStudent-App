import React, { createContext, useContext, useState } from 'react';

type AuthContextValue = {
  signIn: () => void;
  signOut: () => void;
  userToken: string | null;
};

const AuthContext = createContext<AuthContextValue>({
  signIn: () => {},
  signOut: () => {},
  userToken: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);

  const authContext: AuthContextValue = {
    signIn: () => {
      // Replace with your real authentication flow or API call
      setUserToken('demo-token');
      console.log('[auth] user signed in');
    },
    signOut: () => {
      setUserToken(null);
      console.log('[auth] user signed out');
    },
    userToken,
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}
