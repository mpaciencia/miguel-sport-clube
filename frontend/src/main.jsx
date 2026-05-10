import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// 1. Estilos Globais
import './index.css'

// 2. Páginas do Domínio: Jogadores e Equipa (Manuel)
import Equipa from './pages/Equipa.jsx'
import PerfilJogador from './pages/PerfilJogador.jsx'
import StaffJogadores from "./pages/StaffJogadores.jsx"

// 3. Páginas do Domínio: Jogos e Classificação (Ivo)
import Jogos from './pages/Jogos.jsx'
import Classificacao from './pages/Classificacao.jsx'
import CriarJogo from './pages/CriarJogo.jsx'
import RegistarResultado from './pages/RegistarResultado.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/* --- Rotas Públicas --- */}
                <Route path="/equipa" element={<Equipa />} />
                <Route path="/equipa/:id" element={<PerfilJogador />} />
                <Route path="/jogos" element={<Jogos />} />
                <Route path="/classificacao" element={<Classificacao />} />

                {/* --- Rotas Privadas (Staff) --- */}
                <Route path="/staff/jogadores" element={<StaffJogadores />} />
                <Route path="/staff/jogos/novo" element={<CriarJogo />} />
                <Route path="/staff/jogos/resultado" element={<RegistarResultado />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)