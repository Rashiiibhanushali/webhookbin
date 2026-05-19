export default function RequestList({ requests, onSelect, selectedId }) {
  if (requests.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>📭</p>
        <p style={styles.emptyText}>Waiting for requests...</p>
        <p style={styles.emptyHint}>Send a POST to your webhook URL to see it here</p>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {requests.map((req) => (
        <div
          key={req.id}
          style={{
            ...styles.item,
            ...(selectedId === req.id ? styles.itemActive : {}),
          }}
          onClick={() => onSelect(req)}
        >
          <span style={{
            ...styles.method,
            ...(req.method === 'POST' ? styles.post : styles.get),
          }}>
            {req.method}
          </span>
          <span style={styles.time}>
            {new Date(req.received_at).toLocaleTimeString()}
          </span>
          <span style={styles.ip}>{req.ip}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '12px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#1a1d27',
    border: '1px solid transparent',
    transition: 'all 0.15s',
  },
  itemActive: {
    border: '1px solid #7c6af7',
    backgroundColor: '#1e1b3a',
  },
  method: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '4px',
    minWidth: '48px',
    textAlign: 'center',
  },
  post: {
    backgroundColor: '#1a3a2a',
    color: '#4ade80',
  },
  get: {
    backgroundColor: '#1a2a3a',
    color: '#60a5fa',
  },
  time: {
    color: '#8892a4',
    fontSize: '0.85rem',
    flex: 1,
  },
  ip: {
    color: '#4a5568',
    fontSize: '0.75rem',
  },
  empty: {
    textAlign: 'center',
    padding: '64px 24px',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#8892a4',
    fontSize: '1rem',
    marginBottom: '8px',
  },
  emptyHint: {
    color: '#4a5568',
    fontSize: '0.85rem',
  },
};