import { useEffect, useRef } from 'react';

const WS_URL = 'ws://localhost:4000';

export function useWebSocket(binId, onNewRequest) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!binId) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WS connected');
      ws.send(JSON.stringify({ type: 'subscribe', bin_id: binId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'new_request') {
        onNewRequest(message.data);
      }
    };

    ws.onerror = (err) => console.error('WS error:', err);

    ws.onclose = () => console.log('WS disconnected');

    // Cleanup on unmount or binId change
    return () => {
      ws.close();
    };
  }, [binId]);
}