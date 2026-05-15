import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './LandingPage.css'
import { AuthContext } from "../context/AuthContext.jsx";

const JOGADORES_POR_PAGINA = 5
const BASE_URL = 'http://localhost:8000'

function LandingPage() {
    const { user } = useContext(AuthContext
    )
    const [jogadores, setJogadores] = useState([])
    const [paginaAtual, setPaginaAtual] = useState(0)

    useEffect(() => {
        axios.get('http://localhost:8000/api/jogadores/')
            .then(response => setJogadores(response.data))
            .catch(err => console.error('Erro ao carregar jogadores:', err))
    }, [])

    const totalPaginas = Math.ceil(jogadores.length / JOGADORES_POR_PAGINA)
    const jogadoresVisiveis = jogadores.slice(
        paginaAtual * JOGADORES_POR_PAGINA,
        paginaAtual * JOGADORES_POR_PAGINA + JOGADORES_POR_PAGINA
    )

    const paginaAnterior = () => setPaginaAtual(p => Math.max(0, p - 1))
    const paginaSeguinte = () => setPaginaAtual(p => Math.min(totalPaginas - 1, p + 1))

    const posicaoLabel = {
        GR: 'Guarda-Redes',
        FX: 'Fixo',
        AL: 'Ala',
        PI: 'Pivot',
    }

    return (
        <div className="landing-page">

            {/* ── HERÓI ── */}
            <section className="hero">
                <div className="hero-conteudo">
                    <p className="hero-subtitulo">Bem-vindo ao</p>
                    <h1 className="hero-titulo">Miguel Sport Clube</h1>
                    <p className="hero-slogan">Unidos dentro e fora do campo.</p>
                    <Link to="/equipa" className="btn btn-hero">
                        Conhece a Equipa
                    </Link>
                </div>
            </section>

            <div className="landing-grelha pagina-conteudo">

                {/* ── PRÓXIMO JOGO — placeholder para o Ivo ── */}
                <section className="bloco-secao bloco-placeholder">
                    <h2 className="secao-titulo">Próximo Jogo</h2>
                    <div className="placeholder-conteudo">
                        <span className="placeholder-icone">🏟️</span>
                        <p className="placeholder-texto">
                            Bloco reservado para o Ivo.<br />
                            Ligar à API <code>/api/jogos/</code> e mostrar o próximo jogo agendado.
                        </p>
                    </div>
                </section>

                {/* ── PLANTEL — carrossel ── */}
                <section className="bloco-secao bloco-plantel">
                    <h2 className="secao-titulo">O Nosso Plantel</h2>

                    {jogadores.length === 0 ? (
                        <p className="sem-dados">Sem jogadores no plantel.</p>
                    ) : (
                        <>
                            <div className="carrossel">
                                <button
                                    className="carrossel-seta"
                                    onClick={paginaAnterior}
                                    disabled={paginaAtual === 0}
                                    aria-label="Página anterior"
                                >
                                    ‹
                                </button>

                                <div className="carrossel-cards">
                                    {jogadoresVisiveis.map(jogador => (
                                        <Link
                                            to={`/equipa/${jogador.id}`}
                                            key={jogador.id}
                                            className="jogador-card-landing"
                                        >
                                            {/* Nova secção para a foto */}
                                            <div className="jogador-foto-container">
                                                {jogador.foto ? (
                                                    <img
                                                        src={`${BASE_URL}${jogador.foto}`}
                                                        alt={`Foto de ${jogador.nome}`}
                                                        className="jogador-foto-landing"
                                                    />
                                                ) : (
                                                    <div className="jogador-foto-placeholder">
                                                        <span>#{jogador.numero_camisola}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Secção da Informação do jogador */}
                                            <div className="jogador-info-landing">
                                                <div className="jogador-numero">#{jogador.numero_camisola}</div>
                                                <div className="jogador-nome">{jogador.nome}</div>
                                                <div className="jogador-posicao">
                                                    {posicaoLabel[jogador.posicao] || jogador.posicao}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <button
                                    className="carrossel-seta"
                                    onClick={paginaSeguinte}
                                    disabled={paginaAtual === totalPaginas - 1}
                                    aria-label="Página seguinte"
                                >
                                    ›
                                </button>
                            </div>

                            <div className="carrossel-indicadores">
                                {Array.from({ length: totalPaginas }).map((_, i) => (
                                    <button
                                        key={i}
                                        className={`indicador ${i === paginaAtual ? 'ativo' : ''}`}
                                        onClick={() => setPaginaAtual(i)}
                                        aria-label={`Página ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* ── LOGIN / REGISTO — placeholder para o Miguel ── */}
                <section className="bloco-secao">
                    <h2 className="secao-titulo">Área Privada</h2>

                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', textAlign: 'center', height: '100%' }}>

                        {/* Renderização Condicional - A mesma lógica da NavBar */}
                        {user ? (
                            <>
                                <div style={{ fontSize: '3em', marginBottom: '10px' }}>👋</div>
                                <p style={{ fontWeight: 'bold', fontSize: '1.2em', color: 'navy', marginBottom: '20px' }}>
                                    Bem-vindo de volta, {user.username}!
                                </p>

                                {/* O Link inteligente: se for staff vai para a gestão, se não, vai para o dashboard */}
                                <Link
                                    to={user.is_staff ? "/staff/jogadores" : "/dashboard"}
                                    className="btn btn-hero"
                                    style={{ backgroundColor: 'darkorange', display: 'inline-block' }}
                                >
                                    Aceder ao Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '3em', marginBottom: '10px' }}>🔐</div>
                                <p style={{ color: 'darkslategray', marginBottom: '20px' }}>
                                    És jogador ou fazes parte da equipa técnica? Entra na tua conta.
                                </p>
                                <Link to="/login" className="btn btn-hero" style={{ backgroundColor: 'navy', display: 'inline-block' }}>
                                    Fazer Login
                                </Link>
                            </>
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}

export default LandingPage