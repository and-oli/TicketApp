import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import CambiosSolicitud from "../formularioSolicitud/EnviarCambio";
import ListaCambios from "./ListaCambios";
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import Tabs from '@material-ui/core/Tabs';
import "../styles/DetallesSolicitud.css";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
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
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function seleccionarPestana(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

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
  const [value, setValue] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleTouchStart = (event) => {
    const touch = event.targetTouches[0];
    setTouchStart(touch.clientX);
  };

  const handleTouchMove = (event) => {
    const touch = event.targetTouches[0];
      setTouchEnd(touch.clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      setValue(1);
    }

    if (touchStart - touchEnd < -100) {
      setValue(0);
    }
  };

  React.useEffect(() => {
    renderizarInfoSolicitud(idSolicitud);
  }, [idSolicitud]);

  return (
    <div className='detalles-solicitud-padre'>

      <div className="container-paper"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}>
        <Paper className="solicitud-a" elevation={10}>
          <div className="title-paper">
            <p>
              <b>Solicitud #{idSolicitud}: {detalleSolicitud.resumen}</b>
            </p>
          </div>
          <AppBar className='div-header' position='static'>
            <Divider />
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="off"
              className='menu-icon-items'
            >
              <Tab
                className='menu-icons'
                {...seleccionarPestana(0)}
                icon={<InfoIcon />} />
              <Tab
                className='menu-icons'
                {...seleccionarPestana(1)}
                icon={<EditIcon />} />
            </Tabs>
            <Divider />
          </AppBar>
          <TabPanel value={value} index={0}>
            <p className='solicitud-a-p'><b>Descripcion:</b></p>
            <span className="descripcion">
              <p>{detalleSolicitud.descripcion}</p>
            </span>
            <p className='solicitud-a-p'><b>Cliente:</b>&nbsp;{cliente}</p>
            <p className='solicitud-a-p'><b>Nombre del solicitante:</b>&nbsp;{solicitante.name}</p>
            <p className='solicitud-a-p'><b>Correo:</b>&nbsp;{solicitante.email}</p>
            <p className='solicitud-a-p'><b>Categoria:</b>&nbsp;{detalleSolicitud.categoria}</p>
            <p className='solicitud-a-p'><b>Prioridad:</b>&nbsp;{detalleSolicitud.prioridad}</p>
            <p className='solicitud-a-p'><b>Fecha de envío:</b>&nbsp;{detalleSolicitud.fechaHora}</p>
            <p className='solicitud-a-p'><b>Estado:</b>&nbsp;{detalleSolicitud.estado}</p>
            <p className='solicitud-a-p'><b>Asignada a:</b>&nbsp;{asignada} {roleAsignado ? `(${roleAsignado})` : null}</p>
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