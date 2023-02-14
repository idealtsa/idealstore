import { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StoreIcon from "@mui/icons-material/Store";
import { AccountPopover } from "./default-account-popover";
import { useSession } from "next-auth/react";
import InputBase from "@mui/material/InputBase";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
const DefaultNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const navitems = [
  {
    href: "/",
    icon: <HomeIcon fontSize="small" />,
    title: "Home",
  },
  {
    href: "/dashboard",
    icon: <BarChartIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/products",
    icon: <ShoppingBagIcon fontSize="small" />,
    title: "Products",
  },
];

export const DefaultNavbar = () => {
  const { data: session, status } = useSession();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const router = useRouter();
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 280 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary={"IDEAL STORE"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {navitems.map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                onClick={() => router.push(item.href)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.down("lg"), {
    defaultMatches: true,
    noSsr: false,
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);

  return (
    <Box>
      <DefaultNavbarRoot sx={{}}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <Box
            color="text.primary"
            sx={{
              display: "inline-flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{
                display: {
                  xs: "inline-flex",
                  lg: "none",
                },
              }}
              onClick={toggleDrawer("left", true)}
            >
              <MenuIcon fontSize="small" />
            </IconButton>

            {lgUp ? (
              <Drawer
                anchor={"left"}
                open={state["left"]}
                onClose={toggleDrawer("left", false)}
              >
                {list("left")}
              </Drawer>
            ) : (
              <Fragment>
                <StoreIcon sx={{ mr: 1 }} />
                <Typography sx={{ flexGrow: 1 }}> IDEAL STORE</Typography>
                <Box sx={{ paddingLeft: 2 }}>
                  {navitems.map((item, i) => (
                    <Button
                      key={`item-${i}`}
                      sx={{ color: "text.primary" }}
                      href={item.href}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Box>
              </Fragment>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Search">
            <Box>
              {" "}
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search "
                inputProps={{ "aria-label": "search product" }}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Box>
          </Tooltip>
          {session && true ? (
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Tooltip title="Mail">
                <IconButton sx={{ ml: 1 }}>
                  <Badge badgeContent={4} color="error">
                    <EmailIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton sx={{ ml: 1 }}>
                  <Badge badgeContent={5} color="error">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Avatar
                onClick={() => setOpenAccountPopover(true)}
                ref={settingsRef}
                sx={{
                  cursor: "pointer",
                  height: 40,
                  width: 40,
                  ml: 1,
                }}
                src={session?.user.image}
              >
                <PeopleIcon fontSize="small" />
              </Avatar>
            </Box>
          ) : (
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Avatar
                onClick={() => setOpenAccountPopover(true)}
                ref={settingsRef}
                sx={{
                  cursor: "pointer",
                  height: 40,
                  width: 40,
                  ml: 1,
                }}
              >
                <PersonIcon fontSize="small" />
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </DefaultNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        user={session?.user}
        isLogin={session && true}
        onClose={() => setOpenAccountPopover(false)}
      />
    </Box>
  );
};

DefaultNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
