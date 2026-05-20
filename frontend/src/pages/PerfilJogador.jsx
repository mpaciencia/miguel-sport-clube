import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './PerfilJogador.css'

const BASE_URL = 'http://localhost:8000';

function PerfilJogador() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [jogador, setJogador] = useState(null)

    useEffect(() => {
        axios.get(`${BASE_URL}/api/jogadores/${id}/`)
            .then(response => setJogador(response.data))
            .catch(err => console.error("Erro ao carregar perfil:", err))
    }, [id])

    if (!jogador) return <div className="perfil-container">A carregar...</div>

    return (
        <div className="perfil-container">
            <button className="btn-voltar" onClick={() => navigate(-1)}>
                ← Voltar
            </button>

            <div className="perfil-header">
                {jogador.foto ? (
                    <img
                        src={BASE_URL + jogador.foto}
                        alt={`Foto de ${jogador.nome}`}
                        className="jogador-foto-perfil"
                    />
                ) : (
                    <div className="jogador-foto-placeholder-perfil">
                        <span className="placeholder-numero-perfil">
                            {jogador.numero_camisola}
                        </span>
                    </div>
                )}
            </div>

            <div className="perfil-detalhes">
                <h1 className="perfil-info-titulo">{jogador.nome}</h1>
                <p><strong>Número:</strong> #{jogador.numero_camisola}</p>
                <p><strong>Posição:</strong> {jogador.posicao}</p>
                <p><strong>Data de nascimento:</strong> {new Date(jogador.data_nascimento).toLocaleDateString('pt-PT')}</p>
            </div>
        </div>
    )
}

export default PerfilJogador
