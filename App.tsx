import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUiStore } from './stores/uiStore';
import LegacySplash from './pages/LegacySplash';
import Hub from './pages/Hub';
import MissionProfile from './pages/MissionProfile';
import SalvageOps from './pages/SalvageOps';
import InterceptPlanner from './pages/InterceptPlanner';
import StarLockTerminal from './pages/StarLockTerminal';
import RecoveryLedger from './pages/RecoveryLedger';
import AppLayout from './app/AppLayout';

export default function App() {
  const hudEnabled = useUiStore((s) => s.hudEnabled);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LegacySplash />} />
        <Route
          path="/hub"
          element={
            hudEnabled ? (
              <AppLayout><Hub /></AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            hudEnabled ? (
              <AppLayout><MissionProfile /></AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/salvage"
          element={
            hudEnabled ? (
              <AppLayout><SalvageOps /></AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/intercept"
          element={
            hudEnabled ? (
              <AppLayout><InterceptPlanner /></AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/star-lock"
          element={
            hudEnabled ? (
              <AppLayout><StarLockTerminal /></AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ledger"
          element={
            hudEnabled ? (
              <AppLayout><RecoveryLedger /></AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={hudEnabled ? '/hub' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
