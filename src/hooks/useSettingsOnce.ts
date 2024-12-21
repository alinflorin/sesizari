import { doc } from "firebase/firestore";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { useMemo } from "react";
import { Settings } from "../models/settings";

export default function useSettingsOnce() {
  const [settingsDoc, loading] = useDocumentDataOnce(
    doc(firebaseFirestore, "settings/settings")
  );
  const settings = useMemo(() => {
    if (!settingsDoc) {
      return undefined;
    }
    return settingsDoc as Settings;
  }, [settingsDoc]);

  return { settings, loading };
}
