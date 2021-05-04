import Login from './components/shared/Login'
import Navigation from './components/shared/Navigation'

function App() {
  const authorizeUser = {
    admin:localStorage.getItem('TAAdmin') === 'true',
    user:localStorage.getItem('TAUser') === 'true',
    tecnico:localStorage.getItem('TATecnico') === 'true',
    especialista:localStorage.getItem('TAEspecialista') === 'true',
  }
  return localStorage.getItem('TAToken') ? <Navigation {...authorizeUser}/>  :  <Login/>
}

export default App; 