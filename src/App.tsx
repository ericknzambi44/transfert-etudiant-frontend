import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import LoginView from './features/auth/views/LoginView';
import RegisterEtablissementView from './features/auth/views/RegisterEtablissementView';
import RegisterEtudiantView from './features/auth/views/RegisterEtudiantView';
import LandingView from './views/LandingView';
import MainLayout from './layouts/ MainLayout';


// Lazy loading pour les composants lourds
const DashboardView = lazy(() => import('./features/dossier/views/DashboardView'));
const CreerDossierView = lazy(() => import('./features/dossier/views/CreerDossierView'));
const DetailDossierView = lazy(() => import('./features/dossier/views/DetailDossierView'));
const ParcoursView = lazy(() => import('./features/dossier/views/ParcoursView'));
const SearchView = lazy(() => import('./features/dossier/views/SearchView'));
const HistoriqueView = lazy(() => import('./features/dossier/views/HistoriqueView'));

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { auth } = useAuth();
  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { auth } = useAuth();
  return !auth.isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function SuspenseWrapper({ children }: { children: JSX.Element }) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route element={<PublicRoute><Outlet /></PublicRoute>}>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register/etablissement" element={<RegisterEtablissementView />} />
          <Route path="/register/etudiant" element={<RegisterEtudiantView />} />
        </Route>
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<SuspenseWrapper><DashboardView /></SuspenseWrapper>} />
          <Route path="/dossiers" element={<SuspenseWrapper><DashboardView /></SuspenseWrapper>} />
          <Route path="/dossiers/creer" element={<SuspenseWrapper><CreerDossierView /></SuspenseWrapper>} />
          <Route path="/dossiers/:id" element={<SuspenseWrapper><DetailDossierView /></SuspenseWrapper>} />
          <Route path="/dossiers/:id/parcours" element={<SuspenseWrapper><ParcoursView /></SuspenseWrapper>} />
          <Route path="/dossiers/:id/historique" element={<SuspenseWrapper><HistoriqueView /></SuspenseWrapper>} />
          <Route path="/recherche" element={<SuspenseWrapper><SearchView /></SuspenseWrapper>} />
          <Route path="/historique" element={<SuspenseWrapper><HistoriqueView /></SuspenseWrapper>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}