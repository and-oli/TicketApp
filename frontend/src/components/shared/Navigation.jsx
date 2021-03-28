import React from "react";
import ListaSolicitudes from "../solicitudes/ListaSolicitudes";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import DetalleSolicitud from "../solicitudes/DetalleSolicitud";

export default function Navigation(props) {
  const { admin } = props;
  return (
    <Router>
      <Header/>
      <Switch>
        <Route exact path="/">
          <ListaSolicitudes admin={admin} />
        </Route>
        <Route path="/detalle-solicitud">
          <DetalleSolicitud admin={admin} />
        </Route>
      </Switch>
    </Router>
  );
}
