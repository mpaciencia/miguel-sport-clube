import { useState } from 'react';
import axios from 'axios';
import StaffNavbar from './StaffNavbar';

function CriarTreino() {
    const [dataTreino, setDataTreino] = useState('');
    const [hora, setHora] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        axios.post('http://localhost:8000/api/treinos/', {
            data: dataTreino,
            hora: hora,
            local: 'Pavilhão do Cacém'
        })
        .then(() => {
            setSucesso('Treino adicionado com sucesso!');
            setDataTreino('');
            setHora('');
        })
        .catch(error => {
            console.error("Erro ao criar treino:", error.response?.data);
            let errMsg = 'Erro ao criar treino.';
            if (error.response?.data) {
                errMsg = Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(' | ');
            }
            setErro(errMsg);
        });
    };

    return (
        <>
            <StaffNavbar />
            <main className="page-center">
                <div className="form-card">
                    <h2>Adicionar Novo Treino</h2>
                    
                    {erro && <p className="erro-mensagem">{erro}</p>}
                    {sucesso && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{sucesso}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Data do Treino:</label>
                            <input 
                                type="date" 
                                className="form-control"
                                value={dataTreino} 
                                onChange={e => setDataTreino(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Hora:</label>
                            <input 
                                type="time" 
                                className="form-control"
                                value={hora} 
                                onChange={e => setHora(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Local:</label>
                            <input 
                                type="text" 
                                className="form-control"
                                value="Pavilhão do Cacém" 
                                disabled 
                            />
                        </div>
                        <button type="submit" className="btn-submit">
                            Adicionar Treino
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default CriarTreino;
