import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="navbar-logo-placeholder">⚽</span>
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
                </ul>
            </div>
        </nav>
    )
}

export default Navbar