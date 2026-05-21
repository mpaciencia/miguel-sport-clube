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

  // Guardar também os jogadores que já estavam na base de dados para este jogo
  const [selecionadosIniciais, setSelecionadosIniciais] = useState([])

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  // 1. Carregar Dados Iniciais (Executa só 1 vez ao abrir a página)
  useEffect(() => {
    axios.get(URL_JOGOS)
        .then(response => setJogos(response.data))
        .catch(err => console.log('Erro ao carregar jogos', err))

    axios.get(URL_JOGADORES)
        .then(response => setJogadores(response.data))
        .catch(err => console.log('Erro ao carregar jogadores', err))
  }, [])

  // 2. NOVO: Carregar convocados sempre que o "jogoSelecionado" muda!
  useEffect(() => {
    // Limpar as mensagens e as checkboxes sempre que muda o jogo
    setErro('')
    setSucesso('')
    setSelecionados([])
    setSelecionadosIniciais([])

    if (jogoSelecionado) {
      // Vai buscar as convocatórias que já existem para este jogo em específico
      // (Lembras-te que programaste este filtro no views.py?)
      axios.get(`${URL_CONVOCATORIAS}?jogo=${jogoSelecionado}`)
          .then(response => {
            // Extrai apenas os IDs dos jogadores que já estão convocados
            const idsJaConvocados = response.data.map(conv => conv.jogador)
            setSelecionados(idsJaConvocados)
            setSelecionadosIniciais(idsJaConvocados) // Guarda como referência inicial
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

    // NOVO: Evitar enviar POST de jogadores que já lá estavam antes
    const novosConvocados = selecionados.filter(id => !selecionadosIniciais.includes(id))

    if (novosConvocados.length === 0) {
      setErro('Estes jogadores já estão convocados. Nenhuma alteração nova feita.')
      return
    }

    // Fazemos o POST apenas aos jogadores que adicionámos agora
    const pedidos = novosConvocados.map(jogadorId =>
        axios.post(URL_CONVOCATORIAS, {
          jogo: parseInt(jogoSelecionado),
          jogador: jogadorId
        }, { withCredentials: true }) // Nota: certifica-te de que o teu Django CORS aceita credentials
    )

    Promise.all(pedidos)
        .then(() => {
          setSucesso('Convocatória criada com sucesso!')
          setErro('')
          // Atualiza a referência para que num 2º clique ele saiba que já estão gravados
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
        <main className="container">
          <div>
            <h1>Criar / Editar Convocatória</h1>

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

              <button type="submit">Guardar Convocatória</button>
            </form>
          </div>
        </main>
      </>
  )
}

export default CriarConvocatoria