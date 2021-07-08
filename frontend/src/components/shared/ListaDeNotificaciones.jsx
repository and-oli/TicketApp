import "../styles/ListaDeNotificaciones.css";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import DeleteIcon from "@material-ui/icons/Delete";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function ListaDeNotificaciones() {
  const [notificaciones, setNotificaciones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [eliminar, setEliminar] = React.useState(true);
  const [listaNotificacionesAEliminar, setListaNotificacionesAEliminar] = React.useState([]);
  const [cuentaEliminarNotificaciones, setCuentaEliminarNotificaciones] = React.useState(0);
  const [ref, setRef] = useState([]);
  const srefSeleccionarTodo = React.createRef();
  const noMostrar = eliminar || !notificaciones.length
    ? { display: "none" }
    : null;


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
    const notificacionesTodas = notificacionesJson.notificaciones.map(i => {
      const crearReferencia = React.createRef();
      setRef((prevState) => ([...prevState, crearReferencia]));
      return ({ ...i, referencia: crearReferencia, })
    });
    setLoading(false);
    setNotificaciones(notificacionesTodas);
  };

  useEffect(() => {
    renderNotificaciones();
  }, []);

  const iconDeleteClick = () => {
    setEliminar(!eliminar);
    if (eliminar) {
      srefSeleccionarTodo.current.checked = false;
      setListaNotificacionesAEliminar([]);
      setCuentaEliminarNotificaciones(0);
    }
  };

  const handelClickDelete = async () => {
    setLoading(true)
    if (listaNotificacionesAEliminar.length) {
      const data = {
        lista: listaNotificacionesAEliminar,
      };
      const header = {
        method: "post",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const notificacionesEliminadasFetch = await fetch(
        "http://localhost:3001/notification/eliminarNotificaciones",
        header);

      const notificacionesEliminadasJson = await notificacionesEliminadasFetch;
      if (notificacionesEliminadasJson.ok) {
        window.location.reload();
      }
    }
  };

  const checkboxChange = (event) => {
    const notificacionesParaEliminar = event.target || event;
    if (notificacionesParaEliminar.checked) {
      setListaNotificacionesAEliminar(
        (prevState) => [...prevState, notificacionesParaEliminar.value]
      );
      setCuentaEliminarNotificaciones(listaNotificacionesAEliminar.length + 1);
    } else {
      const eliminarDeLista = listaNotificacionesAEliminar.indexOf(notificacionesParaEliminar.value);
      listaNotificacionesAEliminar.splice(eliminarDeLista, 1);
      setCuentaEliminarNotificaciones(listaNotificacionesAEliminar.length);
    };
  };

  const seleccionarTodo = (event) => {
    const checked = event.target.checked;
    let cuenta;
    setListaNotificacionesAEliminar([]);
    for (let i = 0; i < ref.length; i++) {
      ref[i].current.checked = checked;
      checkboxChange(ref[i].current);
      cuenta = i + 1;
    }
    if (srefSeleccionarTodo.current.checked) {
      setCuentaEliminarNotificaciones(cuenta);
    }
  };


  const renderizarNotificaciones = () => {
    const mapNotificaciones = notificaciones.map((noti, i) => (
      <Paper
        style={!eliminar
          ? noti.referencia.current.checked
            ? { backgroundColor: "rgba(255, 225, 1, 0.207)" }
            : null
          : null}
        component={eliminar ? Link : "div"}
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
        <input
          disabled={loading}
          type="checkbox"
          style={noMostrar}
          onChange={checkboxChange}
          value={noti._id}
          ref={noti.referencia}
        />
      </Paper>
    )
    );

    if (mapNotificaciones.length) {
      return (
        <div className="container-notificaciones-padre">
          <div className="container-notificaciones">
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
      {notificaciones.length?
      <div className="eliminar-notificacion">
        <div className="icon-delete-container">
          {eliminar || !notificaciones.length ?
            <DeleteIcon
              onClick={iconDeleteClick}
            /> :
            <DeleteForeverIcon
              onClick={iconDeleteClick}
            />}
          <p
            style={noMostrar}
            onClick={iconDeleteClick}
          >
            Cancelar
          </p>
          <FormControlLabel
            style={noMostrar}
            control={
              <input
                disabled={loading}
                type="checkbox"
                ref={srefSeleccionarTodo}
              />
            }
            onChange={seleccionarTodo}
            label="Seleccionar todo:"
            labelPlacement="start"
          />
        </div>
        <p
          className="eliminar-notificacion-p"
          style={noMostrar}
          onClick={handelClickDelete}
        >
          Eliminar({cuentaEliminarNotificaciones})
        </p>
      </div>: null
      }
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
};

export default ListaDeNotificaciones;
