import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import ListaDeIncumbentes from "../shared/Incumbentes";

export default function CambiosSolicitud(props) {
  const [loading, setloading] = useState(false);
  const [listaTecnicos, setTecnicos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [archivos, setArchivos] = useState({});
  const [excesoDeArchivos, setExcesoDeArchivos] = useState({})
  const [state, setState] = useState({
    dueno: "",
    titulo: "",
    nota: "",
    estado: "",
    incunbente: "",
  });
  const {
    categoriasArchivos,
    estado,
    referenciaSolicitud,
    idSolicitud,
    user,
    asignado,
  } = props;

  const renderizarConstantes = async (categorias) => {
    const archObj = {};
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const estados = await fetch(
      "http://192.168.1.39:3001/constantes/estados",
      header
    );
    const tecnicos = await fetch("http://192.168.1.39:3001/users", header);

    const resEstados = await estados.json();
    const resTecnicos = await tecnicos.json();

    setEstados(Object.values(resEstados));
    setTecnicos(resTecnicos.tecnicos);
    const categoriasDeArchivos = Object.values(categorias);
    categoriasDeArchivos.forEach((cat) => (archObj[cat] = undefined));
    setArchivos(archObj);
  };

  useEffect(() => {
    renderizarConstantes(categoriasArchivos);
  }, [categoriasArchivos]);

  const handleSelectFile = (files, categoria) => {
    const archivosSeleccionados = [];
    for (let i = 0; i < files.length; i++) {
      archivosSeleccionados.push(files[i]);
    }
    //Limita los archivos a 3 por categoria
    if (files.length > 3) {
      //Mensaje en caso de que sean mas de tres archivos 
      setExcesoDeArchivos((prevState) => ({
        ...prevState,
        [categoria]: {
          exceso: true,
          color: 'red'
        }
      }))
    } else {
      setExcesoDeArchivos((prevState) => ({
        ...prevState,
        [categoria]: {
          exceso: false,
          color: 'black'
        }
      }))
    }
    setArchivos((prevState) => ({
      ...prevState,
      [categoria]: archivosSeleccionados,
    }));
  };

  const handleChange = (event) => {
    let { name, value } = event.target;

    event.preventDefault();
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const enviarCambio = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    for (const categoria of categoriasArchivos) {
      //Verifica que hayan archivos por cada categoria
      if (archivos[categoria]) {
        for (const archivo of archivos[categoria]) {
          formData.append(categoria, archivo);
        }
      } else {
        break
      }
    }
    const responseArchivos = await fetch(
      `http://192.168.1.39:3001/archivo/postFile`,
      {
        method: "POST",
        body: formData,
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      }
    ); setloading(true);
    const responseArchivosJson = await responseArchivos.json();

    const data = { refSolicitud: referenciaSolicitud };
    if (responseArchivosJson) {
      if (responseArchivosJson.ok) {
        data.archivos = responseArchivosJson.archivos;
      } else {
        setloading(false);
        return null
      }
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

    const resCambio = await fetch(
      `http://192.168.1.39:3001/cambiosSolicitud/${idSolicitud}`,
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
    const resCambioJson = await resCambio.json();
    const cambiosNoficacion = {
      solicitud: resCambioJson.solicitud,
      notificacion: resCambioJson.notificacion,
    };
    if (resCambioJson.ok) {
      await fetch("http://192.168.1.39:3001/notification/cambioNotifications", {
        method: "post",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cambiosNoficacion),
      });
      setloading(false);
      window.location.reload();
    }
  };

  const renderizarTecnicos = () => {
    return listaTecnicos.map((tecnico) => {
      if (tecnico.name !== asignado) {
        return (
          <option key={tecnico._id} value={tecnico._id}>
            {tecnico.name}
          </option>
        );
      } else return null;
    });
  };

  const renderizarEstados = () => {
    return estados.map((estadoActual, i) => {
      if (estadoActual !== estado) {
        return (
          <option key={i} value={estadoActual}>
            {estadoActual}
          </option>
        );
      } else {
        return null;
      }
    });
  };

  const verificarCantidadArchivos = (categoria) => {

    const archivosTotales = archivos[categoria]
    const cantidadPermitida = excesoDeArchivos[categoria]

    if (archivosTotales) {
      if (archivosTotales.length) {
        return (
          <h6 className="title-file" style={{ color: cantidadPermitida.color }}>
            {archivosTotales
              ? cantidadPermitida.exceso ?
                `Deben ser maximo 3 archivos` :
                `${archivosTotales.length} archivo(s) seleccionado(s)`
              : ""}
          </h6>
        )
      }
    }
  }

  const renderizarCamposArchivos = () => {
    return categoriasArchivos.map((categoria, i) => (
      <div className="container-item-archivo" key={i}>
        <label htmlFor={categoria.toLowerCase()} id="label-file">
          <p>{"Adjuntar  " + categoria.toLowerCase()}s</p>
        </label>
        <input
          accept={categoria === "Foto" ? "image/png, image/gif, image/jpeg" : null}
          type="file"
          style={{ display: "none" }}
          id={categoria.toLowerCase()}
          onChange={(e) => handleSelectFile(e.target.files, categoria)}
          capture={categoria === "Foto" ? "camera" : false}
          multiple
        />
        {verificarCantidadArchivos(categoria)}
      </div>
    ));
  };

  const renderizarCambiosEspecialista = () => {
    if (user !== "Usuario") {
      return (
        <div className='cambios-especialista'>
          <FormControl className="form-control-cambio">
            <label htmlFor="abierta"><p><b>Estado:</b></p></label>
            <NativeSelect
              value={state.abierta}
              name="estado"
              id="estado"
              onChange={handleChange}
              className="select-empty-cambio"
            >
              <option value="">{estado}</option>
              {renderizarEstados()}
            </NativeSelect>
          </FormControl>
          <FormControl className="form-control-cambio">
            <label htmlFor="asignar"><p><b>Dueño:</b></p></label>
            <NativeSelect
              value={state.dueno}
              name="dueno"
              id="dueno"
              onChange={handleChange}
              className="select-empty-cambio"
            >
              <option value="">{asignado}</option>
              {renderizarTecnicos()}
            </NativeSelect>
          </FormControl>

        </div>
      );
    }
  };

  return (
    <Paper className="paper-solicitud-b" elevation={10}>
      <div className="detalles-titles">
        <h2>Modificar solicitud</h2>
      </div>
      <Divider />
      <form onSubmit={enviarCambio}>
        {renderizarCambiosEspecialista()}
        <div className='form-text-cambio'>
          <TextField
            value={state.titulo}
            label="Titulo"
            id="titulo-de-cambio"
            onChange={handleChange}
            name="titulo"
            className="form-control-titulo"
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
            id="nota-de-cambio"
            onChange={handleChange}
            name="nota"
            className="form-control-nota"
            variant="outlined"
            multiline
            inputProps={{
              maxLength: 250,
            }}
            required
            rows={2}
          />
        </div>
        <div className='ajuste-categorias-archivos'>
          {renderizarCamposArchivos()}
        </div>
        <ListaDeIncumbentes
          _id={idSolicitud}
        />
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