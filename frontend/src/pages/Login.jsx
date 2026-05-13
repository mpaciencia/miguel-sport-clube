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
        <main className="container">
            <section className="container3" style={{ marginTop: '50px', maxWidth: '500px' }}>
                <h2 style={{ color: 'white' }}>Entrar no Miguel Sport Clube</h2>
                <form onSubmit={lidarComLogin} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', textAlign: 'left' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    {message && <p style={{ color: 'red' }}>{message}</p>}
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'navy', color: 'white', cursor: 'pointer' }}>
                        Entrar
                    </button>
                </form>
            </section>
        </main>
    );
};

export default Login;