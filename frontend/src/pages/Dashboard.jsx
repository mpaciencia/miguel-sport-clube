import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [treinos, setTreinos] = useState([]);

    const [treinosRespondidos, setTreinosRespondidos] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:8000/api/treinos/')
            .then(response => setTreinos(response.data))
            .catch(error => console.error("Erro ao carregar treinos:", error))
    }, []);

    const confirmarIda = (treinoId, resposta) => {
        setTreinosRespondidos([...treinosRespondidos, treinoId])
        axios.post('http://localhost:8000/api/presenca/', {
            id_treino: treinoId,
            presenteTreino: resposta,
            username: user.username
        })
            .then(response => {
                alert(response.data.message)
            })
            .catch(error => {
                console.error("Erro ao guardar resposta:", error);
                alert("Ocorreu um erro ao guardar a tua presença");
            });
    }

    return (
        <main className="container">
            <header style={{ textAlign: 'center', margin: '30px 0' }}>
                <h1>Bem-vindo, {user ? user.username : "Jogador"}! ⚽</h1>
                <p>Aqui tens o resumo da tua atividade no Miguel Sport Clube.</p>
            </header>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                {/* A TUA SECÇÃO: PRÓXIMOS TREINOS E PRESENÇAS */}
                <section className="container3" style={{ flex: '1', minWidth: '300px' }}>
                    <h2 style={{ color: 'white' }}>Próximos Treinos</h2>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'left' }}>
                        {treinos.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {treinos.map(t => (
                                    <li key={t.id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '15px' }}>
                                        <strong>📅 Data:</strong> {t.data} <br/>
                                        <strong>⏰ Hora:</strong> {t.hora} <br/>
                                        <strong>📍 Local:</strong> {t.local} <br/>

                                        {/* Os Botões de Presença */}

                                        {/* A MAGIA PERMANENTE ACONTECE AQUI */}
                                        { (treinosRespondidos.includes(t.id) ||
                                          (t.confirmados && t.confirmados.includes(user.username)) ||
                                          (t.ausentes && t.ausentes.includes(user.username))) ? (

                                            <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e6f4ea', color: '#137333', borderRadius: '4px', fontWeight: 'bold' }}>
                                                Resposta registada
                                            </div>

                                        ) : (

                                            <div style={{ marginTop: '10px' }}>
                                                <span style={{ marginRight: '10px', color: 'darkslategray', fontWeight: 'bold' }}>Marcar presença:</span>
                                                <button
                                                    onClick={() => confirmarIda(t.id, true)}
                                                    style={{ backgroundColor: 'mediumseagreen', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                                                >
                                                    Presente
                                                </button>
                                                <button
                                                    onClick={() => confirmarIda(t.id, false)}
                                                    style={{ backgroundColor: 'tomato', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Não Presente
                                                </button>
                                            </div>

                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'gray' }}>Não há treinos agendados de momento.</p>
                        )}
                    </div>
                </section>

                {/* SECÇÃO DO IVO (Placeholder) */}
                <section className="container3" style={{ flex: '1', minWidth: '300px', backgroundColor: 'cornflowerblue' }}>
                    <h2 style={{ color: 'white' }}>Última Convocatória & Estatísticas</h2>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <p><em>(ivoxxxxx)</em></p>
                    </div>
                </section>

            </div>
        </main>
    )
}

export default Dashboard;