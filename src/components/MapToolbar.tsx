import { makeStyles, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const useStyles = makeStyles({
  toolbar: {
    position: "absolute",
    zIndex: 100000,
    right: "0.5rem",
    top: "0.5rem",
  },
});

export default function MapToolbar() {
  const classes = useStyles();
  const map = useMap();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (toolbarRef.current) {
      L.DomEvent.disableClickPropagation(toolbarRef.current);
      L.DomEvent.disableScrollPropagation(toolbarRef.current);
    }
  }, [toolbarRef]);

  console.log(map);
  
  return <Toolbar ref={toolbarRef} className={classes.toolbar}>
    <ToolbarButton icon={<AddRegular />} appearance="primary" />
  </Toolbar>
}