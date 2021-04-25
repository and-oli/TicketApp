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
  const [state, setState] = useState({
    refCliente: "",
    prioridad: "",
    resumen: "",
    descripcion: "",
    correo: "",
    ciudad: "",
    requerimiento: "",
    categoria: "",
    subCategoria: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/users/clientes", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((getClientes) => {
        setListaClientes(getClientes.clientes);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const enviarSolicitud = (event) => {
    let data = {};
    let confirmarPost = true;

    event.preventDefault();

    for (let info in state) {
      if (state[info] !== "") {
        data[info] = state[info];
      } else {
        confirmarPost = false;
        setMensaje({
          text: "La informacion debe estar completa.",
          color: "orange",
        });
        break;
      }
    }

    if (confirmarPost) {
      fetch("http://localhost:3001/solicitudes/nuevaSolicitud", {
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
                value={state.requerimiento}
                name="requerimiento"
                onChange={handleChange}
                className="select-empty"
              >
                <option value="">Tipo de requerimiento</option>
                <option value="Incidencia">Incidencia</option>
                <option value="Consulta">Consulta</option>
              </NativeSelect>
            </FormControl>
            <FormControl className="form-control">
              <NativeSelect
                value={state.categoria}
                name="categoria"
                onChange={handleChange}
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
                value={state.subCategoria}
                name="subCategoria"
                onChange={handleChange}
                className="select-empty"
              >
                <option value="">Sub Categorias</option>
                <option value="Otros">Otros</option>
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
