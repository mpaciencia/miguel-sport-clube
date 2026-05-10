import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Jogos from './pages/Jogos'
import Classificacao from './pages/Classificacao'
import CriarJogo from './pages/CriarJogo'
import RegistarResultado from './pages/RegistarResultado'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/jogos" element={<Jogos/>}/>
                <Route path="/classificacao" element={<Classificacao/>}/>
                <Route path="/staff/jogos/novo" element={<CriarJogo/>}/>
                <Route path="/staff/jogos/resultado" element={<RegistarResultado />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App