import { Skeleton, SkeletonItem } from "@fluentui/react-components";
import { Navigate, useLocation, useOutletContext } from "react-router";
import { User } from "../models/user";
import { Tenant } from "../models/tenant";

export default function TenantAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant, user, userLoading, tenantLoading } = useOutletContext<{
    user?: User;
    tenant: Tenant;
    userLoading: boolean;
    tenantLoading: boolean;
  }>();
  const location = useLocation();

  if (userLoading || tenantLoading) {
    return (
      <Skeleton style={{gap: "1rem"}}>
        <SkeletonItem></SkeletonItem>
        <SkeletonItem></SkeletonItem>
        <SkeletonItem></SkeletonItem>
        <SkeletonItem></SkeletonItem>
        <SkeletonItem></SkeletonItem>
        <SkeletonItem></SkeletonItem>
      </Skeleton>
    );
  }
  if (!user || !user.email || !tenant.admins || tenant.admins.length === 0) {
    return (
      <Navigate
        to={"/login?returnUrl=" + encodeURIComponent(location.pathname)}
      />
    );
  }
  if (
    !tenant.admins
      .map((x) => x.toLowerCase())
      .includes(user.email.toLowerCase())
  ) {
    return (
      <Navigate
        to={"/login?returnUrl=" + encodeURIComponent(location.pathname)}
      />
    );
  }
  return <>{children}</>;
}
