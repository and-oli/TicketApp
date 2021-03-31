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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const enviarCambio = (event) => {
    let data = {
      refSolicitud: props.refSolicitud,
    };
    for (let cambio in state) {
      data[cambio] = state[cambio];
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
        <FormControl className="form-control">
          <label htmlFor="asignar">Asignar a:</label>
          <NativeSelect
            value={state.refUsuarioAsignado}
            name="refUsuarioAsignado"
            onChange={handleChange}
            className="select-empty"
          >
            <option value="">seleccione usuario</option>
            {renderizarTecnicos()}
          </NativeSelect>
        </FormControl>

        <FormControl className="form-control">
          <label htmlFor="abierta">Cambiar estado a:</label>
          <NativeSelect
            value={state.abierta}
            name="abierta"
            onChange={handleChange}
            className="select-empty"
          >
            <option value="">Seleccione un estado</option>
            <option value={false}>resuelta</option>
          </NativeSelect>
        </FormControl>

        <TextField
          value={state.nota}
          label="Nota"
          onChange={handleChange}
          name="nota"
          className="form-control"
          variant="outlined"
          multiline
          required
          rows={4}
        />
        <input className="adjuntar-archivo" type="file" />
        {loading ? (
          <CircularProgress
            color='action'
            className='icon-enviar'
            disableShrink
          />
        ) : (
          <Button
            variant="contained"
            type="submit"
            color="default"
            component="button"
            className="button-guardar"
          >
            <p className="button-p">Guardar cambio</p>
          </Button>
        )}
      </form>
    </Paper>
  );
}
