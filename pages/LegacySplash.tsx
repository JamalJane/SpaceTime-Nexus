import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUiStore } from '../stores/uiStore';

const QUOTE = 'A satellite only truly dies when it is forgotten.';

export default function LegacySplash() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const enableHud = useUiStore((s) => s.enableHud);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.9, 1], [0.5, 0.7, 1, 1, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.2], [20, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1.5, 1]);

  useEffect(() => {
    if (!mounted) return;
    const unsub = scrollYProgress.on('change', (v) => {
      if (v >= 0.99 && !exiting) {
        setExiting(true);
        enableHud();
        setTimeout(() => navigate('/hub', { replace: true }), 800);
      }
    });
    return () => unsub();
  }, [scrollYProgress, enableHud, navigate, exiting, mounted]);

  if (!mounted) {
    return (
      <div style={{ 
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F2F2F2',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ fontSize: '1.5rem', textAlign: 'center', padding: '2rem' }}>
          {QUOTE}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ 
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        height: '300vh',
        backgroundColor: '#050505',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div style={{ 
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        paddingTop: '5rem',
        paddingBottom: '5rem'
      }}>
        <motion.div
          style={{ 
            maxWidth: '42rem',
            textAlign: 'center',
            fontSize: '1.5rem',
            opacity, 
            scale, 
            filter,
            color: '#F2F2F2',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: '1.6'
          }}
        >
          {QUOTE}
        </motion.div>
      </div>
      <div style={{ height: '100vh' }} />
      <div style={{ height: '100vh' }} />
      {exiting && (
        <motion.div
          style={{ 
            pointerEvents: 'none',
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: '#050505'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
}
