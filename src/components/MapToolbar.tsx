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
import { useLocation, useNavigate } from "react-router";
import { User } from "../models/user";

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

export interface MapToolbarProps {
  onLocationPicked: (latLng: LatLngExpression) => void;
  user: User | undefined;
}

export default function MapToolbar(props: MapToolbarProps) {
  const classes = useStyles();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const map = useMap();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (toolbarRef.current) {
      L.DomEvent.disableClickPropagation(toolbarRef.current);
      L.DomEvent.disableScrollPropagation(toolbarRef.current);
    }
  }, [toolbarRef]);

  const [awaitingClick, setAwaitingClick] = useState(false);

  const addClicked = useCallback(() => {
    if (!props.user) {
      navigate("/login?returnTo=" + encodeURIComponent(location.pathname));
      return;
    }
    setAwaitingClick(true);
  }, [props, navigate, location]);

  useMapEvent("click", (e) => {
    if (awaitingClick) {
      props.onLocationPicked([e.latlng.lat, e.latlng.lng]);
      setAwaitingClick(false);
    }
  });

  useEffect(() => {
    map.getContainer().style.cursor = awaitingClick ? "pointer" : "";
    map.getContainer().style.boxShadow =
      awaitingClick ? "0 0 5px 5px " + tokens.colorBrandForeground1 : "none";
  }, [map, awaitingClick]);



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
