import { useOutletContext } from "react-router";
import { Tenant } from "../models/tenant";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles,
} from "@fluentui/react-components";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import MapToolbar from "../components/MapToolbar";
import { useCallback, useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import AddComplaint from "../components/AddComplaint";
import { Complaint } from "../models/complaint";
import { User } from "../models/user";
import { useTranslation } from "react-i18next";
import useComplaints from "../hooks/useComplaints";
import ComplaintMarker from "../components/ComplaintMarker";
import useViewportWidth from "../hooks/useViewportWidth";
import useViewportHeight from "../hooks/useViewportHeight";
import { GetComplaintsFilter } from "../models/get-complaints-filter";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default function TenantHome() {
  const classes = useStyles();
  const tenant = useOutletContext<{ tenant: Tenant | undefined }>()?.tenant;
  const user = useOutletContext<{ user: User | undefined }>()?.user;
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const { getComplaints } = useComplaints();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const [getComplaintsFilter, setGetComplaintsFilter] =
    useState<GetComplaintsFilter>({
      startDate: twoWeeksAgo,
      categories: [],
      statuses: [
        "accepted",
        "answer-sent",
        "in-planning",
        "in-progress",
        "solved",
      ],
    });
    
  useEffect(() => {
    (async () => {
      const complaintList = await getComplaints(getComplaintsFilter);
      setComplaints(complaintList);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getComplaintsFilter]);

  const [pickedLocation, setPickedLocation] = useState<
    LatLngExpression | undefined
  >();

  const locationPicked = useCallback((latLng: LatLngExpression) => {
    setPickedLocation(latLng);
  }, []);

  const onAddComplaintClosed = useCallback(
    (complaint?: Complaint | undefined) => {
      setPickedLocation(undefined);
      if (complaint) {
        setShowSuccess(true);
      }
    },
    []
  );

  const value100Vw = useViewportWidth(100);
  const value100Vh = useViewportHeight(100);

  return (
    <>
      <div className={classes.container}>
        {tenant && (
          <MapContainer
            attributionControl={false}
            className={classes.map}
            center={[tenant.mapCenter.latitude, tenant.mapCenter.longitude]}
            scrollWheelZoom={true}
            bounceAtZoomLimits={true}
            zoom={13}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {tenant.area && (
              <GeoJSON data={JSON.parse(tenant.area)} interactive={true} />
            )}
            <MapToolbar
              tenant={tenant}
              user={user}
              onLocationPicked={locationPicked}
              getComplaintsFilter={getComplaintsFilter}
              onGetComplaintsFilterChanged={(f) => setGetComplaintsFilter(f)}
            />
            {complaints.map((c) => (
              <ComplaintMarker
                value100Vw={value100Vw}
                value100Vh={value100Vh}
                key={c.id}
                complaint={c}
              />
            ))}
          </MapContainer>
        )}
      </div>
      {pickedLocation && user && tenant && (
        <AddComplaint
          tenant={tenant}
          user={user}
          location={pickedLocation}
          onClose={onAddComplaintClosed}
        />
      )}
      <Dialog
        modalType="alert"
        open={showSuccess}
        onOpenChange={(_, d) => {
          setShowSuccess(d.open);
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t("ui.routes.tenantHome.success")}</DialogTitle>
            <DialogContent>
              {t("ui.routes.tenantHome.complaintSubmitted")}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">
                  {t("ui.routes.tenantHome.close")}
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
