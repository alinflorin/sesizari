import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { UserProfile } from "../models/user-profile";
import useAuth from "./useAuth";

export default function useUserProfile() {
  const { user } = useAuth();
  const localProfile = localStorage.getItem("userProfile");
  const [profile, setProfile] = useState<UserProfile>(
    localProfile ? JSON.parse(localProfile) : {}
  );

  const [onlineProfile] = useDocumentData(
    doc(firebaseFirestore, `userProfiles/${user?.email}`)
  );

  useEffect(() => {
    if (onlineProfile) {
      setProfile(onlineProfile);
    }
  }, [onlineProfile]);

  const setUserProfile = useCallback(
    async (p: UserProfile) => {
      localStorage.setItem("userProfile", JSON.stringify(p));
      setProfile(p);
      if (user) {
        await updateDoc(doc(firebaseFirestore, `userProfiles/${user!.email}`), {
          ...p,
        });
      }
    },
    [user, setProfile]
  );

  return { profile, setUserProfile };
}
