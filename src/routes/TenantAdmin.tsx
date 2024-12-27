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
  const [loaded, setLoaded] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[] | undefined>();

  useEffect(() => {
    if (!tenant || loaded) {
      return;
    }
    (async () => {
      const result = await getComplaintsForAdmin(tenant.id!);
      setComplaints(result);
      console.log(result);
    })();
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant, loaded]);

  return (
    <>
      <div>{complaints?.length}</div>
      <div>{t("asd")}</div>
    </>
  );
}
