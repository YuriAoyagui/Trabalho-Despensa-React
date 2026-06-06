// Placeholder para componentes React (JSX)
import { getStatusColor, getStatusLabel, formatarData } from '../utils/dateUtils';

export default function ItemRow({ item, onEditar, onExcluir, onConsumir }) {
  const statusClass = getStatusColor(item.dataValidade);
  const statusLabel = getStatusLabel(item.dataValidade);
  const esgotado = item.quantidade === 0;

  return (
    <tr className={`item-row ${statusClass} ${esgotado ? 'esgotado' : ''}`}>
      <td className="td-nome">
        <span className="item-nome">{item.nomeAlimento}</span>
        <span className="item-cat">{item.categoriaFixa}</span>
      </td>
      <td className="td-validade">
        <span className="validade-data">{formatarData(item.dataValidade)}</span>
        <span className="validade-label">{statusLabel}</span>
      </td>
      <td className="td-qty">
        <span className={`qty-badge ${esgotado ? 'qty-zero' : ''}`}>{item.quantidade}</span>
      </td>
      <td className="td-acoes">
        <button
          className="action-btn consumir"
          onClick={() => onConsumir(item.id)}
          disabled={esgotado}
          title={esgotado ? 'Estoque esgotado' : 'Consumir 1 unidade'}
        >
          Consumir
        </button>
        <button className="action-btn editar" onClick={() => onEditar(item)} title="Editar lote">✏️</button>
        <button className="action-btn excluir" onClick={() => onExcluir(item.id)} title="Excluir lote">🗑️</button>
      </td>
    </tr>
  );
}
