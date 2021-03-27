import React, { Component } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./styles/lista.css";
import Header from "./header";
import Menu from "./menu";

export default class ListadeSolicitudes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaSolicitudes: [],
    };

    this.renderizarInfoSolicitudes = this.renderizarInfoSolicitudes.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:3000/solicitudes", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((getSolicitudes) => {
        this.setState({ listaSolicitudes: getSolicitudes.solicitudes });
      });
  }
  renderizarInfoSolicitudes() {
    let listaDeSolicitudes = this.state.listaSolicitudes;
    return listaDeSolicitudes.map((sol) => (
      <TableRow key={sol.idSolicitud}>
        <TableCell align="center">{sol.idSolicitud}</TableCell>
        <TableCell align="center">{sol.refCliente}</TableCell>
        <TableCell align="center">{sol.estado}</TableCell>
        <TableCell align="center">{sol.prioridad}</TableCell>
        <TableCell align="center">{sol.resumen}</TableCell>
        <TableCell align="center">{sol.fechaHora}</TableCell>
        <TableCell align="center">
          <img
            alt="img"
            src="https://img.icons8.com/color/48/000000/list.png"
          />
        </TableCell>
      </TableRow>
    ));
  }
  render() {
    return (
      <div>
        <Header />
        <Menu />
        <div id="container-padre">
          <Accordion className="acordion-h" component="div">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon id="flecha" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>No asignadas</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography id="typography">
                <TableContainer component={Paper}>
                  <Table id="table" size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="center">Cliente</TableCell>
                        <TableCell align="center">Estado</TableCell>
                        <TableCell align="center">Prioridad</TableCell>
                        <TableCell align="center">Resumen</TableCell>
                        <TableCell align="center">Fecha</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.renderizarInfoSolicitudes()}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    );
  }
}
