import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function CambiosSolicitud(props) {
  const [loading, setloading] = useState(false);
  const [listaTecnicos, setTecnicos] = useState([]);
  const [files, setFiles] = useState({
    foto: undefined,
    file: undefined,
  })
  const [state, setState] = useState({
    dueno: "",
    titulo: "",
    nota: "",
    abierta: undefined,
  });

  useEffect(() => {
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((json) => setTecnicos(json.tecnicos));
  }, []);

  const handleSelectFile = (event) => {
    event.preventDefault();
    let { id, files } = event.target;
    setFiles((prevState) => ({ ...prevState, [id]: files[0] }));
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
    const formData = new FormData();
    let data = {
      refSolicitud: props.refSolicitud,
    };

    event.preventDefault();

    for (let cambio in state) {
      if (state[cambio] !== undefined && state[cambio] !== "") {
        data[cambio] = state[cambio];
      }
    }

    const response = await fetch(`http://localhost:3000/cambiosSolicitud/postFile`, {
      method: "POST",
      body: formData,
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    });
    const responseJson = await response.json();
    const ruta = responseJson.ruta;

    data.ruta = ruta

    fetch(`http://localhost:3000/cambiosSolicitud/${props.idSolicitud}`, {
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
            <option value={false}>Resuelta</option>
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
        <div className='container-input'>
          <label htmlFor='file' id='label-file'>
            Adjuntar archivo
        </label>
          <input type="file" id="file" onChange={handleSelectFile} />
          <h6 className='title-file'>{files.file ? files.file.name : null}</h6>
          <label htmlFor='foto' id='label-file'>
            Subir foto
        </label>
          <input
            type="file"
            id="foto"
            accept="image/*"
            capture="camera"
            onChange={handleSelectFile}
          />
          <h6 className='title-file'>{files.foto ? files.foto.name : null}</h6>
        </div>
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