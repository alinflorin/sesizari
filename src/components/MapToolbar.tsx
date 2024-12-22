import {
  Caption1Strong,
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
} from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

const useStyles = makeStyles({
  toolbar: {
    position: "absolute",
    zIndex: 100000,
    right: "0.5rem",
    top: "0.5rem",
    gap: "0.5rem",
  },
  pickText: {
    background: tokens.colorNeutralBackgroundStatic,
    padding: "5px",
  },
});

export default function MapToolbar() {
  const classes = useStyles();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const map = useMap();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!user) {
      navigate("/login?returnTo=" + encodeURIComponent(location.pathname));
      return;
    }
    setClickedLocation(undefined);
    setAwaitingClick(true);
  }, [user, navigate, location]);

  useMapEvent("click", (e) => {
    if (awaitingClick) {
      setClickedLocation([e.latlng.lat, e.latlng.lng]);
      setAwaitingClick(false);
    }
  });

  useEffect(() => {
    console.log(map);
    map.getContainer().style.cursor = awaitingClick ? "pointer" : "";
  }, [map, awaitingClick]);

  console.log("xxx" + clickedLocation);

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      {awaitingClick && (
        <Caption1Strong className={classes.pickText}>
          {t("ui.components.mapToolbar.pickLocation")}
        </Caption1Strong>
      )}
      {!awaitingClick && (
        <ToolbarButton
          onClick={addClicked}
          icon={<AddRegular />}
          appearance="primary"
        />
      )}
    </Toolbar>
  );
}
