import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Classificacao from './pages/Classificacao.jsx'
import CriarJogo from './pages/CriarJogo.jsx'
import Equipa from './pages/Equipa.jsx'
import Jogos from './pages/Jogos.jsx'
import PerfilJogador from './pages/PerfilJogador.jsx'
import RegistarResultado from './pages/RegistarResultado.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/equipa" element={<Equipa />} />
                <Route path="/equipa/:id" element={<PerfilJogador />} />
                <Route path="/jogos" element={<Jogos />} />
                <Route path="/classificacao" element={<Classificacao />} />
                <Route path="/staff/jogos/novo" element={<CriarJogo />} />
                <Route path="/staff/jogos/resultado" element={<RegistarResultado />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
