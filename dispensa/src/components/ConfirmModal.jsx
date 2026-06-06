// Placeholder para componentes React (JSX)
export default function ConfirmModal({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box">
        <p className="modal-msg">{mensagem}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirmar}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}