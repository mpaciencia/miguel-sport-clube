import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const Registar = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [codigoAcesso, setCodigoAcesso] = useState('');
    const [message, setMessage] = useState('');

    const lidarComRegisto = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/registar/', {
            username: username,
            email: email,
            password: password,
            codigo_acesso: codigoAcesso
        })
            .then(response => {
                alert(response.data.message);
                navigate('/login');
            })
            .catch(error => {
                if (error.reponse && error.response.data) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage("Erro ao efetuar o resgisto.");
                }
            })
        }

        return (
            <div className="login-page-container">
            <div className="login-card">
                <h2>Criar Conta - Miguel Sport Clube</h2>
                <p style={{ color: 'gray', fontSize: '0.9em', marginBottom: '20px' }}>
                    Introduz os teus dados e o código fornecido pela direção do clube.
                </p>

                <form onSubmit={lidarComRegisto}>
                    <div style={{ textAlign: 'left' }}>
                        <label>Nome de Utilizador:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label>E-mail:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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

                    <div style={{ textAlign: 'left' }}>
                        <label>Código de Acesso:</label>
                        <input
                            type="text"
                            value={codigoAcesso}
                            onChange={e => setCodigoAcesso(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <p style={{ color: 'tomato', fontWeight: 'bold', margin: '15px 0' }}>
                            {message}
                        </p>
                    )}

                    <button type="submit" style={{ marginTop: '10px' }}>Registar Conta</button>
                </form>

                    <p style={{ marginTop: '20px', fontSize: '0.9em' }}>
                        Já tens conta? <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold' }}>Inicia sessão aqui</Link>
                    </p>
            </div>
        </div>
        );
}

export default Registar;