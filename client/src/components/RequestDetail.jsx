import { useState } from 'react';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button style={styles.copyBtn} onClick={handleCopy}>
      {copied ? 'Copied' : '📋 Copy'}
    </button>
  );
}

function Section({ title, content }) {
  const formatted = JSON.stringify(content, null, 2);
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>{title}</span>
        <CopyButton text={formatted} />
      </div>
      <pre style={styles.pre}>{formatted}</pre>
    </div>
  );
}

export default function RequestDetail({ request }) {
  if (!request) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>🔍</p>
        <p style={styles.emptyText}>Select a request to inspect it</p>
        <p style={styles.emptyHint}>Click any item in the list on the left</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{
            ...styles.method,
            ...(request.method === 'POST' ? styles.post : styles.get),
          }}>
            {request.method}
          </span>
          <span style={styles.headerTitle}>Request Inspector</span>
        </div>
        <span style={styles.timestamp}>
          {new Date(request.received_at).toLocaleString()}
        </span>
      </div>

      <div style={styles.metaRow}>
        <MetaItem label="Request ID" value={request.id} mono />
        <MetaItem label="Source IP" value={request.ip?.replace('::ffff:', '')} mono />
      </div>

      <Section title="Body" content={request.body} />
      <Section title="Headers" content={request.headers} />

      {Object.keys(request.query_params || {}).length > 0 && (
        <Section title="Query Parameters" content={request.query_params} />
      )}
    </div>
  );
}

function MetaItem({ label, value, mono }) {
  return (
    <div style={styles.metaItem}>
      <span style={styles.metaLabel}>{label}</span>
      <span style={{ ...styles.metaValue, fontFamily: mono ? 'monospace' : 'inherit' }}>
        {value}
      </span>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '760px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  method: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '4px',
  },
  post: {
    backgroundColor: '#1a3a2a',
    color: '#4ade80',
  },
  get: {
    backgroundColor: '#1a2a3a',
    color: '#60a5fa',
  },
  timestamp: {
    fontSize: '0.8rem',
    color: '#4a5568',
  },
  metaRow: {
    display: 'flex',
    gap: '24px',
    backgroundColor: '#1a1d27',
    border: '1px solid #2a2f45',
    borderRadius: '8px',
    padding: '14px 18px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  metaLabel: {
    fontSize: '0.65rem',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  metaValue: {
    fontSize: '0.85rem',
    color: '#a8b4c8',
  },
  section: {
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '0.7rem',
    color: '#8892a4',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600',
  },
  copyBtn: {
    background: 'none',
    border: '1px solid #2a2f45',
    color: '#8892a4',
    padding: '3px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.72rem',
  },
  pre: {
    backgroundColor: '#1a1d27',
    border: '1px solid #2a2f45',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '0.8rem',
    color: '#a8b4c8',
    overflowX: 'auto',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: '48px',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#8892a4',
    fontSize: '1rem',
    marginBottom: '6px',
  },
  emptyHint: {
    color: '#4a5568',
    fontSize: '0.85rem',
  },
};