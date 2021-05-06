import Login from './components/shared/Login'
import Navigation from './components/shared/Navigation'

function App() {
  const userRole = localStorage.getItem('TAAdmin'); 

  return localStorage.getItem('TAToken') ? <Navigation user={userRole}/>  :  <Login/>
}

export default App; 