const API_BASE_URL = 'http://webngo.sio.bts:8002/api';

// Page d'authentification




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
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: formData,
  });

  console.log('Status login:', response.status);
  const body = await response.text();
  console.log('Body login:', body);

  if (!response.ok) {
    const body = await response.text();
    console.log('Status login:', response.status);
    console.log('Body login:', body);
    throw new Error('Email ou mot de passe incorrect');
  }

  const parsed = JSON.parse(body);
  console.log('Parsed:', JSON.stringify(parsed));
  console.log('Token:', parsed.access_token);

  const { access_token } = parsed;

  if (!access_token) {
    throw new Error('Token manquant');
  }

  const profileResponse = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
    },
  });

  console.log('Status profil:', profileResponse.status);
  const profileBody = await profileResponse.text();
  console.log('Body profil:', profileBody);

  if (!profileResponse.ok) {
    throw new Error('Impossible de récupérer le profil');
  }

  return JSON.parse(profileBody);
}

export type RegisterForm = Omit<User, 'id'>;
export type RegisterPayload = RegisterForm & { role_id: number };

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.log('Status:', response.status);
    console.log('Body:', body);
    throw new Error('Impossible de créer le compte');
  }

  return response.json();
}