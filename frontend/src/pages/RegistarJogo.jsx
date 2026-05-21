import { useState, useEffect } from 'react';
import axios from 'axios';
import StaffNavbar from './StaffNavbar';
// Se usares o react-router-dom para redirecionar após gravar:
// import { useNavigate } from 'react-router-dom';

function RegistarJogo() {
    // 1. Estados para os dados base do Jogo
    const [adversario, setAdversario] = useState('');
    const [dataJogo, setDataJogo] = useState('');
    const [local, setLocal] = useState('');
    const [isCasa, setIsCasa] = useState(true);
    const [golosNos, setGolosNos] = useState(0);
    const [golosAdv, setGolosAdv] = useState(0);

    // 2. Estados para os Jogadores e Estatísticas
    const [listaJogadores, setListaJogadores] = useState([]);
    // O estado das estatísticas é um array de objetos. Começa vazio.
    const [estatisticas, setEstatisticas] = useState([]);
    const [listaEquipas, setListaEquipas] = useState([]);

    // const navigate = useNavigate();

    // 3. Buscar os jogadores ao Django quando o componente é montado
    useEffect(() => {
        // Fetch jogadores
        axios.get('http://localhost:8000/api/jogadores/')
            .then(response => {
                setListaJogadores(response.data);
            })
            .catch(error => {
                console.error("Erro ao carregar jogadores:", error);
            });
            
        // Fetch equipas da classificacao
        axios.get('http://localhost:8000/api/classificacao/')
            .then(response => {
                setListaEquipas(response.data);
            })
            .catch(error => {
                console.error("Erro ao carregar equipas:", error);
            });
    }, []);

    // 3.5 Auto-preencher o local se for em casa
    useEffect(() => {
        if (isCasa) {
            setLocal('Pavilhão do Cacém');
        } else if (local === 'Pavilhão do Cacém') {
            setLocal('');
        }
    }, [isCasa]);

    // 4. Função para adicionar uma nova linha de estatística em branco
    const adicionarLinhaEstatistica = () => {
        setEstatisticas([...estatisticas, { jogador_id: '', golos: 0, assistencias: 0 }]);
    };

    // 5. Função para atualizar uma linha de estatística específica
    const atualizarEstatistica = (index, campo, valor) => {
        // Criar uma cópia do array atual
        const novasEstatisticas = [...estatisticas];
        // Atualizar o campo (jogador_id, golos ou assistencias) da linha correspondente
        novasEstatisticas[index][campo] = valor;
        // Guardar o array atualizado no estado
        setEstatisticas(novasEstatisticas);
    };

    // 6. Submissão do Formulário
    const handleSubmit = (e) => {
        e.preventDefault();

        // Passo A: Criar o Jogo
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

                // Passo B: Gravar as estatísticas usando o ID do novo jogo
                // Fazemos um loop pelo array de estatisticas e enviamos um POST por cada uma
                estatisticas.forEach(est => {
                    if (est.jogador_id !== '') { // Só envia se tiver um jogador selecionado
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
                // navigate('/calendario'); // Descomentar para redirecionar
            })
            .catch(error => {
                console.error("Erro ao criar jogo:", error);
                alert("Ocorreu um erro ao registar o jogo.");
            });
    };

    return (
        <>
            <StaffNavbar />
            <main className="container">
                <div className="container">
                    <h2>Registar Resultado do Jogo</h2>
                    <form onSubmit={handleSubmit}>

                        {/* --- DADOS DO JOGO --- */}
                        <fieldset>
                            <legend>Dados do Jogo</legend>
                            <label>Adversário:</label>
                            <select value={adversario} onChange={(e) => setAdversario(e.target.value)} required>
                                <option value="">Selecione o adversário...</option>
                                {listaEquipas.map(equipa => {
                                    if (equipa.is_nos) return null; // Esconder a nossa própria equipa
                                    return (
                                        <option key={equipa.id} value={equipa.nome}>
                                            {equipa.nome}
                                        </option>
                                    );
                                })}
                            </select>

                            <label>Data:</label>
                            <input type="datetime-local" value={dataJogo} onChange={(e) => setDataJogo(e.target.value)} required />

                            <label>Local:</label>
                            <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} required />

                            <label>Em Casa?</label>
                            <input type="checkbox" checked={isCasa} onChange={(e) => setIsCasa(e.target.checked)} />

                            <br/><br/>
                            <label>Golos Nós:</label>
                            <input type="number" value={golosNos} onChange={(e) => setGolosNos(e.target.value)} required />

                            <label>Golos Adversário:</label>
                            <input type="number" value={golosAdv} onChange={(e) => setGolosAdv(e.target.value)} required />
                        </fieldset>

                        <br/>

                        {/* --- ESTATÍSTICAS DOS JOGADORES --- */}
                        <fieldset>
                            <legend>Estatísticas Individuais</legend>
                            <button type="button" onClick={adicionarLinhaEstatistica}>
                                + Adicionar Jogador
                            </button>

                            {estatisticas.map((est, index) => (
                                <div key={index} style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
                                    <label>Jogador: </label>
                                    {/* Aqui está o Dropdown gerado dinamicamente */}
                                    <select
                                        value={est.jogador_id}
                                        onChange={(e) => atualizarEstatistica(index, 'jogador_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Selecione um jogador...</option>
                                        {listaJogadores.map(jogador => (
                                            <option key={jogador.id} value={jogador.id}>
                                                {jogador.numero_camisola} - {jogador.nome} ({jogador.posicao})
                                            </option>
                                        ))}
                                    </select>

                                    <label style={{ marginLeft: '10px' }}>Golos: </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={est.golos}
                                        onChange={(e) => atualizarEstatistica(index, 'golos', e.target.value)}
                                        style={{ width: '50px' }}
                                    />

                                    <label style={{ marginLeft: '10px' }}>Assistências: </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={est.assistencias}
                                        onChange={(e) => atualizarEstatistica(index, 'assistencias', e.target.value)}
                                        style={{ width: '50px' }}
                                    />
                                </div>
                            ))}
                        </fieldset>

                        <br/>
                        <button type="submit">Guardar Tudo</button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default RegistarJogo;