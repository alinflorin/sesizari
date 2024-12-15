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
    user,
    logout,
    signup,
    loginWithGoogle,
    loginWithEmailAndPassword,
    forgotPassword,
  };
}
