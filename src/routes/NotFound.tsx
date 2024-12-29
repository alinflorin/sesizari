import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "0.5rem",
  },
});
export default function NotFound() {
  const classes = useStyles();
  return <div className={classes.container}>404</div>;
}
