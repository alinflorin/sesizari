import { useNavigate } from "react-router";
import useTenants from "../hooks/useTenants";
import { Card, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  },
  card: {
    cursor: "pointer"
  }
});

export default function Home() {
  const {tenants} = useTenants();
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      {tenants &&
        tenants.map((tenant) => (
          <Card onClick={() => navigate("/t/" + tenant.id)} key={tenant.id} className={classes.card}>
            <p>{tenant.name}</p>
          </Card>
        ))}
    </div>
  );
}
