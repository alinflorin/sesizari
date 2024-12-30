import EnhancedMarker from "./EnhancedMarker";
import { Complaint } from "../models/complaint";
import { Popup, useMap } from "react-leaflet";
import { Marker } from "leaflet";
import { Location24Filled } from "@fluentui/react-icons";
import {
  Caption2Strong,
  Caption2,
  makeStyles,
  Button,
  PresenceBadge,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { stringToHexColor } from "../helpers/color-helpers";
import { useMemo } from "react";

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
    gap: "0.5rem",
  }
});

export default function ComplaintMarker(props: ComplaintMarkerProps) {
  const map = useMap();
  const classes = useStyles();
  const { t } = useTranslation();

  const complaintDone = useMemo(() => {
    return (
      props.complaint.status === "answer-sent" ||
      props.complaint.status === "solved"
    );
  }, [props]);

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
      providedIcon={
        <Button
          style={{
            position: "relative",
            width: "24px",
            minWidth: "24px",
            height: "24px",
            minHeight: "24px",
          }}
          appearance="transparent"
          icon={
            <Location24Filled
              color={stringToHexColor(props.complaint.category)}
            />
          }
        >
          {complaintDone && (
            <PresenceBadge
              style={{
                position: "absolute",
                bottom: "0px",
                right: "4px",
              }}
              status="available"
              size="extra-small"
            />
          )}
        </Button>
      }
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
            <Caption2Strong>
              {t("ui.components.complaintMarker.id")}:
            </Caption2Strong>
            <Caption2>{props.complaint.id}</Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong>
              {t("ui.components.complaintMarker.category")}:
            </Caption2Strong>
            <Caption2>
              {props.complaint.category}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong>
              {t("ui.components.complaintMarker.description")}:
            </Caption2Strong>
            <Caption2>
              {props.complaint.description}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong>
              {t("ui.components.complaintMarker.status")}:
            </Caption2Strong>
            <Caption2>
              {t(
                "ui.components.complaintMarker.statuses." +
                  props.complaint.status
              )}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong>
              {t("ui.components.complaintMarker.submittedAt")}:
            </Caption2Strong>
            <Caption2>
              {props.complaint.submissionDate?.toDate().toLocaleString() || "-"}
            </Caption2>
          </div>
          <div className={classes.popupRow}>
            <Caption2Strong>
              {t("ui.components.complaintMarker.lastUpdateAt")}:
            </Caption2Strong>
            <Caption2>
              {props.complaint.lastUpdateAt?.toDate().toLocaleString() || "-"}
            </Caption2>
          </div>
        </div>
      </Popup>
    </EnhancedMarker>
  );
}
