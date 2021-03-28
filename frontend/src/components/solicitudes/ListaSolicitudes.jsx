import React from "react";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "../styles/ListaSolicitudes.css";
import { Link } from 'react-router-dom';

export default function ListaSolicitudes () {
  const [listaSolicitudes, setListaSolicitudes] = React.useState([]);

  React.useEffect(
    () => {
      fetch("http://localhost:3000/solicitudes", {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      })
        .then((res) => res.json())
        .then((getSolicitudes) => {
          setListaSolicitudes(getSolicitudes.solicitudes);
        });
    }, []
  );

  const renderizarInfoSolicitudes = () => {
    return listaSolicitudes.map((sol) => (
      <TableRow key={sol.idSolicitud}>
        <TableCell align="center" component={Link} to={`/detalle-solicitud/?id_solicitud=${sol.idSolicitud}`} >{sol.idSolicitud}</TableCell>
        <TableCell align="center">{sol.refCliente}</TableCell>
        <TableCell align="center">{sol.estado}</TableCell>
        <TableCell align="center">{sol.prioridad}</TableCell>
        <TableCell align="center">{sol.resumen}</TableCell>
        <TableCell align="center">{sol.fechaHora}</TableCell>
      </TableRow>
    ));
  }
    return (
      <div>
        <div id="container-padre">
          <Typography id="typography">
            <TableContainer component={Paper}>
              <Table id="table" size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Número de solicitud</TableCell>
                    <TableCell align="center">Cliente</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Prioridad</TableCell>
                    <TableCell align="center">Resumen</TableCell>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderizarInfoSolicitudes()}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        </div>
      </div>
    );
}

