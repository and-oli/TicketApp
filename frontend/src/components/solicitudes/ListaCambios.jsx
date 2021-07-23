import React, { useState, useCallback } from "react";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../styles/ListaCambios.css";

export default function ListaSolicitudes(props) {
  const [cambios, setCambios] = useState([]);
  const [loading, setloading] = useState(true);
  const { refSolicitud, categoriasArchivos, asignado } = props;

  const getCambios = useCallback(async (ref) => {
    if (ref !== undefined) {
      const resCambios = await fetch(
        `http://localhost:3001/cambiosSolicitud/cambios/${ref}`,
        {
          method: "GET",
          headers: {
            "x-access-token": localStorage.getItem("TAToken"),
          },
        }
      );

      const cambiosJson = await resCambios.json();
      setloading(false);
      setCambios(cambiosJson.cambios);
    }
  }, []);

  React.useEffect(() => {
    getCambios(refSolicitud);
  }, [refSolicitud, getCambios]);

  const cambiosDeEstado = (cambio) => {
    if (cambio.estado) {
      return (
        <div>
          <Divider />
          <p className="title-card-cambio"><b>Cambio de estado:</b></p>
          <div className="info-cambios">
            <p className="cambio-realizado">
              {cambio.estado === "Asignada"
                ? cambio.estado + " : (" + asignado + ")"
                : cambio.estado}
            </p>
          </div>
        </div>
      );
    }
  };

  const renderizarArchivos = (archivos) => {
    if (archivos[0]) {
      const renderizarArchivosPorCategoria = () => {
        const categorias = {};
        categoriasArchivos.forEach((categoria) => {
          categorias[categoria] = [];
          archivos.forEach((archivoPorCategora) => {
            if (archivoPorCategora.categoriaArchivo === categoria) {
              categorias[categoria].push(archivoPorCategora);
            }
          });
        });

        const mapNombresArchivos = categoria => (archivos.map((archivo, i) => {
          const punto = archivo.nombreArchivo.split(".");
          const extencion = punto[punto.length - 1];
          const nombreSolo = archivo.nombreArchivo.split(`.${extencion}`)[0];
          let nombre;
          if (nombreSolo.length > 15) {
            nombre = `${nombreSolo.substring(0, 15)}...${extencion}`;
          } else {
            nombre = archivo.nombreArchivo;
          };
          const link = archivo.urlArchivo;
          if (archivo.categoriaArchivo === categoria) {
            return (
              <p key={i}>
                <a href={link}>{nombre}</a>
              </p>
            );
          } else return null;
        }));

        const mapArchivos = categoriasArchivos.map(categoria => {
          if (categorias[categoria].length) {
            return (
              <div className="categoria-files" key={categoria}>
                <h6>{categoria}(s):</h6>
                <div className="info-files">
                  {mapNombresArchivos(categoria)}
                </div>
              </div>
            );
          } else return null;
        });
        return mapArchivos;
      };
      return (
        <div>
          <Divider />
          <p className="title-card-cambio"><b>Archivo(s):</b></p>
          <div className="archivos-por-categoria">
            {renderizarArchivosPorCategoria()}
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
            <p className="title-card-cambio"><b>Usuario:</b></p>
            <p className="user-info-cambio">{cambio.refUsuario[0].name}</p>
            <p className="user-info-cambio">({cambio.refUsuario[0].role})</p>
          </div>
          <Divider />
          <div>
            <p className="title-card-cambio"><b>Fecha:</b></p>
            <p className="fecha-info-cambio">{cambio.fechaHora}</p>
          </div>
          {cambiosDeEstado(cambio)}
          {renderizarArchivos(cambio.archivos)}
          <Divider />
          <p className="title-card-cambio"><b>Nota:</b></p>
          <div className="nota">{cambio.nota}</div>
        </div>
      </Paper>
    ));
  };

  const renderizarCambios = () => {
    if (loading) {
      return (
        <div className="detalles-titles-sin-cambios">
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
          <div className="detalles-titles-sin-cambios">
            <h4>No hay cambios</h4>
          </div>
        );
      } else {
        return renderizarItemsCambios();
      };
    };
  };

  return (
    <div>
      <p className='detalles-cambios-titulos'>Historial</p>
      <Divider />
      <div className="paper-solicitud-c">
        {renderizarCambios()}
      </div>
    </div>
  );
};
