import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000';

function PerfilJogador() {
    const { id } = useParams()
    const [jogador, setJogador] = useState(null)

    useEffect(() => {
        axios.get(`${BASE_URL}/api/jogadores/${id}/`)
            .then(response => setJogador(response.data))
    }, [id])

    if (!jogador) return <p>A carregar...</p>

    return (
        <div style={{ padding: '24px', maxWidth: '400px' }}>
            <Link to="/equipa">← Voltar</Link>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                {/* Foto do jogador em destaque no perfil */}
                {jogador.foto ? (
                    <img
                        src={BASE_URL + jogador.foto}
                        alt={`Foto de ${jogador.nome}`}
                        style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '3px solid #ddd',
                            marginBottom: '16px'
                        }}
                    />
                ) : (
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        border: '3px solid #ccc'
                    }}>
                        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#666' }}>
                            {jogador.numero_camisola}
                        </span>
                    </div>
                )}
            </div>

            <h1>{jogador.nome}</h1>
            <p>Número: #{jogador.numero_camisola}</p>
            <p>Posição: {jogador.posicao}</p>
            <p>Data de nascimento: {jogador.data_nascimento}</p>
        </div>
    )
}

export default PerfilJogador