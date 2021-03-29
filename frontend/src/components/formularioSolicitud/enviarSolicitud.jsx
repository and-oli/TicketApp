import React from "react";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import TextField from "@material-ui/core/TextField";
import "../styles/EnviarSolicitud.css";

export default class EnviarSolicitud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refCliente: "",
      prioridad: "",
      resumen: "",
      descripcion: "",
      nombre: "",
      correo: "",
      ciudad: "",
      requerimiento: "",
      categoria: "",
      subCategoria: "",
      listaClientes: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.enviarSolicitud = this.enviarSolicitud.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:3000/users/clientes", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((getClientes) => {
        this.setState({ listaClientes: getClientes.clientes });
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  enviarSolicitud(event) {
    const state = this.state;
    let data = {};
    for (let info in state) {
      if (state[info] !== state.listaClientes) {
        data[info] = state[info];
      }
    }
    fetch("http://localhost:3000/solicitudes", {
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
        <form onSubmit={this.enviarSolicitud}>
          <div className="container-p">
            <div className="container-a">
              <FormControl className="form-control">
                <NativeSelect
                  value={this.state.refCliente}
                  name="refCliente"
                  onChange={this.handleChange}
                  className="select-empty"
                >
                  <option value="">Cliente</option>
                  {renderizarClientes(this.state.listaClientes)}
                </NativeSelect>
              </FormControl>
              <FormControl className="form-control">
                <NativeSelect
                  value={this.state.prioridad}
                  name="prioridad"
                  onChange={this.handleChange}
                  className="select-empty"
                >
                  <option value="Prioridad">Prioridad</option>
                  <option value="Ninguna">Ninguna</option>
                  <option value="Baja">Baja</option>
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                  <option value="Inmediata">Inmediata</option>
                </NativeSelect>
              </FormControl>
              <FormControl className="form-control">
                <NativeSelect
                  value={this.state.requerimiento}
                  name="requerimiento"
                  onChange={this.handleChange}
                  className="select-empty"
                >
                  <option value="">Tipo de requerimiento</option>
                  <option value="Incidencia">Incidencia</option>
                  <option value="Consulta">Consulta</option>
                </NativeSelect>
              </FormControl>
              <FormControl className="form-control">
                <NativeSelect
                  value={this.state.categoria}
                  name="categoria"
                  onChange={this.handleChange}
                  className="select-empty"
                >
                  <option value="">Categorias</option>
                  <option value="Aires Acondicionados">
                    Aires Acondicionados
                  </option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Backup's">Backup's</option>
                  <option value="Correo electronico">Correo electronico</option>
                  <option value="Cuentas de acceso">Cuentas de acceso</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="General">General</option>
                  <option value="Gestion documental">Gestion documental</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Infraestructura - Obra Civil">
                    Infraestructura - Obra Civil
                  </option>
                  <option value="Internet">Internet</option>
                  <option value="Monitoreo">Monitoreo</option>
                  <option value="Programación de Técnico">
                    Programación de Técnico
                  </option>
                  <option value="Redes de Datos">Redes de Datos</option>
                  <option value="Seguridad Informática">
                    Seguridad Informática
                  </option>
                  <option value="Software">Software</option>
                  <option value="Synergy">Synergy</option>
                  <option value="Telefonía">Telefonía</option>
                </NativeSelect>
              </FormControl>
              <FormControl className="form-control">
                <NativeSelect
                  value={this.state.subCategoria}
                  name="subCategoria"
                  onChange={this.handleChange}
                  className="select-empty"
                >
                  <option value="">Sub Categorias</option>
                  <option value="Otros">Otros</option>
                </NativeSelect>
              </FormControl>
            </div>
            <div className="container-b">
              <TextField
                value={this.state.correo}
                label="Correo"
                onChange={this.handleChange}
                name="correo"
                className="form-control"
                variant="outlined"
              />
              <TextField
                value={this.state.ciudad}
                label="Ciudad"
                onChange={this.handleChange}
                name="ciudad"
                className="form-control"
                variant="outlined"
              />
              <TextField
                value={this.state.resumen}
                label="Resumen"
                onChange={this.handleChange}
                name="resumen"
                className="form-control"
                variant="outlined"
              />
              <TextField
                value={this.state.descripcion}
                label="Descripcion"
                onChange={this.handleChange}
                name="descripcion"
                className="form-control"
                variant="outlined"
                multiline
                rows={4}
              />
            </div>
          </div>
          <div className="button">
            <input type="submit" value="Enviar solicitud" />
          </div>
        </form>
        </div>
    );
  }
}
