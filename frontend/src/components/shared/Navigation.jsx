import React from "react";
import ListaSolicitudes from "../solicitudes/ListaSolicitudes";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import DetalleSolicitud from "../solicitudes/DetalleSolicitud";
import EnviarSolicitud from "../formularioSolicitud/EnviarSolicitud";
export default function Navigation(props) {
  const { admin } = props;
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
      <Header />
      <Switch>
        <Route exact path="/">
          <ListaSolicitudes admin={admin} />
        </Route>
        <Route path="/detalle-solicitud">
          <DetalleSolicitud admin={admin} />
        </Route>
        <Route path="/nueva-solicitud">
          <EnviarSolicitud />
        </Route>
      </Switch>
    </Router>
  );
}
