import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import CambiosSolicitud from "./CambiosSolicitud";
import "../styles/DetallesSolicitud.css";
export default function DetalleSolicitud(props) {
  let params = new URL(document.location).searchParams;
  let idSolicitud = params.get("id_solicitud");

  const [detalleSolicitud, setDetalleSolicitud] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/solicitudes/porNumero/${idSolicitud}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((getSolicitudes) => {
        setDetalleSolicitud(getSolicitudes.solicitud);
      });
  }, []);
  return (
    <div>
      <p className="title-paper">
        # Solicitud: {idSolicitud}: {detalleSolicitud.resumen}
      </p>
      <div className="container-paper">
        <Paper className="paper-solicitud-a" elevation={6}>
          {/* <p>Cliente: {detalleSolicitud.refClient.nombre}</p> */}
          <p>Fecha de envío: {detalleSolicitud.fechaHora}</p>
          <p>Prioridad: {detalleSolicitud.prioridad}</p>
          <p>Estado: {detalleSolicitud.estado}</p>
          <p>Categoria: {detalleSolicitud.categoria}</p>
          <p>Sub categoria: {detalleSolicitud.subcategoria}</p>
          <p>Descripcion:</p>
          <div className="descripcion">
            <p>{detalleSolicitud.desripcion}</p>
          </div>
        </Paper>
        <CambiosSolicitud
          requerimiento={detalleSolicitud.requerimente}
          idSolicitud={idSolicitud}
          refSolicitud={detalleSolicitud._id}
          refUsuario={detalleSolicitud.listaIncumbentes}
        />
        <Paper className="paper-solicitud-c" elevation={4} />
      </div>
    </div>
  );
}
