const { WebSocketServer } = require('ws');

// Map of bin_id -> Set of connected WebSocket clients
const clients = new Map();

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    let subscribedBinId = null;

    // Client sends a message to subscribe to a bin
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        if (data.type === 'subscribe' && data.bin_id) {
          subscribedBinId = data.bin_id;

          // Add this client to the bin's subscriber list
          if (!clients.has(subscribedBinId)) {
            clients.set(subscribedBinId, new Set());
          }
          clients.get(subscribedBinId).add(ws);

          console.log(`Client subscribed to bin: ${subscribedBinId}`);

          // Confirm subscription to the client
          ws.send(JSON.stringify({ 
            type: 'subscribed', 
            bin_id: subscribedBinId 
          }));
        }
      } catch (err) {
        console.error('WS message error:', err.message);
      }
    });

    // Clean up when client disconnects
    ws.on('close', () => {
      if (subscribedBinId && clients.has(subscribedBinId)) {
        clients.get(subscribedBinId).delete(ws);
        console.log(`Client unsubscribed from bin: ${subscribedBinId}`);
      }
    });
  });

  return wss;
}

// Called from the webhook route to push new requests to subscribers
function broadcastTobin(bin_id, data) {
  if (clients.has(bin_id)) {
    const message = JSON.stringify({ type: 'new_request', data });
    clients.get(bin_id).forEach((client) => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(message);
      }
    });
  }
}

module.exports = { setupWebSocket, broadcastTobin };