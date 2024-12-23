import { doc, setDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { useCallback, useMemo } from "react";
import { Settings } from "../models/settings";

export default function useSettings() {
  const [settingsDoc, loading] = useDocumentData(
    doc(firebaseFirestore, "settings/settings")
  );
  const settings = useMemo(() => {
    if (!settingsDoc) {
      return undefined;
    }
    return settingsDoc as Settings;
  }, [settingsDoc]);

    const updateSettings = useCallback(async (newSettings: Settings) => {
      await setDoc(doc(firebaseFirestore, "settings/settings"), newSettings, {merge: true});
    }, []);

  return { settings, loading, updateSettings };
}
