import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import "../styles/Menu.css";

function Menu(props) {
  const { close } = props
  return (
    <div className="container">
      <List component="nav" aria-label="main mailbox folders">
        <ListItem onClick={close} button component={Link} to={`/`}>
          <ListItemIcon>
            <img alt="icon" className="icon" src="/listaIcon.png" />
          </ListItemIcon>
          <ListItemText
            component="p"
            className="button-label"
            primary="Solicitudes"
          />
        </ListItem>
        <ListItem
          onClick={close}
          button
          component={Link}
          to={`/nueva-solicitud`}
        >
          <ListItemIcon>
            <img alt="icon" className="icon" src="/ticketIcon.png" />
          </ListItemIcon>
          <ListItemText primary="Reportar solicitud" />
        </ListItem>
      </List>
    </div>
  );
};

export default Menu;
