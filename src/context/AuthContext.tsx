import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser, testConnection } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConnected: boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseConnected: true,
  signIn: async () => null,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  useEffect(() => {
    // Initial connection validation per Firebase skill
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    return await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConnected,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
