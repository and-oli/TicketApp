import React, { useState } from "react";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../styles/ListaCambios.css";

export default function ListaSolicitudes(props) {
  const [cambios, setCambio] = useState([]);
  const [loading, setloading] = useState(true);

  React.useEffect(() => {
    if (props.refSolicitud !== undefined) {
      fetch(
        `http://192.168.1.39:3001/cambiosSolicitud/cambios/${props.refSolicitud}`,
        {
          method: "GET",
          headers: {
            "x-access-token": localStorage.getItem("TAToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((cambio) => {
          setloading(false);
          setCambio(cambio.cambios);
        });
    }
  }, [props.refSolicitud]);

  const cambiosDeEstado = (cambio) => {
    if (cambio.estado) {
      return (
        <div>
          <p className="title-card-cambio">Cambio de estado:</p>
          <div className="info-cambios">
            <p className="cambio-realizado">
              {cambio.estado === "Asignado"
                ? cambio.estado + " : (" + props.asignado + ")"
                : cambio.estado}
            </p>
          </div>
        </div>
      );
    }
  };

  const renderizarArchivos = (cambio) => {
    if (cambio.archivos[0]) {
      return (
        <div>
          <p className="title-card-cambio">Archivo(s):</p>
          <div className="info-files">
            {cambio.archivos.map((archivo, i) => {
              const punto = archivo.nombreArchivo.split(".");
              const extencion = punto[punto.length - 1];
              const nombreSolo = archivo.nombreArchivo.split(
                `.${extencion}`
              )[0];
              const nombre = `${nombreSolo.substring(0, 8)}...${extencion}`;
              const link = archivo.urlArchivo;
              return (
                  <h6 key={i}>
                    {archivo.categoriaArchivo}: &nbsp;&nbsp;{" "}
                    <a href={link}>{nombre}</a>
                  </h6>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderizarItemsCambios = () => {
    return cambios.map((cambio, i) => (
      <Paper elevation={20} key={i} className="container-padre-cambios">
        <div className="info-usuario">
          <h4>{cambio.titulo}</h4>
          <Divider />
          <div>
            <p className="title-card-cambio">Usuario:</p>
            <p className="user-info-cambio">{cambio.refUsuario.name}</p>
            <p className="user-info-cambio">({cambio.refUsuario.role})</p>
          </div>
          <Divider />
          <div>
            <p className="title-card-cambio">Fecha:</p>
            <p className="fecha-info-cambio">{cambio.fechaHora}</p>
          </div>
          <Divider />
          {cambiosDeEstado(cambio)}
          <Divider />
          {renderizarArchivos(cambio)}
          <Divider />
          <p className="title-card-cambio">Nota:</p>
          <div className="nota">{cambio.nota}</div>
        </div>
      </Paper>
    ));
  };

  const renderizarCambios = () => {
    if (loading) {
      return (
        <div className="loading">
          <CircularProgress
            color="inherit"
            className="icon-loading"
            disableShrink
          />
        </div>
      );
    } else {
      if (!cambios.length) {
        return (
          <div className="loading">
            <h4>No hay cambios</h4>
          </div>
        );
      } else {
        return renderizarItemsCambios();
      }
    }
  };

  return <div>{renderizarCambios()}</div>;
}
