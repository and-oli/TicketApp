import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import TextField from "@material-ui/core/TextField";

export default class CambiosSolicitud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estado: "",
      nota: "",
      abierta: undefined,
    };

    this.handleChange = this.handleChange.bind(this);
    this.enviarCambio = this.enviarCambio.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  enviarCambio(event) {
    const state = this.state;
    let data = {
      refSolicitud: this.props.refSolicitud,
      refUsuario: this.props.refUsuario,
    };
    for (let cambio in state) {
      data[cambio] = state[cambio];
    }
    fetch(`http://localhost:3000/cambiosSolicitud/${this.props.idSolicitud}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {});
    event.preventDefault();
  }

  render() {
    return (
      <Paper className="paper-solicitud-b" elevation={4}>
        <form onSubmit={this.enviarCambio}>
          <FormControl className="form-control">
            <label htmlFor="asignar">Asignar a:</label>
            <NativeSelect
              value={this.state.estado}
              name="estado"
              onChange={this.handleChange}
              className="select-empty"
            >
              <option value="">asigne a</option>
              <option value="asignada">asigne a</option>
            </NativeSelect>
          </FormControl>
          <FormControl className="form-control">
            <label htmlFor="abierta">Cambiar estado a:</label>
            <NativeSelect
              value={this.state.abierta}
              name="abierta"
              onChange={this.handleChange}
              className="select-empty"
            >
              <option value="">seleccione estado</option>
              <option value={false}>resuelta</option>
            </NativeSelect>
          </FormControl>
          <TextField
            value={this.state.nota}
            label="Nota"
            onChange={this.handleChange}
            name="nota"
            className="form-control"
            variant="outlined"
            multiline
            rows={4}
          />
          <input className="adjuntar-archivo" type="file" />
          <input
            className="actualizar-button"
            type="submit"
            value="Guardar cambio"
          />
        </form>
      </Paper>
    );
  }
}
