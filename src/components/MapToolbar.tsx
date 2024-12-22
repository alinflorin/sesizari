import { makeStyles, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMapEvent } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

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
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (toolbarRef.current) {
      L.DomEvent.disableClickPropagation(toolbarRef.current);
      L.DomEvent.disableScrollPropagation(toolbarRef.current);
    }
  }, [toolbarRef]);

  const [awaitingClick, setAwaitingClick] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<
    LatLngExpression | undefined
  >();

  const addClicked = useCallback(() => {
    setClickedLocation(undefined);
    setAwaitingClick(true);
  }, []);

  useMapEvent("click", (e) => {
    if (awaitingClick) {
      setClickedLocation([e.latlng.lat, e.latlng.lng]);
      setAwaitingClick(false);
    }
  });

  console.log("xxx" + clickedLocation);

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      <ToolbarButton
        onClick={addClicked}
        icon={<AddRegular />}
        appearance="primary"
      />
    </Toolbar>
  );
}
