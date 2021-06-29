import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import '../styles/incumbentes.css'


export default function ListaDeIncumbentes(props) {
  const { _id } = props;
  const [listaIncumbentes, setListaIncumbentes] = useState([]);
  const [incumbente, setIncumbente] = useState('');
  const [listadoPosiblesIncumbentes, setPosiblesIncumbentes] = useState([]);
  const [agregando, setAgregando] = useState(false);
  const [incumbenteVacio, setIncumbenteVacio] = useState('');
  const [cargandoIncumbentes, setCargandoIncumbentes] = useState(false);

  const getIncumbentes = async (id) => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      }
    };
    setCargandoIncumbentes(true)

    const incumbentesActuales = await fetch(`http://192.168.1.39:3001/incumbentes/listaDeIncumbentes/${id}`, header);
    const listaPosiblesIncumbentes = await fetch(`http://192.168.1.39:3001/incumbentes/posiblesIncumbentes`, header);

    const incumbentesJson = await incumbentesActuales.json();
    const posiblesIncumbentesJson = await listaPosiblesIncumbentes.json();

    setListaIncumbentes(incumbentesJson.lista);
    setPosiblesIncumbentes(posiblesIncumbentesJson.listaPosiblesUsuarios);
    setCargandoIncumbentes(false)
  };

  useEffect(() => {
    getIncumbentes(_id);
  }, [_id]);

  const handleChange = (event, values) => {
    const value = event ? event.target.value : values;
    setIncumbente(value ? value : '');
  };

  const handleDelete = async (incumbente) => {
    const data = {};
    const lista = listaIncumbentes.filter(i => i !== incumbente);

    data.idSolicitud = _id;
    data.nuevaLista = lista;

    await fetch('http://192.168.1.39:3001/incumbentes/deleteIncumbente', {
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

  const agregarIncumbentes = async () => {
    setAgregando(true);
    if (incumbente) {
      const usuarioRepetido = listaIncumbentes.filter(user => user.username === incumbente)[0];
      if (!usuarioRepetido) {
        const nuevoUsuario = listadoPosiblesIncumbentes.filter(user => user.username === incumbente)[0];
        if (nuevoUsuario) {
          const data = {};
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
            const listaActual = listaIncumbentes;
            listaActual.push(nuevoUsuario);
            setListaIncumbentes(listaActual);
            setIncumbente('');
            setIncumbenteVacio('');
            setAgregando(false);
          }
        } else {
          setIncumbente('');
          setIncumbenteVacio('El usuario no fue encontrado');
          setAgregando(false);
        }
      } else {
        setIncumbente('');
        setIncumbenteVacio('El usuario ya esta en la lista');
        setAgregando(false);
      }
    } else {
      setIncumbenteVacio('Ningun usuario seleccionado');
      setAgregando(false);
    }
  };

  const renderizarIncumbentes = () => {
    if (listaIncumbentes !== undefined) {
      const chips = listaIncumbentes.map(incumbente => {
        return (
          <Chip
            className='chip-incumbente'
            key={incumbente._id}
            avatar={
              <Avatar
                alt={incumbente.username}
                src="/static/images/avatar/1.jpg"
              />}
            id={incumbente._id}
            label={<p>{incumbente.username}</p>}
            onDelete={() => handleDelete(incumbente)}
          />
        )
      });
      if (cargandoIncumbentes) {
        return (
          <div className='cargar-lista-de-incumbentes'>
            <CircularProgress
              color="inherit"
              className="icon-agregar-incumbente"
              disableShrink
            />
          </div>
        )
      } else {
        return (
          <div className='lista-de-incumbentes'>
            {chips.length
              ? chips
              : <h4>La lista esta vacia</h4>}
          </div>
        )
      }
    };
  };
  return (
    <div className='ajuste-listado-incumbentes'>
      <p><b>Incumbentes:</b></p>
      <Autocomplete
        rows={1}
        className='form-control-agregar-lista'
        freeSolo
        options={incumbente
          ? incumbente.length >= 3
            ? listadoPosiblesIncumbentes.map(user => user.username)
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
            id="usuario-incumbente"
            className="input-agregar"
            onClick={() => setIncumbenteVacio('')}
            type="text"
            rows={1}
            {...params}
          />
        )}
      />
      {agregando ?
        <div id='label-agregar-icon'>
          <CircularProgress
            color="inherit"
            className="icon-agregar-incumbente"
            disableShrink
          />

        </div>
        :
        <div className='container-agregar-button'>
          <button
            className="button-agregar"
            type='button'
            onClick={agregarIncumbentes}
          >
            Agregar
          </button>
        </div>
      }
      <h4 className='incumbente-vacio'>{incumbenteVacio}</h4>
      {renderizarIncumbentes()}
    </div>
  )
};
