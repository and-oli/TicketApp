import React, { useState } from "react";
import "../styles/ListaCambios.css";
import Paper from "@material-ui/core/Paper";

export default function ListaSolicitudes(props) {
  const [cambios, setCambio] = useState([]);
  React.useEffect(() => {
    if (props.refSolicitud !== undefined) {
      fetch(
        `http://localhost:3000/cambiosSolicitud/cambios/${props.refSolicitud}`,
        {
          method: "GET",
          headers: {
            "x-access-token": localStorage.getItem("TAToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((cambio) => {
          setCambio(cambio.cambios);
        });
    }
  }, [props.refSolicitud]);
  const renderizarCambios = () => {
    return cambios.map((cambio, i) => (
      <Paper elevation={20} key={i} className="container-padre-cambios">
        <p>{cambio.refUsuario.name}</p>
        <p>({cambio.refUsuario.role})</p>
        <p>Cambios: </p>
        <p>{cambio.estado}</p>
        <p>{cambio.nota}</p>
      </Paper>
    ));
  };

  return <div>{renderizarCambios()}</div>;
}
