import { useState, useEffect } from "react";
import axios from "axios";
import './FormJogador.css';

const BASE_URL = 'http://localhost:8000';

function FormJogador({ onJogadorAtualizado, jogadorEditando, setJogadorEditando }) {
    const estadoInicial = {
        nome: '',
        numero_camisola: '',
        posicao: 'GR',
        data_nascimento: ''
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [erro, setErro] = useState('');

    // Estado para a foto: o ficheiro selecionado e o URL de preview
    const [fotoFicheiro, setFotoFicheiro] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Preenche o formulário automaticamente se clicarmos em "Editar"
    useEffect(() => {
        if (jogadorEditando) {
            setFormData({
                nome: jogadorEditando.nome,
                numero_camisola: jogadorEditando.numero_camisola,
                posicao: jogadorEditando.posicao,
                data_nascimento: jogadorEditando.data_nascimento,
            });
            // Mostra a foto atual do jogador como preview inicial
            setPreviewUrl(jogadorEditando.foto ? BASE_URL + jogadorEditando.foto : '');
        } else {
            setFormData(estadoInicial);
            setPreviewUrl('');
        }
        // Ao mudar de jogador, limpa sempre o ficheiro selecionado
        setFotoFicheiro(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jogadorEditando]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler para quando o utilizador seleciona uma imagem
    const handleFotoSelecionada = (e) => {
        const ficheiro = e.target.files[0];
        if (ficheiro) {
            setFotoFicheiro(ficheiro);
            // URL.createObjectURL cria um URL temporário local para fazer a preview
            // sem precisar de enviar o ficheiro ao servidor ainda
            setPreviewUrl(URL.createObjectURL(ficheiro));
        } else {
            setFotoFicheiro(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro('');

        // Quando o pedido inclui um ficheiro, é obrigatório usar FormData
        // em vez de um objeto JSON simples. O FormData permite enviar
        // dados de texto e ficheiros binários no mesmo pedido (multipart/form-data).
        const dados = new FormData();
        dados.append('nome', formData.nome);
        dados.append('numero_camisola', formData.numero_camisola);
        dados.append('posicao', formData.posicao);
        dados.append('data_nascimento', formData.data_nascimento);

        // Só adiciona o campo 'foto' se o utilizador selecionou um ficheiro novo.
        // Se não selecionou, o campo é omitido e o Django mantém a foto existente
        // (graças ao partial=True no serializer).
        if (fotoFicheiro) {
            dados.append('foto', fotoFicheiro);
        }

        if (jogadorEditando) {
            // Modo Edição: Método PUT com FormData
            axios.put(`${BASE_URL}/api/jogadores/${jogadorEditando.id}/`, dados, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(() => {
                    alert('Jogador atualizado com sucesso!');
                    setJogadorEditando(null);
                    setFotoFicheiro(null);
                    setPreviewUrl('');
                    if (onJogadorAtualizado) onJogadorAtualizado();
                })
                .catch(error => {
                    console.error("Erro ao atualizar:", error.response?.data);
                    let errMsg = 'Erro ao atualizar jogador.';
                    if (error.response?.data) {
                        errMsg = Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(' | ');
                    }
                    setErro(errMsg);
                });
        } else {
            // Modo Criação: Método POST com FormData
            axios.post(`${BASE_URL}/api/jogadores/`, dados, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(() => {
                    alert('Jogador adicionado com sucesso!');
                    setFormData(estadoInicial);
                    setFotoFicheiro(null);
                    setPreviewUrl('');
                    if (onJogadorAtualizado) onJogadorAtualizado();
                })
                .catch(error => {
                    console.error("Erro ao adicionar:", error.response?.data);
                    let errMsg = 'Erro ao adicionar jogador.';
                    if (error.response?.data) {
                        errMsg = Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(' | ');
                    }
                    setErro(errMsg);
                });
        }
    };

    const cancelarEdicao = () => {
        setJogadorEditando(null);
        setFormData(estadoInicial);
        setFotoFicheiro(null);
        setPreviewUrl('');
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

                {/* Campo de upload de foto */}
                <label>
                    Foto do Jogador:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoSelecionada}
                        style={{ marginTop: '5px' }}
                    />
                </label>

                {/* Preview da foto: mostra a foto selecionada ou a foto atual do jogador */}
                {previewUrl && (
                    <div className="foto-preview">
                        <img
                            src={previewUrl}
                            alt="Preview da foto"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
                        />
                        {!fotoFicheiro && jogadorEditando?.foto && (
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>Foto atual</p>
                        )}
                        {fotoFicheiro && (
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>Nova foto selecionada</p>
                        )}
                    </div>
                )}

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