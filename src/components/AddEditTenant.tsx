import { useTranslation } from "react-i18next";
import { Tenant } from "../models/tenant";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";

export interface AddEditTenantProps {
  tenant: Tenant;
  onClose: () => void;
}

export default function AddEditTenant(props: AddEditTenantProps) {
  const { t } = useTranslation();
  return (
    <Dialog
      modalType="non-modal"
      defaultOpen
      onOpenChange={(_, d) => {
        if (!d.open && props.onClose) {
          props.onClose();
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            {props.tenant.id
              ? t("ui.components.addEditTenant.editTenant")
              : t("ui.components.addEditTenant.addTenant")}
          </DialogTitle>
          <DialogContent>asdasd</DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={props.onClose}>
              {t("ui.components.addEditTenant.cancel")}
            </Button>
            <Button appearance="primary">
              {t("ui.components.addEditTenant.save")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
