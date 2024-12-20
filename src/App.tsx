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
  const { profile } = useUserProfile();
  const {user} = useAuth();

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
        <Header user={user} />
        <div className={classes.content}>
          <Outlet />
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
