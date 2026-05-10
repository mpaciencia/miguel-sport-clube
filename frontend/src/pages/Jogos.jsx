import { useState, useEffect } from 'react'
import axios from 'axios'

const URL_JOGOS = 'http://127.0.0.1:8000/clube/api/jogos/'

function Jogos() {
  const [jogos, setJogos] = useState([])
  const [mesFiltro, setMesFiltro] = useState('')

  useEffect(() => {
    axios.get(URL_JOGOS)
      .then(response => setJogos(response.data))
      .catch(err => console.log('Erro ao carregar jogos', err))
  }, [])

  const jogosFiltrados = mesFiltro
    ? jogos.filter(j => new Date(j.data).getMonth() + 1 === parseInt(mesFiltro))
    : jogos

  return (
    <div>
      <h1>Calendário de Jogos</h1>

      <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)}>
        <option value="">Todos os meses</option>
        <option value="1">Janeiro</option>
        <option value="2">Fevereiro</option>
        <option value="3">Março</option>
        <option value="4">Abril</option>
        <option value="5">Maio</option>
        <option value="6">Junho</option>
        <option value="7">Julho</option>
        <option value="8">Agosto</option>
        <option value="9">Setembro</option>
        <option value="10">Outubro</option>
        <option value="11">Novembro</option>
        <option value="12">Dezembro</option>
      </select>

      {jogosFiltrados.length === 0 ? (
        <p>Sem jogos para mostrar.</p>
      ) : (
        jogosFiltrados.map(jogo => (
          <div key={jogo.id}>
            <h2>vs {jogo.adversario}</h2>
            <p>{new Date(jogo.data).toLocaleDateString('pt-PT')}</p>
            <p>{jogo.local} — {jogo.is_casa ? 'Casa' : 'Fora'}</p>
            <p>{jogo.resultado ? `Resultado: ${jogo.resultado}` : 'Por jogar'}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default Jogos