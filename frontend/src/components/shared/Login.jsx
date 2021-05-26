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
  }
  function passwordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const ready = await navigator.serviceWorker.ready;
    const subscription = await ready.pushManager.getSubscription();
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="login-container">
          <h2 className="title">Iniciar Sesión</h2>
          <div>
            <form className="container-title" onSubmit={handleSubmit}>
              <TextField
                type="text"
                label="Usuario"
                style={{ width: 200, alignSelf: "center" }}
                size="small"
                value={userName}
                onChange={userChange}
                required
              />
              <TextField
                type="password"
                label="Contraseña"
                style={{ width: 200, alignSelf: "center" }}
                value={password}
                onChange={passwordChange}
                required
              />
              <h6
                style={{
                  color: message.color,
                  marginTop: 0,
                  textAlign: "center",
                }}
              >
                {message.text}
              </h6>
              {loading ? (
                <CircularProgress
                  style={{ width: 40, alignSelf: "center", marginTop: 30 }}
                  color="inherit"
                  disableShrink
                />
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  color="default"
                  style={{
                    width: 130,
                    fontSize: 10,
                    alignSelf: "center",
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
