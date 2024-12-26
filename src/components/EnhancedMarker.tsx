import React, { useState, useId, useMemo } from "react";
import { createPortal } from "react-dom";
import { Marker, MarkerProps } from "react-leaflet";
import L from "leaflet";

export type EnhancedMarkerProps = MarkerProps & {
  providedIcon: React.ReactNode;
};

// `EnhancedMarker` has the same API as `Marker`, apart from the `icon` can be a React component.
export const EnhancedMarker = ({
  eventHandlers,
  providedIcon,
  ...otherProps
}: EnhancedMarkerProps) => {
  const [markerRendered, setMarkerRendered] = useState(false);
  const id = "marker-" + useId();

  const icon = useMemo(
    () =>
      L.divIcon({
        html: `<div style="width: 24px; height: 24px;" id="${id}"></div>`,
        iconSize: [24, 24],
        className: "mt-m-22",
      }),
    [id]
  );

  return (
    <>
      <Marker
        {...otherProps}
        eventHandlers={{
          ...eventHandlers,
          add: (...args) => {
            setMarkerRendered(true);
            if (eventHandlers?.add) eventHandlers.add(...args);
          },
          remove: (...args) => {
            setMarkerRendered(false);
            if (eventHandlers?.remove) eventHandlers.remove(...args);
          },
        }}
        icon={icon}
      />
      {markerRendered &&
        createPortal(providedIcon, document.getElementById(id)!)}
    </>
  );
};

export default EnhancedMarker;
