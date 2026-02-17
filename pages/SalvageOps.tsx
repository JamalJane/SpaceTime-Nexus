import { useTargetStore } from '../stores/targetStore';
import { useMissionStore } from '../stores/missionStore';
import { useNavigate } from 'react-router-dom';

const MOCK_TARGETS = [
  { id: '1', norad_id: 25544, name: 'ISS', object_type: 'PAYLOAD' as const, dry_mass_kg: 420_000, material_profile: { aluminum: 0.6, titanium: 0.3, gold: 0.05, copper: 0.05 } },
  { id: '2', norad_id: 48274, name: 'ZENIT-2 ROCKET BODY', object_type: 'DEBRIS' as const, dry_mass_kg: 9000, material_profile: { aluminum: 0.7, titanium: 0.2, gold: 0.02, copper: 0.08 } },
];

export default function SalvageOps() {
  const { selected, setSelected, nrv, setNrv } = useTargetStore();
  const { completeIdentification } = useMissionStore();
  const navigate = useNavigate();

  const handleCommit = () => {
    if (!selected) return;
    setNrv(selected.dry_mass_kg * 12);
    completeIdentification();
    navigate('/intercept');
  };

  return (
    <div className="mx-auto max-w-4xl font-sans">
      <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-signal">
        Salvage Ops
      </h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          {MOCK_TARGETS.map((sat) => (
            <button
              key={sat.id}
              type="button"
              onClick={() => setSelected(sat)}
              className={`flex h-16 w-full items-center justify-between rounded border px-4 font-mono text-sm transition ${
                selected?.id === sat.id
                  ? 'border-bounty bg-surface text-signal'
                  : 'border-neutral bg-void text-neutral hover:border-signal/50'
              }`}
            >
              <span>{sat.name}</span>
              <span>NORAD {sat.norad_id}</span>
            </button>
          ))}
        </div>
        <div className="rounded border border-neutral bg-surface p-4">
          <h2 className="font-mono text-xs uppercase text-neutral">Material breakdown</h2>
          {selected ? (
            <>
              <ul className="mt-2 font-mono text-signal">
                {Object.entries(selected.material_profile).map(([k, v]) => (
                  <li key={k}>{k}: {(v * 100).toFixed(0)}%</li>
                ))}
              </ul>
              <p className="mt-4 text-bounty">Bounty (NRV): ${nrv ?? (selected.dry_mass_kg * 12).toLocaleString()}</p>
              <button
                type="button"
                onClick={handleCommit}
                className="mt-4 rounded border border-signal bg-void px-4 py-2 font-sans text-sm text-signal hover:bg-signal hover:text-void"
              >
                Commit to mission
              </button>
            </>
          ) : (
            <p className="mt-2 text-neutral">Select a target</p>
          )}
        </div>
      </div>
      <div className="mt-6 overflow-hidden border border-neutral py-2 font-mono text-xs text-neutral">
        <div className="animate-scroll whitespace-nowrap">
          Live scrap: Al $2.1/kg · Ti $8.4/kg · Au $62k/kg · Cu $9.2/kg
        </div>
      </div>
    </div>
  );
}
