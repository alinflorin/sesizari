import {
  MoreVertical32Filled,
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
  Avatar,
  Image,
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
  logo: {
    width: "32px",
    height: "32px"
  }
});

export default function Header({ user }: HeaderProps) {
  const classes = useStyles();
  console.log(user);

  return (
    <Toolbar className={classes.toolbar}>
      <Image src="/images/logo.svg" className={classes.logo} />
      <div className={classes.right}>
        <ToolbarDivider />
        <Menu>
          <MenuTrigger>
            <ToolbarButton icon={user ? <Avatar size={32} initials={user.displayName} /> : <MoreVertical32Filled />} />
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
