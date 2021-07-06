import "../styles/ListaDeNotificaciones.css";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from '@material-ui/core/Checkbox';
import React, { useEffect } from "react";
import DeleteIcon from '@material-ui/icons/Delete';

function ListaDeNotificaciones() {
  const [notificaciones, setNotificaciones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [eliminar, setEliminar] = React.useState(true);
  const [listaNotificacionesAEliminar, setListaNotificacionesAEliminar] = React.useState([])

  const renderNotificaciones = async () => {
    const getNotificaciones = await fetch(
      "http://192.168.0.11:3001/notification/getNotifications",
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

  const deleteClick = () => {
    setEliminar(!eliminar)
  }

  const handelClickDelete = async () => {
  const data = {
  lista: listaNotificacionesAEliminar
  } 
    const header = {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
    const notificacionesEliminadasFetch = await fetch('http://192.168.0.11:3001/notification/eliminarNotificaciones', header);
    const notificacionesEliminadasJson = await notificacionesEliminadasFetch;
    if (notificacionesEliminadasJson.ok) {
      window.location.reload();
    }
  }

  const checkboxChange = (event) => {
    const notificacionesParaEliminar = event.target.value;
    setListaNotificacionesAEliminar((prevState) => 
    [...prevState, notificacionesParaEliminar]);
  }

  useEffect(() => {
    renderNotificaciones();
  }, []);

  const renderizarNotificaciones = () => {
    const mapNotificaciones = notificaciones.map((noti, i) => (
      <Paper
        component={eliminar ? Link : 'div'}
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
        <Checkbox
          onChange = {checkboxChange}
          color ="default"
          value = {noti._id}
          style={eliminar ? { display: 'none' } : null}
          className='checkbox-notificacion'
          inputProps={{ 'aria-label': 'checkbox with default color' }}
        />
      </Paper>
    )
    );
    if (mapNotificaciones.length) {
      return (
        <div className='container-notificaciones-padre'>
          <div className='eliminar-notificacion'>
            <DeleteIcon
              onClick={deleteClick}
            />
            <p 
            style={eliminar ? { display: 'none' } : null}
            onClick={handelClickDelete}
            >
              Eliminar({listaNotificacionesAEliminar.length})
            </p>
          </div>
          <div className='container-notificaciones'>
            {mapNotificaciones}
          </div>
        </div>
      )
    } else {
      return (
        <div className="container-sin-notificaciones">
          <h4>No hay notificaciones</h4>
        </div>
      )
    }
  };
  return (
    <div className="container-notificaciones-padre">
      <div className="title-paper-notificaciones">
        <p>Notificaciones</p>
      </div>

      {loading ? (
        <div className="container-sin-notificaciones">
          <CircularProgress
            color="inherit"
            className="icon-enviar"
            disableShrink
          />
        </div>
      ) : renderizarNotificaciones()}

    </div>
  );
}

export default ListaDeNotificaciones;
