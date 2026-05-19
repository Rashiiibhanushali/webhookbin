import { useState, useEffect } from 'react';
import BinCreator from './components/BinCreator';
import RequestList from './components/RequestList';
import { useWebSocket } from './hooks/useWebSocket';
import { fetchBin } from './api';

export default function App() {
  const [binId, setBinId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Load existing requests when bin is created
  useEffect(() => {
    if (!binId) return;
    fetchBin(binId).then((data) => {
      setRequests(data.requests || []);
    });
  }, [binId]);

  // Real-time: prepend new requests to the top
  useWebSocket(binId, (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  });

  return (
    <div style={styles.layout}>
      <BinCreator onBinCreated={setBinId} />

      {binId && (
        <div style={styles.main}>
          <div style={styles.sidebar}>
            <p style={styles.sidebarLabel}>
              {requests.length} request{requests.length !== 1 ? 's' : ''} captured
            </p>
            <RequestList
              requests={requests}
              onSelect={setSelectedRequest}
              selectedId={selectedRequest?.id}
            />
          </div>

          <div style={styles.detail}>
            {selectedRequest ? (
              <div style={styles.detailInner}>
                <h2 style={styles.detailTitle}>Request Detail</h2>

                <Section title="Overview">
                  <Row label="Method" value={selectedRequest.method} />
                  <Row label="IP" value={selectedRequest.ip} />
                  <Row
                    label="Received"
                    value={new Date(selectedRequest.received_at).toLocaleString()}
                  />
                </Section>

                <Section title="Headers">
                  <pre style={styles.pre}>
                    {JSON.stringify(selectedRequest.headers, null, 2)}
                  </pre>
                </Section>

                <Section title="Body">
                  <pre style={styles.pre}>
                    {JSON.stringify(selectedRequest.body, null, 2)}
                  </pre>
                </Section>

                {Object.keys(selectedRequest.query_params || {}).length > 0 && (
                  <Section title="Query Params">
                    <pre style={styles.pre}>
                      {JSON.stringify(selectedRequest.query_params, null, 2)}
                    </pre>
                  </Section>
                )}
              </div>
            ) : (
              <div style={styles.noSelection}>
                <p>👈 Select a request to inspect it</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#8892a4',
        marginBottom: '8px',
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
      <span style={{ color: '#8892a4', fontSize: '0.85rem', minWidth: '80px' }}>{label}</span>
      <span style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>{value}</span>
    </div>
  );
}

const styles = {
  layout: {
    minHeight: '100vh',
  },
  main: {
    display: 'flex',
    height: 'calc(100vh - 220px)',
  },
  sidebar: {
    width: '340px',
    borderRight: '1px solid #1e2130',
    overflowY: 'auto',
    flexShrink: 0,
  },
  sidebarLabel: {
    fontSize: '0.75rem',
    color: '#4a5568',
    padding: '12px 16px 4px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  detail: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  detailInner: {
    maxWidth: '720px',
  },
  detailTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#7c6af7',
  },
  pre: {
    backgroundColor: '#1a1d27',
    border: '1px solid #2a2f45',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '0.8rem',
    color: '#a8b4c8',
    overflowX: 'auto',
    lineHeight: '1.6',
  },
  noSelection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#4a5568',
    fontSize: '0.95rem',
  },
};