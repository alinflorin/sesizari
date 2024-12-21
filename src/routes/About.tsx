import { Title1 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export default function About() {
  const {t} = useTranslation();
  return <div>
    <Title1>{t("ui.routes.about.about")}</Title1>
  </div>
}