export default function LiveIndicator({ active }) {
  return (
    <div style={styles.wrapper}>
      <div style={{
        ...styles.dot,
        backgroundColor: active ? '#4ade80' : '#4a5568',
        boxShadow: active ? '0 0 6px #4ade80' : 'none',
        animation: active ? 'pulse 1.5s infinite' : 'none',
      }} />
      <span style={{ ...styles.text, color: active ? '#4ade80' : '#4a5568' }}>
        {active ? 'Listening' : 'Not connected'}
      </span>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s',
  },
  text: {
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};