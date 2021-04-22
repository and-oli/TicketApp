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
  const [state, setState] = useState({
    refUsuarioAsignado: "",
    titulo: "",
    nota: "",
    foto: undefined,
    file: undefined,
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
    setState((prevState) => ({ ...prevState, [id]: files[0] }));
  };

  const handleChange = (event) => {
    let { name, value } = event.target;

    event.preventDefault();

    if (name === "abierta" && value === "") {
      value = undefined;
    }
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const enviarCambio = (event) => {
    let formData = new FormData();
    let data = {
      refSolicitud: props.refSolicitud,
    };

    formData.append("foto", state.foto);
    formData.append("file", state.file);

    for (let cambio in state) {
      if (state[cambio] !== undefined || "") {
        data[cambio] = state[cambio];
      }
    }
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
    event.preventDefault();
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
          <label htmlFor="asignar">Asignar:</label>
          <NativeSelect
            value={state.refUsuarioAsignado}
            name="refUsuarioAsignado"
            onChange={handleChange}
            className="select-empty"
          >
            <option value="">Asignado {props.asignado}</option>

            {renderizarTecnicos()}
          </NativeSelect>
        </FormControl>

        <FormControl
          className="form-control"
          disabled={state.refUsuarioAsignado === "" ? false : true}
        >
          <label htmlFor="abierta">Estado:</label>
          <NativeSelect
            value={state.abierta}
            name="abierta"
            onChange={handleChange}
            className="select-empty"
          >
            <option value="">Estado {props.estado}</option>
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
            <input type="file" id="file" onChange={handleSelectFile} />
            <input
              type="file"
              label='Tomar foto'
              id="foto"
              accept="image/*"
              capture="camera"
              onChange={handleSelectFile}
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