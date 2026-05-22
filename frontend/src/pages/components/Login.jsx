import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import { AuthContext } from "../../context/AuthContext.jsx";

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
        }, {
            withCredentials: true  // ADICIONADO AQUI (Slide 10, pag 17)
        })
            .then(response => {
                fazerLogin(response.data);
                setMessage("Login efetuado com sucesso!")
                navigate(-1)
            })
            .catch(error => {
                setMessage("username ou password incorretos");
                console.log(error);
            });
    };

    return (
        <div className="page-center">
            <div className="form-card">
                <h2>Entrar no Miguel Sport Clube</h2>
                <form onSubmit={lidarComLogin}>
                    <div className="form-group">
                        <label>Utilizador:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Palavra-passe:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p style={{
                        color: message.includes("sucesso") ? "mediumseagreen" : "var(--cor-secundaria)",
                        fontWeight: "bold",
                        margin: "15px 0 5px 0",
                        fontSize: "0.95em",
                        textAlign: 'center'
                    }}>
                        {message}
                    </p>

                    <button type="submit" className="btn-submit">Iniciar Sessão</button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#4a5568', textAlign: 'center' }}>
                    Não tens conta? <Link to="/registar_user" style={{ color: 'var(--cor-primaria)', fontWeight: 'bold', textDecoration: 'underline' }}>Regista-te aqui</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;