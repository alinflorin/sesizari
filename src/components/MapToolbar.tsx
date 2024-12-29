import {
  Caption1Strong,
  makeStyles,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
  Toolbar,
  ToolbarButton,
} from "@fluentui/react-components";
import {
  BuildingRetailToolboxRegular,
  CursorProhibitedRegular,
  FilterRegular,
  LocationAddRegular,
} from "@fluentui/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { User } from "../models/user";
import { Tenant } from "../models/tenant";
import ComplaintsFilter from "./ComplaintsFilter";
import { GetComplaintsFilter } from "../models/get-complaints-filter";

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
  getComplaintsFilter: GetComplaintsFilter;
  defaultFilter: GetComplaintsFilter;
  onResetFilter: () => void;
  onGetComplaintsFilterChanged: (f: GetComplaintsFilter) => void;
}

export default function MapToolbar(props: MapToolbarProps) {
  const classes = useStyles();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const map = useMap();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [filterOpen, setFilterOpen] = useState(false);

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

      if (
        props.tenant.area &&
        !(e.originalEvent.target as HTMLElement).classList.contains(
          "leaflet-interactive"
        )
      ) {
        return;
      }

      props.onLocationPicked(location);
      setAwaitingClick(false);
    }
  });

  useEffect(() => {
    const polys = Array.from(
      map.getContainer().querySelectorAll(".leaflet-interactive")
    ) as HTMLElement[];
    const els: HTMLElement[] = props.tenant.area ? polys : [map.getContainer()];
    for (const el of els) {
      if (awaitingClick) {
        el.classList.add("cp");
      } else {
        el.classList.remove("cp");
      }
    }
  }, [map, awaitingClick, props]);

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

    const isFilterChanged = useMemo(() => {
      return (
        JSON.stringify(props.getComplaintsFilter) !== JSON.stringify(props.defaultFilter)
      );
    }, [props]);

  return (
    <>
      <Toolbar ref={toolbarRef} className={classes.toolbar}>
        {awaitingClick && (
          <>
            <Caption1Strong className={classes.pickText}>
              {t("ui.components.mapToolbar.pickLocation")}
            </Caption1Strong>
            <ToolbarButton
              appearance={undefined}
              onClick={() => setAwaitingClick(false)}
              icon={<CursorProhibitedRegular />}
            />
          </>
        )}
        {!awaitingClick && (
          <>
            <ToolbarButton
              appearance={undefined}
              onClick={addClicked}
              icon={<LocationAddRegular />}
            />

            <Popover
              open={filterOpen}
              onOpenChange={(_, d) => setFilterOpen(d.open)}
              withArrow
            >
              <PopoverTrigger>
                <ToolbarButton
                  appearance={isFilterChanged ? "primary" : undefined}
                  icon={<FilterRegular />}
                />
              </PopoverTrigger>
              <PopoverSurface>
                <ComplaintsFilter
                  allCategories={props.tenant.categories}
                  defaultFilter={props.defaultFilter}
                  onReset={() => {
                    props.onResetFilter();
                    setFilterOpen(false);
                  }}
                  filter={props.getComplaintsFilter}
                  onChange={(f) => {
                    props.onGetComplaintsFilterChanged(f);
                    setFilterOpen(false);
                  }}
                />
              </PopoverSurface>
            </Popover>

            {isTenantAdmin && (
              <ToolbarButton
                appearance={undefined}
                onClick={() => navigate("./admin")}
                icon={<BuildingRetailToolboxRegular />}
              />
            )}
          </>
        )}
      </Toolbar>
    </>
  );
}
