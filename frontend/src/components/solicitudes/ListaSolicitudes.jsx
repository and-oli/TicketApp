import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import "../styles/ListaSolicitudes.css";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    display: "flex",
    alignSelf: "center",
  },

  searchList: {
    position: "absolute",
    width: "auto",
  },

  formControl: {
    display: "flex",
    margin: theme.spacing(1),
    minWidth: 120,
    height: "auto",
  },
}));

export default function ListaSolicitudes() {
  const [listaSolicitudes, setListaSolicitudes] = React.useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [buscar, setBuscar] = useState(false);
  const [filtro, setFiltro] = useState({
    searchId: '',
    searchTexto: "",
    searchEstado: "",
  });

  const classes = useStyles();

  React.useEffect(() => {
    fetch(`http://localhost:3000/solicitudes/?idSolicitud=${filtro.searchId}&estado=${filtro.searchEstado}&resumen=${filtro.searchTexto}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((getSolicitudes) => {
        setListaSolicitudes(getSolicitudes.solicitudes);
      });
  }, [buscar]);

  const onChangeSearch = (event) => {
    const { name, value } = event.target;
    setFiltro((prevState) => ({ ...prevState, [name]: value }));
  };

  const dropdownOpen = () => {
    setOpenDropdown(openDropdown ? false : true);
  };

  const iniciarBusqueda = () => {
    setBuscar(buscar ? false : true);
  };

  const renderizarInfoSolicitudes = () => {
    const lista = []
    console.log(listaSolicitudes)
    listaSolicitudes.map((sol) => {
      return lista.push(
        <TableRow key={sol.idSolicitud}>
          <TableCell align="center">
            <Link
              className="link"
              to={`/detalle-solicitud/?id_solicitud=${sol.idSolicitud}`}
            >
              {sol.idSolicitud}
            </Link>
          </TableCell>
          <TableCell align="center">{sol.cliente[0].nombre}</TableCell>
          <TableCell align="center">{sol.usuarioSolicitante[0].name}</TableCell>
          <TableCell align="center">{sol.estado}</TableCell>
          <TableCell align="center">{sol.prioridad}</TableCell>
          <TableCell align="center">{sol.resumen}</TableCell>
          <TableCell align="center">{sol.fechaHora}</TableCell>
        </TableRow>
      );
    });

    return lista;
  };

  return (
    <div>
        <div className="container-filter">
          <Button
            component={"button"}
            className="buton-filter"
            onClick={dropdownOpen}
          >
            Filtros
          </Button>
          {openDropdown ? (
            <div className="input-search">
              <InputBase
                className="input-id"
                placeholder="# Solicitud..."
                value={filtro.searchId}
                name="searchId"
                onChange={onChangeSearch}
                inputProps={{ "aria-label": "search" }}
              />
              <InputBase
                className="input-relacion"
                placeholder="Buscar texto"
                value={filtro.searchTexto}
                name="searchTexto"
                onChange={onChangeSearch}
                inputProps={{ "aria-label": "search" }}
              />
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">
                  Estado
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  name="searchEstado"
                  value={filtro.searchEstado}
                  onChange={onChangeSearch}
                >
                  <MenuItem value="">todos</MenuItem>
                  <MenuItem value="Resuelta">Resuelta</MenuItem>
                  <MenuItem value="Asignada">Asignada</MenuItem>
                  <MenuItem value="Sin asignar">Sin asignar</MenuItem>
                </Select>
              </FormControl>

              <div className={classes.searchIcon}>
                <SearchIcon onClick={iniciarBusqueda} />
              </div>
            </div>
          ) : null}
      </div>
      <Divider />
      <TableContainer component={Paper}>
        <Table id="table" size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Número de solicitud</TableCell>
              <TableCell align="center">Cliente</TableCell>
              <TableCell align="center">Solicitante</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Prioridad</TableCell>
              <TableCell align="center">Resumen</TableCell>
              <TableCell align="center">Fecha - Hora</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderizarInfoSolicitudes()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
