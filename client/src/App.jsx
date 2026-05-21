import { useState, useEffect } from 'react';
import BinCreator from './components/BinCreator';
import RequestList from './components/RequestList';
import RequestDetail from './components/RequestDetail';
import LiveIndicator from './components/LiveIndicator';
import { useWebSocket } from './hooks/useWebSocket';
import { fetchBin } from './api';
import { pingServer } from './api';

export default function App() {
  const [binId, setBinId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { isConnected } = useWebSocket(binId, (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
    setSelectedRequest((current) => current ?? newRequest);
  });
  
  // Ping server on app load to wake it up
  useEffect(() => {
    pingServer();
  }, []);

  useEffect(() => {
    if (!binId) return;
    fetchBin(binId).then((data) => {
      setRequests(data.requests || []);
    });
  }, [binId]);

  function handleClear() {
    setRequests([]);
    setSelectedRequest(null);
  }

  function handleNewBin() {
    setBinId(null);
    setRequests([]);
    setSelectedRequest(null);
  }

  return (
    <div style={styles.layout}>
      <BinCreator onBinCreated={setBinId} binId={binId} />  {/* ← pass binId */}

      {binId && (
        <>
          <div style={styles.toolbar}>
            <LiveIndicator active={isConnected} />
          </div>

          <div style={styles.main}>
            <div style={styles.sidebar}>
              <RequestList
                requests={requests}
                onSelect={setSelectedRequest}
                selectedId={selectedRequest?.id}
                onClear={handleClear}
                onNewBin={handleNewBin}  
              />
            </div>

            <div style={styles.detail}>
              <RequestDetail request={selectedRequest} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10px 24px',
    borderBottom: '1px solid #1e2130',
    backgroundColor: '#0f1117',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '320px',
    borderRight: '1px solid #1e2130',
    overflowY: 'auto',
    flexShrink: 0,
  },
  detail: {
    flex: 1,
    overflowY: 'auto',
    padding: '28px 32px',
  },
};