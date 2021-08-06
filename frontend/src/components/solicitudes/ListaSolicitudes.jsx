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
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CategoriasTickets from "../shared/CategoriasTicket";
import "../styles/ListaSolicitudes.css";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    padding: 8,
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
    minWidth: 130,
    height: "auto",
    '@media screen and (min-width: 0px) and (max-width: 500px)': {
      width: '335px !important',
    },
  },

  root: {
    minWidth: 360,
  },

  formControlCategoria: {
    display: "flex",
    margin: theme.spacing(1),
    minWidth: 220,
    height: "auto",
    '@media screen and (min-width: 0px) and (max-width: 500px)': {
      width: '290px !important',
    },
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

export default function ListaSolicitudes(props) {
  const { userRole } = props;
  const [listaSolicitudes, setListaSolicitudes] = useState([]);
  const [page, setPage] = useState(0);
  const [cuenta, setCuenta] = useState(0);
  const [ordenarPor, setOrdenarPor] = useState("");
  const [orden, setOrden] = useState("desc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setloading] = useState(true);
  const [estados, setEstados] = useState([]);
  const [categoriaDeTicket, setCategoriaDeTicket] = useState([]);
  const [filtro, setFiltro] = useState({
    searchTexto: "",
    searchEstado: "Todos",
    searchProyecto: "Todos los proyectos",
  });

  const refPagePrevia = useRef();
  const refOrdenarPorPrevia = useRef();
  const refOrdenPrevia = useRef();
  const refRowsPerPagePrevia = useRef();
  // const refFiltroPrevia = useRef();

  const renderizarConstante = async () => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    };

    const fetchEstados = await fetch(
      `http://localhost:3001/constantes/estados`,
      header
    );

    const fetchCategoriasTicket = await fetch(
      `http://localhost:3001/categorias`,
      header
    );

    const todasLasCategoriasTickets = await fetchCategoriasTicket.json();

    const estados = await fetchEstados.json();
    const categoriaTicket = todasLasCategoriasTickets.categorias;
    setCategoriaDeTicket(categoriaTicket)
    setEstados(Object.values(estados));
  };

  React.useEffect(() => {
    renderizarConstante();
  }, []);

  React.useEffect(() => {
    refPagePrevia.current = page;
    refOrdenarPorPrevia.current = ordenarPor;
    refOrdenPrevia.current = orden;
    refRowsPerPagePrevia.current = rowsPerPage;
    // refFiltroPrevia.current = filtro;
  });
  const pagePrevia = refPagePrevia.current;
  const ordenarPorPrevia = refOrdenarPorPrevia.current;
  const ordenPrevia = refOrdenPrevia.current;
  const rowsPerPagePrevia = refRowsPerPagePrevia.current;
  // const filtroPrevia = refFiltroPrevia.current || {};

  const classes = useStyles();

  const enviarBusqueda = useCallback(async (forzar) => {
    setloading(true);
    if (
      pagePrevia === page &&
      ordenarPorPrevia === ordenarPor &&
      ordenPrevia === orden &&
      rowsPerPagePrevia === rowsPerPage &&
      !forzar
    ) {
      setloading(false);
      return;
    }
    const estado = filtro.searchEstado === "Todos" ? "" : filtro.searchEstado;
    const proyecto = filtro.searchProyecto === "Todos los proyectos" ? "" : filtro.searchProyecto;
    const resFiltro = await fetch(
      `http://localhost:3001/solicitudes/?estado=${estado}&proyecto=${proyecto}&texto=${filtro.searchTexto.trim()}&pagina=${page}&cantidad=${rowsPerPage}&ordenarPor=${ordenarPor}&orden=${orden}`,
      {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      }
    );
    const filtroJson = await resFiltro.json();
    if (filtroJson.ok) {
      setListaSolicitudes(filtroJson.solicitudes);
      setloading(false);
    }
    if (filtroJson.cuenta) {
      setCuenta(filtroJson.cuenta);
    } else {
      setCuenta(0);
    }

  }, [
    filtro,
    // filtroPrevia,
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
    enviarBusqueda(true);
  };

  const cambioOrden = (idEncabezado) => {
    if (ordenarPor === idEncabezado) {
      setOrden(orden === "asc" ? "desc" : "asc");
    } else {
      setOrden("desc");
    }
    setOrdenarPor(idEncabezado);
  };

  const renderizarEstados = () => {
    return estados.map((estado, i) => (
      <option value={estado} key={i}>
        {estado}
      </option>
    ));
  };

  const renderizarCategoriaDeTicket = () => {
    return categoriaDeTicket.map((categoria, i) => (
      <option value={categoria._id} key={i}>
        {categoria.nombreCategoriaTicket}
      </option>
    ))
  }

  const renderizarInfoSolicitudes = () => {
    if (listaSolicitudes.length) {
      return listaSolicitudes.map((sol) => {
        return (
          <TableRowAlt key={sol.idSolicitud}>
            <TableCell align="center" id={sol.idSolicitud}>
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
          </TableRowAlt>)
      });
    } else {
      return (
        <TableRowAlt>
          <TableCell align="center" colSpan={7}>
            <p>No hay solicitudes</p>
          </TableCell>
        </TableRowAlt>
      );
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

  const confirmarRoles = {
    especialista: userRole === "Especialista",
    administrador: userRole === "ADMINISTRADOR",
  }

  return (
    <div>
      <form id="filter-form" onSubmit={iniciarBusqueda}>
        {confirmarRoles.especialista
          || confirmarRoles.administrador
          ? <div className='text-file-icon-search'>
            <FormControl className={classes.formControlCategoria}>
              <InputLabel id="demo-controlled-open-select-label">
                Categoria ticket
              </InputLabel>
              <Select
                native
                value={filtro.searchProyecto}
                onChange={onChangeSearch}
                labelId="demo-controlled-open-select-label"
                inputProps={{
                  name: "searchProyecto",
                  id: "demo-controlled-open-select",
                }}
              >
                <option value="Todos los proyectos">
                  Todas las categorias
                </option>
                {renderizarCategoriaDeTicket()}
              </Select>
            </FormControl>
            {confirmarRoles.administrador
              ? <CategoriasTickets categorias={categoriaDeTicket} />
              : null}
          </div>
          : null
        }
        <div className='text-file-icon-search'>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-estado-label">
              Estado
            </InputLabel>
            <Select
              native
              labelId="demo-controlled-open-select-estado-label"
              inputProps={{
                id: "demo-controlled-open-estado-select",
                name: "searchEstado"
              }}
              value={filtro.searchEstado}
              onChange={onChangeSearch}
            >
              <option value="Todos">Todos</option>
              {renderizarEstados()}
            </Select>
          </FormControl>
        </div>
        <div className='text-file-icon-search'>
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
        </div>
      </form>
      <Divider />
      <TableContainer className={classes.root} component={Paper}>
        <Table id="table" size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {encabezados.map((encabezado, i) => {
                return (
                  <TableCellHeader
                    className="header-table"
                    key={i}
                    align="center"
                    sortDirection={ordenarPor === encabezado.id ? orden : false}
                  >
                    <TableSortLabel
                      hideSortIcon={true}
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
          <TableBody>
            {loading ? (
              <TableRowAlt>
                <TableCell colSpan={7} align="center">
                  <CircularProgress
                    color="inherit"
                    className="icon-enviar"
                    disableShrink
                  />
                </TableCell>
              </TableRowAlt>
            ) : (
              renderizarInfoSolicitudes()
            )}
          </TableBody>
          <TableFooter>
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
};