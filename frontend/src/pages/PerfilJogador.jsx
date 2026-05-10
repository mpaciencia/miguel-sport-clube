import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function PerfilJogador() {
    const { id } = useParams()
    const [jogador, setJogador] = useState(null)
    const [erro, setErro] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:8000/api/jogadores/${id}/`)
            .then(response => {
                setJogador(response.data)
                setErro('')
            })
            .catch(() => setErro('Não foi possível carregar o perfil do jogador.'))
    }, [id])

    if (erro) return <p>{erro}</p>
    if (!jogador) return <p>A carregar...</p>

    return (
        <div>
            <Link to="/equipa">← Voltar</Link>
            <h1>{jogador.nome}</h1>
            <p>Número: #{jogador.numero_camisola}</p>
            <p>Posição: {jogador.posicao}</p>
            <p>Data de nascimento: {jogador.data_nascimento}</p>
        </div>
    )
}

export default PerfilJogador
