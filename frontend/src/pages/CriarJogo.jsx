import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const URL_JOGOS = 'http://127.0.0.1:8000/api/jogos/'

function CriarJogo() {
  const navigate = useNavigate()
  const [adversario, setAdversario] = useState('')
  const [data, setData] = useState('')
  const [local, setLocal] = useState('')
  const [isCasa, setIsCasa] = useState(true)
  const [erro, setErro] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(URL_JOGOS, {
      adversario,
      data,
      local,
      is_casa: isCasa
    }, { withCredentials: true })
      .then(() => {
        navigate('/jogos')
      })
      .catch(err => {
        setErro('Erro ao criar jogo. Verifica se estás autenticado como staff.')
        console.log(err)
      })
  }

  return (
    <div>
      <h1>Criar Jogo</h1>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Adversário:</label>
          <input
            type="text"
            value={adversario}
            onChange={e => setAdversario(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data e Hora:</label>
          <input
            type="datetime-local"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Local:</label>
          <input
            type="text"
            value={local}
            onChange={e => setLocal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isCasa}
              onChange={e => setIsCasa(e.target.checked)}
            />
            Jogo em casa
          </label>
        </div>
        <button type="submit">Criar Jogo</button>
      </form>
    </div>
  )
}

export default CriarJogo