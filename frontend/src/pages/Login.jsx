import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
    const navigate = useNavigate();

    const { fazerLogin } = useContext(AuthContext);

    // guardar oq utilizador escreve
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[message, setMessage] = useState('');

    const lidarComLogin = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/login/', {
            username: username,
            password: password
        })
        .then(response => {
            fazerLogin(response.data);
            setMessage("Login efetuado com sucesso!")
            navigate('/dashboard')

            if(response.data.is_staff) {
                navigate('/staff/jogadores');
            } else {
                navigate('/equipa');
            }
        })
            .catch(error => {
                setMessage("username ou password incorretos");
                console.log(error);
            });
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2>Entrar no Miguel Sport Clube</h2>
                <form onSubmit={lidarComLogin}>
                    <div style={{ textAlign: 'left' }}>
                        <label>Utilizador:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label>Palavra-passe:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Iniciar Sessão</button>
                </form>
            </div>
        </div>
    );
}

export default Login;