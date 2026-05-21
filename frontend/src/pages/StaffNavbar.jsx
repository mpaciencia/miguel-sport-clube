import { NavLink } from 'react-router-dom';
import './StaffNavbar.css';

function StaffNavbar() {
    return (
        <div className="staff-sub-navbar">
            <NavLink
                to="/staff/jogadores"
                className={({ isActive }) => isActive ? 'staff-sub-link ativo' : 'staff-sub-link'}
            >
                Plantel e Treinos
            </NavLink>
            <NavLink
                to="/staff/jogos/registar"
                className={({ isActive }) => isActive ? 'staff-sub-link ativo' : 'staff-sub-link'}
            >
                Registar Jogo
            </NavLink>
            <NavLink
                to="/staff/treinos/novo"
                className={({ isActive }) => isActive ? 'staff-sub-link ativo' : 'staff-sub-link'}
            >
                Adicionar Treino
            </NavLink>
        </div>
    );
}

export default StaffNavbar;