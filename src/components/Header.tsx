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
import useUserProfile from "../hooks/useUserProfile";

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

export default function Header() {
  const classes = useStyles();
  const { user } = useAuth();
  const { profile, setUserProfile } = useUserProfile();
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback((newLangCode: string) => {
    if (newLangCode === i18n.language) {
      return;
    }
    setUserProfile({...profile, language: newLangCode});
  }, [profile, setUserProfile, i18n]);

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
                        onClick={i18n.language.toLowerCase() ===
                          l.code.toLowerCase() ? undefined : () => changeLanguage(l.code)}
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
              <MenuItem icon={<DarkThemeRegular />}>
                {t("ui.components.header.theme")}
              </MenuItem>
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
