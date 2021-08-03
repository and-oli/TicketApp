import React, { useEffect, useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import "../styles/EnviarSolicitud.css";
import { Divider } from "@material-ui/core";

export default function EnviarSolicitud() {
  const [loading, setloading] = useState(false);
  const [mensaje, setMensaje] = useState({ text: "", color: "" });
  const [listaClientes, setListaClientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [prioridad, setPrioridad] = useState([]);
  const [requerimiento, setRequerimiento] = useState([]);
  const [state, setState] = useState({
    refCliente: "",
    prioridad: "",
    resumen: "",
    descripcion: "",
    correo: "",
    ciudad: "",
    requerimiento: "",
    categoria: "",
  });

  const renderizarConstantes = async () => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    };

    const getClientes = await fetch(
      "http://localhost:3001/users/clientes",
      header
    );

    const categoriasSolicitud = await fetch(
      "http://localhost:3001/categorias",
      header
    );

    const prioridad = await fetch(
      "http://localhost:3001/constantes/prioridad",
      header
    );

    const requerimiento = await fetch(
      "http://localhost:3001/constantes/tipoRequerimiento",
      header
    );

    const resClientes = await getClientes.json();
    const resCategorias = await categoriasSolicitud.json();
    const resPrioridad = await prioridad.json();
    const resRequerimiento = await requerimiento.json();

    if (resCategorias.ok) {
      const todasLasCategorias = resCategorias.categorias.map(
        cat => (cat.nombreCategoria)
      )
      setCategorias(todasLasCategorias);
    }
    setListaClientes(resClientes.clientes);
    setPrioridad(Object.values(resPrioridad));
    setRequerimiento(Object.values(resRequerimiento));
  };

  useEffect(() => {
    renderizarConstantes();
  }, []);

  const renderLista = (lista) => {
    return lista.map((item, i) => (
      <option
        key={i}
        value={
          item === "Categorias" ||
            item === "Prioridad" ||
            item === "Tipo de requerimiento"
            ? ""
            : item
        }
      >
        {item}
      </option>
    ));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const enviarSolicitud = async (event) => {
    let data = {};
    let confirmarPost = true;

    event.preventDefault();

    setloading(true);

    for (let info in state) {
      if (state[info] !== "") {
        data[info] = state[info];
      } else {
        confirmarPost = false;
        setloading(false);
        setMensaje({
          text: "La informacion debe estar completa.",
          color: "orange",
        });
        break;
      }
    }

    if (confirmarPost) {
      const header = {
        method: "POST",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      header.body = JSON.stringify(data);
      const resFetch = await fetch(
        "http://localhost:3001/solicitudes/nuevaSolicitud",
        header
      );
      const resJson = await resFetch.json();

      if (resJson.ok) {
        header.body = JSON.stringify(resJson);
        await fetch(
          "http://localhost:3001/notification/solicitudNotifications",
          header
        );
        window.location.reload();
      } else {
        setloading(false)
      }
    }
  };

  function renderizarClientes(lista) {
    return lista.map((cliente) => (
      <option key={cliente.nombre} value={cliente._id}>
        {cliente.nombre}
      </option>
    ));
  }

  return (
    <div>
      <form className="form-nueva-solicitud" onSubmit={enviarSolicitud}>
        <Paper className="paper-nueva-solicitud" elevation={20}>
          <div className="title-envio">
            <p>Introduzca los detalles de la solicitud</p>
          </div>
          <Divider />
          <div className="container-p">
            <div className="container-a">
              <div className='container-select-empty'>
                <FormControl variant="outlined" className="form-control-select">
                  <p>Cliente: </p>
                  <Select
                    native
                    disabled={loading}
                    value={state.refCliente}
                    name="refCliente"
                    onChange={handleChange}
                    id='cliente'
                    className="select-empty"
                  >
                    <option aria-label="None"></option>
                    {renderizarClientes(listaClientes)}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" className="form-control-select">
                  <p>Prioridad: </p>
                  <Select
                    disabled={loading}
                    native
                    value={state.prioridad}
                    name="prioridad"
                    id="prioridad"
                    placeholder="seleccionar prioridad"
                    onChange={handleChange}
                    className="select-empty"
                  >
                    <option aria-label="None"></option>
                    {renderLista(prioridad)}
                  </Select>
                </FormControl>
              </div>
              <div className='container-select-empty'>
                <FormControl variant="outlined" className="form-control-select">
                  <p>Requerimiento: </p>
                  <Select
                    placeholder="Seleccionar requerimiento"
                    disabled={loading}
                    native
                    value={state.requerimiento}
                    name="requerimiento"
                    id='requerimiento'
                    onChange={handleChange}
                    className="select-empty"
                  >
                    <option aria-label="None"></option>
                    {renderLista(requerimiento)}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" className="form-control-select">
                  <p>Categoria: </p>
                  <Select
                    disabled={loading}
                    native
                    value={state.categoria}
                    name="categoria"
                    id='categoria'
                    onChange={handleChange}
                    className="select-empty"
                  >
                    <option aria-label="None"></option>
                    {renderLista(categorias)}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="form-control-text">
              <p className="text-field">Correo del solicitante: </p>
              <TextField
                placeholder="Correo"
                disabled={loading}
                value={state.correo}
                onChange={handleChange}
                name="correo"
                id='correo'
                variant="outlined"
              />
            </div>
            <div className="form-control-text">
              <p className="text-field">Ciudad: </p>
              <TextField
                placeholder="Ciudad"
                disabled={loading}
                value={state.ciudad}
                onChange={handleChange}
                name="ciudad"
                id='ciudad'
                variant="outlined"
              />
            </div>
            <div className="form-control-text">
              <p className="text-field">Resumen: </p>
              <TextField
                placeholder="Resumen"
                disabled={loading}
                value={state.resumen}
                onChange={handleChange}
                name="resumen"
                id='resumen'
                variant="outlined"
                inputProps={{
                  maxLength: 35,
                }}
              />
            </div>
            <div className="form-control-text">
              <p className="text-field">Descripcion: </p>
              <TextField
                placeholder="Descripcion"
                disabled={loading}
                value={state.descripcion}
                onChange={handleChange}
                name="descripcion"
                id='descripcion'
                className="form-control-descripcion"
                variant="outlined"
                multiline
                rows={4}
              />
            </div>
          </div>
          <h6 style={{ color: mensaje.color }} className='informacion-incompleta'>
            {mensaje.text}
          </h6>
          <div className="button-enviar-nueva-solicitud">
            {loading ? (
              <CircularProgress
                color="inherit"
                className="icon-enviar"
                disableShrink
              />
            ) : (
              <Button
                variant="contained"
                type="submit"
                component="button"
                className="button-enviar"
              >
                <p className="button-p">Enviar solicitud</p>
              </Button>
            )}
          </div>
        </Paper>
      </form>
    </div>
  );
}
