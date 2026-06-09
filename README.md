# 🥫 Gerenciador de Dispensa

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/Licença-MIT-green?style=flat)

Aplicação web responsiva para controle pessoal de estoque alimentício doméstico. O sistema permite cadastrar alimentos por lote de validade, alertar visualmente sobre produtos próximos ao vencimento e exportar a lista completa da dispensa para consulta offline no mercado — reduzindo o desperdício de alimentos e os gastos com reabastecimentos desnecessários.

---

## ✅ Funcionalidades

- **Autenticação completa** — cadastro, login, logout e redefinição de senha
- **Perfil de usuário** — nome, foto de perfil, edição e exclusão de conta
- **CRUD de alimentos** — adicionar, visualizar, editar e excluir itens da dispensa
- **Controle por lotes** — cada compra com validade diferente gera uma linha independente, sem misturar estoques
- **Alertas visuais por validade** — cores dinâmicas em tempo real conforme a proximidade do vencimento
- **Consumo rápido** — botão que desconta 1 unidade do estoque com um clique
- **Exportação para PDF** — gera e baixa um relatório completo da dispensa para uso offline
- **Busca e filtro** — localizar itens por nome ou categoria
- **Categorias fixas** — padronização dos grupos alimentares para evitar duplicidade de nomes
- **Totalmente responsivo** — funciona em desktop, notebook e celular via navegador

---

## 🛠️ Tecnologias Utilizadas

**Front-end**
- [React 18](https://react.dev/) — biblioteca principal de interface
- [Vite 5](https://vitejs.dev/) — bundler e servidor de desenvolvimento
- CSS puro com variáveis (Design System próprio, sem framework externo)

**Gerenciamento de Estado**
- React Context API — `AuthContext` e `PantryContext`
- `localStorage` — persistência de dados no próprio navegador, sem servidor

**Segurança**
- Web Crypto API — hash SHA-256 para senhas
- Sanitização de inputs — proteção contra XSS em todos os campos

**Ferramentas**
- Node.js 18+
- npm

---

## 🏗️ Arquitetura do Sistema

O projeto segue a arquitetura em três camadas definida na ERS (Especificação de Requisitos de Software):

```
┌─────────────────────────────────────────────┐
│              CAMADA VIEW (pages/)           │
│   Login · Register · Dashboard · Profile   │
└────────────────────┬────────────────────────┘
                     │ consome
┌────────────────────▼────────────────────────┐
│         CAMADA APPLICATION (contexts/)      │
│      AuthContext · PantryContext            │
│  GestaoAutenticacao ◄──► ControleDispensa   │
└────────────────────┬────────────────────────┘
                     │ delega
┌────────────────────▼────────────────────────┐
│       TECHNICAL SERVICES (utils/)           │
│   storage.js · dateUtils.js · sanitize.js  │
└─────────────────────────────────────────────┘
```

Os componentes reutilizáveis (`ItemForm`, `ItemRow`, `ExportPDF`, `ConfirmModal`) servem a camada View sem carregar lógica de negócio.

---

## 📋 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) versão **18 ou superior**
- **npm** (já vem com o Node.js)
- [Git](https://git-scm.com/)

Para verificar se já estão instalados:

```bash
node -v
npm -v
git --version
```

---

## 🚀 Como Instalar e Executar

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/Trabalho-Dispensa-React.git
```

**2. Entre na pasta do projeto**

```bash
cd pastaDoProjeto
```

**3. Instale as dependências**

```bash
npm install
```

**4. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

**5. Acesse no navegador**

```
http://localhost:5173
```

Para encerrar o servidor, pressione `Ctrl+C` no terminal.

---

## 📁 Estrutura de Pastas

```
dispensa/
├── index.html                  # Entrada HTML da SPA
├── package.json
├── vite.config.js
├── .gitignore
│
└── src/
    ├── App.jsx                 # Roteamento por estado (sem react-router)
    ├── main.jsx                # Ponto de entrada React
    ├── index.css               # Design system e estilos globais
    │
    ├── contexts/
    │   ├── AuthContext.jsx     # UC01/UC02 — autenticação e perfil de usuário
    │   └── PantryContext.jsx   # UC03/UC04 — CRUD de itens e consumo rápido
    │
    ├── pages/
    │   ├── Login.jsx           # Tela de login
    │   ├── Register.jsx        # Tela de cadastro
    │   ├── ForgotPassword.jsx  # Redefinição de senha
    │   ├── Dashboard.jsx       # Painel principal da dispensa (UC05)
    │   └── Profile.jsx         # Edição e exclusão de conta
    │
    ├── components/
    │   ├── ItemRow.jsx         # Linha da tabela com cor dinâmica (RN-01)
    │   ├── ItemForm.jsx        # Formulário de adição/edição de lote
    │   ├── ExportPDF.jsx       # Exportação do inventário (UC06)
    │   └── ConfirmModal.jsx    # Modal de confirmação reutilizável
    │
    └── utils/
        ├── dateUtils.js        # calcularDiasParaVencer(), regra cromática RN-01
        ├── sanitize.js         # Proteção XSS e hash de senha
        └── storage.js          # Abstração do localStorage
```

---

## 👥 Autores

| Gabriel Lima Rocha | 
| Guilherme Lopes| 
| Yuri Aoyagui | 

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
