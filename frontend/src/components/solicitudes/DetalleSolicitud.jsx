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
  const [roleAsignado, setRoleAsignado] = useState("");
  const [solicitante, setSolicitante] = useState({});

  React.useEffect(() => {
    fetch(`http://localhost:3001/solicitudes/porNumero/${idSolicitud}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((getSolicitudes) => {
        setDetalleSolicitud(getSolicitudes.solicitud);
        setCliente(getSolicitudes.solicitud.refCliente.nombre);
        setSolicitante(getSolicitudes.solicitud.refUsuarioSolicitante);
        if(getSolicitudes.solicitud.dueno){
          setRoleAsignado(getSolicitudes.solicitud.dueno.role);
          setAsignada(getSolicitudes.solicitud.dueno.name);
        } else {
          setAsignada('Sin dueño');
        }
      });
  }, [idSolicitud]);

  return (
    <div>
      <div className="title-paper">
        <p>
          Solicitud {idSolicitud}: {detalleSolicitud.resumen}
        </p>
      </div>
      <div className="container-paper">
        <Paper className="paper-solicitud-a" elevation={10}>
          <p>Cliente: {cliente}</p>
          <p>Fecha de envío: {detalleSolicitud.fechaHora}</p>
          <p>Nombre del solicitante: {solicitante.name}</p>
          <p>Correo: {solicitante.email}</p>
          <p>Prioridad: {detalleSolicitud.prioridad}</p>
          <p>Estado: {detalleSolicitud.estado}</p>
          <p>
            Asignada a: {asignada} ({roleAsignado})
          </p>
          <p>Categoria: {detalleSolicitud.categoria}</p>
          <p>Descripcion:</p>
          <div className="descripcion">
            <p>{detalleSolicitud.descripcion}</p>
          </div>
        </Paper>
        <CambiosSolicitud
          abierta = {detalleSolicitud.abierta}
          asignado = {asignada}
          requerimiento = {detalleSolicitud.requerimente}
          estado = {detalleSolicitud.estado}
          idSolicitud = {idSolicitud}
          refSolicitud = {detalleSolicitud._id}
        />
        <Paper className="paper-solicitud-c" elevation={4}>
          <ListaCambios
            asignado={asignada} 
            refSolicitud={detalleSolicitud._id}
            idSolicitud={idSolicitud}
          />
        </Paper>
      </div>
    </div>
  );
};
