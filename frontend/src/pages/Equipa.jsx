import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import './Equipa.css'

function Equipa() {
    const [jogadores, setJogadores] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/jogadores/')
            .then(response => setJogadores(response.data))
            // Boa prática: sempre apanhar erros em chamadas de rede!
            .catch(error => console.error("Erro a buscar os jogadores:", error));
    }, []);

    return (
        <div className="equipa-container">
            <h1>Equipa</h1>
            <div className="equipa-grelha">
                {jogadores.map(jogador => (
                    <Link to={`/equipa/${jogador.id}`} key={jogador.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="jogador-card">
                            <h3>#{jogador.numero_camisola}</h3>
                            <p>{jogador.nome}</p>
                            <p>{jogador.posicao}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
export default Equipa;