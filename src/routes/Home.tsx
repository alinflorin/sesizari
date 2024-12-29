import { useNavigate } from "react-router";
import useTenants from "../hooks/useTenants";
import { Body1, Caption1, Card, CardHeader, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
    padding: "0.5rem",
  },
  card: {
    cursor: "pointer",
  },
});

export default function Home() {
  const { tenants } = useTenants();
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      {tenants &&
        tenants.map((tenant) => (
          <Card
            onClick={() => navigate("/t/" + tenant.id)}
            key={tenant.id}
            className={classes.card}
          >
            <CardHeader
              header={
                <Body1>
                  <b>{tenant.name}</b>
                </Body1>
              }
              description={<Caption1>{tenant.id}</Caption1>}
            />
          </Card>
        ))}
    </div>
  );
}
