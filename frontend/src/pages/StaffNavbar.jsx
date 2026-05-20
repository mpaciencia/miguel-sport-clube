import { NavLink } from 'react-router-dom';
import './StaffNavbar.css';

function StaffNavbar() {
    return (
        <div className="staff-sub-navbar">
            <NavLink
                to="/staff/jogadores"
                className={({ isActive }) => isActive ? 'staff-sub-link ativo' : 'staff-sub-link'}
            >
                🏃 Plantel e Treinos
            </NavLink>
            <NavLink
                to="/staff/jogos/novo"
                className={({ isActive }) => isActive ? 'staff-sub-link ativo' : 'staff-sub-link'}
            >
                ⚽ Criar Jogo
            </NavLink>
            <NavLink
                to="/staff/convocatorias/nova"
                className={({ isActive }) => isActive ? 'staff-sub-link ativo' : 'staff-sub-link'}
            >
                📋 Nova Convocatória
            </NavLink>
            <NavLink
                to="/staff/jogos/resultado"
                className={({ isActive }) => isActive ? 'staff-sub-link ativo' : 'staff-sub-link'}
            >
                🏆 Registar Resultado
            </NavLink>
        </div>
    );
}

export default StaffNavbar;