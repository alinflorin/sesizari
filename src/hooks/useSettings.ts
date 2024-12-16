import { useEffect, useState } from "react";
import useFirestore from "./useFirestore";
import { Settings } from "../models/settings";

export default function useSettings() {
  const [settings, setSettings] = useState<Settings | undefined>();
  const {getSettings} = useFirestore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        if (s) {
          setSettings(s);
        }
        setLoaded(true);
      } catch (err: unknown) {
        console.error(err);
        setLoaded(true);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {settings, loaded};
}