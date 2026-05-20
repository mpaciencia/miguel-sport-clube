import { useState, useEffect } from 'react'
import axios from 'axios'

const URL_JOGOS = 'http://127.0.0.1:8000/api/jogos/'
const URL_JOGADORES = 'http://127.0.0.1:8000/api/jogadores/'
const URL_CONVOCATORIAS = 'http://127.0.0.1:8000/api/convocatorias/'

function CriarConvocatoria() {
  const [jogos, setJogos] = useState([])
  const [jogadores, setJogadores] = useState([])
  const [jogoSelecionado, setJogoSelecionado] = useState('')
  const [selecionados, setSelecionados] = useState([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    axios.get(URL_JOGOS)
      .then(response => setJogos(response.data))
      .catch(err => console.log('Erro ao carregar jogos', err))

    axios.get(URL_JOGADORES)
      .then(response => setJogadores(response.data))
      .catch(err => console.log('Erro ao carregar jogadores', err))
  }, [])

  const toggleJogador = (id) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!jogoSelecionado) return
    if (selecionados.length === 0) {
      setErro('Seleciona pelo menos um jogador.')
      return
    }

    const pedidos = selecionados.map(jogadorId =>
      axios.post(URL_CONVOCATORIAS, {
        jogo: parseInt(jogoSelecionado),
        jogador: jogadorId
      }, { withCredentials: true })
    )

    Promise.all(pedidos)
      .then(() => {
        setSucesso('Convocatória criada com sucesso!')
        setErro('')
        setSelecionados([])
      })
      .catch(err => {
        setErro('Erro ao criar convocatória. Verifica se estás autenticado como staff.')
        console.log(err)
      })
  }

  return (
    <div>
      <h1>Criar Convocatória</h1>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Jogo:</label>
          <select
            value={jogoSelecionado}
            onChange={e => setJogoSelecionado(e.target.value)}
            required
          >
            <option value="">Seleciona um jogo</option>
            {jogos.map(jogo => (
              <option key={jogo.id} value={jogo.id}>
                vs {jogo.adversario} — {new Date(jogo.data).toLocaleDateString('pt-PT')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2>Seleciona os Convocados</h2>
          {jogadores.map(jogador => (
            <div key={jogador.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selecionados.includes(jogador.id)}
                  onChange={() => toggleJogador(jogador.id)}
                />
                {jogador.numero_camisola} — {jogador.nome} ({jogador.posicao})
              </label>
            </div>
          ))}
        </div>

        <button type="submit">Criar Convocatória</button>
      </form>
    </div>
  )
}

export default CriarConvocatoria