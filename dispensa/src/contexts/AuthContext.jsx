import { createContext, useContext, useState, useCallback } from 'react';
import {
  getUsers, saveUsers, getCurrentUser, saveCurrentUser,
  clearCurrentUser, deleteUserItems,
} from '../utils/storage';
import { sanitizeText, sanitizePassword, hashPassword } from '../utils/sanitize';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(() => getCurrentUser());

  // UC01 — Cadastro
  const cadastrarUsuario = useCallback(async ({ nome, senha, fotoBase64 }) => {
    const nomeClean = sanitizeText(nome);
    const senhaClean = sanitizePassword(senha);
    if (!nomeClean || !senhaClean) return { ok: false, msg: 'Preencha todos os campos.' };

    const users = getUsers();
    if (users.find((u) => u.nome.toLowerCase() === nomeClean.toLowerCase()))
      return { ok: false, msg: 'Esse nome de usuário já existe.' };

    const hash = await hashPassword(senhaClean);
    const novoUsuario = {
      id: crypto.randomUUID(),
      nome: nomeClean,
      senhaHash: hash,
      fotoPerfil: fotoBase64 || null,
    };
    saveUsers([...users, novoUsuario]);
    return { ok: true };
  }, []);

  // UC02 — Login
  const login = useCallback(async (nome, senha) => {
    const nomeClean = sanitizeText(nome);
    const senhaClean = sanitizePassword(senha);
    const users = getUsers();
    const user = users.find((u) => u.nome.toLowerCase() === nomeClean.toLowerCase());
    if (!user) return { ok: false, msg: 'Usuário não encontrado.' };

    const hash = await hashPassword(senhaClean);
    if (hash !== user.senhaHash) return { ok: false, msg: 'Senha incorreta.' };

    saveCurrentUser(user);
    setUsuarioLogado(user);
    return { ok: true };
  }, []);

  // UC02 — Logout
  const logout = useCallback(() => {
    clearCurrentUser();
    setUsuarioLogado(null);
  }, []);

  // UC01 — Atualizar perfil
  const atualizarPerfil = useCallback(async ({ nome, senha, fotoBase64 }) => {
    const nomeClean = sanitizeText(nome);
    if (!nomeClean) return { ok: false, msg: 'Nome não pode ser vazio.' };

    const users = getUsers();
    const idx = users.findIndex((u) => u.id === usuarioLogado.id);
    if (idx === -1) return { ok: false, msg: 'Usuário não encontrado.' };

    const updated = { ...users[idx], nome: nomeClean };
    if (fotoBase64 !== undefined) updated.fotoPerfil = fotoBase64;
    if (senha) {
      const senhaClean = sanitizePassword(senha);
      updated.senhaHash = await hashPassword(senhaClean);
    }

    const newUsers = [...users];
    newUsers[idx] = updated;
    saveUsers(newUsers);
    saveCurrentUser(updated);
    setUsuarioLogado(updated);
    return { ok: true };
  }, [usuarioLogado]);

  // UC01 — Excluir conta
  const excluirContaUsuario = useCallback(() => {
    const users = getUsers().filter((u) => u.id !== usuarioLogado.id);
    saveUsers(users);
    deleteUserItems(usuarioLogado.id);
    clearCurrentUser();
    setUsuarioLogado(null);
  }, [usuarioLogado]);

  // UC02 — Redefinir senha (fluxo "esqueci a senha")
  const redefinirSenha = useCallback(async (nome, novaSenha) => {
    const nomeClean = sanitizeText(nome);
    const senhaClean = sanitizePassword(novaSenha);
    if (!nomeClean || !senhaClean) return { ok: false, msg: 'Preencha todos os campos.' };

    const users = getUsers();
    const idx = users.findIndex((u) => u.nome.toLowerCase() === nomeClean.toLowerCase());
    if (idx === -1) return { ok: false, msg: 'Usuário não encontrado.' };

    const hash = await hashPassword(senhaClean);
    const newUsers = [...users];
    newUsers[idx] = { ...newUsers[idx], senhaHash: hash };
    saveUsers(newUsers);
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider value={{
      usuarioLogado,
      cadastrarUsuario,
      login,
      logout,
      atualizarPerfil,
      excluirContaUsuario,
      redefinirSenha,
    }}>
      {children}
    </AuthContext.Provider>
  );
}