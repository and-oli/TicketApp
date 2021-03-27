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
import "./styles/menu.css";

class Menu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      listaProyectos:[]
    }
  }

  render() {
    return (
      <div className="container">
        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemIcon>
              <img
                alt="icon"
                style={{ height: 40 }}
                src="https://img.icons8.com/material-sharp/96/000000/thumbnails.png"
              />
            </ListItemIcon>
            <ListItemText
              component="p"
              className="button-label"
              primary="Mi vista"
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <img
                alt="icon"
                style={{ height: 40 }}
                src="https://img.icons8.com/ios/100/000000/boarding-pass.png"
              />
            </ListItemIcon>
            <ListItemText primary="Reportar solicitud" />
          </ListItem>
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
        </List>
      </div>
    );
  };
};

export default Menu;