import React, { useEffect } from "react";
import "../styles/Header.css";
import MenuList from "@material-ui/core/MenuList";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuItem from "@material-ui/core/MenuItem";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Badge from "@material-ui/core/Badge";
import { Link } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ConfirmationNumberSharpIcon from "@material-ui/icons/ConfirmationNumberSharp";
import Menu from "./Menu";
import clsx from "clsx";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  menuButton: {
    width: "5%",
    margin: theme.spacing(1),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  popper: {
    display: "flex",
    position: "absolute",
    zIndex: 2,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  changePassword: {
    fontSize: "15px",
    position: "relative",
    right: "75px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  logout: {
    fontSize: "15px",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openLog, setOpenLog] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [countNotifications, setCountNotifications] = React.useState();

  const handleClose = async () => {
    const ready = await navigator.serviceWorker.ready;
    const subscription = await ready.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
    localStorage.removeItem("TAToken");
    localStorage.removeItem("TAUser");
    window.location.reload();
  };

  const notificationsTotalCount = async () => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (window.location.pathname !== "/lista-notificaciones") {
      const count = await fetch(
        "http://localhost:3001/notification/countNotifications",
        header);
      const countJson = await count.json();
      setCountNotifications(countJson.count);
    } else {
      setCountNotifications(0);
    }
  };

  const handleCountNotifications = () => {
    setCountNotifications(null);
  };

  useEffect(() => {
    notificationsTotalCount();
  }, []);

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
    }
  };

  function openLogMenu() {
    setOpenLog(true);
  };

  function closeLogMenu() {
    setOpenLog(false);
  };

  function handleDrawerOpen() {
    setDrawerOpen(true);
  };

  function handleDrawerClose() {
    setDrawerOpen(false);
  };

  return (
    <div>
      <header className="header">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(
            classes.menuButton,
            drawerOpen && classes.menuButtonHidden
          )}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !drawerOpen && classes.drawerPaperClose
            ),
          }}
          open={drawerOpen}
          onClose={handleDrawerClose}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <Menu close={handleDrawerClose} />
          <Divider />
        </Drawer>
        <div className="container-header-img">
          <Link to="/">
            <img
              className="header__img"
              id='logo-icon-principal'
              src="/logoComsistelco2.png"
              alt="Tickets"
            />
          </Link>
          <div className="circle-icon">
            <IconButton
              component={Link}
              to="/nueva-solicitud"
              className="icon-nueva-solicitud"
              aria-label="show 17 new notifications"
              color="inherit"
              title="Reportar solicitud"
              onClick={handleCountNotifications}
            >
              <ConfirmationNumberSharpIcon
                className="icon"
              />
              <p>Reportar solicitud</p>
            </IconButton>
            <IconButton
              component={Link}
              to="/lista-notificaciones"
              className="icon-notifications"
              title={`${countNotifications} notificaciones`}
              id="notificaciones"
              aria-label='ver notificaciones'
              color="inherit"
              onClick={handleCountNotifications}
            >
              <Badge badgeContent={countNotifications}>
                <NotificationsIcon
                  className="icon"
                />
              </Badge>
            </IconButton>
            <AccountCircle
              id="icon"
              className="icon"
              ref={anchorRef}
              aria-controls={openLog ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={openLogMenu}
            />
          </div>
          <Popper
            className={classes.popper}
            open={openLog}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={closeLogMenu}>
                    <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                      <MenuItem id="logout" onClick={handleClose}>
                        <PowerSettingsNewIcon className="logout-icon" />
                        cerrar sesión
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </header>
    </div>
  );
};

export default Header;
