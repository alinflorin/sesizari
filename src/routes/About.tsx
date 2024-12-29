import { makeStyles, Title1 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
});

export default function About() {
  const {t} = useTranslation();
  const classes = useStyles();

  return <div className={classes.container}>
    <Title1>{t("ui.routes.about.about")}</Title1>
  </div>
}