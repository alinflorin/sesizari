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
import { ConfirmationDialogProvider } from "./contexts/confirmation-dialog.provider";
import StaticStyles from "./styles/StaticStyles";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  content: {
    flex: "auto",
    padding: "0.5rem",
    overflow: "auto",
    minHeight: 0,
  },
});

function App() {
  const classes = useStyles();
  const { profile, setUserProfile } = useUserProfile();
  const { user, loading: userLoading } = useAuth();
  const { tenant, tenantLoading } = useTenant();
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
  const { i18n, t } = useTranslation();
  useEffect(() => {
    if (profile.language && i18n.language !== profile.language) {
      i18n.changeLanguage(profile.language);
    }
  }, [profile, i18n]);

  useEffect(() => {
    document.title = t("ui.title");
  }, [i18n.language, t]);

  return (
    <FluentProvider
      className={computedTheme === "dark" ? "dark-theme" : "light-theme"}
      theme={computedTheme === "dark" ? webDarkTheme : webLightTheme}
    >
      <ConfirmationDialogProvider>
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
                userLoading: userLoading,
                tenantLoading: tenantLoading
              }}
            />
          </div>
        </div>
        <StaticStyles />
      </ConfirmationDialogProvider>
    </FluentProvider>
  );
}

export default App;
