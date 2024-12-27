import { useTranslation } from "react-i18next";
import useComplaints from "../hooks/useComplaints";
import { useOutletContext } from "react-router";
import { Tenant } from "../models/tenant";
import { useEffect, useState } from "react";
import { Complaint } from "../models/complaint";

export default function TenantAdmin() {
  const { t } = useTranslation();
  const { getComplaintsForAdmin } = useComplaints();
  const { tenant } = useOutletContext<{
    tenant: Tenant | undefined;
  }>();
  const [complaints, setComplaints] = useState<Complaint[] | undefined>();
  const [tenantId, setTenantId] = useState<string | undefined>();

  useEffect(() => {
    if (!tenant || tenantId) {
      return;
    }
    setTenantId(tenant.id!);
  }, [tenant, tenantId]);

  useEffect(() => {
    if (!tenantId) {
      return;
    }
    (async () => {
      console.log(1);
      const result = await getComplaintsForAdmin(tenantId);
      setComplaints(result.data);
    })();
  }, [tenantId, getComplaintsForAdmin]);



  return (
    <>
      <div>{complaints?.length}</div>
      <div>{t("asd")}</div>
    </>
  );
}
