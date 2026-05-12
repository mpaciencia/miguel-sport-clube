import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function PerfilJogador() {
    const { id } = useParams()
    const [jogador, setJogador] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/jogadores/${id}/`)
            .then(response => setJogador(response.data))
    }, [id])

    if (!jogador) return <p>A carregar...</p>

    return (
        <div>
            <button onClick={() => navigate(-1)}>← Voltar</button>
            <h1>{jogador.nome}</h1>
            <p>Número: #{jogador.numero_camisola}</p>
            <p>Posição: {jogador.posicao}</p>
            <p>Data de nascimento: {jogador.data_nascimento}</p>
        </div>
    )
}

export default PerfilJogador
