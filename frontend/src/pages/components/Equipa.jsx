import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import '../CSS/Equipa.css'

const BASE_URL = 'http://localhost:8000';

function Equipa() {
    const [jogadores, setJogadores] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/jogadores/`)
            .then(response => setJogadores(response.data))
            .catch(error => console.error("Erro a buscar os jogadores:", error));
    }, []);

    return (
        <div className="pagina-conteudo">
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>O Nosso Plantel</h1>
            <div className="equipa-grelha">
                {jogadores.map(jogador => (
                    <Link to={`/equipa/${jogador.id}`} key={jogador.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="jogador-card">
                            {jogador.foto ? (
                                <img
                                    src={BASE_URL + jogador.foto}
                                    alt={`Foto de ${jogador.nome}`}
                                    className="jogador-foto"
                                />
                            ) : (
                                <div className="jogador-foto-placeholder">
                                    <span>{jogador.numero_camisola}</span>
                                </div>
                            )}
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