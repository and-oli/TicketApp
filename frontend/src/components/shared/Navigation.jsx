import React,{useState} from "react";
import ListaSolicitudes from "../solicitudes/ListaSolicitudes";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import DetalleSolicitud from "../solicitudes/DetalleSolicitud";
import EnviarSolicitud from "../formularioSolicitud/EnviarSolicitud";
import ListaDeNotificaciones from "./ListaDeNotificaciones"
export default function Navigation(props) {

  const { user } = props;
  const [notificaciones, setNotificaciones] = useState([]);

  const renderNotificaciones = async () => {
    const getNotificaciones = await fetch(
      "http://localhost:3001/notification/getNotifications",
      {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("TAToken"),
        },
      }
    );
    const notificacionesJson = await getNotificaciones.json();
    return setNotificaciones(notificacionesJson.notificaciones);
    }

  React.useEffect(
    () => {
      fetch('http://localhost:3001/users/validarToken', {
        method: 'GET',
        headers: {
          'x-access-token': localStorage.getItem("TAToken")
        },
      }).then((response) => { 
        if (response.status === 403) {
          localStorage.removeItem("TAToken");
          window.location.reload();
        }
      })
      renderNotificaciones();
    }, []
  );

  return (
    <Router>
      <Header userRole={user} notificaciones={notificaciones}/>
      <Switch>
        <Route exact path="/">
          <ListaSolicitudes />
        </Route>
        <Route path="/detalle-solicitud">
          <DetalleSolicitud userRole={user}/>
        </Route>
        <Route path="/nueva-solicitud">
          <EnviarSolicitud />
        </Route>
        <Route path="/lista-notificaciones">
          <ListaDeNotificaciones notificaciones={notificaciones}/>
        </Route>
      </Switch>
    </Router>
  );
}
