import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';



export default function ListaDeIncumbentes(props) {
  const { _id } = props;
  const [listaIncumbentes, setListaIncumbentes] = useState([]);
  const [incumbente, setIncumbente] = useState('');
  const [listadoPosiblesIncumbentes, setPosiblesIncumbentes] = useState([]);

  const getIncumbentes = async (id) => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      }
    };

    const incumbentesActuales = await fetch(`http://localhost:3001/incumbentes/listaDeIncumbentes/${id}`, header);
    const listaPosiblesIncumbentes = await fetch(`http://localhost:3001/incumbentes/posiblesIncumbentes`, header);

    const incumbentesJson = await incumbentesActuales.json();
    const posiblesIncumbentesJson = await listaPosiblesIncumbentes.json();
    setListaIncumbentes(incumbentesJson.lista);
    setPosiblesIncumbentes(posiblesIncumbentesJson.listaPosiblesUsuarios);
  };

  useEffect(() => {
    getIncumbentes(_id)
  }, [_id]);

  const handleChange = (event) => {
    const value = event.target.value;
    setIncumbente(value);
  };

  const handleDelete = async (incumbente) => {
    const data = {};
    const lista = listaIncumbentes.filter(i => i !== incumbente);
    data.idSolicitud = _id;
    data.nuevaLista = lista;
    await fetch('http://localhost:3001/incumbentes/deleteIncumbente', {
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
    const nuevoUsuario = listadoPosiblesIncumbentes.filter(i => i.username === incumbente)[0];
    if(nuevoUsuario) {
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
    };
    };
  };

  const renderizarIncumbentes = () => {
    if (listaIncumbentes !== undefined) {
      const chips = listaIncumbentes.map(incumbente => (
        <Chip
          className='chip-incumbente'
          key={incumbente._id}
          avatar={<Avatar alt={incumbente.username} src="/static/images/avatar/1.jpg" />}
          id={incumbente._id}
          label={<p>{incumbente.username}</p>}
          onDelete={() => handleDelete(incumbente)}
        />
      ));
      return (
        <div className='lista-de-incumbentes'>
          {chips}
        </div>
      )
    }
  };

  return (
    <div className='ajuste-listado-incumbentes'>
      <p><b>Incumbentes:</b></p>
      <div className="form-control-agregar-lista">
        <TextField
          value={incumbente}
          label="Usuario incumbente"
          id="usuario-incumbente"
          onChange={handleChange}
          className="input-agregar"
          variant="outlined"
          multiline
          inputProps={{
            maxLength: 10,
          }}
          rows={1}
        />
        <label htmlFor='button-a' id="label-agregar">
          Agregar
        </label>
        
        <input
          type="button"
          style={{ display: "none" }}
          id='button-a'
          onClick={() => agregarIncumbentes()}
        />
      </div>
      {renderizarIncumbentes()}
    </div>
  )
};