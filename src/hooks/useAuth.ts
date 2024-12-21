import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../providers/firebase";
import { User } from "../models/user";
import { useCallback, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function useAuth() {
  const [user, loading] = useAuthState(firebaseAuth);

  const mappedUser = useMemo(() => {
    if (!user) {
      return undefined;
    }
    return {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || undefined
    } as User;
  }, [user]);

  const logout = useCallback(async () => {
    await firebaseAuth.signOut();
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  }, []);

  const loginWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      return await signInWithEmailAndPassword(firebaseAuth, email, password);
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(firebaseAuth, email);
  }, []);

  return {
    user: mappedUser,
    loading,
    logout,
    signup,
    loginWithGoogle,
    loginWithEmailAndPassword,
    forgotPassword,
  };
}
