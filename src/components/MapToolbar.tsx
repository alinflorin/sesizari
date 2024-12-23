import {
  Caption1Strong,
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
} from "@fluentui/react-components";
import {
  AddRegular,
  BuildingRetailToolboxRegular,
} from "@fluentui/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { User } from "../models/user";
import { Tenant } from "../models/tenant";

const useStyles = makeStyles({
  toolbar: {
    position: "absolute",
    zIndex: 100000,
    right: "0.5rem",
    top: "0.5rem",
    gap: "0.5rem",
  },
  pickText: {
    background: tokens.colorNeutralBackground1,
    padding: "5px",
  },
});

export interface MapToolbarProps {
  onLocationPicked: (latLng: LatLngExpression) => void;
  user: User | undefined;
  tenant: Tenant;
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
      const location: LatLngExpression = [e.latlng.lat, e.latlng.lng];

      // check boundaries
      console.log(e);

      props.onLocationPicked(location);
      setAwaitingClick(false);
    }
  });

  useEffect(() => {
    map.getContainer().style.cursor = awaitingClick ? "pointer" : "";
    map.getContainer().style.boxShadow = awaitingClick
      ? "0 0 5px 5px " + tokens.colorBrandForeground1
      : "none";
  }, [map, awaitingClick]);

  const isTenantAdmin = useMemo(() => {
    if (!props.user?.email) {
      return false;
    }
    if (!props.tenant.admins || props.tenant.admins.length === 0) {
      return false;
    }
    return props.tenant.admins
      .map((x) => x.toLowerCase())
      .includes(props.user.email.toLowerCase());
  }, [props]);

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      {awaitingClick && (
        <Caption1Strong className={classes.pickText}>
          {t("ui.components.mapToolbar.pickLocation")}
        </Caption1Strong>
      )}
      {!awaitingClick && (
        <>
          <ToolbarButton
            appearance="primary"
            onClick={addClicked}
            icon={<AddRegular />}
          />

          {isTenantAdmin && (
            <ToolbarButton
              appearance="primary"
              onClick={() => navigate("./admin")}
              icon={<BuildingRetailToolboxRegular />}
            />
          )}
        </>
      )}
    </Toolbar>
  );
}
