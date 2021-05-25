import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";

const Notifications = (props) => {
  const {recargar} = props
  const [notificaciones, setNotificaciones] = useState([]);
  const renderNotificaciones = async () => {
    const getNotificaciones = await fetch(
      "http://localhost:3001/notification/getNotifications",
      {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      }
    );
    const notificacionesJson = await getNotificaciones.json();
    return setNotificaciones(notificacionesJson.notificaciones);
  };
  useEffect(() => {
    renderNotificaciones();
  }, [recargar]);

  return (
    <IconButton
      className="icon-notifications"
      aria-label="show 17 new notifications"
      color="inherit"
    >
      <Badge badgeContent={notificaciones.length}>
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default Notifications;
