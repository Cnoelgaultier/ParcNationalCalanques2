import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://webngo.sio.bts:8002/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Activite {
    id: number;
    nom: string;
    description: string;
    tarif: number;
    duree: string;
    type_id: number;
    image_url: string;
}

export interface Availability {
    activite_id: number;
    date: string;
    heure: string | null;
    quota_jour: number;
    quota_heure: number;
    reserve_jour: number;
    reserve_heure: number | null;
    disponible_jour: number;
    disponible_heure: number | null;
}

export interface CreateReservationPayload {
    activite_id: number;
    date: string;
    heure: string;
    nb_participants: number;
}

export interface Reservation {
    id: number;
    activite_id: number;
    date: string;
    heure: string;
    nb_participants: number;
    total: number;
}

// ─── Fetch activités ─────────────────────────────────────────────────────────

const fetchActivites = async (): Promise<Activite[]> => {
    const response = await fetch(`${API_BASE_URL}/activities/`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return response.json();
};

export const useActivites = () => {
    return useQuery<Activite[], Error>({
        queryKey: ['activites'],
        queryFn: fetchActivites,
        staleTime: 5 * 60 * 1000,
    });
};

// ─── Fetch disponibilité ──────────────────────────────────────────────────────

const fetchAvailability = async (activiteId: number, date: string): Promise<Availability> => {
    const response = await fetch(`${API_BASE_URL}/activities/${activiteId}/availability?date=${date}`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return response.json();
};

export const useAvailability = (activiteId: number | null, date: string) => {
    return useQuery<Availability, Error>({
        queryKey: ['availability', activiteId, date],
        queryFn: () => fetchAvailability(activiteId!, date),
        // Ne fetch que si on a une activité ET une date valide (format YYYY-MM-DD)
        enabled: !!activiteId && /^\d{4}-\d{2}-\d{2}$/.test(date),
        staleTime: 30 * 1000, // 30 secondes
    });
};


const createReservation = async (payload: CreateReservationPayload): Promise<Reservation> => {
    const response = await fetch(`${API_BASE_URL}/reservations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.detail || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
};

export const useCreateReservation = () => {
    const queryClient = useQueryClient();
    return useMutation<Reservation, Error, CreateReservationPayload>({
        mutationFn: createReservation,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['availability', variables.activite_id, variables.date] });
        },
    });
};



export const formatDuree = (duree: string): string => {
    const [h, m] = duree.split(':');
    const heures = parseInt(h);
    const minutes = parseInt(m);
    if (minutes === 0) return `${heures}h00`;
    return `${heures}h${minutes}`;
};

export const formatDateForApi = (date: string): string => {
    const parts = date.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};