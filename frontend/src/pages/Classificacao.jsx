import { useState, useEffect } from 'react'
import axios from 'axios'

const URL_CLASSIFICACAO = 'http://127.0.0.1:8000/api/classificacao/'

function Classificacao() {
  const [equipas, setEquipas] = useState([])

  useEffect(() => {
    axios.get(URL_CLASSIFICACAO)
      .then(response => setEquipas(response.data))
      .catch(err => console.log('Erro ao carregar classificação', err))
  }, [])

  return (
    <div>
      <h1>Classificação</h1>

      {equipas.length === 0 ? (
        <p>Sem dados de classificação.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Equipa</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>GM</th>
              <th>GS</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {equipas.map((equipa, index) => (
              <tr
                key={equipa.id}
                style={equipa.is_nos ? { fontWeight: 'bold', backgroundColor: '#d4edda' } : {}}
              >
                <td>{index + 1}</td>
                <td>{equipa.nome}</td>
                <td>{equipa.jogos}</td>
                <td>{equipa.vitorias}</td>
                <td>{equipa.empates}</td>
                <td>{equipa.derrotas}</td>
                <td>{equipa.golos_marcados}</td>
                <td>{equipa.golos_sofridos}</td>
                <td>{equipa.pontos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Classificacao