import { Outlet } from "react-router";
import Header from "./components/Header";
import {
  FluentProvider,
  makeStyles,
  webDarkTheme,
} from "@fluentui/react-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "./providers/firebase";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  content: {
    flex: "auto",
    padding: "1rem",
    overflow: "auto",
    minHeight: 0,
  },
});

function App() {
  const classes = useStyles();

  const [user, authLoaded ] = useAuthState(firebaseAuth);

  return (
    <FluentProvider theme={webDarkTheme} className={classes.wrapper}>
      <Header />
      <div className={classes.content}>
        <Outlet />
      </div>
    </FluentProvider>
  );
}

export default App;
