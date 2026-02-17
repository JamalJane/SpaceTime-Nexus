import { useState } from 'react';
import { useMissionStore } from '../stores/missionStore';
import { useNavigate } from 'react-router-dom';

type ScanState = 'idle' | 'scanning' | 'match_found' | 'azimuth_locked';

export default function StarLockTerminal() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [locked, setLocked] = useState(false);
  const { completeCalibration } = useMissionStore();
  const navigate = useNavigate();

  const handleLock = () => {
    setScanState('scanning');
    setTimeout(() => setScanState('match_found'), 1500);
    setTimeout(() => {
      setScanState('azimuth_locked');
      setLocked(true);
      completeCalibration();
    }, 2500);
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center font-sans">
      <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-signal">
        Star-Lock Terminal
      </h1>
      <div className="relative mt-8 h-[320px] w-[320px] rounded-full border-2 border-system bg-void/90">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full bg-system/50" />
          <div className="absolute h-full w-px bg-system/50" />
        </div>
        <div className="absolute left-2 top-2 text-system">[</div>
        <div className="absolute right-2 top-2 text-system">]</div>
        <div className="absolute bottom-2 left-2 text-system">[</div>
        <div className="absolute bottom-2 right-2 text-system">]</div>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-neutral">
          {scanState === 'idle' && 'Pan to scan'}
          {scanState === 'scanning' && 'SCANNING...'}
          {scanState === 'match_found' && 'MATCH_FOUND'}
          {scanState === 'azimuth_locked' && 'AZIMUTH_LOCKED'}
        </div>
      </div>
      {locked ? (
        <p className="mt-4 font-mono text-sm text-system">Orientation quaternions saved.</p>
      ) : (
        <button
          type="button"
          onClick={handleLock}
          className="mt-6 rounded border border-signal bg-void px-4 py-2 font-sans text-sm text-signal hover:bg-signal hover:text-void"
        >
          Simulate lock
        </button>
      )}
      <button
        type="button"
        onClick={() => navigate('/ledger')}
        className="mt-4 rounded border border-bounty bg-void px-4 py-2 font-sans text-sm text-bounty hover:bg-bounty hover:text-void"
      >
        Execute burn
      </button>
    </div>
  );
}
