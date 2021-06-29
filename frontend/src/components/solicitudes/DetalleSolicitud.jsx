import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import CambiosSolicitud from "../formularioSolicitud/EnviarCambio";
import ListaCambios from "./ListaCambios";
import "../styles/DetallesSolicitud.css";

export default function DetalleSolicitud(props) {
  const { userRole } = props;
  let params = new URL(document.location).searchParams;
  let idSolicitud = params.get("id_solicitud");
  const [detalleSolicitud, setDetalleSolicitud] = useState([]);
  const [cliente, setCliente] = useState("");
  const [asignada, setAsignada] = useState("");
  const [categoriasArchivos, setCategoriasArchivos] = useState([]);
  const [roleAsignado, setRoleAsignado] = useState("");
  const [solicitante, setSolicitante] = useState({});

  const renderizarInfoSolicitud = async (id) => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const resDetalles = await fetch(
      `http://localhost:3001/solicitudes/porNumero/${id}`,
      header
    );

    const categoriasArchivos = await fetch(
      "http://localhost:3001/constantes/categoriasArchivos",
      header
    );

    const detallesJson = await resDetalles.json();
    const resCategoriasArchivos = await categoriasArchivos.json();

    setDetalleSolicitud(detallesJson.solicitud);
    setCategoriasArchivos(Object.values(resCategoriasArchivos));
    setCliente(detallesJson.solicitud.refCliente.nombre);
    setSolicitante(detallesJson.solicitud.refUsuarioSolicitante);
    if (detallesJson.solicitud.dueno) {
      setRoleAsignado(detallesJson.solicitud.dueno.role);
      setAsignada(detallesJson.solicitud.dueno.name);
    } else {
      setAsignada("Sin dueño");
    }
  };

  React.useEffect(() => {
    renderizarInfoSolicitud(idSolicitud);
  }, [idSolicitud]);

  return (
    <div>
      <div className="title-paper">
        <p>
          Solicitud #{idSolicitud}: {detalleSolicitud.resumen}
        </p>
      </div>
      <div className="container-paper">
        <Paper className="paper-solicitud-a" elevation={10}>
          <div className="detalles-titles">
            <h2>Informacion de la solicitud</h2>
          </div>
          <Divider />
          <p><b>Descripcion:</b></p>
          <div className="descripcion">
          <p>{detalleSolicitud.descripcion}</p>
          </div>
          <p><b>Cliente:</b> {cliente}</p>
          <p><b>Nombre del solicitante:</b> {solicitante.name}</p>
          <p><b>Correo:</b> {solicitante.email}</p>
          <p><b>Categoria:</b> {detalleSolicitud.categoria}</p>
          <p><b>Prioridad:</b> {detalleSolicitud.prioridad}</p>
          <p><b>Fecha de envío:</b> {detalleSolicitud.fechaHora}</p>
          <p><b>Estado:</b> {detalleSolicitud.estado}</p>
          <p><b>Asignada a:</b> {asignada} {roleAsignado? `(${roleAsignado})` : null}</p>
        </Paper>
        <CambiosSolicitud
          user={userRole}
          categoriasArchivos={categoriasArchivos}
          abierta={detalleSolicitud.abierta}
          asignado={asignada}
          requerimiento={detalleSolicitud.requerimente}
          estado={detalleSolicitud.estado}
          idSolicitud={idSolicitud}
          referenciaSolicitud={detalleSolicitud._id}
        />
        <ListaCambios
          categoriasArchivos={categoriasArchivos}
          asignado={asignada}
          refSolicitud={detalleSolicitud._id}
          idSolicitud={idSolicitud}
        />
      </div>
    </div>
  );
}
