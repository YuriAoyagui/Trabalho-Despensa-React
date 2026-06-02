import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function Profile({ onVoltar }) {
  const { usuarioLogado, atualizarPerfil, excluirContaUsuario } = useAuth();
  const [nome, setNome] = useState(usuarioLogado.nome);
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState(usuarioLogado.fotoPerfil);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return setErro('Foto muito grande (máx. 2MB).');
    const reader = new FileReader();
    reader.onload = (ev) => setFoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSalvar = async () => {
    if (!nome.trim()) return setErro('Nome não pode ser vazio.');
    if (senha && senha.length < 4) return setErro('Senha deve ter pelo menos 4 caracteres.');
    setErro(''); setSucesso(''); setLoading(true);
    const res = await atualizarPerfil({ nome, senha: senha || null, fotoBase64: foto });
    setLoading(false);
    if (!res.ok) return setErro(res.msg);
    setSucesso('Perfil atualizado com sucesso!');
    setSenha('');
  };

  return (
    <div className="profile-page">
      {confirmarExclusao && (
        <ConfirmModal
          mensagem="⚠️ Tem certeza? Essa ação é irreversível. Todos os seus dados serão apagados."
          onConfirmar={excluirContaUsuario}
          onCancelar={() => setConfirmarExclusao(false)}
        />
      )}

      <div className="profile-card">
        <button className="back-btn" onClick={onVoltar}>← Voltar</button>
        <h2 className="profile-title">Meu Perfil</h2>

        <div className="foto-upload center">
          {foto
            ? <img src={foto} alt="Perfil" className="foto-preview large" />
            : <div className="foto-placeholder large">{usuarioLogado.nome[0].toUpperCase()}</div>
          }
          <label className="btn btn-ghost btn-sm foto-label">
            Alterar foto
            <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          </label>
        </div>

        <label className="field-label">Nome</label>
        <input
          className="input"
          value={nome}
          maxLength={100}
          onChange={(e) => setNome(e.target.value)}
        />

        <label className="field-label">Nova Senha <span className="optional">(deixe em branco para manter)</span></label>
        <input
          className="input"
          type="password"
          placeholder="Nova senha (opcional)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p className="form-error">{erro}</p>}
        {sucesso && <p className="form-success">{sucesso}</p>}

        <button className="btn btn-primary btn-full" onClick={handleSalvar} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>

        <hr className="divider" />

        <button className="btn btn-danger-outline btn-full" onClick={() => setConfirmarExclusao(true)}>
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}