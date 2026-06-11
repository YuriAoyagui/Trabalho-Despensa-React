import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Register({ onIrLogin }) {
  const { cadastrarUsuario } = useAuth();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [foto, setFoto] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return setErro('Foto muito grande (máx. 2MB).');
    const reader = new FileReader();
    reader.onload = (ev) => setFoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCadastrar = async () => {
    if (!nome.trim() || !senha) return setErro('Preencha nome e senha.');
    if (senha !== confirmar) return setErro('As senhas não coincidem.');
    if (senha.length < 4) return setErro('Senha deve ter pelo menos 4 caracteres.');
    setErro(''); setLoading(true);
    const res = await cadastrarUsuario({ nome, senha, fotoBase64: foto });
    setLoading(false);
    if (!res.ok) return setErro(res.msg);
    onIrLogin();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🥫</div>
        <h1 className="auth-title">Criar Conta</h1>
        <p className="auth-sub">Bem-vindo(a) ao Gerenciador de Despensa</p>

        <label className="field-label">Foto de Perfil (opcional)</label>
        <div className="foto-upload">
          {foto
            ? <img src={foto} alt="Prévia" className="foto-preview" />
            : <div className="foto-placeholder">📷</div>
          }
          <label className="btn btn-ghost btn-sm foto-label">
            Escolher foto
            <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          </label>
        </div>

        <label className="field-label">Nome de usuário *</label>
        <input
          className="input"
          placeholder="Como quer ser chamado?"
          value={nome}
          maxLength={100}
          autoComplete="username"
          onChange={(e) => setNome(e.target.value)}
        />

        <label className="field-label">Senha *</label>
        <input
          className="input"
          type="password"
          placeholder="Mínimo 4 caracteres"
          value={senha}
          autoComplete="new-password"
          onChange={(e) => setSenha(e.target.value)}
        />

        <label className="field-label">Confirmar Senha *</label>
        <input
          className="input"
          type="password"
          placeholder="Repita a senha"
          value={confirmar}
          autoComplete="new-password"
          onChange={(e) => setConfirmar(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCadastrar()}
        />

        {erro && <p className="form-error">{erro}</p>}

        <button className="btn btn-primary btn-full" onClick={handleCadastrar} disabled={loading}>
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>

        <div className="auth-links">
          <button className="link-btn" onClick={onIrLogin}>Já tenho conta</button>
        </div>
      </div>
    </div>
  );
}