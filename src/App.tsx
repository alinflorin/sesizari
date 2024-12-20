import { Outlet } from "react-router";
import Header from "./components/Header";
import {
  FluentProvider,
  makeStyles,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import useUserProfile from "./hooks/useUserProfile";
import { useSystemTheme } from "./hooks/useSystemTheme";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useTenant from "./hooks/useTenant";
import useSettings from "./hooks/useSettings";
import useAuth from "./hooks/useAuth";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  content: {
    flex: "auto",
    padding: "1rem",
    overflow: "auto",
    minHeight: 0,
  },
});

function App() {
  const classes = useStyles();
  const { profile, setUserProfile } = useUserProfile();
  const {user, loading: userLoading} = useAuth();
  const tenant = useTenant();
  const { settings, loading: settingsLoading } = useSettings();
  
  // Theming
  const sysTheme = useSystemTheme();
  const computedTheme = useMemo(() => {
    if (!profile.theme || profile.theme === "system") {
      return sysTheme;
    }
    return profile.theme;
  }, [profile, sysTheme]);

  // i18n
  const { i18n } = useTranslation();
  useEffect(() => {
    if (profile.language && i18n.language !== profile.language) {
      i18n.changeLanguage(profile.language);
    }
  }, [profile, i18n]);

  return (
    <FluentProvider
      theme={computedTheme === "dark" ? webDarkTheme : webLightTheme}
    >
      <div className={classes.wrapper}>
        <Header
          settings={settings}
          tenant={tenant}
          profile={profile}
          setUserProfile={setUserProfile}
        />
        <div className={classes.content}>
          <Outlet
            context={{
              tenant: tenant,
              settings: settings,
              settingsLoading: settingsLoading,
              user: user,
              userLoading: userLoading
            }}
          />
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
