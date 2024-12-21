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
import { useCallback } from "react";

export interface AddEditTenantProps {
  tenant: Tenant;
  onClose: (edited?: Tenant | undefined) => void;
}

export default function AddEditTenant(props: AddEditTenantProps) {
  const { t } = useTranslation();

  const saveClicked = useCallback(async () => {
    // TODO
    props.onClose();
  }, [props]);


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
          <DialogContent>
            <form>
              asd
            </form>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => props.onClose()}>
              {t("ui.components.addEditTenant.cancel")}
            </Button>
            <Button appearance="primary" onClick={saveClicked}>
              {t("ui.components.addEditTenant.save")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
