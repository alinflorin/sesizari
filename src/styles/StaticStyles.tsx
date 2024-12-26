import { makeStaticStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStaticStyles({
  ".leaflet-popup-content-wrapper": {
    background: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  ".leaflet-popup-tip": {
    background: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  ".leaflet-popup-close-button": {
    color: tokens.colorNeutralForeground1,
  },
  ".leaflet-popup-close-button span": {
    color: tokens.colorNeutralForeground1,
  },
  ".leaflet-bar a": {
    background: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  ".leaflet-bar a:hover": {
    color: tokens.colorNeutralForeground1,
    background: tokens.colorNeutralBackground1Hover,
  },
  ".leaflet-bar a:focus": {
    color: tokens.colorNeutralForeground1,
    background: tokens.colorNeutralBackground1Hover,
  },
  ".leaflet-bar a.leaflet-disabled": {
    color: tokens.colorNeutralForeground1,
    background: tokens.colorNeutralBackground1Pressed,
  },
});

export default function StaticStyles() {
  useStyles();
  return null;
}