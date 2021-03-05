import React from 'react';
import './styles/Login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            respuesta: ''
        };

        this.userChange = this.userChange.bind(this);
        this.contraseñaChange = this.contraseñaChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    userChange(event) {
        this.setState({ userName: event.target.value });
    }
    contraseñaChange(event) {
        this.setState({ password: event.target.value });
    }


    handleSubmit(event) {
        event.preventDefault()
        let user = {
            userName: this.state.userName,
            password: this.state.password
        }
        console.log(this.state.userName, this.state.password)
        fetch('http://localhost:3000/users', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ respuesta: result.mensaje })
                }
            )
    }

    render() {
        return (
            <div>
                <div className="image">
                    <img className="logo" src="https://comsistelco.com/assets/images/logo_33.png" alt="Logo comsistelco" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="login-container">
                        <h2 className="title" >Iniciar Sesión</h2>
                        <div>
                            <form className="container-title" onSubmit={this.handleSubmit}>
                                <TextField type="text" label="E-mail"
                                    style={{ width: 200, alignSelf: 'center' }}
                                    size='small'
                                    value={this.state.userName}
                                    onChange={this.userChange}
                                    required />
                                <TextField type="password" label="Contraseña"
                                    style={{ width: 200, alignSelf: 'center' }}
                                    value={this.state.password}
                                    onChange={this.contraseñaChange}
                                    required />
                                <Button variant="contained" type="submit" color='default' style={{ width: 130, fontSize: 10, alignSelf: 'center', marginTop: 30 }}>
                                    Ingresar
                            </Button>
                            </form>
                        </div>
                    </div>
                    <h1 style={{ position: 'absolute', alignSelf: 'flex-end', top: '80%' }}>{this.state.respuesta}</h1>
                </div>
            </div>
        )
    }
};
