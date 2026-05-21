import { useEffect, useRef, useState } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL;

export function useWebSocket(binId, onNewRequest) {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!binId) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WS connected');
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'subscribe', bin_id: binId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'new_request') {
        onNewRequest(message.data);
      }
    };

    ws.onerror = (err) => console.error('WS error:', err);

    ws.onclose = () => {
      console.log('WS disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [binId]);

  return { isConnected };
}