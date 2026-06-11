import { usePantry } from '../contexts/PantryContext';
import { formatarData, getStatusLabel } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

// UC06 — PDFGeneratorEngine: gerarDocumentoTextoPlano + downloadArquivoPDF
export default function ExportPDF() {
  const { capturarEstadoAtualItens } = usePantry();
  const { usuarioLogado } = useAuth();

  const downloadArquivoPDF = () => {
    const itens = capturarEstadoAtualItens();
    const agora = new Date().toLocaleDateString('pt-BR');

    // Monta o conteúdo HTML para impressão/PDF
    const linhas = itens.map((item) => `
      <tr>
        <td>${item.nomeAlimento}</td>
        <td>${item.categoriaFixa}</td>
        <td style="text-align:center">${item.quantidade}</td>
        <td style="text-align:center">${formatarData(item.dataValidade)}</td>
        <td style="text-align:center">${getStatusLabel(item.dataValidade)}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Despensa — ${usuarioLogado.nome}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #1a1a2e; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    p.sub { color: #666; font-size: 13px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #e8f4fd; padding: 10px 8px; text-align: left; border-bottom: 2px solid #b8d9f0; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #f8fbfe; }
    .footer { margin-top: 20px; font-size: 11px; color: #aaa; }
  </style>
</head>
<body>
  <h1>🏠 Minha Despensa — ${usuarioLogado.nome}</h1>
  <p class="sub">Relatório gerado em ${agora} · ${itens.length} lote(s) cadastrado(s)</p>
  <table>
    <thead>
      <tr>
        <th>Alimento</th>
        <th>Categoria</th>
        <th>Qtd</th>
        <th>Validade</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${linhas}</tbody>
  </table>
  <p class="footer">Gerenciador de Despensa · Exportado para consulta offline</p>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `despensa_${usuarioLogado.nome}_${agora.replace(/\//g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="btn btn-export" onClick={downloadArquivoPDF} title="Exportar dispensa para PDF">
      📄 Exportar PDF
    </button>
  );
}
