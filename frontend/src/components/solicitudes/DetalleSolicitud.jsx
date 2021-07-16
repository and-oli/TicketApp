import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import CambiosSolicitud from "../formularioSolicitud/EnviarCambio";
import ListaCambios from "./ListaCambios";
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import "../styles/DetallesSolicitud.css";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function seleccionarVista(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DetalleSolicitud(props) {
  const { userRole } = props;
  let params = new URL(document.location).searchParams;
  let idSolicitud = params.get("id_solicitud");
  const [detalleSolicitud, setDetalleSolicitud] = useState([]);
  const [cliente, setCliente] = useState("");
  const [asignada, setAsignada] = useState("");
  const [categoriasArchivos, setCategoriasArchivos] = useState([]);
  const [roleAsignado, setRoleAsignado] = useState("");
  const [solicitante, setSolicitante] = useState({});
  const [value, setValue] = React.useState(0);
  const renderizarInfoSolicitud = async (id) => {
    const header = {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const resDetalles = await fetch(
      `http://localhost:3001/solicitudes/porNumero/${id}`,
      header
    );

    const categoriasArchivos = await fetch(
      "http://localhost:3001/constantes/categoriasArchivos",
      header
    );

    const detallesJson = await resDetalles.json();
    const resCategoriasArchivos = await categoriasArchivos.json();

    setDetalleSolicitud(detallesJson.solicitud);
    setCategoriasArchivos(Object.values(resCategoriasArchivos));
    setCliente(detallesJson.solicitud.refCliente.nombre);
    setSolicitante(detallesJson.solicitud.refUsuarioSolicitante);
    if (detallesJson.solicitud.dueno) {
      setRoleAsignado(detallesJson.solicitud.dueno.role);
      setAsignada(detallesJson.solicitud.dueno.name);
    } else {
      setAsignada("Sin dueño");
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    renderizarInfoSolicitud(idSolicitud);
  }, [idSolicitud]);

  return (
    <div className='detalles-solicitud-padre'>
      <div className="title-paper">
        <p>
          <b>Solicitud #{idSolicitud}: {detalleSolicitud.resumen}</b>
        </p>
      </div>
      <div className="container-paper">
        <Paper className="solicitud-a" elevation={10}>
          <AppBar className='div-header' position='static'>
            <BottomNavigation
              value={value}
              onChange={handleChange}
              className='menu-icon-items'
            >
              <BottomNavigationAction
                className='menu-icons'
                label="Información"
                {...seleccionarVista(0)}
                icon={<InfoIcon />} />
              <BottomNavigationAction
                className='menu-icons'
                label="Modificar"
                {...seleccionarVista(1)}
                icon={<EditIcon />} />
            </BottomNavigation>
            <Divider />
          </AppBar>
          <TabPanel value={value} index={0}>
            <p className='solicitud-a-p'><b>Descripcion:</b></p>
            <span className="descripcion">
              <p>{detalleSolicitud.descripcion}</p>
            </span>
            <p className='solicitud-a-p'><b>Cliente:</b>{cliente}</p>
            <p className='solicitud-a-p'><b>Nombre del solicitante:</b>{solicitante.name}</p>
            <p className='solicitud-a-p'><b>Correo:</b>{solicitante.email}</p>
            <p className='solicitud-a-p'><b>Categoria:</b>{detalleSolicitud.categoria}</p>
            <p className='solicitud-a-p'><b>Prioridad:</b>{detalleSolicitud.prioridad}</p>
            <p className='solicitud-a-p'><b>Fecha de envío:</b>{detalleSolicitud.fechaHora}</p>
            <p className='solicitud-a-p'><b>Estado:</b>{detalleSolicitud.estado}</p>
            <p className='solicitud-a-p'><b>Asignada a:</b>{asignada} {roleAsignado ? `(${roleAsignado})` : null}</p>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ListaCambios
              categoriasArchivos={categoriasArchivos}
              asignado={asignada}
              refSolicitud={detalleSolicitud._id}
              idSolicitud={idSolicitud}
            />
            <CambiosSolicitud
              user={userRole}
              categoriasArchivos={categoriasArchivos}
              idSolicitante={solicitante._id}
              abierta={detalleSolicitud.abierta}
              asignado={asignada}
              requerimiento={detalleSolicitud.requerimente}
              estado={detalleSolicitud.estado}
              idSolicitud={idSolicitud}
              referenciaSolicitud={detalleSolicitud._id}
            />
          </TabPanel>
        </Paper>
      </div>
    </div>
  );
};
