import EnhancedMarker from "./EnhancedMarker";
import { Complaint } from "../models/complaint";
import { Popup, useMap } from "react-leaflet";
import { Marker } from "leaflet";
import { Location24Filled } from "@fluentui/react-icons";
import {
  Caption2Strong,
  Caption2,
  makeStyles,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export interface ComplaintMarkerProps {
  complaint: Complaint;
  value100Vw: number;
  value100Vh: number;
}

const useStyles = makeStyles({
  popup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    minWidth: "20vw",
    maxWidth: "60vw",
  },
  popupRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "0.5rem"
  },
  taLeft: {
    textAlign: "left",
  },
  taRight: {
    textAlign: "right",
  }
});

export default function ComplaintMarker(props: ComplaintMarkerProps) {
  const map = useMap();
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <EnhancedMarker
      riseOnHover={true}
      eventHandlers={{
        click: (e) => {
          const marker: Marker = e.target;
          if (marker.isPopupOpen()) {
            map.flyTo(e.latlng);
          }
        },
      }}
      providedIcon={<Location24Filled />}
      position={[
        props.complaint.location.latitude,
        props.complaint.location.longitude,
      ]}
    >
      <Popup
        maxHeight={props.value100Vh * (60 / 100)}
        maxWidth={props.value100Vw * (60 / 100)}
        offset={[0, -12]}
      >
        <div className={classes.popup}>
          <div className={classes.popupRow}>
            <Caption2Strong className={classes.taRight}>
              {t("ui.components.complaintMarker.id")}:
            </Caption2Strong>
            <Caption2 className={classes.taLeft}>{props.complaint.id}</Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong className={classes.taRight}>
              {t("ui.components.complaintMarker.category")}:
            </Caption2Strong>
            <Caption2 className={classes.taLeft}>
              {props.complaint.category}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong className={classes.taRight}>
              {t("ui.components.complaintMarker.description")}:
            </Caption2Strong>
            <Caption2 className={classes.taLeft}>
              {props.complaint.description}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong className={classes.taRight}>
              {t("ui.components.complaintMarker.status")}:
            </Caption2Strong>
            <Caption2 className={classes.taLeft}>
              {t(
                "ui.components.complaintMarker.statuses." +
                  props.complaint.status
              )}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong className={classes.taRight}>
              {t("ui.components.complaintMarker.submittedAt")}:
            </Caption2Strong>
            <Caption2 className={classes.taLeft}>
              {props.complaint.submissionDate?.toDate().toLocaleString() || "-"}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong className={classes.taRight}>
              {t("ui.components.complaintMarker.lastUpdateAt")}:
            </Caption2Strong>
            <Caption2 className={classes.taLeft}>
              {props.complaint.lastUpdateAt?.toDate().toLocaleString() || "-"}
            </Caption2>
          </div>
        </div>
      </Popup>
    </EnhancedMarker>
  );
}
