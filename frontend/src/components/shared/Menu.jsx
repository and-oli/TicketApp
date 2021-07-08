import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import "../styles/Menu.css";

const especialistaMenuItems = (
  <div>
    <Divider />
    <FormControl component="div" className="form">
      <InputLabel component="label" htmlFor="grouped-select">
        Todos los proyectos
      </InputLabel>
      <Select component="div" defaultValue="" id="grouped-select">
        <MenuItem value="" style={{ height: 25 }}>
          <em>None</em>
        </MenuItem>
      </Select>
    </FormControl>
  </div>
);

function Menu(props) {
  const {close, user} = props
  return (
    <div className="container">
      <List component="nav" aria-label="main mailbox folders">
        <ListItem onClick={close} button component={Link} to={`/`}>
          <ListItemIcon>
            <img alt="icon" style={{ height: 40 }} src="/listaIcon.png" />
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
            <img alt="icon" style={{ height: 40 }} src="/ticketIcon.png" />
          </ListItemIcon>
          <ListItemText primary="Reportar solicitud" />
        </ListItem>
        {user === "Especialista" ? especialistaMenuItems : null}
      </List>
    </div>
  );
};

export default Menu;
