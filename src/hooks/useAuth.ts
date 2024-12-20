import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../providers/firebase";
import { User } from "../models/user";
import { useMemo } from "react";

export default function useAuth() {
  const [user] = useAuthState(firebaseAuth);

  const mappedUser = useMemo(() => {
    if (!user) {
      return undefined;
    }
    return {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || undefined,
      initials: (user.displayName || user.email || user.uid).split(" ").map(x => x[0].toUpperCase()).join("")
    } as User;
  }, [user]);

  return {user: mappedUser};
}
