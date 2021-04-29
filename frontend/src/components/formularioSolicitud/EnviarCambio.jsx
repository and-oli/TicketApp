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

  useEffect(() => {
    const archObj = {};
    categoriasArchivos.forEach((cat) => (archObj[cat] = undefined));
    setArchivos(archObj);
    fetch("http://localhost:3001/users", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((json) => setTecnicos(json.tecnicos));
  }, [categoriasArchivos]);

  useEffect(() => {
    fetch("http://localhost:3001/cambiosSolicitud/constantes", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setCategoriasArchivos([...Object.values(json.categoriasDeArchivos)]);
        setEstados([...Object.values(json.estados)]);
      });
  }, []);

  const handleSelectFile = (files, categoria) => {
    setArchivos((prevState) => ({ ...prevState, [categoria]: files }));
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

    const formData = new FormData();
    for (const categoria of categoriasArchivos) {
      if (archivos[categoria] !== undefined) {
        formData.append(categoria, archivos[categoria][0]);
      }
    }

    const responseArchivos = await fetch(`http://localhost:3001/archivo/postFile`,{
        method: "POST",
        body: formData,
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      }
    );
    const responseArchivosJson = await responseArchivos.json();

    const data = { refSolicitud: props.refSolicitud };

    for (let cambio in state) {
      if (state[cambio] !== undefined && state[cambio] !== "") {
        data[cambio] = state[cambio];
      }
    }

    fetch(`http://localhost:3001/cambiosSolicitud/${props.idSolicitud}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setloading(true);
        if (json.ok) {
          window.location.reload();
        }
      });
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
          Adjuntar {categoria.toLowerCase()}s
        </label>
        <input
          type="file"
          style={{ display: "none" }}
          id={categoria.toLowerCase()}
          onChange={(e) => handleSelectFile(e.target.files, categoria)}
          capture="camera"
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

  return (
    <Paper className="paper-solicitud-b" elevation={10}>
      <form onSubmit={enviarCambio}>
        <FormControl
          className="form-control"
          disabled={state.abierta === undefined ? false : true}
        >
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

        <FormControl
          className="form-control"
          disabled={state.dueno === "" ? false : true}
        >
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
        {/* <div id="container-archivos"> */}
        {renderizarCamposArchivos()}
        {/* </div> */}
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
