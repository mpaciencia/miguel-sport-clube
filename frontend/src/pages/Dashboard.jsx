import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [treinos, setTreinos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/treinos/')
            .then(response => setTreinos(response.data))
            .catch(error => console.error("Erro ao carregar treinos:", error))
    }, []);

    return (
        <main className="container">
            <header style={{ textAlign: 'center', margin: '30px 0' }}>
                <h1>Bem-vindo, {user ? user.username : "Jogador"}! ⚽</h1>
                <p>Aqui tens o resumo da tua atividade no Miguel Sport Clube.</p>
            </header>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                {/* SECÇÃO: PRÓXIMOS TREINOS (Tua responsabilidade) */}
                <section className="container3" style={{ flex: '1', minWidth: '300px' }}>
                    <h2 style={{ color: 'white' }}>Próximos Treinos</h2>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'left' }}>
                        {treinos.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {treinos.map(t => (
                                    <li key={t.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                        <strong>📅 Data:</strong> {t.data} <br/>
                                        <strong>⏰ Hora:</strong> {t.hora} <br/>
                                        <strong>📍 Local:</strong> {t.local}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'gray' }}>Não há treinos agendados de momento.</p>
                        )}
                    </div>
                </section>

                <section className="container3" style={{ flex: '1', minWidth: '300px', backgroundColor: 'cornflowerblue' }}>
                    <h2 style={{ color: 'white' }}>Última Convocatória & Estatísticas</h2>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <p><em>(Em breve: Dados das convocatórias do Ivo e perfil do Manuel)</em></p>
                        <div style={{ fontSize: '2em' }}>📊</div>
                        <p style={{ color: 'navy', fontWeight: 'bold' }}>Golos este mês: 0</p>
                    </div>
                </section>

            </div>
        </main>
    );
}

export default Dashboard;