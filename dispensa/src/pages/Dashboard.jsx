import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePantry } from '../contexts/PantryContext';
import ItemRow from '../components/ItemRow';
import ItemForm from '../components/ItemForm';
import ExportPDF from '../components/ExportPDF';
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard({ onIrPerfil }) {
  const { usuarioLogado, logout } = useAuth();
  const { listaItens, removerItemPorId, decrementarQuantidade } = usePantry();
  const [formAberto, setFormAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [excluirId, setExcluirId] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const abrirNovoItem = () => { setItemEditando(null); setFormAberto(true); };
  const abrirEditar = (item) => { setItemEditando(item); setFormAberto(true); };
  const fecharForm = () => { setFormAberto(false); setItemEditando(null); };

  const itensFiltrados = listaItens.filter((item) => {
    const matchBusca = item.nomeAlimento.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria ? item.categoriaFixa === filtroCategoria : true;
    return matchBusca && matchCat;
  });

  const categoriasDaLista = [...new Set(listaItens.map((i) => i.categoriaFixa))].sort();

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-brand">
          <span className="brand-icon">🥫</span>
          <span className="brand-name">Minha Dispensa</span>
        </div>
        <div className="dash-user">
          <button className="user-btn" onClick={onIrPerfil} title="Editar perfil">
            {usuarioLogado.fotoPerfil
              ? <img src={usuarioLogado.fotoPerfil} alt="Perfil" className="avatar" />
              : <span className="avatar avatar-text">{usuarioLogado.nome[0].toUpperCase()}</span>
            }
            <span className="user-nome">{usuarioLogado.nome}</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={logout} title="Sair">Sair</button>
        </div>
      </header>

      {/* Legenda de cores */}
      <div className="legend-bar">
        <span className="legend-item status-ok">● Mais de 15 dias</span>
        <span className="legend-item status-atencao">● 6 a 15 dias</span>
        <span className="legend-item status-critico">● Até 5 dias</span>
        <span className="legend-item status-vencido">● Vencido</span>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          className="input search-input"
          placeholder="🔍 Buscar alimento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className="input filter-select"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categoriasDaLista.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="toolbar-actions">
          <ExportPDF />
          <button className="btn btn-primary" onClick={abrirNovoItem}>+ Adicionar</button>
        </div>
      </div>

      {/* Tabela */}
      {itensFiltrados.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🥡</span>
          <p>{listaItens.length === 0 ? 'Sua dispensa está vazia. Adicione o primeiro item!' : 'Nenhum item encontrado.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="dispensa-table">
            <thead>
              <tr>
                <th>Alimento / Categoria</th>
                <th>Validade</th>
                <th>Qtd</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onEditar={abrirEditar}
                  onExcluir={(id) => setExcluirId(id)}
                  onConsumir={decrementarQuantidade}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="total-label">{listaItens.length} lote(s) cadastrado(s)</p>

      {/* Modais */}
      {formAberto && <ItemForm itemEditando={itemEditando} onFechar={fecharForm} />}
      {excluirId && (
        <ConfirmModal
          mensagem="Deseja excluir este item da dispensa?"
          onConfirmar={() => { removerItemPorId(excluirId); setExcluirId(null); }}
          onCancelar={() => setExcluirId(null)}
        />
      )}
    </div>
  );
}
