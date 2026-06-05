import type { Car, Winner, EngineData } from '../types';

const BASE = 'http://127.0.0.1:3000';

export async function getCars(page: number, limit = 7): Promise<{ cars: Car[]; total: number }> {
  const res = await fetch(`${BASE}/garage?_page=${page}&_limit=${limit}`);
  const total = Number(res.headers.get('X-Total-Count') ?? '0');
  const cars = (await res.json()) as Car[];
  return { cars, total };
}

export async function getCar(id: number): Promise<Car> {
  const res = await fetch(`${BASE}/garage/${id}`);
  return res.json() as Promise<Car>;
}

export async function createCar(name: string, color: string): Promise<Car> {
  const res = await fetch(`${BASE}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return res.json() as Promise<Car>;
}

export async function updateCar(id: number, name: string, color: string): Promise<Car> {
  const res = await fetch(`${BASE}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return res.json() as Promise<Car>;
}

export async function deleteCar(id: number): Promise<void> {
  await fetch(`${BASE}/garage/${id}`, { method: 'DELETE' });
}

export async function startEngine(id: number): Promise<EngineData> {
  const res = await fetch(`${BASE}/engine?id=${id}&status=started`, { method: 'PATCH' });
  return res.json() as Promise<EngineData>;
}

export async function stopEngine(id: number): Promise<void> {
  await fetch(`${BASE}/engine?id=${id}&status=stopped`, { method: 'PATCH' });
}

export async function driveMode(id: number): Promise<void> {
  const res = await fetch(`${BASE}/engine?id=${id}&status=drive`, { method: 'PATCH' });
  if (!res.ok) throw new Error('engine broken');
}

export async function getWinners(
  page: number,
  limit = 10,
  sort = 'id',
  order = 'ASC',
): Promise<{ winners: Winner[]; total: number }> {
  const url = `${BASE}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;
  const res = await fetch(url);
  const total = Number(res.headers.get('X-Total-Count') ?? '0');
  const winners = (await res.json()) as Winner[];
  return { winners, total };
}

export async function getWinner(id: number): Promise<Winner | null> {
  const res = await fetch(`${BASE}/winners/${id}`);
  if (res.status === 404) return null;
  return res.json() as Promise<Winner>;
}

export async function createWinner(id: number, wins: number, time: number): Promise<Winner> {
  const res = await fetch(`${BASE}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });
  return res.json() as Promise<Winner>;
}

export async function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  const res = await fetch(`${BASE}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
  return res.json() as Promise<Winner>;
}

export async function deleteWinner(id: number): Promise<void> {
  await fetch(`${BASE}/winners/${id}`, { method: 'DELETE' });
}
