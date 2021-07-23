import React, { useEffect, useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "../styles/incumbentes.css"

export default function ListaDeIncumbentes(props) {
  const { _id, deshabilitarEntradas, solicitante } = props;
  const [listaIncumbentes, setListaIncumbentes] = useState([]);
  const [incumbente, setIncumbente] = useState("");
  const [listadoPosiblesIncumbentes, setPosiblesIncumbentes] = useState([]);
  const [agregando, setAgregando] = useState(false);
  const [incumbenteVacio, setIncumbenteVacio] = useState("");
  const [cargandoIncumbentes, setCargandoIncumbentes] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])


  const getIncumbentes = async (id) => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      }
    };
    setCargandoIncumbentes(true);

    const incumbentesActuales = await fetch(
      `http://localhost:3001/incumbentes/listaDeIncumbentes/${id}`,
      header);
    const listaPosiblesIncumbentes = await fetch(`
    http://localhost:3001/incumbentes/posiblesIncumbentes`,
      header);

    const incumbentesJson = await incumbentesActuales.json();
    const posiblesIncumbentesJson = await listaPosiblesIncumbentes.json();
    if (mountedRef.current) {
    setListaIncumbentes(incumbentesJson.lista);
    setPosiblesIncumbentes(posiblesIncumbentesJson.listaPosiblesUsuarios);
    setCargandoIncumbentes(false);
    }
  };

  useEffect(() => {
    getIncumbentes(_id);
  }, [_id]);

  const handleChange = (event, values) => {
    const value = event ? event.target.value : values;
    setIncumbente(value ? value : "");
  };

  const handleDelete = async (incumbente) => {
    const data = {};
    const lista = listaIncumbentes.filter(i => i !== incumbente);

    data.idSolicitud = _id;
    data.nuevaLista = lista;

    await fetch("http://localhost:3001/incumbentes/deleteIncumbente", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setListaIncumbentes(lista);
  };

  const agregarIncumbentes = async (event) => {
    event.preventDefault();
    setAgregando(true);
    if (incumbente) {
      const nuevoUsuario = listadoPosiblesIncumbentes.filter(
        user => user.username === incumbente
      )[0];
      const data = {};
      if (nuevoUsuario) {
        data.refIncumbente = nuevoUsuario._id;
        data.solicitud = _id;
        const resNuevoIncumbente = await fetch(
          `http://localhost:3001/incumbentes/nuevoIncumbente`,
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
        const jsonNuevoIncumbente = await resNuevoIncumbente.json();
        if (jsonNuevoIncumbente.ok) {
          setListaIncumbentes((prevState) => ([...prevState, nuevoUsuario]));
          setIncumbente("");
          setIncumbenteVacio("");
          setAgregando(false);
        } else {
          setIncumbente("");
          setIncumbenteVacio(jsonNuevoIncumbente.mensaje);
          setAgregando(false);
        }
      } else {
        setIncumbenteVacio("El usuario no existe");
        setAgregando(false);
      }
    } else {
      setIncumbenteVacio("Ningun usuario seleccionado");
      setAgregando(false);
    }
  };

  const renderizarIncumbentes = () => {
    if (listaIncumbentes !== undefined) {
      const chips = listaIncumbentes.map(incumbente => {
        return (
          <Chip
            disabled={agregando ||
              deshabilitarEntradas ||
              solicitante ===
              incumbente._id}
            className="chip-incumbente"
            key={incumbente._id}
            avatar={
              <Avatar
                alt={incumbente.username}
                src="/static/images/avatar/1.jpg"
              />}
            id={incumbente._id}
            label={<p>{incumbente.username}</p>}
            onDelete={solicitante !== incumbente._id ?
              () => handleDelete(incumbente
              ) : null}
          />
        )
      });
      if (cargandoIncumbentes) {
        return (
          <div className="cargar-lista-de-incumbentes">
            <CircularProgress
              color="inherit"
              className="icon-agregar-incumbente"
              disableShrink
            />
          </div>
        )
      } else {
        return (
          <div className="lista-de-incumbentes">
            {chips.length
              ? chips
              : <h4>La lista esta vacia</h4>}
          </div>
        )
      }
    };
  };

  const renderizarPosiblesIncumbentes = () => listadoPosiblesIncumbentes.map(user => {
    if (solicitante !== user._id) {
      return user.username
    } else {
      return ""
    }
  });

  return (
    <div className="form-incumbentes" >
      <form onSubmit={agregarIncumbentes}>
        <p><b>Incumbentes:</b></p>
        <div className="ajuste-listado-incumbentes">
          <Autocomplete
            disabled={deshabilitarEntradas || agregando}
            rows={1}
            className="form-control-agregar-lista"
            freeSolo
            options={incumbente
              ? incumbente.length >= 3
                ? renderizarPosiblesIncumbentes()
                : []
              : []
            }
            inputValue={incumbente}
            onInputChange={handleChange}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                label="Usuario incumbente"
                variant="outlined"
                className="input-agregar"
                onClick={() => setIncumbenteVacio("")}
                type="text"
                rows={1}
                {...params}
              />
            )}
          />
          {agregando ?
            <div id="label-agregar-icon">
              <CircularProgress
                color="inherit"
                className="icon-agregar-incumbente"
                disableShrink
              />
            </div> :
            <div className="container-agregar-button">
              <button
                disabled={deshabilitarEntradas}
                style={deshabilitarEntradas ? { backgroundColor: "gray" } : null}
                className="button-agregar"
                type="submit"
              >
                Agregar
              </button>
            </div>
          }
          <h4 className="incumbente-vacio">{incumbenteVacio}</h4>
          {renderizarIncumbentes()}
        </div>
      </form>
    </div>
  )
};
