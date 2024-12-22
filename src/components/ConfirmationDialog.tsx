import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export interface ConfirmationDialogProps {
  open: boolean;
  title: string | undefined;
  content: string | undefined;
  onYes: () => void;
  onNo: () => void;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      modalType="modal"
      open={props.open}
      onOpenChange={(_, d) => {
        if (!d.open && props.onNo) {
          props.onNo();
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            {props.title || t("ui.components.confirmationDialog.confirmation")}
          </DialogTitle>
          <DialogContent>
            {props.content || t("ui.components.confirmationDialog.areYouSure")}
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onNo} appearance="secondary">
              {t("ui.components.confirmationDialog.no")}
            </Button>
            <Button onClick={props.onYes} appearance="primary">
              {t("ui.components.confirmationDialog.yes")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
