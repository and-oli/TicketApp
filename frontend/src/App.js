import Login from './components/shared/Login'
import Navigation from './components/shared/Navigation'

function App() {
  return localStorage.getItem('TAToken') ? <Navigation admin={localStorage.getItem('TAAdmin') === 'true'}/>  :  <Login/>
}

export default App; 