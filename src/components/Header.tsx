import {
  ArrowExitRegular,
  CheckmarkRegular,
  DarkThemeRegular,
  InfoRegular,
  LocalLanguageRegular,
  MoreVertical32Filled,
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
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../providers/i18n";
import useAuth from "../hooks/useAuth";
import { useCallback } from "react";
import { UserProfile } from "../models/user-profile";

const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];

export interface HeaderProps {
  profile: UserProfile;
  setUserProfile: (profile: UserProfile) => Promise<void>;
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
  logo: {
    width: "32px",
    height: "32px",
  },
});

export default function Header({ profile, setUserProfile }: HeaderProps) {
  const classes = useStyles();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

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

  const changeTheme = useCallback(async (newTheme: "light" | "dark" | "system") => {
    if (newTheme === profile.theme) {
      return;
    }
    await setUserProfile({ ...profile, theme: newTheme });
  }, [setUserProfile, profile]);

  return (
    <Toolbar className={classes.toolbar}>
      <Image src="/images/logo.svg" className={classes.logo} />
      <div className={classes.right}>
        <ToolbarDivider />
        <Menu>
          <MenuTrigger>
            <ToolbarButton
              icon={
                user ? (
                  <Avatar
                    size={32}
                    image={{ as: "img", src: user.photoURL }}
                    initials={user.initials}
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
              <MenuItem icon={<InfoRegular />}>
                {t("ui.components.header.about")}
              </MenuItem>
              {!user && (
                <MenuItem icon={<PersonPasskeyRegular />}>
                  {t("ui.components.header.login")}
                </MenuItem>
              )}
              {user && (
                <MenuItem icon={<ArrowExitRegular />}>
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
