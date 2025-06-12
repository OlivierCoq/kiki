'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/auth-js';
import { createClient } from '@/utils/supabase/client'

const supabase = createClient();

type UserContextType = {
  session: Session | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  session: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ session, loading }}>
      {children}
    </UserContext.Provider>
  );
}