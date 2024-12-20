import { Outlet } from "react-router";
import Header from "./components/Header";
import {
  FluentProvider,
  makeStyles,
  webDarkTheme,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
});

function App() {
  const classes = useStyles();

  return (
    <FluentProvider theme={webDarkTheme} className={classes.wrapper}>
      <Header />
      <div>
        <Outlet />
      </div>
    </FluentProvider>
  );
}

export default App;
