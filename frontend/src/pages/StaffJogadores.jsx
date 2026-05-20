import { useState, useEffect, useContext } from "react";
import axios from "axios";
import FormJogador from "../pages/FormJogador";
import { AuthContext } from "../context/AuthContext.jsx";
// IMPORTA O NOVO COMPONENTE AQUI (ajusta o caminho se o colocaste noutra pasta)
import StaffNavbar from "./StaffNavbar";
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
        // Novo wrapper principal para segurar a Navbar e as colunas
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* SUB-NAVBAR DO STAFF NO TOPO */}
            <StaffNavbar />

            {/* O TEU CONTENTOR ORIGINAL DAS DUAS COLUNAS */}
            <div className="staff-container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>

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
                        <h3 style={{ marginTop: 0, color: 'darkslategray' }}>Próximos Treinos e Presenças</h3>

                        {Array.isArray(treinos) && treinos.length > 0 ? (
                            <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0 }}>
                                {treinos.map(t => (
                                    <li key={t.id} style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                                        <strong style={{ color: '#2d3748' }}>📅 {t.data} às {t.hora}</strong> <br/>
                                        <span style={{ fontSize: '0.9em', color: '#718096' }}>📍 {t.local}</span>

                                        {/* Zona de listagem de presenças para o Treinador */}
                                        <div style={{ marginTop: '10px', fontSize: '0.85em', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '5px' }}>

                                            {/* Listar os Confirmados */}
                                            <div style={{ marginBottom: '5px' }}>
                                                <span style={{ color: 'mediumseagreen', fontWeight: 'bold' }}>Presentes: ({t.confirmados ? t.confirmados.length : 0}): </span>
                                                <span style={{ color: '#4a5568' }}>
                                                    {t.confirmados && t.confirmados.length > 0 ? t.confirmados.join(', ') : 'Nenhum jogador confirmado'}
                                                </span>
                                            </div>

                                            {/* Listar os Ausentes */}
                                            <div>
                                                <span style={{ color: 'tomato', fontWeight: 'bold' }}>Não Presentes({t.ausentes ? t.ausentes.length : 0}): </span>
                                                <span style={{ color: '#4a5568' }}>
                                                    {t.ausentes && t.ausentes.length > 0 ? t.ausentes.join(', ') : 'Nenhuma ausência declarada'}
                                                </span>
                                            </div>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'gray', fontSize: '0.9em' }}>Não há treinos agendados de momento.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StaffJogadores;