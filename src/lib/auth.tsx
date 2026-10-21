import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { setAuthToken, getMyProfile, type AccountType, type ProfileInfo } from './api';

export type AuthAccountType = AccountType | 'admin';

export interface AuthState {
  token: string | null;
  accountType: AuthAccountType | null;
  userId: number | null;
  profile: ProfileInfo | null;
}

export interface AuthContextType {
  authState: AuthState;
  signIn: (token: string, accountType: AuthAccountType, userId: number) => Promise<void>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    accountType: null,
    userId: null,
    profile: null,
  });

  const signIn = async (token: string, accountType: AuthAccountType, userId: number) => {
    setAuthToken(token);
    const profile = await getMyProfile(userId);
    setAuthState({ token, accountType, userId, profile });
  };

  const signOut = () => {
    setAuthToken(null);
    setAuthState({ token: null, accountType: null, userId: null, profile: null });
  };

  const refreshProfile = async () => {
    if (!authState.userId) {
      return;
    }
    const profile = await getMyProfile(authState.userId);
    setAuthState((current) => ({ ...current, profile }));
  };

  const value = useMemo(() => ({ authState, signIn, signOut, refreshProfile }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}