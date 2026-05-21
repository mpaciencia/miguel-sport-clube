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
            <main className="container" style={{ marginTop: '20px' }}>
                <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Adicionar Novo Treino</h2>
                    
                    {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}
                    {sucesso && <p style={{ color: 'green', textAlign: 'center' }}>{sucesso}</p>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Data do Treino:</label>
                            <input 
                                type="date" 
                                value={dataTreino} 
                                onChange={e => setDataTreino(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Hora:</label>
                            <input 
                                type="time" 
                                value={hora} 
                                onChange={e => setHora(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Local:</label>
                            <input 
                                type="text" 
                                value="Pavilhão do Cacém" 
                                disabled 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                        >
                            Adicionar Treino
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default CriarTreino;
