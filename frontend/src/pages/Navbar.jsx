import { NavLink, Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";

function Navbar() {
    const { user, fazerLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    const clicarSair = () => {
        axios.post('http://localhost:8000/api/logout/')
            .then(() => {
                fazerLogout();
                navigate('/'); // ir p home
            });
    }

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <img src="/msclogo.png" alt="Logo Miguel Sport Clube" className="navbar-logo" />
                    <span className="navbar-nome">Miguel Sport Clube</span>
                </Link>
                <ul className="navbar-links">
                    <li>
                        <NavLink
                            to="/equipa"
                            className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}
                        >
                            Equipa
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/jogos"
                            className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}
                        >
                            Jogos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/classificacao"
                            className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}
                        >
                            Classificação
                        </NavLink>
                    </li>

                    { user !== null && user.is_staff == true && (
                        <li>
                            <NavLink
                                to="/staff/jogadores"
                                className={({ isActive }) => isActive ? 'navlink ativo' : 'navlink'}
                                style={{ color: 'darkorange' }}
                            >
                                Painel de Staff
                            </NavLink>
                        </li>
                    )}

                    {user ? (
                        // se existir na memoria, login
                        <>
                            <li style={{ display: 'flex', alignItems: 'center', marginLeft: '15px', color: 'gray', fontWeight: 'bold' }}>
                                Olá, {user.username} {user.is_staff && "(Staff)"}
                            </li>
                            <li>
                                <button
                                    onClick={clicarSair}
                                    className="nav-link"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                                >
                                    Sair
                                </button>
                            </li>
                        </>
                    ) : (
                        // n fez login
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}
                            >
                                Entrar / Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar