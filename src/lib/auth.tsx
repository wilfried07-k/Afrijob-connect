import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken, getMyProfile, type AccountType, type ProfileInfo } from './api';

export type AuthAccountType = AccountType | 'admin';

export interface AuthState {
  token: string | null;
  accountType: AuthAccountType | null;
  userId: number | null;
  profile: ProfileInfo | null;
}

type StoredAuthSession = { token: string; accountType: AuthAccountType; userId: number };

export interface AuthContextType {
  authState: AuthState;
  isReady: boolean;
  signIn: (token: string, accountType: AuthAccountType, userId: number) => Promise<void>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    accountType: null,
    userId: null,
    profile: null,
  });

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      let session: StoredAuthSession | null = null;
      try {
        if (Platform.OS === 'web') return;
        const stored = await SecureStore.getItemAsync('auth-session');
        if (!stored) return;
        const decoded = JSON.parse(stored) as Partial<StoredAuthSession>;
        const validType = decoded.accountType === 'candidate' || decoded.accountType === 'recruiter' || decoded.accountType === 'admin';
        if (typeof decoded.token !== 'string' || !decoded.token || !Number.isInteger(decoded.userId) || !decoded.userId || !validType) {
          await SecureStore.deleteItemAsync('auth-session');
          return;
        }
        const restoredSession = decoded as StoredAuthSession;
        session = restoredSession;
        setAuthToken(restoredSession.token);
        const profile = await getMyProfile(restoredSession.userId);
        if (active) setAuthState({ ...restoredSession, profile });
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        const sessionIsInvalid = message.includes('Identifiants') || message.includes('suspendu') || message.includes('introuvable');
        if (session && !sessionIsInvalid) {
          if (active) setAuthState({ ...session, profile: null });
        } else {
          setAuthToken(null);
          if (Platform.OS !== 'web') await SecureStore.deleteItemAsync('auth-session').catch(() => undefined);
        }
      } finally {
        if (active) setIsReady(true);
      }
    };
    void restoreSession();
    return () => { active = false; };
  }, []);

  const signIn = async (token: string, accountType: AuthAccountType, userId: number) => {
    setAuthToken(token);
    try {
      const profile = await getMyProfile(userId);
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('auth-session', JSON.stringify({ token, accountType, userId }));
      }
      setAuthState({ token, accountType, userId, profile });
    } catch (error) {
      setAuthToken(null);
      throw error;
    }
  };

  const signOut = () => {
    setAuthToken(null);
    setAuthState({ token: null, accountType: null, userId: null, profile: null });
    if (Platform.OS !== 'web') void SecureStore.deleteItemAsync('auth-session').catch(() => undefined);
  };

  const refreshProfile = async () => {
    if (!authState.userId) {
      return;
    }
    const profile = await getMyProfile(authState.userId);
    setAuthState((current) => ({ ...current, profile }));
  };

  const value = useMemo(() => ({ authState, isReady, signIn, signOut, refreshProfile }), [authState, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
