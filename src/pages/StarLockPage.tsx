import { motion } from 'framer-motion'
import { Star, Navigation, Globe2, Compass, Info, ArrowRight } from 'lucide-react'
import { useNavStore } from '../store'
import GlossaryLink from '../components/GlossaryLink'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const CONSTELLATIONS = [
    {
        name: 'Orion',
        stars: 7,
        season: 'Winter',
        desc: 'The Hunter — one of the most recognizable constellations. Betelgeuse (red supergiant) and Rigel (blue supergiant) mark opposite corners. The three belt stars point toward Sirius, the brightest star in the sky.',
        howToFind: 'Look south in winter evenings for three bright stars in a row — that\'s Orion\'s Belt.',
    },
    {
        name: 'Ursa Major',
        stars: 7,
        season: 'Year-round (Northern)',
        desc: 'Contains the Big Dipper asterism. The two "pointer" stars (Dubhe and Merak) at the end of the Big Dipper\'s bowl always point toward Polaris — this is how navigators have found north for thousands of years.',
        howToFind: 'Find the Big Dipper high in the north. Draw a line through the two end stars of the bowl — it points to Polaris.',
    },
    {
        name: 'Crux (Southern Cross)',
        stars: 4,
        season: 'Southern Hemisphere',
        desc: 'The smallest constellation but critical for southern navigation. The long axis of the cross points toward the south celestial pole. Sailors have used it since the age of exploration.',
        howToFind: 'Visible below ~25°N latitude. Look for four bright stars forming a compact cross near the Milky Way.',
    },
    {
        name: 'Cassiopeia',
        stars: 5,
        season: 'Year-round (Northern)',
        desc: 'The distinctive W-shape (or M, depending on the season) never sets below the horizon in northern latitudes. It sits directly opposite the Big Dipper relative to Polaris — if one is low, the other is high.',
        howToFind: 'Look for a bright W or M shape on the opposite side of Polaris from the Big Dipper.',
    },
]

const NAV_TECH = [
    {
        title: 'Star Trackers',
        icon: <Star size={20} />,
        what: 'A camera on a spacecraft that photographs stars and matches patterns against a catalog.',
        why: 'GPS doesn\'t work far from Earth. Star trackers let spacecraft know their orientation (attitude) to within 0.0001° — accurate enough to point a camera at a planet millions of miles away.',
        used: 'Every interplanetary mission, ISS, Hubble, James Webb Space Telescope.',
    },
    {
        title: 'Inertial Navigation',
        icon: <Navigation size={20} />,
        what: 'Gyroscopes and accelerometers that track every rotation and acceleration since launch.',
        why: 'Provides continuous position data without external signals. Drifts over time, so it\'s paired with star trackers for periodic "fixes."',
        used: 'Nuclear submarines, ICBMs, Apollo lunar missions, Mars rovers.',
    },
    {
        title: 'Celestial Sphere',
        icon: <Globe2 size={20} />,
        what: 'An imaginary sphere surrounding Earth onto which all stars appear projected.',
        why: 'Gives us a coordinate system (Right Ascension + Declination) that works the same no matter where you are in the solar system. Think of it as GPS coordinates for the sky.',
        used: 'Every observatory, planetarium, and spacecraft navigation system.',
    },
]

const IMPACT_STATS = [
    { value: '27,000+', label: 'Tracked debris objects', color: 'var(--coral)' },
    { value: '8,500', label: 'Metric tons in orbit', color: 'var(--gold)' },
    { value: '36,500', label: 'Objects > 10cm', color: 'var(--red)' },
    { value: '130M+', label: 'Fragments > 1mm', color: 'var(--purple)' },
    { value: '$2.1B', label: 'Annual tracking cost', color: 'var(--green)' },
    { value: '2040', label: 'Projected Kessler threshold', color: 'var(--red)' },
]

