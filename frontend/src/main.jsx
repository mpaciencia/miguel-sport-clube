import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from "./context/AuthContext.jsx";

// 1. Estilos Globais
import './index.css'

// 2. Páginas do Domínio: Jogadores e Equipa (Manuel)
import Equipa from './pages/Equipa.jsx'
import PerfilJogador from './pages/PerfilJogador.jsx'
import StaffJogadores from "./pages/StaffJogadores.jsx"
import Navbar from './pages/Navbar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from "./pages/Dashboard.jsx";

// 3. Páginas do Domínio: Jogos e Classificação (Ivo)
import Jogos from './pages/Jogos.jsx'
import Classificacao from './pages/Classificacao.jsx'
import CriarJogo from './pages/CriarJogo.jsx'
import RegistarResultado from './pages/RegistarResultado.jsx'

// 4. Login e "segurança"
import Login from "./pages/Login.jsx";
import RotaProtegida from "./pages/RotaProtegida.jsx";
import {StrictMode} from "react";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    {/* --- Rotas Públicas --- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/equipa" element={<Equipa />} />
                    <Route path="/equipa/:id" element={<PerfilJogador />} />
                    <Route path="/jogos" element={<Jogos />} />
                    <Route path="/classificacao" element={<Classificacao />} />

                    {/* --- Rotas Privadas (Staff) --- */}
                    <Route path="/staff/jogadores" element={
                        <RotaProtegida>
                            <StaffJogadores />
                        </RotaProtegida>
                    } />
                    <Route path="/staff/jogos/novo" element={
                        <RotaProtegida>
                            <CriarJogo />
                        </RotaProtegida>
                    } />
                    <Route path="/staff/jogos/resultado" element={
                        <RotaProtegida>
                            <RegistarResultado />
                        </RotaProtegida>
                    } />
                    <Route path="/dashboard" element={
                        <RotaProtegida>
                            <Dashboard />
                        </RotaProtegida>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
)