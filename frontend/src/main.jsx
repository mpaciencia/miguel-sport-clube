import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Equipa from './pages/Equipa.jsx'
import PerfilJogador from './pages/PerfilJogador.jsx'
import StaffJogadores from "./pages/StaffJogadores.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/equipa" element={<Equipa />} />
                <Route path="/equipa/:id" element={<PerfilJogador />} />
                <Route path="/staff/jogadores" element={<StaffJogadores />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)