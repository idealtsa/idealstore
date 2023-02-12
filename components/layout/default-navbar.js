import { Fragment, useEffect, useRef, useState } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StoreIcon from "@mui/icons-material/Store";
import { AccountPopover } from "./default-account-popover";
import { useSession } from "next-auth/react";
import InputBase from "@mui/material/InputBase";

const DefaultNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const navitems = [
  {
    href: "/dashboard/",
    icon: <BarChartIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/dashboard/customers",
    icon: <PeopleIcon fontSize="small" />,
    title: "Customers",
  },
  {
    href: "/dashboard/products",
    icon: <ShoppingBagIcon fontSize="small" />,
    title: "Products",
  },
];

export const DefaultNavbar = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      setLogin(false);
    },
  });
  const [isLogin, setLogin] = useState(status === "authenticated");
  useEffect(() => {
    setLogin(status === "authenticated");
  }, [status]);

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
              id="basic-button"
              sx={{
                display: {
                  xs: "inline-flex",
                  lg: "none",
                },
              }}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MenuIcon fontSize="small" />
            </IconButton>

            {lgUp ? (
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {navitems.map((item, i) => (
                  <MenuItem
                    key={`${i}-iii`}
                    sx={{ color: "text.primary" }}
                    onClick={handleClose}
                    href={item.href}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </Menu>
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
          {isLogin ? (
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
                src={session.user.image}
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
        isLogin={isLogin}
        onClose={() => setOpenAccountPopover(false)}
      />
    </Box>
  );
};

DefaultNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
