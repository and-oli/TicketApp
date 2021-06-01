import React, { useEffect, useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import "../styles/EnviarSolicitud.css";

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
      "http://localhost:3001/constantes/categoriasSolicitud",
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

    const clientes = await getClientes.json();
    const resCategorias = await categoriasSolicitud.json();
    const resPrioridad = await prioridad.json();
    const resRequerimiento = await requerimiento.json();

    setListaClientes(clientes.clientes);
    setCategorias(Object.values(resCategorias));
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
      const resFetch = await fetch(
        "http://localhost:3001/solicitudes/nuevaSolicitud",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "x-access-token": localStorage.getItem("TAToken"),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const resJson = await resFetch.json();
      console.log(resJson.notificacion)
      if (resJson.ok) {
        await fetch(
          "http://localhost:3001/notification/solicitudNotifications",
          {
            method: "POST",
            body: JSON.stringify(resJson),
            headers: {
              "x-access-token": localStorage.getItem("TAToken"),
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        setloading(false);
        window.location.reload();
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
      <div className="title-envio">
        <p>Introduzca los detalles de la solicitud</p>
      </div>
      <form onSubmit={enviarSolicitud}>
        <div className="container-p">
          <div className="container-a">
            <FormControl className="form-control">
              <NativeSelect
                value={state.refCliente}
                name="refCliente"
                onChange={handleChange}
                className="select-empty"
              >
                <option value="">Cliente</option>
                {renderizarClientes(listaClientes)}
              </NativeSelect>
            </FormControl>
            <FormControl className="form-control">
              <NativeSelect
                value={state.prioridad}
                name="prioridad"
                onChange={handleChange}
                className="select-empty"
              >
                {renderLista(prioridad)}
              </NativeSelect>
            </FormControl>
            <FormControl className="form-control">
              <NativeSelect
                value={state.requerimiento}
                name="requerimiento"
                onChange={handleChange}
                className="select-empty"
              >
                {renderLista(requerimiento)}
              </NativeSelect>
            </FormControl>
            <FormControl className="form-control">
              <NativeSelect
                value={state.categoria}
                name="categoria"
                onChange={handleChange}
                className="select-empty"
              >
                {renderLista(categorias)}
              </NativeSelect>
            </FormControl>
          </div>
          <div className="container-b">
            <TextField
              value={state.correo}
              label="Correo"
              onChange={handleChange}
              name="correo"
              className="form-control"
              variant="outlined"
            />
            <TextField
              value={state.ciudad}
              label="Ciudad"
              onChange={handleChange}
              name="ciudad"
              className="form-control"
              variant="outlined"
            />
            <TextField
              value={state.resumen}
              label="Resumen"
              onChange={handleChange}
              name="resumen"
              className="form-control"
              variant="outlined"
            />
            <TextField
              value={state.descripcion}
              label="Descripcion"
              onChange={handleChange}
              name="descripcion"
              className="form-control"
              variant="outlined"
              multiline
              rows={4}
            />
          </div>
        </div>
        <h6
          style={{
            color: mensaje.color,
            marginTop: 0,
            height: 10,
            textAlign: "center",
          }}
        >
          {mensaje.text}
        </h6>
        <div className="button">
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
      </form>
    </div>
  );
}
