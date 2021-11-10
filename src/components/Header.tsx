import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useUser } from "../context/AuthContext";
import { Button, Tooltip } from "@mui/material";
import Auth from "@aws-amplify/auth";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Add } from "@mui/icons-material";

export default function Header() {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await Auth.signOut();
  };

  const handleLoginClick = () => {
    router.push("/signin");
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <NextLink href="/" passHref>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Reddit Clone
            </Typography>
          </NextLink>
          {user ? (
            <div>
              <NextLink href="/create" passHref>
                <Tooltip title="Create post">
                  <IconButton size="large" aria-label="Add new post" color="inherit">
                    <Add />
                  </IconButton>
                </Tooltip>
              </NextLink>

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose && handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Box>
              <Button variant="contained" sx={{ margin: "auto 1rem" }} onClick={handleLoginClick}>
                Login
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleSignupClick}>
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
