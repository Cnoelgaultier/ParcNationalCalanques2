const API_BASE_URL = 'http://webngo.sio.bts:8002/api';

// Types
export interface User {
    id: number;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    adresse: string;
    cp: string;
    ville: string;
    telephone: string;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Email ou mot de passe incorrect');

  return response.json();
}

export async function registerUser(form: Omit<User, 'id'>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const body = await response.text();
    console.log('Status:', response.status);
    console.log('Body:', body);
    throw new Error('Impossible de créer le compte');
  }

  return response.json();
}