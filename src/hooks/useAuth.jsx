import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getCurrentSession, getUserProfile } from '../lib/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileRequestRef = useRef(0);

  const fetchProfile = async (userId) => {
    const requestId = ++profileRequestRef.current;
    console.log('[Auth] Fetching profile:', userId);

    try {
      const profilePromise = getUserProfile(userId);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('PROFILE_TIMEOUT')), 10000),
      );
      const profileData = await Promise.race([profilePromise, timeoutPromise]);

      if (requestId === profileRequestRef.current) {
        console.log('[Auth] Profile loaded:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      if (requestId === profileRequestRef.current) {
        console.error('[Auth] Profile load failed:', error);
        setProfile(null);
      }
    }

    return requestId === profileRequestRef.current;
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const currentSession = await getCurrentSession();

        if (!mounted) return;

        setSession(currentSession || null);
        console.log('[Auth] Initial session:', currentSession?.user?.id || null);

        if (currentSession?.user?.id) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('[Auth] Auth state changed:', _event, newSession?.user?.id || null);

      if (_event === 'INITIAL_SESSION') return;

      setSession(newSession || null);

      if (newSession?.user?.id) {
        setLoading(true);
        // Defer Supabase work until the auth callback has released its internal lock.
        setTimeout(() => {
          if (!mounted) return;
          void fetchProfile(newSession.user.id).finally(() => {
            if (mounted) setLoading(false);
          });
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isAuthenticated: !!session?.user,
      isAdmin: profile?.role === 'admin',
      isActiveStudent: profile?.role === 'student' && profile?.is_active === true,
      refreshProfile: async () => {
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        }
      },
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};