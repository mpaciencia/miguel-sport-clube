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

    const [fotoFicheiro, setFotoFicheiro] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (jogadorEditando) {
            setFormData({
                nome: jogadorEditando.nome,
                numero_camisola: jogadorEditando.numero_camisola,
                posicao: jogadorEditando.posicao,
                data_nascimento: jogadorEditando.data_nascimento,
            });
            setPreviewUrl(jogadorEditando.foto ? BASE_URL + jogadorEditando.foto : '');
        } else {
            setFormData(estadoInicial);
            setPreviewUrl('');
        }
        setFotoFicheiro(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jogadorEditando]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFotoSelecionada = (e) => {
        const ficheiro = e.target.files[0];
        if (ficheiro) {
            setFotoFicheiro(ficheiro);
            setPreviewUrl(URL.createObjectURL(ficheiro));
        } else {
            setFotoFicheiro(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro('');

        const dados = new FormData();
        dados.append('nome', formData.nome);
        dados.append('numero_camisola', formData.numero_camisola);
        dados.append('posicao', formData.posicao);
        dados.append('data_nascimento', formData.data_nascimento);

        if (fotoFicheiro) {
            dados.append('foto', fotoFicheiro);
        }

        if (jogadorEditando) {
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
        <div className="form-card" style={{ maxWidth: '100%' }}>
            <h2>{jogadorEditando ? 'A Editar Jogador' : 'Adicionar Novo Jogador'}</h2>
            {erro && <p className="erro-mensagem">{erro}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nome:</label>
                    <input className="form-control" type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Número da Camisola:</label>
                    <input className="form-control" type="number" name="numero_camisola" value={formData.numero_camisola} onChange={handleChange} required min="1" />
                </div>

                <div className="form-group">
                    <label>Posição:</label>
                    <select className="form-control" name="posicao" value={formData.posicao} onChange={handleChange}>
                        <option value="GR">Guarda Redes</option>
                        <option value="FX">Fixo</option>
                        <option value="AL">Ala</option>
                        <option value="PI">Pivot</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Data de Nascimento:</label>
                    <input className="form-control" type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Foto do Jogador:</label>
                    <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={handleFotoSelecionada}
                        style={{ padding: '8px' }}
                    />
                </div>

                {previewUrl && (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img
                            src={previewUrl}
                            alt="Preview da foto"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #dde1e9' }}
                        />
                        {!fotoFicheiro && jogadorEditando?.foto && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--cor-texto-suave)', marginTop: '4px' }}>Foto atual</p>
                        )}
                        {fotoFicheiro && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--cor-texto-suave)', marginTop: '4px' }}>Nova foto selecionada</p>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-submit" style={{ flex: 1, marginTop: 0 }}>
                        {jogadorEditando ? 'Atualizar Jogador' : 'Guardar Jogador'}
                    </button>
                    {jogadorEditando && (
                        <button type="button" className="btn btn-neutro" onClick={cancelarEdicao} style={{ flex: 1 }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default FormJogador;