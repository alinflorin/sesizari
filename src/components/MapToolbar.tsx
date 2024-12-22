import { makeStyles, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useMap } from "react-leaflet";

const useStyles = makeStyles({
  toolbar: {
    position: "absolute",
    zIndex: 100000,
    right: "1rem",
    top: "1rem",
  },
});

export default function MapToolbar() {
  const classes = useStyles();
  const map = useMap();
  
  console.log(map);
  
  return <Toolbar className={classes.toolbar}>
    <ToolbarButton icon={<AddRegular />} appearance="primary" />
  </Toolbar>
}