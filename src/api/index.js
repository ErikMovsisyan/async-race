const BASE = 'http://127.0.0.1:3000';

export async function getCars(page, limit = 7) {
  const res = await fetch(`${BASE}/garage?_page=${page}&_limit=${limit}`);
  const total = Number(res.headers.get('X-Total-Count') ?? '0');
  const cars = await res.json();
  return { cars, total };
}

export async function getCar(id) {
  const res = await fetch(`${BASE}/garage/${id}`);
  return res.json();
}

export async function createCar(name, color) {
  const res = await fetch(`${BASE}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return res.json();
}

export async function updateCar(id, name, color) {
  const res = await fetch(`${BASE}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return res.json();
}

export async function deleteCar(id) {
  await fetch(`${BASE}/garage/${id}`, { method: 'DELETE' });
}

export async function startEngine(id) {
  const res = await fetch(`${BASE}/engine?id=${id}&status=started`, { method: 'PATCH' });
  return res.json();
}

export async function stopEngine(id) {
  await fetch(`${BASE}/engine?id=${id}&status=stopped`, { method: 'PATCH' });
}

export async function driveMode(id) {
  const res = await fetch(`${BASE}/engine?id=${id}&status=drive`, { method: 'PATCH' });
  if (!res.ok) throw new Error('engine broken');
}

export async function getWinners(page, limit = 10, sort = 'id', order = 'ASC') {
  const url = `${BASE}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;
  const res = await fetch(url);
  const total = Number(res.headers.get('X-Total-Count') ?? '0');
  const winners = await res.json();
  return { winners, total };
}

export async function getWinner(id) {
  const res = await fetch(`${BASE}/winners/${id}`);
  if (res.status === 404) return null;
  return res.json();
}

export async function createWinner(id, wins, time) {
  const res = await fetch(`${BASE}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });
  return res.json();
}

export async function updateWinner(id, wins, time) {
  const res = await fetch(`${BASE}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
  return res.json();
}

export async function deleteWinner(id) {
  await fetch(`${BASE}/winners/${id}`, { method: 'DELETE' });
}
