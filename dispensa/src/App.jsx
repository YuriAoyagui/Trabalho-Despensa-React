import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PantryProvider } from './contexts/PantryContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import './index.css';

// Páginas disponíveis no fluxo de autenticação
const AUTH_PAGES = { LOGIN: 'login', REGISTER: 'register', FORGOT: 'forgot' };
const APP_PAGES  = { DASHBOARD: 'dashboard', PROFILE: 'profile' };

function AppContent() {
  const { usuarioLogado } = useAuth();
  const [authPage, setAuthPage] = useState(AUTH_PAGES.LOGIN);
  const [appPage, setAppPage]   = useState(APP_PAGES.DASHBOARD);

  // Usuário não autenticado → fluxo de auth
  if (!usuarioLogado) {
    if (authPage === AUTH_PAGES.REGISTER)
      return <Register onIrLogin={() => setAuthPage(AUTH_PAGES.LOGIN)} />;
    if (authPage === AUTH_PAGES.FORGOT)
      return <ForgotPassword onIrLogin={() => setAuthPage(AUTH_PAGES.LOGIN)} />;
    return (
      <Login
        onIrCadastro={() => setAuthPage(AUTH_PAGES.REGISTER)}
        onIrRecuperar={() => setAuthPage(AUTH_PAGES.FORGOT)}
      />
    );
  }

  // Usuário autenticado → app protegido por PantryProvider
  return (
    <PantryProvider>
      {appPage === APP_PAGES.PROFILE
        ? <Profile onVoltar={() => setAppPage(APP_PAGES.DASHBOARD)} />
        : <Dashboard onIrPerfil={() => setAppPage(APP_PAGES.PROFILE)} />
      }
    </PantryProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
