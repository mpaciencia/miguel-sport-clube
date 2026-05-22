import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import {AuthProvider} from "./context/AuthContext.jsx";

import './index.css'

// Páginas do Domínio: Jogadores e Equipa
import Equipa from './pages/components/Equipa.jsx'
import PerfilJogador from './pages/components/PerfilJogador.jsx'
import StaffJogadores from "./pages/components/StaffJogadores.jsx"
import Navbar from './pages/components/Navbar.jsx'
import LandingPage from './pages/components/Landingpage.jsx'
import Dashboard from "./pages/components/Dashboard.jsx";

// Páginas do Domínio: Jogos e Classificação
import Jogos from './pages/components/Jogos.jsx'
import Classificacao from './pages/components/Classificacao.jsx'
import RegistarJogo from './pages/components/RegistarJogo.jsx';
import CriarTreino from './pages/components/CriarTreino.jsx';

// Login e "segurança"
import Login from "./pages/components/Login.jsx";
import RotaProtegida from "./pages/components/RotaProtegida.jsx";
import Registar from "./pages/components/Registar.jsx";
import axios from 'axios';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };
    
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                {/* --- Rotas Públicas --- */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/equipa" element={<Equipa/>}/>
                <Route path="/equipa/:id" element={<PerfilJogador/>}/>
                <Route path="/jogos" element={<Jogos/>}/>
                <Route path="/classificacao" element={<Classificacao/>}/>
                <Route path="/registar_user" element={<Registar/>}/>
                <Route path="/dashboard" element={
                    <RotaProtegida>
                        <Dashboard/>
                    </RotaProtegida>
                }/>

                {/* --- Rotas Privadas (Staff) --- */}
                <Route path="/staff/jogadores" element={
                    <RotaProtegida apenasStaff={true}>
                        <StaffJogadores/>
                    </RotaProtegida>
                }/>
                <Route path="/staff/jogos/registar" element={
                    <RotaProtegida apenasStaff={true}>
                        <RegistarJogo/>
                    </RotaProtegida>
                }/>
                <Route path="/staff/treinos/novo" element={
                    <RotaProtegida apenasStaff={true}>
                        <CriarTreino/>
                    </RotaProtegida>
                }/>
            </Routes>

        </BrowserRouter>
    </AuthProvider>
)