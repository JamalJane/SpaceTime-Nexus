import { useState } from 'react';
import { useMissionStore } from '../stores/missionStore';
import { useTargetStore } from '../stores/targetStore';

export default function InterceptPlanner() {
  const [tofHours, setTofHours] = useState(24);
  const { setBurnDeltaV, setFuelOk, setTofHours: setTof, completeCalculation } = useMissionStore();
  const selected = useTargetStore((s) => s.selected);

  const deltaV = 1.2 + tofHours * 0.05;
  const fuelOk = deltaV < 4;

  const handleConfirm = () => {
    setBurnDeltaV(deltaV);
    setFuelOk(fuelOk);
    setTof(tofHours);
    completeCalculation();
  };

  return (
    <div className="mx-auto max-w-4xl font-sans">
      <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-signal">
        Intercept Planner
      </h1>
      {selected && (
        <p className="mt-2 font-mono text-sm text-neutral">Target: {selected.name}</p>
      )}
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <div className="flex-1 rounded border border-neutral bg-surface p-4">
          <p className="font-mono text-xs text-neutral">Transfer arc (3D view)</p>
          <div className="mt-2 h-48 rounded bg-void" />
        </div>
        <div className="w-full md:w-72 space-y-4">
          <label className="block font-mono text-sm text-signal">
            Time of flight (hours)
            <input
              type="range"
              min={1}
              max={72}
              value={tofHours}
              onChange={(e) => setTofHours(Number(e.target.value))}
              className="mt-2 h-2 w-full accent-bounty"
            />
            <span className="ml-2">{tofHours}h</span>
          </label>
          <div className="h-24 rounded border border-neutral p-2">
            <p className="font-mono text-xs text-neutral">Δv</p>
            <p className={`font-mono text-lg ${fuelOk ? 'text-system' : 'text-hazard'}`}>
              {deltaV.toFixed(2)} km/s
            </p>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!fuelOk}
            className={`w-full rounded border px-4 py-2 font-sans text-sm ${
              fuelOk
                ? 'border-signal bg-void text-signal hover:bg-signal hover:text-void'
                : 'cursor-not-allowed border-neutral text-neutral'
            }`}
          >
            {fuelOk ? 'Confirm trajectory' : 'Fuel warning'}
          </button>
        </div>
      </div>
    </div>
  );
}
