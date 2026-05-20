import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const URL_JOGOS = 'http://127.0.0.1:8000/api/jogos/'
const URL_ESTATISTICAS = 'http://127.0.0.1:8000/api/estatisticas/'
const URL_CONVOCATORIAS = 'http://127.0.0.1:8000/api/convocatorias/'

function RegistarResultado() {
  const navigate = useNavigate()
  const [jogos, setJogos] = useState([])
  const [jogoSelecionado, setJogoSelecionado] = useState('')
  const [golosNos, setGolosNos] = useState(0)
  const [golosAdv, setGolosAdv] = useState(0)
  const [convocados, setConvocados] = useState([])
  const [stats, setStats] = useState({})
  const [erro, setErro] = useState('')

  useEffect(() => {
    axios.get(URL_JOGOS)
      .then(response => setJogos(response.data))
      .catch(err => console.log('Erro ao carregar jogos', err))
  }, [])

  useEffect(() => {
    if (!jogoSelecionado) return
    axios.get(URL_CONVOCATORIAS + '?jogo=' + jogoSelecionado, { withCredentials: true })
      .then(response => {
        setConvocados(response.data)
        const statsIniciais = {}
        response.data.forEach(c => {
          statsIniciais[c.jogador] = { golos: 0, assistencias: 0 }
        })
        setStats(statsIniciais)
      })
      .catch(err => console.log('Erro ao carregar convocados', err))
  }, [jogoSelecionado])

  const handleStatChange = (jogadorId, campo, valor) => {
    setStats(prev => ({
      ...prev,
      [jogadorId]: {
        ...prev[jogadorId],
        [campo]: parseInt(valor) || 0
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const jogo = jogos.find(j => j.id === parseInt(jogoSelecionado))

    axios.put(URL_JOGOS + jogoSelecionado + '/', {
      adversario: jogo.adversario,
      data: jogo.data,
      local: jogo.local,
      is_casa: jogo.is_casa,
      golos_nos: golosNos,
      golos_adv: golosAdv
    }, { withCredentials: true })
      .then(() => {
        const pedidos = convocados.map(c =>
          axios.post(URL_ESTATISTICAS, {
            jogo: parseInt(jogoSelecionado),
            jogador: c.jogador,
            golos: stats[c.jogador]?.golos || 0,
            assistencias: stats[c.jogador]?.assistencias || 0
          }, { withCredentials: true })
        )
        return Promise.all(pedidos)
      })
      .then(() => navigate('/jogos'))
      .catch(err => {
        setErro('Erro ao registar resultado. Verifica se estás autenticado como staff.')
        console.log(err)
      })
  }

  return (
    <div>
      <h1>Registar Resultado</h1>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

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
          <label>Golos Nossos:</label>
          <input
            type="number"
            min="0"
            value={golosNos}
            onChange={e => setGolosNos(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Golos Adversário:</label>
          <input
            type="number"
            min="0"
            value={golosAdv}
            onChange={e => setGolosAdv(e.target.value)}
            required
          />
        </div>

        {convocados.length > 0 && (
          <div>
            <h2>Estatísticas Individuais</h2>
            <table>
              <thead>
                <tr>
                  <th>Jogador</th>
                  <th>Golos</th>
                  <th>Assistências</th>
                </tr>
              </thead>
              <tbody>
                {convocados.map(c => (
                  <tr key={c.jogador}>
                    <td>Jogador #{c.jogador}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={stats[c.jogador]?.golos || 0}
                        onChange={e => handleStatChange(c.jogador, 'golos', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={stats[c.jogador]?.assistencias || 0}
                        onChange={e => handleStatChange(c.jogador, 'assistencias', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button type="submit">Registar Resultado</button>
      </form>
    </div>
  )
}

export default RegistarResultado