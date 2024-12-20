import {
  MoreVertical32Filled,
  PersonWarning32Regular,
} from "@fluentui/react-icons";
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
} from "@fluentui/react-components";
import { User } from "../models/user";

export interface HeaderProps {
  user: User | undefined;
}

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  right: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default function Header({ user }: HeaderProps) {
  const classes = useStyles();
  console.log(user);

  return (
    <Toolbar className={classes.toolbar}>
      <PersonWarning32Regular />
      <div className={classes.right}>
        <ToolbarDivider />
        <Menu>
          <MenuTrigger>
            <ToolbarButton icon={<MoreVertical32Filled />} />
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem>New </MenuItem>
              <MenuItem>New Window</MenuItem>
              <MenuItem disabled>Open File</MenuItem>
              <MenuItem>Open Folder</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </Toolbar>
  );
}
