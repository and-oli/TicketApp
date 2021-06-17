import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
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
        <Paper className="paper-solicitud-a" elevation={5}>
          <h3>Informacion de la solicitud</h3>
          <p><h3> Cliente:</h3> {cliente}</p>
          <p><h3>Fecha de envío:</h3> {detalleSolicitud.fechaHora}</p>
          <p><h3>Nombre del solicitante:</h3> {solicitante.name}</p>
          <p><h3>Correo:</h3> {solicitante.email}</p>
          <p><h3>Prioridad:</h3> {detalleSolicitud.prioridad}</p>
          <p><h3>Estado:</h3> {detalleSolicitud.estado}</p>
          <p>
          <h3> Asignada a:</h3> {asignada} ({roleAsignado})
          </p>
          <p><h3>Categoria:</h3> {detalleSolicitud.categoria}</p>
          <p><h3>Descripcion:</h3></p>
          <div className="descripcion">
            <p>{detalleSolicitud.descripcion}</p>
          </div>
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
        <Paper className="paper-solicitud-c" elevation={4}>
          <ListaCambios
            categoriasArchivos={categoriasArchivos}
            asignado={asignada}
            refSolicitud={detalleSolicitud._id}
            idSolicitud={idSolicitud}
          />
        </Paper>
      </div>
    </div>
  );
}
