import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase";
import { AppUser } from "../models/app-user";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@firebase/auth";

export default function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        setUser(null);
        setLoaded(true);
        return;
      }
      const appUser: AppUser = u;
      setUser(appUser);
      setLoaded(true);
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

  const signup = useCallback(async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const loginWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      return await signInWithEmailAndPassword(auth, email, password);
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  return {
    loaded,
    user,
    logout,
    signup,
    loginWithGoogle,
    loginWithEmailAndPassword,
    forgotPassword,
  };
}
