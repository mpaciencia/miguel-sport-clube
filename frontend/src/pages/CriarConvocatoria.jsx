import { useState, useEffect } from 'react'
import axios from 'axios'
import StaffNavbar from './StaffNavbar';

const URL_JOGOS = 'http://127.0.0.1:8000/api/jogos/'
const URL_JOGADORES = 'http://127.0.0.1:8000/api/jogadores/'
const URL_CONVOCATORIAS = 'http://127.0.0.1:8000/api/convocatorias/'

function CriarConvocatoria() {
  const [jogos, setJogos] = useState([])
  const [jogadores, setJogadores] = useState([])

  const [jogoSelecionado, setJogoSelecionado] = useState('')
  const [selecionados, setSelecionados] = useState([])

  const [selecionadosIniciais, setSelecionadosIniciais] = useState([])

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

  useEffect(() => {
    setErro('')
    setSucesso('')
    setSelecionados([])
    setSelecionadosIniciais([])

    if (jogoSelecionado) {
      axios.get(`${URL_CONVOCATORIAS}?jogo=${jogoSelecionado}`)
          .then(response => {
            const idsJaConvocados = response.data.map(conv => conv.jogador)
            setSelecionados(idsJaConvocados)
            setSelecionadosIniciais(idsJaConvocados)
          })
          .catch(err => console.log('Erro ao carregar convocatórias existentes', err))
    }
  }, [jogoSelecionado])

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

    const novosConvocados = selecionados.filter(id => !selecionadosIniciais.includes(id))

    if (novosConvocados.length === 0) {
      setErro('Estes jogadores já estão convocados. Nenhuma alteração nova feita.')
      return
    }

    const pedidos = novosConvocados.map(jogadorId =>
        axios.post(URL_CONVOCATORIAS, {
          jogo: parseInt(jogoSelecionado),
          jogador: jogadorId
        }, { withCredentials: true })
    )

    Promise.all(pedidos)
        .then(() => {
          setSucesso('Convocatória criada com sucesso!')
          setErro('')
          setSelecionadosIniciais(selecionados)
        })
        .catch(err => {
          setErro('Erro ao criar convocatória. Verifica as tuas permissões.')
          console.log(err)
        })
  }

  return (
      <>
        <StaffNavbar />
        <main className="page-center">
          <div className="form-card" style={{ maxWidth: '600px' }}>
            <h2>Criar / Editar Convocatória</h2>

            {erro && <p className="erro-mensagem">{erro}</p>}
            {sucesso && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{sucesso}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Jogo:</label>
                <select
                    className="form-control"
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

              <div style={{ marginTop: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #dde1e9', paddingBottom: '10px', marginBottom: '15px' }}>Seleciona os Convocados</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {jogadores.map(jogador => (
                        <div key={jogador.id} className="form-check" style={{ marginBottom: '10px' }}>
                          <input
                              type="checkbox"
                              id={`jogador-${jogador.id}`}
                              checked={selecionados.includes(jogador.id)}
                              onChange={() => toggleJogador(jogador.id)}
                          />
                          <label htmlFor={`jogador-${jogador.id}`}>
                              {jogador.numero_camisola} — {jogador.nome} ({jogador.posicao})
                          </label>
                        </div>
                    ))}
                </div>
              </div>

              <button type="submit" className="btn-submit" style={{ marginTop: '20px' }}>Guardar Convocatória</button>
            </form>
          </div>
        </main>
      </>
  )
}

export default CriarConvocatoria