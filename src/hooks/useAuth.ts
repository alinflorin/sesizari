import { useCallback, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../models/user-profile";
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
      getDoc(doc(db, "userProfiles/" + u.email)).then((d) => {
        if (d.exists()) {
          const userProfile: UserProfile = d.data();
          appUser.isAdmin = userProfile.isAdmin;
        }
      });
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
