import { useState } from 'react';
import { motion } from 'framer-motion';

const GLOSSARY: { term: string; definition: string }[] = [
  { term: 'Apoapsis', definition: 'Farthest point of an orbit from the primary body.' },
  { term: 'Delta-V', definition: 'Change in velocity required for a maneuver (m/s).' },
  { term: 'Inclination', definition: 'Orbital tilt relative to the equatorial plane.' },
  { term: 'TLE', definition: 'Two-Line Element set; compact representation of an orbit.' },
  { term: 'SGP4', definition: 'Simplified General Perturbations model for propagation.' },
];

export default function MissionProfile() {
  const [tab, setTab] = useState<'syndicate' | 'glossary' | 'status'>('syndicate');

  return (
    <div className="mx-auto max-w-3xl font-sans">
      <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-signal">
        Mission Profile
      </h1>
      <div className="mt-6 flex gap-2 border-b border-neutral pb-2">
        {(['syndicate', 'glossary', 'status'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded px-3 py-1 font-mono text-sm capitalize ${
              tab === t ? 'bg-neutral text-signal' : 'text-neutral hover:text-signal'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'syndicate' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-4 text-signal/90"
        >
          <p>
            The 2026 Debris Crisis made orbital recycling an economic necessity. The NEXUS Syndicate
            treats Earth orbit as a graveyard of pre-positioned raw materials—enabling identification,
            valuation, and simulated recovery of defunct satellites and rocket bodies.
          </p>
        </motion.div>
      )}
      {tab === 'glossary' && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-3"
        >
          {GLOSSARY.map(({ term, definition }) => (
            <li key={term} className="group border-l-2 border-neutral pl-4">
              <span className="font-mono text-bounty">{term}</span>
              <span className="ml-2 text-signal/80">{definition}</span>
            </li>
          ))}
        </motion.ul>
      )}
      {tab === 'status' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 font-mono text-sm"
        >
          <p className="text-system">Space-Track API: Connected</p>
          <p className="mt-2 text-neutral">Last TLE sync: —</p>
        </motion.div>
      )}
    </div>
  );
}
