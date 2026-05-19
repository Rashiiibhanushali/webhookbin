function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(dateStr).toLocaleTimeString();
}

export default function RequestList({ requests, onSelect, selectedId, onClear, onNewBin }) {
  if (requests.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>📭</p>
        <p style={styles.emptyText}>Waiting for requests...</p>
        <p style={styles.emptyHint}>Send a POST to your webhook URL</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.listHeader}>
        <span style={styles.count}>
          {requests.length} request{requests.length !== 1 ? 's' : ''}
        </span>
        <div style={styles.actions}>
          <button style={styles.newBinBtn} onClick={onNewBin}>
            + New Bin
          </button>
          <button style={styles.clearBtn} onClick={onClear}>
            Clear all
          </button>
        </div>
      </div>

      <div style={styles.list}>
        {requests.map((req, index) => (
          <div
            key={req.id}
            style={{
              ...styles.item,
              ...(selectedId === req.id ? styles.itemActive : {}),
            }}
            onClick={() => onSelect(req)}
          >
            <div style={styles.itemLeft}>
              <span style={{
                ...styles.method,
                ...(req.method === 'POST' ? styles.post : styles.get),
              }}>
                {req.method}
              </span>
              {index === 0 && (
                <span style={styles.newBadge}>NEW</span>
              )}
            </div>
            <div style={styles.itemRight}>
              <span style={styles.time}>{timeAgo(req.received_at)}</span>
              <span style={styles.ip}>{req.ip?.replace('::ffff:', '')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #1e2130',
  },
  count: {
    fontSize: '0.75rem',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  clearBtn: {
    background: 'none',
    border: '1px solid #2a2f45',
    color: '#8892a4',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '8px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  itemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  method: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '4px',
    minWidth: '44px',
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
  newBadge: {
    fontSize: '0.6rem',
    backgroundColor: '#7c6af7',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  time: {
    color: '#8892a4',
    fontSize: '0.75rem',
  },
  ip: {
    color: '#4a5568',
    fontSize: '0.7rem',
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
  actions: {
  display: 'flex',
  gap: '6px',
  },
  newBinBtn: {
  background: 'none',
  border: '1px solid #7c6af7',
  color: '#7c6af7',
  padding: '4px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: '600',
  },
};