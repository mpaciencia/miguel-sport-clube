import { useState, useEffect } from 'react';
import axios from 'axios';
import StaffNavbar from './StaffNavbar.jsx';


function RegistarJogo() {
    const [adversario, setAdversario] = useState('');
    const [dataJogo, setDataJogo] = useState('');
    const [local, setLocal] = useState('');
    const [isCasa, setIsCasa] = useState(true);
    const [golosNos, setGolosNos] = useState(0);
    const [golosAdv, setGolosAdv] = useState(0);

    const [listaJogadores, setListaJogadores] = useState([]);

    const [estatisticas, setEstatisticas] = useState([]);
    const [listaEquipas, setListaEquipas] = useState([]);

    useEffect(() => {
        // fetch jogadores
        axios.get('http://localhost:8000/api/jogadores/')
            .then(response => {
                setListaJogadores(response.data);
            })
            .catch(error => {
                console.error("Erro ao carregar jogadores:", error);
            });

        // fetch equipas da classificacao
        axios.get('http://localhost:8000/api/classificacao/')
            .then(response => {
                setListaEquipas(response.data);
            })
            .catch(error => {
                console.error("Erro ao carregar equipas:", error);
            });
    }, []);

    // Auto-preencher o local se for em casa
    useEffect(() => {
        if (isCasa) {
            setLocal('Pavilhão do Cacém');
        } else if (local === 'Pavilhão do Cacém') {
            setLocal('');
        }
    }, [isCasa]);

    const adicionarLinhaEstatistica = () => {
        setEstatisticas([...estatisticas, { jogador_id: '', golos: 0, assistencias: 0 }]);
    };

    const atualizarEstatistica = (index, campo, valor) => {
        const novasEstatisticas = [...estatisticas];
        novasEstatisticas[index][campo] = valor;
        setEstatisticas(novasEstatisticas);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dadosJogo = {
            adversario: adversario,
            data: dataJogo,
            local: local,
            is_casa: isCasa,
            golos_nos: golosNos,
            golos_adv: golosAdv
        };

        axios.post('http://localhost:8000/api/jogos/', dadosJogo)
            .then(response => {
                const jogoCriadoId = response.data.id;

                estatisticas.forEach(est => {
                    if (est.jogador_id !== '') {
                        const dadosEst = {
                            jogo: jogoCriadoId,
                            jogador: est.jogador_id,
                            golos: est.golos,
                            assistencias: est.assistencias
                        };
                        axios.post('http://localhost:8000/api/estatisticas/', dadosEst)
                            .catch(err => console.error("Erro na estatística:", err));
                    }
                });

                alert("Jogo e estatísticas registados com sucesso!");
            })
            .catch(error => {
                console.error("Erro ao criar jogo:", error);
                alert("Ocorreu um erro ao registar o jogo.");
            });
    };

    return (
        <>
            <StaffNavbar />
            <main className="page-center">
                <div className="form-card" style={{ maxWidth: '700px' }}>
                    <h2>Registar Resultado do Jogo</h2>
                    <form onSubmit={handleSubmit}>

                        {/* --- DADOS DO JOGO --- */}
                        <div style={{ padding: '20px', border: '1px solid #dde1e9', borderRadius: '8px', marginBottom: '24px' }}>
                            <h3 style={{ marginTop: 0 }}>Dados do Jogo</h3>
                            
                            <div className="form-group">
                                <label>Adversário:</label>
                                <select className="form-control" value={adversario} onChange={(e) => setAdversario(e.target.value)} required>
                                    <option value="">Selecione o adversário...</option>
                                    {listaEquipas.map(equipa => {
                                        if (equipa.is_nos) return null;
                                        return (
                                            <option key={equipa.id} value={equipa.nome}>
                                                {equipa.nome}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Data:</label>
                                <input className="form-control" type="datetime-local" value={dataJogo} onChange={(e) => setDataJogo(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label>Local:</label>
                                <input className="form-control" type="text" value={local} onChange={(e) => setLocal(e.target.value)} required />
                            </div>

                            <div className="form-check">
                                <input type="checkbox" id="checkCasa" checked={isCasa} onChange={(e) => setIsCasa(e.target.checked)} />
                                <label htmlFor="checkCasa">Em Casa?</label>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Golos Nós:</label>
                                    <input className="form-control" type="number" min="0" value={golosNos} onChange={(e) => setGolosNos(e.target.value)} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Golos Adversário:</label>
                                    <input className="form-control" type="number" min="0" value={golosAdv} onChange={(e) => setGolosAdv(e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        {/* --- ESTATÍSTICAS DOS JOGADORES --- */}
                        <div style={{ padding: '20px', border: '1px solid #dde1e9', borderRadius: '8px', marginBottom: '24px' }}>
                            <h3 style={{ marginTop: 0 }}>Estatísticas Individuais</h3>
                            <button type="button" className="btn btn-neutro" onClick={adicionarLinhaEstatistica} style={{ marginBottom: '15px' }}>
                                + Adicionar Jogador
                            </button>

                            {estatisticas.map((est, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '15px', padding: '15px', backgroundColor: '#fafbfe', borderRadius: '6px', border: '1px solid #dde1e9' }}>
                                    <div className="form-group" style={{ margin: 0, flex: 2 }}>
                                        <label>Jogador:</label>
                                        <select
                                            className="form-control"
                                            value={est.jogador_id}
                                            onChange={(e) => atualizarEstatistica(index, 'jogador_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {listaJogadores.map(jogador => (
                                                <option key={jogador.id} value={jogador.id}>
                                                    {jogador.numero_camisola} - {jogador.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ margin: 0, flex: 1 }}>
                                        <label>Golos:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={est.golos}
                                            onChange={(e) => atualizarEstatistica(index, 'golos', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0, flex: 1 }}>
                                        <label>Assistências:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={est.assistencias}
                                            onChange={(e) => atualizarEstatistica(index, 'assistencias', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn-submit">Guardar Tudo</button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default RegistarJogo;