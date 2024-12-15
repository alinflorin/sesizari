import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase";
import { AppUser } from "../models/app-user";


export default function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        setUser(null);
        return;
      }
      const appUser: AppUser = u;
      setUser(appUser);
    });
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, []);

  const logout = useCallback(async () => {
    await auth.signOut();
  }, []);

  return { user, logout };
}
