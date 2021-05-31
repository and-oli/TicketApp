import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// TODO: Determinar fuente de verdad para categorías
export default function CambiosSolicitud(props) {
  const [loading, setloading] = useState(false);
  const [listaTecnicos, setTecnicos] = useState([]);
  const [categoriasArchivos, setCategoriasArchivos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [archivos, setArchivos] = useState({});
  const [state, setState] = useState({
    dueno: "",
    titulo: "",
    nota: "",
    abierta: undefined,
  });

  const renderizarConstantes = async () => {
    const archObj = {};
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const categoriasArchivos = await fetch(
      "http://192.168.0.8:3001/constantes/categoriasArchivos",
      header
    );
    const estados = await fetch(
      "http://192.168.0.8:3001/constantes/estados",
      header
    );
    const tecnicos = await fetch("http://192.168.0.8:3001/users", header);

    const resCategoriasArchivos = await categoriasArchivos.json();
    const resEstados = await estados.json();
    const resTecnicos = await tecnicos.json();

    setCategoriasArchivos(Object.values(resCategoriasArchivos));
    setEstados(Object.values(resEstados));
    setTecnicos(resTecnicos.tecnicos);

    const categoriasDeArchivos = Object.values(resCategoriasArchivos);
    categoriasDeArchivos.forEach((cat) => (archObj[cat] = undefined));
    setArchivos(archObj);
  };

  useEffect(() => {
    renderizarConstantes();
  }, []);

  const handleSelectFile = (files, categoria) => {
    const archivosSeleccionados = [];
    for (let i = 0; i < files.length; i++) {
      archivosSeleccionados.push(files[i]);
    }

    setArchivos((prevState) => ({
      ...prevState,
      [categoria]: archivosSeleccionados,
    }));
  };

  const handleChange = (event) => {
    let { name, value } = event.target;

    event.preventDefault();

    if (name === "abierta" && value === "") {
      value = undefined;
    }
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const enviarCambio = async (event) => {
    event.preventDefault();

    setloading(true);

    const formData = new FormData();
    for (const categoria of categoriasArchivos) {
      if (archivos[categoria] !== undefined) {
        for (const archivo of archivos[categoria]) {
          formData.append(categoria, archivo);
        }
      }
    }
    const responseArchivos = await fetch(
      `http://192.168.0.8:3001/archivo/postFile`,
      {
        method: "POST",
        body: formData,
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      }
    );
    const responseArchivosJson = await responseArchivos.json();

    const data = { refSolicitud: props.refSolicitud };

    if (responseArchivosJson) {
      data.archivos = responseArchivosJson.archivos;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const ready = await navigator.serviceWorker.ready;
      const subscription = await ready.pushManager.getSubscription();
      data.subscription = subscription;
      for (let cambio in state) {
        if (state[cambio] !== undefined && state[cambio] !== "") {
          data[cambio] = state[cambio];
        }
      }
    }

    const resCambio = await fetch(`http://192.168.0.8:3001/cambiosSolicitud/${props.idSolicitud}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    const resCambioJson = await resCambio.json();
    const cambiosNoficacion = {solicitud:resCambioJson.solicitud, notificacion:resCambioJson.notificacion }
      if (resCambioJson.ok) {
        await fetch('http://192.168.0.8:3001/notification/cambioNotifications',{
          method: "post",
          headers: {
            "x-access-token": localStorage.getItem("TAToken"),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cambiosNoficacion)
        })
        setloading(false);
        window.location.reload();
      }
  };

  const renderizarTecnicos = () => {
    return listaTecnicos.map((tecnico) => (
      <option key={tecnico._id} value={tecnico._id}>
        {tecnico.name}
      </option>
    ));
  };

  const renderizarEstados = () => {
    return estados.map((estado, i) => {
      if (estado !== props.estado) {
        return (
          <option key={i} value={estado === "Resuelta" ? false : estado}>
            {estado}
          </option>
        );
      } else {
        return null;
      }
    });
  };

  const renderizarCamposArchivos = () => {
    return categoriasArchivos.map((categoria, i) => (
      <div className="container-item-archivo" key={i}>
        <label htmlFor={categoria.toLowerCase()} id="label-file">
          {"Adjuntar  " + categoria.toLowerCase()}s
        </label>
        <input
          type="file"
          style={{ display: "none" }}
          id={categoria.toLowerCase()}
          onChange={(e) => handleSelectFile(e.target.files, categoria)}
          capture={categoria === "Foto" ? "camera" : false}
          multiple
        />
        <h6 className="title-file">
          {archivos[categoria]
            ? `${archivos[categoria].length} archivo(s) seleccionado(s)`
            : ""}
        </h6>
      </div>
    ));
  };

  const renderizarCambiosEspecialista = () => {
    return (
      <div>
        <FormControl className="form-control">
          <label htmlFor="asignar">Dueño:</label>
          <NativeSelect
            value={state.dueno}
            name="dueno"
            onChange={handleChange}
            className="select-empty"
          >
            <option value="">{props.asignado}</option>
            {renderizarTecnicos()}
          </NativeSelect>
        </FormControl>

        <FormControl className="form-control">
          <label htmlFor="abierta">Estado:</label>
          <NativeSelect
            value={state.abierta}
            name="abierta"
            onChange={handleChange}
            className="select-empty"
          >
            <option value="">{props.estado}</option>
            {renderizarEstados()}
          </NativeSelect>
        </FormControl>
      </div>
    );
  };

  return (
    <Paper className="paper-solicitud-b" elevation={10}>
      <form onSubmit={enviarCambio}>
        {props.user === "Especialista" || props.user === "Tecnico" || "ADMINISTRADOR"
          ? renderizarCambiosEspecialista()
          : null}
        <TextField
          value={state.titulo}
          label="Titulo del cambio"
          onChange={handleChange}
          name="titulo"
          className="form-control"
          variant="outlined"
          multiline
          inputProps={{
            maxLength: 35,
          }}
          required
          rows={1}
        />
        <TextField
          value={state.nota}
          label="Nota"
          onChange={handleChange}
          name="nota"
          className="form-control"
          variant="outlined"
          multiline
          inputProps={{
            maxLength: 150,
          }}
          required
          rows={4}
        />
        {props.user === "Especialista" || props.user === "Tecnico" || "ADMINISTRADOR"
          ? renderizarCamposArchivos()
          : null}
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
              className="button-guardar"
            >
              <p className="button-p">Guardar cambio</p>
            </Button>
          )}
        </div>
      </form>
    </Paper>
  );
}
