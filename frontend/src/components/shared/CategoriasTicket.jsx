import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import { Divider } from "@material-ui/core";
import { Button, Paper } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '40%',
    height: 500,
    minWidth: '350px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
}));

export default function CategoriasTickets(props) {
  const { categorias } = props;
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [enviarNuevaCategoria, setEnviarNuevaCategoria] = React.useState('');
  const [listaDeCategorias, setListaDeCategorias] = React.useState([]);
  const [nuevoNombre, setNuevoNombre] = React.useState({});
  const [noDisponible, setNoDisponible] = React.useState(false);
  const [mensajeRespuesta, setMensajeRespuesta] = React.useState({
    texto: '',
    color: '',
  });

  useEffect(() => {
    const listaEditarCategorias = categorias.map(categoria => ({
      ...categoria,
      editar: false
    }));
    setListaDeCategorias(listaEditarCategorias);
  }, [categorias]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setNoDisponible(false)
    setMensajeRespuesta({
      texto: '',
      color: '',
    });
    setNuevoNombre({
      nombreCategoria: '',
      id: '',
    });
    const listaEditarCategorias = categorias.map(categoria => ({
      ...categoria,
      editar: false
    }));
    setListaDeCategorias(listaEditarCategorias);
    setOpen(false);
  };

  const nuevaCategoria = async () => {
    const data = {
      nombreNuevaCategoria: enviarNuevaCategoria.trim(),
    };

    const header = {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const fetchNuevaCategoria = await fetch(
      'http://localhost:3001/categorias/nuevaCategoria',
      header);

    const responseNuevaCategoria = await fetchNuevaCategoria.json();

    if (responseNuevaCategoria.ok) {
      setMensajeRespuesta({
        texto: responseNuevaCategoria.mensaje,
        color: 'green',
      });
      window.location.reload();
    } else {
      setMensajeRespuesta({
        texto: responseNuevaCategoria.mensaje,
        color: 'red',
      });
    };
  };

  const enviarEdicionCategoria = async (id) => {
    const nombreCateoria = nuevoNombre.nombreCategoria.trim();
    const data = {
      nuevoNombreCategoria: nombreCateoria,
      id: nuevoNombre.id,
    };

    const header = {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const fetchEditarCategoria = await fetch(
      'http://localhost:3001/categorias/editarCategoria',
      header);

    const categoriaEditada = await fetchEditarCategoria.json();

    if (categoriaEditada.ok) {
      const nuevaLista = listaDeCategorias.map(categoria => {
        if (categoria._id === id) {
          categoria.editar = false;
          categoria.nombreCategoria = nombreCateoria;
        }
        return categoria;
      });
      setNoDisponible(false);
      setListaDeCategorias(nuevaLista);
      setMensajeRespuesta({
        texto: categoriaEditada.mensaje,
        color: 'green',
      });
    } else {
      setMensajeRespuesta({
        texto: categoriaEditada.mensaje,
        color: 'red',
      });
    };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEnviarNuevaCategoria(value);
  };

  const onChangeCategoria = (e, idCategoria) => {
    const editarNombreCategoria = e.target.value;
    setNuevoNombre({
      nombreCategoria: editarNombreCategoria,
      id: idCategoria,
    });
  };

  const editarSolicitud = (id, editarCategoria) => {
    setNoDisponible(editarCategoria)
    const nuevaLista = listaDeCategorias.map(categoria => {
      if (categoria._id === id) {
        categoria.editar = editarCategoria;
      }
      return categoria;
    });
    setListaDeCategorias(nuevaLista);
  };

  const onClickClear = (id, editar) => {
    setMensajeRespuesta({
      texto: '',
      color: '',
    });
    setNuevoNombre({
      nombreCategoria: '',
      id: '',
    });
    editarSolicitud(id, editar)
  };

  const body = (
    <Paper
      style={modalStyle}
      className={classes.paper}
      id='categorias-paper'>
      <h3>Categorias</h3>
      <Divider />
      <div className='categorias-existentes'>
        {listaDeCategorias.map((categoria) => (
          <div className='editar-categoria' key={categoria._id}>
            {categoria.editar ?
              <input type="text"
                defaultValue={categoria.nombreCategoria}
                onChange={(e) => onChangeCategoria(e, categoria._id)}
              /> :
              <p>{categoria.nombreCategoria}</p>
            }
            {!categoria.editar ?
              (!noDisponible ?
                <EditIcon
                  onClick={() => {
                    setNuevoNombre({
                      nombreCategoria: categoria.nombreCategoria,
                      id: categoria._id
                    });
                    editarSolicitud(categoria._id, true)
                  }}
                /> : null) :
              <div>
                <CheckIcon
                  onClick={() => enviarEdicionCategoria(categoria._id)}
                />
                <ClearIcon
                  onClick={() => onClickClear(categoria._id, false)}
                />
              </div>
            }
          </div>
        ))}
      </div>
      <Divider />
      <form
        id='Agregar-categorias'
        className='Agregar-categorias'
        onSubmit={nuevaCategoria}
      >
        <TextField
          className='categoria-input'
          label="Agregar categoria"
          inputProps={{ "aria-label": "search" }}
          variant="outlined"
          value={enviarNuevaCategoria}
          onChange={handleChange}
          margin="dense"
        />
        <Button
          variant="contained"
          component="button"
          type='submit'
          form='Agregar-categorias'
          className="button-Agregar-categorias"
          onClick={handleOpen}
        >
          <p className="button-p">Agregar</p>
        </Button>
      </form>
      <h6
        className='mensaje-respuesta'
        style={{ color: mensajeRespuesta.color }}
      >
        {mensajeRespuesta.texto}
      </h6>
    </Paper>
  );

  return (
    <div>
      <div className='cambios-en-categorias'>
        <Button
          variant="contained"
          component="button"
          className="button-modificar-categorias"
          onClick={handleOpen}
        >
          <p className="button-p">
            Modificar categoria
          </p>
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}