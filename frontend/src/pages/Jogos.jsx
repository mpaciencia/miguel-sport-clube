import { useState, useEffect } from 'react'
import axios from 'axios'

const URL_JOGOS = 'http://127.0.0.1:8000/api/jogos/'

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
    <div className="pagina-conteudo">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Calendário de Jogos</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <select 
            className="form-control" 
            style={{ maxWidth: '300px', cursor: 'pointer' }}
            value={mesFiltro} 
            onChange={e => setMesFiltro(e.target.value)}
          >
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {jogosFiltrados.length === 0 ? (
            <p className="sem-dados" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Sem jogos para mostrar.</p>
          ) : (
            jogosFiltrados.map(jogo => (
              <div key={jogo.id} className="card" style={{ borderTop: jogo.is_casa ? '4px solid var(--cor-primaria)' : '4px solid var(--cor-secundaria)' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>vs {jogo.adversario}</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: 'var(--cor-texto-suave)' }}>
                    <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>📅</span>
                    <span>{new Date(jogo.data).toLocaleDateString('pt-PT')} às {new Date(jogo.data).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', color: 'var(--cor-texto-suave)' }}>
                    <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>📍</span>
                    <span>{jogo.local} — <strong>{jogo.is_casa ? 'Casa' : 'Fora'}</strong></span>
                </div>

                <div style={{ 
                    padding: '10px', 
                    backgroundColor: jogo.resultado ? '#f0f3fa' : '#fff5f5', 
                    borderRadius: '6px', 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: jogo.resultado ? 'var(--cor-primaria)' : 'var(--cor-secundaria)'
                }}>
                    {jogo.resultado ? `Resultado: ${jogo.resultado}` : 'Por jogar'}
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  )
}

export default Jogos