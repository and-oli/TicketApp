import "../styles/ListaDeNotificaciones.css";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect } from "react";

function ListaDeNotificaciones() {
  const [notificaciones, setNotificaciones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
    const notificacionesTodas = notificacionesJson.notificaciones;
    setLoading(false);
    setNotificaciones(notificacionesTodas);
  }

  useEffect(() => {
    renderNotificaciones();
  }, []);

  const renderizarNotificaciones = () => {
    const mapNotificaciones = notificaciones.map((noti, i) => (
        <Paper
          component={Link}
          to={noti.url}
          elevation={5}
          key={i}
          className="paper-notificaciones"
        >
          <div className="notificacion-icon">
            <img
              alt="icono"
              src="/iconComsistelco512.png"
            />
          </div>
          <div className="contenido">
            <h5>{noti.title}</h5>
            <p>{noti.text}</p>
          </div>
        </Paper>
      )
    );
    if(mapNotificaciones.length) {
      return mapNotificaciones
    } else {
      return <h4>No hay notificaciones</h4>
    }
  };
  return (
    <div className="container-notificaciones-padre">
      <div className="title-paper-notificaciones">
        <p>Notificaciones</p>
      </div>
      <span className="container-notificaciones">
        {loading ? (
          <CircularProgress
            color="inherit"
            className="icon-enviar"
            disableShrink
          />
        ) : (
          renderizarNotificaciones()
        )}
      </span>
    </div>
  );
}

export default ListaDeNotificaciones;
