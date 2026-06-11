import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ onIrCadastro, onIrRecuperar }) {
  const { login } = useAuth();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!nome.trim() || !senha) return setErro('Preencha nome e senha.');
    setErro(''); setLoading(true);
    const res = await login(nome, senha);
    setLoading(false);
    if (!res.ok) setErro(res.msg);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🥫</div>
        <h1 className="auth-title">Minha Despensa</h1>
        <p className="auth-sub">Gerencie seus alimentos com facilidade</p>

        <label className="field-label">Nome de usuário</label>
        <input
          className="input"
          placeholder="Seu nome"
          value={nome}
          maxLength={100}
          autoComplete="username"
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <label className="field-label">Senha</label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={senha}
          autoComplete="current-password"
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        {erro && <p className="form-error">{erro}</p>}

        <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="auth-links">
          <button className="link-btn" onClick={onIrRecuperar}>Esqueci a senha</button>
          <span>·</span>
          <button className="link-btn" onClick={onIrCadastro}>Criar conta</button>
        </div>
      </div>
    </div>
  );
}