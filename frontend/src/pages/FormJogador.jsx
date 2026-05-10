import { useState, useEffect } from "react";
import axios from "axios";
import './FormJogador.css';

function FormJogador({ onJogadorAtualizado, jogadorEditando, setJogadorEditando }) {
    const estadoInicial = {
        nome: '',
        numero_camisola: '',
        posicao: 'GR',
        data_nascimento: ''
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [erro, setErro] = useState('');

    // Preenche o formulário automaticamente se clicarmos em "Editar"
    useEffect(() => {
        if (jogadorEditando) {
            // eslint-disable-next-line
            setFormData(jogadorEditando);
        } else {
            setFormData(estadoInicial);
        }
    }, [jogadorEditando, estadoInicial]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro('');

        if (jogadorEditando) {
            // Modo Edição: Método PUT
            axios.put(`http://localhost:8000/api/jogadores/${jogadorEditando.id}/`, formData)
                .then(() => {
                    alert('Jogador atualizado com sucesso!');
                    setJogadorEditando(null); // Sai do modo de edição
                    setFormData(estadoInicial);
                    if (onJogadorAtualizado) onJogadorAtualizado();
                })
                .catch(error => {
                    console.error("Erro ao atualizar:", error.response?.data);
                    setErro('Erro ao atualizar jogador.');
                });
        } else {
            // Modo Criação: Método POST
            axios.post('http://localhost:8000/api/jogadores/', formData)
                .then(() => {
                    alert('Jogador adicionado com sucesso!');
                    setFormData(estadoInicial);
                    if (onJogadorAtualizado) onJogadorAtualizado();
                })
                .catch(error => {
                    console.error("Erro ao adicionar:", error.response?.data);
                    setErro('Erro ao adicionar jogador.');
                });
        }
    };

    const cancelarEdicao = () => {
        setJogadorEditando(null);
        setFormData(estadoInicial);
        setErro('');
    };

    return (
        <div className="formulario-card">
            <h3>{jogadorEditando ? 'A Editar Jogador' : 'Adicionar Novo Jogador'}</h3>
            {erro && <p className="erro-mensagem">{erro}</p>}

            <form onSubmit={handleSubmit} className="form-jogador">
                <label>
                    Nome:
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                </label>

                <label>
                    Número da Camisola:
                    <input type="number" name="numero_camisola" value={formData.numero_camisola} onChange={handleChange} required min="1" />
                </label>

                <label>
                    Posição:
                    <select name="posicao" value={formData.posicao} onChange={handleChange}>
                        <option value="GR">Guarda Redes</option>
                        <option value="FX">Fixo</option>
                        <option value="AL">Ala</option>
                        <option value="PI">Pivot</option>
                    </select>
                </label>

                <label>
                    Data de Nascimento:
                    <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />
                </label>

                <div className="botoes-form">
                    <button type="submit" className="btn-guardar">
                        {jogadorEditando ? 'Atualizar Jogador' : 'Guardar Jogador'}
                    </button>
                    {jogadorEditando && (
                        <button type="button" className="btn-cancelar" onClick={cancelarEdicao}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default FormJogador;