import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword({ onIrLogin }) {
  const { redefinirSenha } = useAuth();
  const [nome, setNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRedefinir = async () => {
    if (!nome.trim() || !novaSenha) return setErro('Preencha todos os campos.');
    if (novaSenha !== confirmar) return setErro('As senhas não coincidem.');
    if (novaSenha.length < 4) return setErro('Senha deve ter pelo menos 4 caracteres.');
    setErro(''); setLoading(true);
    const res = await redefinirSenha(nome, novaSenha);
    setLoading(false);
    if (!res.ok) return setErro(res.msg);
    setSucesso(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🔑</div>
        <h1 className="auth-title">Redefinir Senha</h1>
        <p className="auth-sub">Informe seu usuário e a nova senha</p>

        {sucesso ? (
          <div className="success-box">
            <p>✅ Senha redefinida com sucesso!</p>
            <button className="btn btn-primary btn-full" onClick={onIrLogin}>Ir para Login</button>
          </div>
        ) : (
          <>
            <label className="field-label">Nome de usuário</label>
            <input
              className="input"
              placeholder="Seu nome cadastrado"
              value={nome}
              maxLength={100}
              onChange={(e) => setNome(e.target.value)}
            />

            <label className="field-label">Nova Senha</label>
            <input
              className="input"
              type="password"
              placeholder="Mínimo 4 caracteres"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />

            <label className="field-label">Confirmar Nova Senha</label>
            <input
              className="input"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRedefinir()}
            />

            {erro && <p className="form-error">{erro}</p>}

            <button className="btn btn-primary btn-full" onClick={handleRedefinir} disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>

            <div className="auth-links">
              <button className="link-btn" onClick={onIrLogin}>Voltar ao Login</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}