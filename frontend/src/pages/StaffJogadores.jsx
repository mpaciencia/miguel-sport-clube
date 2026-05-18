import {useState, useEffect, useContext} from "react";
import axios from "axios";
import FormJogador from "../pages/FormJogador";
import { AuthContext } from "../context/AuthContext.jsx";
import './StaffJogadores.css';

function StaffJogadores() {
    const { user } = useContext(AuthContext)

    const [jogadores, setJogadores] = useState([]);
    const [jogadorEditando, setJogadorEditando] = useState(null);

    const [treinos, setTreinos] = useState([]);

    const fetchJogadores = () => {
        axios.get('http://localhost:8000/api/jogadores/')
            .then(response => setJogadores(response.data))
            .catch(error => console.error("Erro ao buscar jogadores:", error));
    };

    const fetchTreinos = () => {
        axios.get('http://localhost:8000/api/treinos/')
            .then(response => setTreinos(response.data))
            .catch(error => console.error("Erro ao procurar treinos:", error));
    }

    useEffect(() => {
        fetchJogadores();
        fetchTreinos()
    }, []);

    // Função para apagar jogador
    const apagarJogador = (id) => {
        // Confirmação de segurança
        if (window.confirm("Tens a certeza que pretendes apagar este jogador do plantel?")) {
            axios.delete(`http://localhost:8000/api/jogadores/${id}/`)
                .then(() => {
                    alert("Jogador removido.");
                    fetchJogadores(); // Recarrega a grelha após apagar
                })
                .catch(error => console.error("Erro ao apagar:", error));
        }
    };

    return (
        <div className="staff-container" style={{ display: 'flex', gap: '30px', padding: '20px', alignItems: 'flex-start' }}>

            {/* ==========================================
                COLUNA ESQUERDA: GESTÃO (Manuel)
            ========================================== */}
            <div style={{ flex: '2' }}>
                <h1>Painel de Staff - Gestão de Plantel</h1>

                <FormJogador
                    onJogadorAtualizado={fetchJogadores}
                    jogadorEditando={jogadorEditando}
                    setJogadorEditando={setJogadorEditando}
                />

                <h3>Plantel Atual</h3>
                <table className="tabela-jogadores">
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Nome</th>
                            <th>Posição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jogadores.map(jogador => (
                            <tr key={jogador.id}>
                                <td>{jogador.numero_camisola}</td>
                                <td>{jogador.nome}</td>
                                <td>{jogador.posicao}</td>
                                <td className="acoes-celula">
                                    <button className="btn-editar" onClick={() => setJogadorEditando(jogador)}>
                                        Editar
                                    </button>
                                    <button className="btn-apagar" onClick={() => apagarJogador(jogador.id)}>
                                        Apagar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ==========================================
                COLUNA DIREITA: VISÃO GERAL (Tua Parte)
            ========================================== */}
            <div style={{ flex: '1', backgroundColor: '#f0f4f8', padding: '25px', borderRadius: '10px', border: '1px solid #d9e2ec' }}>
                <h2 style={{ marginTop: 0, color: 'navy' }}>Visão Geral</h2>
                <p>Bem-vindo, <strong>{user ? user.username : 'Treinador'}</strong>!</p>

                {/* Bloco dos teus Treinos */}
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: 'darkslategray' }}>Próximos Treinos</h3>
                    {treinos.length > 0 ? (
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {treinos && treinos.map(t => (
                                <li key={t.id} style={{ marginBottom: '10px' }}>
                                    <strong>{t.data}</strong> às {t.hora} <br/>
                                    <span style={{ fontSize: '0.9em', color: 'gray' }}>📍 {t.local}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'gray', fontSize: '0.9em' }}>Não há treinos agendados de momento.</p>
                    )}
                </div>

                {/* Bloco do Ivo (Placeholder) */}
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: 'darkslategray' }}>Próximo Jogo</h3>
                    <p style={{ color: 'gray', fontSize: '0.9em', fontStyle: 'italic' }}>
                        (A aguardar que o Ivo ligue a API de /jogos/ aqui)
                    </p>
                </div>
            </div>

        </div>
    );
}

export default StaffJogadores;