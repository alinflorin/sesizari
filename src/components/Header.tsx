import {
  ArrowExitRegular,
  CheckmarkRegular,
  DarkThemeRegular,
  InfoRegular,
  LocalLanguageRegular,
  MoreVertical32Filled,
  PeopleSettingsRegular,
  PersonPasskeyRegular,
} from "@fluentui/react-icons";
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  Avatar,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../providers/i18n";
import useAuth from "../hooks/useAuth";
import { useCallback } from "react";
import { UserProfile } from "../models/user-profile";
import { useLocation, useNavigate } from "react-router";
import { Tenant } from "../models/tenant";
import { Settings } from "../models/settings";

const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];

export interface HeaderProps {
  profile: UserProfile;
  setUserProfile: (profile: UserProfile) => Promise<void>;
  tenant: Tenant | undefined;
  settings: Settings | undefined;
}

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  right: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: "32px",
    height: "32px",
    cursor: "pointer",
  },
});

export default function Header({
  profile,
  setUserProfile,
  tenant,
  settings
}: HeaderProps) {
  const classes = useStyles();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = useCallback(
    async (newLangCode: string) => {
      if (newLangCode === i18n.language) {
        return;
      }
      i18n.changeLanguage(newLangCode);
      await setUserProfile({ ...profile, language: newLangCode });
    },
    [profile, setUserProfile, i18n]
  );

  const changeTheme = useCallback(
    async (newTheme: "light" | "dark" | "system") => {
      if (newTheme === profile.theme) {
        return;
      }
      await setUserProfile({ ...profile, theme: newTheme });
    },
    [setUserProfile, profile]
  );

  const logoutClicked = useCallback(async () => {
    await logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <Toolbar className={classes.toolbar}>
      <div className={classes.left}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Image
              onClick={() => navigate("/")}
              src="/images/logo.svg"
              className={classes.logo}
            />
          </BreadcrumbItem>
          {tenant && (
            <>
              <BreadcrumbDivider />
              <BreadcrumbItem>
                <BreadcrumbButton
                  key={tenant.id}
                  onClick={() => navigate("/t/" + tenant.id)}
                >
                  {tenant.name}
                </BreadcrumbButton>
              </BreadcrumbItem>
            </>
          )}
        </Breadcrumb>
      </div>
      <div className={classes.right}>
        <ToolbarDivider />
        <Menu>
          <MenuTrigger>
            <ToolbarButton
              icon={
                user ? (
                  <Avatar
                    size={32}
                    image={{ src: user.photoURL }}
                    name={user.displayName}
                  />
                ) : (
                  <MoreVertical32Filled />
                )
              }
            />
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <Menu>
                <MenuTrigger>
                  <MenuItem icon={<LocalLanguageRegular />}>
                    {t("ui.components.header.language")}
                  </MenuItem>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    {supportedLanguages.map((l) => (
                      <MenuItem
                        onClick={
                          i18n.language.toLowerCase() === l.code.toLowerCase()
                            ? undefined
                            : () => changeLanguage(l.code)
                        }
                        icon={
                          i18n.language.toLowerCase() ===
                          l.code.toLowerCase() ? (
                            <CheckmarkRegular />
                          ) : (
                            <></>
                          )
                        }
                        key={l.code}
                      >
                        {l.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuPopover>
              </Menu>
              <Menu>
                <MenuTrigger>
                  <MenuItem icon={<DarkThemeRegular />}>
                    {t("ui.components.header.theme")}
                  </MenuItem>
                </MenuTrigger>
                <MenuPopover>
                  {themes.map((theme) => (
                    <MenuItem
                      onClick={() => changeTheme(theme)}
                      icon={
                        (profile.theme || "system") === theme ? (
                          <CheckmarkRegular />
                        ) : (
                          <></>
                        )
                      }
                      key={theme}
                    >
                      {t("ui.components.header." + theme)}
                    </MenuItem>
                  ))}
                </MenuPopover>
              </Menu>
              <MenuItem
                onClick={() => navigate("/about")}
                icon={<InfoRegular />}
              >
                {t("ui.components.header.about")}
              </MenuItem>
              {user &&
                settings &&
                settings.superAdmins.includes(user.email) && (
                  <MenuItem
                    onClick={() => navigate("/tenants-admin")}
                    icon={<PeopleSettingsRegular />}
                  >
                    {t("ui.components.header.tenantsAdmin")}
                  </MenuItem>
                )}
              {!user && (
                <MenuItem
                  onClick={() =>
                    navigate(
                      "/login?returnTo=" + encodeURIComponent(location.pathname)
                    )
                  }
                  icon={<PersonPasskeyRegular />}
                >
                  {t("ui.components.header.login")}
                </MenuItem>
              )}
              {user && (
                <MenuItem onClick={logoutClicked} icon={<ArrowExitRegular />}>
                  {t("ui.components.header.logout")}
                </MenuItem>
              )}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </Toolbar>
  );
}
