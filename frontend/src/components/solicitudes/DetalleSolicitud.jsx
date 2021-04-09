import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import CambiosSolicitud from "../formularioSolicitud/EnviarCambio";
import ListaCambios from "./ListaCambios";
import "../styles/DetallesSolicitud.css";
export default function DetalleSolicitud() {
  let params = new URL(document.location).searchParams;
  let idSolicitud = params.get("id_solicitud");

  const [detalleSolicitud, setDetalleSolicitud] = useState([]);
  const [cliente, setCliente] = useState("");
  const [asignada, setAsignada] = useState("");
  const [solicitante, setSolicitante] = useState({});
  React.useEffect(() => {
    fetch(`http://localhost:3000/solicitudes/porNumero/${idSolicitud}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((getSolicitudes) => {
        setDetalleSolicitud(getSolicitudes.solicitud);
        setCliente(getSolicitudes.solicitud.refCliente.nombre);
        setAsignada(getSolicitudes.solicitud.refUsuarioAsignado.name);
        setSolicitante(getSolicitudes.solicitud.listaIncumbentes[0]);
      });
  }, [idSolicitud]);
  return (
    <div>
      <p className="title-paper">
        Solicitud {idSolicitud}: {detalleSolicitud.resumen}
      </p>
      <div className="container-paper">
        <Paper className="paper-solicitud-a" elevation={10}>
          <p>Cliente: {cliente}</p>
          <p>Fecha de envío: {detalleSolicitud.fechaHora}</p>
          <p>Nombre del solicitante: {solicitante.name}</p>
          <p>Correo: {solicitante.email}</p>
          <p>Prioridad: {detalleSolicitud.prioridad}</p>
          <p>Estado: {detalleSolicitud.estado}</p>
          <p>Asignada a: {asignada}</p>
          <p>Categoria: {detalleSolicitud.categoria}</p>
          <p>Descripcion:</p>
          <div className="descripcion">
            <p>{detalleSolicitud.descripcion}</p>
          </div>
        </Paper>
        <CambiosSolicitud
          requerimiento={detalleSolicitud.requerimente}
          idSolicitud={idSolicitud}
          refSolicitud={detalleSolicitud._id}
        />
        <Paper className="paper-solicitud-c" elevation={4}>
          <ListaCambios
            refSolicitud={detalleSolicitud._id}
            idSolicitud={idSolicitud}
          />
        </Paper>
      </div>
    </div>
  );
}
