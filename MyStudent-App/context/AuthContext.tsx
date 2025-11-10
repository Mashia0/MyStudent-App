// context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  userToken: string | null;
}>({
  signIn: () => {},
  signOut: () => {},
  userToken: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);

  const authContext = {
    signIn: () => {
      // Logika login Anda yang sebenarnya akan ada di sini
      // Untuk saat ini, kita hanya set token palsu
      setUserToken('dummy-token');
      console.log('Pengguna masuk');
    },
    signOut: () => {
      setUserToken(null);
      console.log('Pengguna keluar');
    },
    userToken,
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}
