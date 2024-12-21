import {
  Body1,
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  makeStyles,
  Title1,
  tokens,
} from "@fluentui/react-components";
import useTenants from "../hooks/useTenants";
import { useTranslation } from "react-i18next";
import {
  Add32Regular,
  DeleteRegular,
  EditRegular,
} from "@fluentui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { Tenant } from "../models/tenant";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import AddEditTenant from "../components/AddEditTenant";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
  },
  add: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
});

export default function TenantsAdmin() {
  const { tenants: tenantsFirestore, deleteTenant } = useTenants();
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const [editedTenant, setEditedTenant] = useState<Tenant | undefined>();

  useEffect(() => {
    if (!tenantsFirestore) {
      return;
    }
    setTenants([...tenantsFirestore]);
  }, [tenantsFirestore]);

  const classes = useStyles();
  const { t } = useTranslation();
  const { showDialog } = useConfirmationDialog();

  const deleteTenantClicked = useCallback(
    async (tenant: Tenant, index: number) => {
      const allow = await showDialog();
      if (!allow) {
        return;
      }
      await deleteTenant(tenant.id!);
      tenants.splice(index, 1);
      setTenants([...tenants]);
    },
    [tenants, showDialog, deleteTenant]
  );

  return (
    <>
      <div className={classes.container}>
        <Title1>{t("ui.routes.tenantsAdmin.tenantsAdmin")}</Title1>
        <div className={classes.grid}>
          {tenants?.map((tenant, i) => (
            <Card key={tenant.id}>
              <CardHeader
                header={
                  <Body1>
                    <b>{tenant.name}</b>
                  </Body1>
                }
                description={<Caption1>{tenant.id}</Caption1>}
              />
              <CardFooter>
                <Button
                  onClick={() => setEditedTenant(tenant)}
                  icon={<EditRegular fontSize={16} />}
                >
                  {t("ui.routes.tenantsAdmin.edit")}
                </Button>
                <Button
                  onClick={() => deleteTenantClicked(tenant, i)}
                  icon={
                    <DeleteRegular
                      color={tokens.colorPaletteRedForeground1}
                      fontSize={16}
                    />
                  }
                >
                  {t("ui.routes.tenantsAdmin.delete")}
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Card onClick={() => setEditedTenant({admins: [], name: ""})} className={classes.add}>
            <Add32Regular />
          </Card>
        </div>
      </div>
      {editedTenant && (
        <AddEditTenant
          onClose={() => setEditedTenant(undefined)}
          tenant={editedTenant}
        />
      )}
    </>
  );
}
