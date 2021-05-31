import "../styles/ListaDeNotificaciones.css"
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";

function ListaDeNotificaciones(props){
  const {notificaciones} = props
  return(
    <div className='container-notificaciones-padre'>
      <div className="title-paper-notificaciones">
        <p>
          Notificaciones ({notificaciones.length})
        </p>
      </div>
      <span className='container-notificaciones'>
         {
           notificaciones.map((noti, i)=> {
             return (
              <Paper component={Link} to={noti.url} elevation={5} key={i} className='paper-notificaciones'>
                <img alt='icono' src="/iconComsistelco512.png" className='notificacion-icon'/>
                <div className='contenido'>
                  <p>
                    {noti.titulo}
                  </p>
                  <p>
                    {noti.info}
                  </p>
                </div>
              </Paper>
             )
           })
         }
      </span>
    </div>
  )
}

export default ListaDeNotificaciones