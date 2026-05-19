const BASE_URL = 'http://localhost:4000';

export async function createBin() {
  const res = await fetch(`${BASE_URL}/api/bins`, { method: 'POST' });
  return res.json();
}

export async function fetchBin(binId) {
  const res = await fetch(`${BASE_URL}/api/bins/${binId}`);
  return res.json();
}