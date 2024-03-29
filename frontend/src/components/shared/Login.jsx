import React, { useState } from "react";
import "../styles/Login.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", color: "green" });
  const [loading, setloading] = useState(false);

  function userChange(event) {
    setUserName(event.target.value);
  };
  function passwordChange(event) {
    setPassword(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const permission = await Notification.requestPermission();
    let subscription;

    if (permission === "granted") {
      const ready = await navigator.serviceWorker.ready;
      subscription = await ready.pushManager.getSubscription();
    }

    if (!loading) {
      setloading(true);
      let user = {};
      user.username = userName;
      user.password = password;
      user.subscription = subscription;
      const response = await fetch(
        "http://localhost:3001/users/authenticate",
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const resJson = await response.json();
      setloading(false);
      if (resJson.ok) {
        localStorage.setItem("TAToken", resJson.token);
        localStorage.setItem("TAUser", resJson.user);
        await fetch("http://localhost:3001/notification/sendNotifications", {
          method: "GET",
          headers: {
            "x-access-token": localStorage.getItem("TAToken"),
          },
        });
        window.location.reload();
        setMessage({ text: resJson.mensaje, color: "green" });
      } else {
        setMessage({ text: resJson.mensaje, color: "red" });
      }
    }
  }

  return (
    <div>
      <div className="image">
        <img
          className="logo"
          src="/logoComsistelco.png"
          alt="Logo comsistelco"
        />
      </div>
      <div className='login-container-padre'>
        <div className="login-container">
          <h2 className="title">Iniciar Sesión</h2>
          <div>
            <form className="container-title" onSubmit={handleSubmit}>
              <TextField
                id="usuario"
                type="text"
                label="Usuario"
                className='login-input'
                size="small"
                value={userName}
                onChange={userChange}
                required
              />
              <TextField
                id="password"
                type="password"
                label="Contraseña"
                className='login-input'
                value={password}
                onChange={passwordChange}
                required
              />
              <h6 style={{ color: message.color }}>
                {message.text}
              </h6>
              {loading ? (
                <CircularProgress
                  className='spinner-load'
                  color="inherit"
                  disableShrink
                />
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  color="default"
                  className="button-login"
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
};