export default function StarLockPage() {
    const { setPage } = useNavStore()

    return (
        <div className="page-section" style={{ paddingTop: '100px' }}>
            <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                    <div className="section-label" style={{ textAlign: 'center' }}>STAR-LOCK TERMINAL</div>
                    <h2>Navigate by the <span className="gradient-text">Stars</span></h2>
                    <p style={{ maxWidth: '650px', margin: '12px auto 0', fontSize: '0.95rem' }}>
                        Before GPS, before radio, there were the stars. Learn how ancient navigators and modern
                        spacecraft both use the same sky to find their way — and why protecting our orbits matters.
                    </p>
                </motion.div>

                {/* How it works */}
                <motion.div variants={fadeUp} className="glass" style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <Info size={18} color="var(--coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>How Do Spacecraft Navigate?</h3>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, margin: 0 }}>
                                Spacecraft can't use GPS beyond Earth orbit. Instead they use <strong>celestial navigation</strong> — the same
                                principle sailors used for centuries. A camera (star tracker) photographs the sky, an AI identifies star patterns,
                                and the computer calculates the spacecraft's exact orientation. Combined with inertial sensors that track every
                                twist and turn, this gives spacecraft pinpoint accuracy across billions of miles.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Technologies */}
                <motion.div variants={fadeUp}>
                    <div className="section-label">NAVIGATION TECHNOLOGIES</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                        {NAV_TECH.map(tech => (
                            <div key={tech.title} className="glass" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ color: 'var(--coral)' }}>{tech.icon}</div>
                                    <h3 style={{ fontSize: '1rem' }}>{tech.title}</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <p style={{ fontSize: '0.82rem', margin: 0 }}>
                                        <strong style={{ color: 'var(--signal)' }}>What:</strong> {tech.what}
                                    </p>
                                    <p style={{ fontSize: '0.82rem', margin: 0 }}>
                                        <strong style={{ color: 'var(--signal)' }}>Why it matters:</strong> {tech.why}
                                    </p>
                                    <p style={{ fontSize: '0.78rem', margin: 0, color: 'var(--gray)' }}>
                                        <strong>Used in:</strong> {tech.used}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Constellation Guide */}
                <motion.div variants={fadeUp}>
                    <div className="section-label">CONSTELLATION GUIDE</div>
                    <p style={{ fontSize: '0.82rem', marginBottom: '12px', opacity: 0.7 }}>
                        These are the key constellations used for celestial navigation. Learn to identify them and you can find your bearings anywhere on Earth.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {CONSTELLATIONS.map(con => (
                            <div key={con.name} className="glass info-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.05rem' }}>{con.name}</h3>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[...Array(con.stars)].map((_, i) => (
                                            <Star key={i} size={9} fill="var(--gold)" color="var(--gold)" />
                                        ))}
                                    </div>
                                </div>
                                <span className="tag gold" style={{ alignSelf: 'flex-start' }}>{con.season}</span>
                                <p style={{ fontSize: '0.8rem', margin: 0 }}>{con.desc}</p>
                                <div style={{
                                    fontSize: '0.78rem', padding: '8px 12px', marginTop: '4px',
                                    background: 'rgba(232,132,92,0.06)', borderRadius: '8px',
                                    border: '1px solid rgba(232,132,92,0.15)',
                                }}>
                                    <strong style={{ color: 'var(--coral)', fontSize: '0.7rem' }}>HOW TO FIND:</strong>{' '}
                                    <span style={{ opacity: 0.8 }}>{con.howToFind}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Global Impact Ledger */}
                <motion.div variants={fadeUp} className="glass-warm" style={{ padding: '32px' }}>
                    <div className="section-label">WHY THIS MATTERS — THE DEBRIS CRISIS IN NUMBERS</div>
                    <p style={{ fontSize: '0.88rem', marginBottom: '24px', maxWidth: '600px' }}>
                        Every collision creates more fragments. More fragments cause more collisions.
                        If we don't act, this <GlossaryLink term="Kessler Syndrome"><strong>Kessler Syndrome</strong></GlossaryLink> could make orbital space unusable within our lifetimes.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        {IMPACT_STATS.map(stat => (
                            <div key={stat.label} style={{ textAlign: 'center', padding: '12px' }}>
                                <div style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700,
                                    color: stat.color,
                                }}>
                                    {stat.value}
                                </div>
                                <div className="stat-label" style={{ marginTop: '4px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-coral" onClick={() => setPage('GRAVEYARD')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            See the Graveyard <ArrowRight size={14} />
                        </button>
                        <button className="btn" onClick={() => setPage('INTERCEPT')}>
                            Plan an Intercept
                        </button>
                    </div>
                </motion.div>

                <div style={{ height: '80px' }} />
            </motion.div>
        </div>
    )
}
