// Placeholder para componentes React (JSX)
import { useState, useEffect } from 'react';
import { CATEGORIAS, usePantry } from '../contexts/PantryContext';

const EMPTY = { nomeAlimento: '', categoriaFixa: '', dataValidade: '', quantidade: 1 };

export default function ItemForm({ itemEditando, onFechar }) {
  const { salvarItem } = usePantry();
  const [form, setForm] = useState(EMPTY);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (itemEditando) setForm({ ...itemEditando });
    else setForm(EMPTY);
  }, [itemEditando]);

  const set = (campo, val) => setForm((f) => ({ ...f, [campo]: val }));

  const handleSubmit = () => {
    setErro('');
    const res = salvarItem(form, itemEditando?.id || null);
    if (!res.ok) return setErro(res.msg);
    onFechar();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box form-box">
        <h2 className="modal-title">{itemEditando ? 'Editar Alimento' : 'Adicionar Alimento'}</h2>

        <label className="field-label">Nome do Alimento *</label>
        <input
          className="input"
          placeholder="Ex: Arroz Tio João"
          value={form.nomeAlimento}
          maxLength={100}
          onChange={(e) => set('nomeAlimento', e.target.value)}
        />

        <label className="field-label">Categoria *</label>
        <select
          className="input"
          value={form.categoriaFixa}
          onChange={(e) => set('categoriaFixa', e.target.value)}
        >
          <option value="">Selecione...</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="field-label">Data de Validade *</label>
        <input
          className="input"
          type="date"
          value={form.dataValidade}
          onChange={(e) => set('dataValidade', e.target.value)}
        />

        <label className="field-label">Quantidade *</label>
        <div className="qty-control">
          <button className="qty-btn" onClick={() => set('quantidade', Math.max(1, form.quantidade - 1))}>−</button>
          <input
            className="input qty-input"
            type="number"
            min={1}
            max={9999}
            value={form.quantidade}
            onChange={(e) => set('quantidade', Math.max(1, parseInt(e.target.value) || 1))}
          />
          <button className="qty-btn" onClick={() => set('quantidade', Math.min(9999, form.quantidade + 1))}>+</button>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onFechar}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {itemEditando ? 'Salvar Alterações' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
