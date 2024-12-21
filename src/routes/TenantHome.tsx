import useTenant from "../hooks/useTenant";

export default function TenantHome() {
  const tenant = useTenant();

  return <>{tenant.name}</>;
}
