const BASE_URL = import.meta.env.VITE_API_URL;

// Warm up the server on app load
export async function pingServer() {
  try {
    await fetch(`${BASE_URL}/`);
  } catch (err) {
    console.log('Server waking up...');
  }
}

export async function createBin() {
  const res = await fetch(`${BASE_URL}/api/bins`, { method: 'POST' });
  return res.json();
}

export async function fetchBin(binId) {
  const res = await fetch(`${BASE_URL}/api/bins/${binId}`);
  return res.json();
}