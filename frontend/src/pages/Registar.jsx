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
            <div className="page-center">
            <div className="form-card">
                <h2>Criar Conta - Miguel Sport Clube</h2>
                <p style={{ color: 'var(--cor-texto-suave)', fontSize: '0.9em', marginBottom: '20px', textAlign: 'center' }}>
                    Introduz os teus dados e o código fornecido pela direção do clube.
                </p>

                <form onSubmit={lidarComRegisto}>
                    <div className="form-group">
                        <label>Nome de Utilizador:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>E-mail:</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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

                    <div className="form-group">
                        <label>Código de Acesso:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={codigoAcesso}
                            onChange={e => setCodigoAcesso(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <p className="erro-mensagem" style={{ textAlign: 'center' }}>
                            {message}
                        </p>
                    )}

                    <button type="submit" className="btn-submit">Registar Conta</button>
                </form>

                    <p style={{ marginTop: '20px', fontSize: '0.9em', textAlign: 'center' }}>
                        Já tens conta? <Link to="/login" style={{ color: 'var(--cor-primaria)', fontWeight: 'bold', textDecoration: 'underline' }}>Inicia sessão aqui</Link>
                    </p>
            </div>
        </div>
        );
}

export default Registar;