import React, { useState } from 'react';
import '../styles/Login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: 'green' });
  const [loading, setloading] = useState(false);

  function userChange(event) {
    setUserName(event.target.value);
  }
  function passwordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!loading) {
      setloading(true);
      let user = {
        username: userName,
        password: password,
      };
      fetch('http://localhost:3000/users/authenticate', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((res) => {
          setloading(false);
          if (res.ok) {
            localStorage.setItem("TAToken", res.token);
            localStorage.setItem("TAAdmin", res.amin);
            window.location.reload();
            setMessage({ text: res.mensaje, color: 'green' });
          } else {
            setMessage({ text: res.mensaje, color: 'red' });
          }
        });
    }
  }

  return (
    <div>
      <div className='image'>
        <img className='logo' src={process.env.PUBLIC_URL + '/logoComsistelco.png'} alt='Logo comsistelco' />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='login-container'>
          <h2 className='title'>Iniciar Sesión</h2>
          <div>
            <form className='container-title' onSubmit={handleSubmit}>
              <TextField
                type='text'
                label='Usuario'
                style={{ width: 200, alignSelf: 'center' }}
                size='small'
                value={userName}
                onChange={userChange}
                required
              />
              <TextField
                type='password'
                label='Contraseña'
                style={{ width: 200, alignSelf: 'center' }}
                value={password}
                onChange={passwordChange}
                required
              />
              <h6 style={{ color: message.color, marginTop: 0 }}>
                {message.text}
              </h6>
              {loading ? (
                <CircularProgress
                  style={{ width: 40, alignSelf: 'center', marginTop: 30 }}
                  disableShrink
                />
              ) : (
                <Button
                  variant='contained'
                  type='submit'
                  color='default'
                  style={{
                    width: 130,
                    fontSize: 10,
                    alignSelf: 'center',      
                    marginTop: 30,
                  }}
                >
                  Ingresar
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
