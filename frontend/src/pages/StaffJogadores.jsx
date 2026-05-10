import { useState, useEffect } from "react";
import axios from "axios";
import FormJogador from "../pages/FormJogador";
import './StaffJogadores.css';

function StaffJogadores() {
    const [jogadores, setJogadores] = useState([]);
    const [jogadorEditando, setJogadorEditando] = useState(null);

    const fetchJogadores = () => {
        axios.get('http://localhost:8000/api/jogadores/')
            .then(response => setJogadores(response.data))
            .catch(error => console.error("Erro ao buscar jogadores:", error));
    };

    useEffect(() => {
        fetchJogadores();
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
        <div className="staff-container">
            <h1>Painel de Staff - Gestão de Plantel</h1>

            {/* Passamos as novas props ao formulário */}
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
                                {/* Botão Editar ativa o estado */}
                                <button
                                    className="btn-editar"
                                    onClick={() => setJogadorEditando(jogador)}
                                >
                                    Editar
                                </button>
                                {/* Botão Apagar chama a função passando o ID */}
                                <button
                                    className="btn-apagar"
                                    onClick={() => apagarJogador(jogador.id)}
                                >
                                    Apagar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StaffJogadores;