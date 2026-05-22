import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [treinos, setTreinos] = useState([]);

    const [treinosRespondidos, setTreinosRespondidos] = useState([]);
    const getCSRFToken = () => {
        return document.cookie.split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
    };


    useEffect(() => {
        axios.get('http://localhost:8000/api/treinos/', {withCredentials: true})
            .then(response => setTreinos(response.data))
            .catch(error => console.error("Erro ao carregar treinos:", error))
    }, []);

    const confirmarIda = (treinoId, resposta) => {
        setTreinosRespondidos([...treinosRespondidos, treinoId])
        axios.post('http://localhost:8000/api/presenca/', {
            id_treino: treinoId,
            presenteTreino: resposta
        }, {
            withCredentials: true,
            headers: { 'X-CSRFToken': getCSRFToken() }
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
        <main className="pagina-conteudo">
            <header style={{ textAlign: 'center', margin: '30px 0 50px' }}>
                <h1>Bem-vindo, {user ? user.username : "Jogador"}! ⚽</h1>
                <p style={{ color: 'var(--cor-texto-suave)' }}>Aqui tens o resumo da tua atividade no Miguel Sport Clube.</p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <section className="form-card" style={{ maxWidth: '600px', width: '100%' }}>
                    <h2 style={{ color: 'var(--cor-primaria)' }}>Próximos Treinos</h2>

                    {treinos.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {treinos.map(t => (
                                <li key={t.id} style={{ marginBottom: '15px', borderBottom: '1px solid #dde1e9', paddingBottom: '15px' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong style={{ color: 'var(--cor-texto)' }}>📅 Data:</strong> {t.data} <br/>
                                        <strong style={{ color: 'var(--cor-texto)' }}>⏰ Hora:</strong> {t.hora} <br/>
                                        <strong style={{ color: 'var(--cor-texto)' }}>📍 Local:</strong> {t.local}
                                    </div>

                                    { (treinosRespondidos.includes(t.id) ||
                                        (t.confirmados && t.confirmados.includes(user.username)) ||
                                        (t.ausentes && t.ausentes.includes(user.username))) ? (

                                        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e6f4ea', color: '#137333', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center' }}>
                                            ✓ Resposta registada
                                        </div>

                                    ) : (

                                        <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ color: 'var(--cor-texto-suave)', fontWeight: 'bold' }}>Presença:</span>
                                            <button
                                                className="btn"
                                                onClick={() => confirmarIda(t.id, true)}
                                                style={{ backgroundColor: 'mediumseagreen', color: 'white', flex: 1 }}
                                            >
                                                Sim, vou
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => confirmarIda(t.id, false)}
                                                style={{ backgroundColor: 'tomato', color: 'white', flex: 1 }}
                                            >
                                                Não vou
                                            </button>
                                        </div>

                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="sem-dados" style={{ textAlign: 'center' }}>Não há treinos agendados de momento.</div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Dashboard;