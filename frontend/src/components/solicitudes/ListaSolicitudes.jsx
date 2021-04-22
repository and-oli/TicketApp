import React, { useState, useCallback, useRef } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import "../styles/ListaSolicitudes.css";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    display: "flex",
    alignItems: "center",
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

const TableCellHeader = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const TableRowAlt = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white.black,
    color: theme.palette.common.white,
  },
  root: {
    fontSize: 14,
  },
}))(TableRow);

export default function ListaSolicitudes() {
  const [listaSolicitudes, setListaSolicitudes] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [cuenta, setCuenta] = React.useState(0);
  const [ordenarPor, setOrdenarPor] = React.useState("");
  const [orden, setOrden] = React.useState("desc");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filtro, setFiltro] = useState({
    searchTexto: "",
    searchEstado: "Todos",
  });

  const refPagePrevia = useRef();
  const refOrdenarPorPrevia = useRef();
  const refOrdenPrevia = useRef();
  const refRowsPerPagePrevia = useRef();

  React.useEffect(() => {
    refPagePrevia.current = page;
    refOrdenarPorPrevia.current = ordenarPor;
    refOrdenPrevia.current = ordenPrevia;
    refRowsPerPagePrevia.current = rowsPerPage;
  });
  const pagePrevia = refPagePrevia.current;
  const ordenarPorPrevia = refOrdenarPorPrevia.current;
  const ordenPrevia = refOrdenPrevia.current;
  const rowsPerPagePrevia = refRowsPerPagePrevia.current;

  const classes = useStyles();

  const enviarBusqueda = useCallback(() => {
    if (
      pagePrevia === page &&
      ordenarPorPrevia === ordenarPor &&
      ordenPrevia === orden &&
      rowsPerPagePrevia === rowsPerPage
    ) {
      return;
    }
    const estado = filtro.searchEstado === "Todos" ? "" : filtro.searchEstado;
    fetch(
      `http://localhost:3000/solicitudes/?estado=${estado}&texto=${filtro.searchTexto}&pagina=${page}&cantidad=${rowsPerPage}&ordenarPor=${ordenarPor}&orden=${orden}`,
      {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      }
    )
      .then((res) => res.json())
      .then((resultado) => {
        setListaSolicitudes(resultado.solicitudes);
        setCuenta(resultado.cuenta);
      });
  }, [
    filtro,
    page,
    pagePrevia,
    rowsPerPage,
    rowsPerPagePrevia,
    ordenarPor,
    ordenarPorPrevia,
    orden,
    ordenPrevia,
  ]);

  React.useEffect(() => {
    enviarBusqueda();
  }, [enviarBusqueda]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeSearch = (event) => {
    const { name, value } = event.target;
    setFiltro((prevState) => ({ ...prevState, [name]: value }));
  };

  const iniciarBusqueda = (e) => {
    if (e) {
      e.preventDefault();
    }
    enviarBusqueda();
  };

  const cambioOrden = (idEncabezado) => {
    if (ordenarPor === idEncabezado) {
      setOrden(orden === "asc" ? "desc" : "asc");
    } else {
      setOrden("desc");
    }
    setOrdenarPor(idEncabezado);
  };

  const renderizarInfoSolicitudes = () => {
    if (listaSolicitudes) {
      return listaSolicitudes.map((sol) => {
        return (
          <TableRowAlt key={sol.idSolicitud}>
            <TableCell align="center">
              <Link
                className="link"
                to={`/detalle-solicitud/?id_solicitud=${sol.idSolicitud}`}
              >
                {sol.idSolicitud}
              </Link>
            </TableCell>
            <TableCell align="center">{sol.cliente[0].nombre}</TableCell>
            <TableCell align="center">
              {sol.usuarioSolicitante[0].name}
            </TableCell>
            <TableCell align="center">{sol.estado}</TableCell>
            <TableCell align="center">{sol.prioridad}</TableCell>
            <TableCell align="center">{sol.resumen}</TableCell>
            <TableCell align="center">{sol.fechaHora}</TableCell>
          </TableRowAlt>
        );
      });
    }
  };

  const encabezados = [
    { id: "idSolicitud", titulo: "Número de solicitud" },
    { id: "cliente", titulo: "Cliente" },
    { id: "usuarioSolicitante", titulo: "Solicitante" },
    { id: "estado", titulo: "Estado" },
    { id: "prioridad", titulo: "Prioridad" },
    { id: "resumen", titulo: "Resumen" },
    { id: "fechaHora", titulo: "Fecha" },
  ];

  return (
    <div>
      <form id="filter-form" onSubmit={iniciarBusqueda}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-controlled-open-select-label">Estado</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            name="searchEstado"
            value={filtro.searchEstado}
            onChange={onChangeSearch}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Resuelta">Resuelta</MenuItem>
            <MenuItem value="Asignada">Asignada</MenuItem>
            <MenuItem value="Sin asignar">Sin asignar</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className="input-relacion"
          label="Buscar"
          value={filtro.searchTexto}
          name="searchTexto"
          onChange={onChangeSearch}
          inputProps={{ "aria-label": "search" }}
          variant="outlined"
          margin="dense"
        />
        <div className={classes.searchIcon}>
          <IconButton type="submit">
            <SearchIcon />
          </IconButton>
        </div>
      </form>
      <Divider />
      <TableContainer component={Paper}>
        <Table id="table" size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {encabezados.map((encabezado, i) => {
                return (
                  <TableCellHeader
                    key={i}
                    align="center"
                    sortDirection={ordenarPor === encabezado.id ? orden : false}
                  >
                    <TableSortLabel
                      active={ordenarPor === encabezado.id}
                      direction={ordenarPor === encabezado.id ? orden : "asc"}
                      onClick={() => cambioOrden(encabezado.id)}
                    >
                      {encabezado.titulo}
                    </TableSortLabel>
                  </TableCellHeader>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>{renderizarInfoSolicitudes()}</TableBody>
          <TableFooter style={{ width: "auto" }}>
            <TableRow>
              <TablePagination
                count={cuenta}
                page={page}
                rowsPerPage={rowsPerPage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
