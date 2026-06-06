// Placeholder para componentes React (JSX)
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getItems, saveItems } from '../utils/storage';
import { sanitizeText, sanitizeNumber, isValidDate } from '../utils/sanitize';
import { ordenarPorValidade } from '../utils/dateUtils';
import { useAuth } from './AuthContext';

const PantryContext = createContext(null);
export const usePantry = () => useContext(PantryContext);

export const CATEGORIAS = [
  'Grãos/Cereais',
  'Laticínios',
  'Carnes/Proteínas',
  'Enlatados/Conservas',
  'Bebidas',
  'Biscoitos/Doces',
  'Hortifrúti',
  'Temperos',
];

export function PantryProvider({ children }) {
  const { usuarioLogado } = useAuth();
  const [listaItens, setListaItens] = useState([]);

  // Carrega itens do usuário ao logar
  useEffect(() => {
    if (usuarioLogado) {
      setListaItens(ordenarPorValidade(getItems(usuarioLogado.id)));
    } else {
      setListaItens([]);
    }
  }, [usuarioLogado]);

  const persistir = useCallback((items) => {
    const ordenados = ordenarPorValidade(items);
    setListaItens(ordenados);
    saveItems(usuarioLogado.id, ordenados);
  }, [usuarioLogado]);

  // UC03 — Create: salvar item (novo ou edição)
  const salvarItem = useCallback((dados, idExistente = null) => {
    const nomeClean = sanitizeText(dados.nomeAlimento);
    const qtd = sanitizeNumber(dados.quantidade);

    if (!nomeClean) return { ok: false, msg: 'Informe o nome do alimento.' };
    if (!CATEGORIAS.includes(dados.categoriaFixa)) return { ok: false, msg: 'Selecione uma categoria.' };
    if (!isValidDate(dados.dataValidade)) return { ok: false, msg: 'Data de validade inválida.' };
    if (qtd <= 0) return { ok: false, msg: 'Quantidade deve ser maior que zero.' };

    if (idExistente) {
      // Update
      const updated = listaItens.map((item) =>
        item.id === idExistente
          ? { ...item, nomeAlimento: nomeClean, categoriaFixa: dados.categoriaFixa, dataValidade: dados.dataValidade, quantidade: qtd }
          : item
      );
      persistir(updated);
    } else {
      // Create — cada inserção é um lote único (lógica de lotes da ERS)
      const novoLote = {
        id: crypto.randomUUID(),
        nomeAlimento: nomeClean,
        categoriaFixa: dados.categoriaFixa,
        dataValidade: dados.dataValidade,
        quantidade: qtd,
      };
      persistir([...listaItens, novoLote]);
    }
    return { ok: true };
  }, [listaItens, persistir]);

  // UC03 — Delete
  const removerItemPorId = useCallback((id) => {
    persistir(listaItens.filter((item) => item.id !== id));
  }, [listaItens, persistir]);

  // UC04 — Consumir Alimento Rápido: decrementa 1 unidade
  const decrementarQuantidade = useCallback((id) => {
    const updated = listaItens.map((item) => {
      if (item.id !== id) return item;
      return item.quantidade > 0 ? { ...item, quantidade: item.quantidade - 1 } : item;
    });
    persistir(updated);
  }, [listaItens, persistir]);

  // UC06 — Capturar estado atual para exportação PDF
  const capturarEstadoAtualItens = useCallback(() => listaItens, [listaItens]);

  return (
    <PantryContext.Provider value={{
      listaItens,
      salvarItem,
      removerItemPorId,
      decrementarQuantidade,
      capturarEstadoAtualItens,
      obterItensCadastrados: capturarEstadoAtualItens,
    }}>
      {children}
    </PantryContext.Provider>
  );
}