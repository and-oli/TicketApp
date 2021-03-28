import React from "react";

export default function DetalleSolicitud(props) {
  let params = (new URL(document.location)).searchParams;
  let idSolicitud = params.get('id_solicitud');
  return (
    <div>
      {idSolicitud}
    </div>
  );
}
