import { Skeleton, SkeletonItem } from "@fluentui/react-components";
import { Navigate, useLocation, useOutletContext } from "react-router";
import { Settings } from "../models/settings";
import { User } from "../models/user";

export default function SuperAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, settingsLoading, user, userLoading } = useOutletContext<{
    settings?: Settings;
    settingsLoading: boolean;
    user?: User;
    userLoading: boolean;
  }>();
  const location = useLocation();

  if (settingsLoading || userLoading) {
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
  if (!settings || !user || !user.email) {
    return (
      <Navigate
        to={"/login?returnUrl=" + encodeURIComponent(location.pathname)}
      />
    );
  }
  if (!settings.superAdmins.includes(user.email)) {
    return (
      <Navigate
        to={"/login?returnUrl=" + encodeURIComponent(location.pathname)}
      />
    );
  }
  return <>{children}</>;
}
