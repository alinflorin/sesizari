import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export interface ComplaintSentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ComplaintSent(props: ComplaintSentProps) {
  const { t } = useTranslation();
  return (
    <Dialog
      modalType="alert"
      open={props.open}
      onOpenChange={(_, d) => {
        props.onOpenChange(d.open);
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{t("ui.components.complaintSent.success")}</DialogTitle>
          <DialogContent>
            {t("ui.components.complaintSent.complaintSubmitted")}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">
                {t("ui.components.complaintSent.close")}
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
