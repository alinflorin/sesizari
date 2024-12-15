import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { MoreVert } from "@mui/icons-material";
import { useRef, useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);

  const { user, logout } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          onClick={() => navigate("/")}
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
        >
          Sesizari
        </Typography>
        <IconButton
          ref={menuButton}
          color="default"
          onClick={() => setMenuOpen(true)}
        >
          {user ? (
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={user.photoURL || undefined}
            >
              {user.displayName
                ?.split(" ")
                .map((x) => x[0].toUpperCase())
                .join("")}
            </Avatar>
          ) : (
            <MoreVert sx={{ width: 32, height: 32 }} />
          )}
        </IconButton>
        <Menu
          onClose={() => setMenuOpen(false)}
          anchorEl={menuButton.current}
          open={menuOpen}
        >
          <MenuItem
            onClick={() => {
              navigate("/about");
              setMenuOpen(false);
            }}
          >
            About
          </MenuItem>

          {!user && (
            <MenuItem
              onClick={() => {
                navigate(
                  "/login?returnTo=" + encodeURIComponent(location.pathname)
                );
                setMenuOpen(false);
              }}
            >
              Login
            </MenuItem>
          )}
          {user && (
            <MenuItem
              onClick={async () => {
                await logout();
                setMenuOpen(false);
                navigate("/");
              }}
            >
              Logout
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
