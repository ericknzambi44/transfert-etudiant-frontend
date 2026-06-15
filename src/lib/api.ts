// api.ts
import { ApiResponse, DossierTransfert, ParcoursAcademique, StatistiquesDTO, HistoriqueAction } from './api.types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<ApiResponse<T>> {
  const token = !options?.skipAuth ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const json: ApiResponse<T> = await res.json();

    // Vérifier le statut HTTP ET le flag "success" du backend
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Erreur serveur');
    }
    return json;
  } catch (err: any) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Impossible de joindre le serveur. Vérifiez votre connexion.');
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; role: string; userType: string; etablissementId: string | null }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerEtablissement: (data: any) =>
    request<{ id: string }>('/etablissements/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  registerEtudiant: (data: any) =>
    request<{ id: string }>('/etudiants/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Dossiers
  creerDossier: (payload: any) =>
    request<DossierTransfert>('/dossiers', { method: 'POST', body: JSON.stringify(payload) }),
  validerParSource: (dossierId: string, commentaire: string) =>
    request<DossierTransfert>(`/dossiers/${dossierId}/valider-source`, {
      method: 'POST',
      body: JSON.stringify({ commentaire }),
    }),
  consentementEtudiant: (dossierId: string) =>
    request<void>(`/dossiers/${dossierId}/consentement`, {
      method: 'POST',
      body: JSON.stringify({ consentement: true }),
      skipAuth: true,
    }),
  repondreTransfert: (dossierId: string, accepte: boolean, commentaire: string) =>
    request<DossierTransfert>(`/dossiers/${dossierId}/accepter-cible`, {
      method: 'POST',
      body: JSON.stringify({ accepte, commentaire }),
    }),
  rechercherParEmail: (email: string) =>
    request<DossierTransfert[]>(`/dossiers/search?email=${encodeURIComponent(email)}`),
  getParcours: (dossierId: string) =>
    request<ParcoursAcademique>(`/dossiers/${dossierId}/parcours`),
  getDossiersSource: () => request<DossierTransfert[]>('/dossiers'),
  getDossierById: (id: string) => request<DossierTransfert>(`/dossiers/${id}`),
  getHistorique: (dossierId: string) =>
    request<HistoriqueAction[]>(`/dossiers/${dossierId}/historique`),
  getStatistiques: () => request<StatistiquesDTO>('/dossiers/statistiques'),
  getMesDossiers: () => request<DossierTransfert[]>('/dossiers/me'),
};