import React from "react";
import ListaSolicitudes from "../solicitudes/ListaSolicitudes";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import DetalleSolicitud from "../solicitudes/DetalleSolicitud";
import EnviarSolicitud from "../formularioSolicitud/EnviarSolicitud";
import ListaDeNotificaciones from "./ListaDeNotificaciones"
export default function Navigation(props) {

  const { user } = props;

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

    }, []
  );

  return (
    <Router>
      <Header userRole={user} />
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
          <ListaDeNotificaciones />
        </Route>
      </Switch>
    </Router>
  );
}
