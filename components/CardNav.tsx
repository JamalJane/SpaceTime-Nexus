import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUiStore, type CardNavTab } from '../stores/uiStore';

const TABS: { path: string; tab: CardNavTab; label: string }[] = [
  { path: '/hub', tab: 'hub', label: 'Graveyard' },
  { path: '/profile', tab: 'profile', label: 'About' },
  { path: '/salvage', tab: 'salvage', label: 'Salvage' },
  { path: '/intercept', tab: 'intercept', label: 'Terminal' },
  { path: '/star-lock', tab: 'star-lock', label: 'Star-Lock' },
  { path: '/ledger', tab: 'ledger', label: 'Ledger' },
];

export default function CardNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const setActiveTab = useUiStore((s) => s.setActiveCardNavTab);

  return (
    <nav
      className="flex gap-3 rounded-full border px-4 py-2 backdrop-blur-md"
      style={{
        borderColor: '#404040',
        backgroundColor: 'rgba(13, 13, 13, 0.8)'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {TABS.map(({ path, tab, label }) => {
        const isActive = location.pathname === path;
        return (
          <motion.button
            key={path}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              navigate(path);
            }}
            className="relative rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wider outline-none"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#F2F2F2'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.span
                layoutId="cardnav-active"
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: '#FFD700' }}
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
