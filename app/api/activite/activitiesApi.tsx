import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://webngo.sio.bts:8002/api';

export interface Activity {
    id: number;
    nom: string;
    description: string;
    tarif: number;
    duree: string;
    type_id: number;
    image_url: string;
}

const fetchActivities = async (): Promise<Activity[]> => {
    const response = await fetch(`${API_BASE_URL}/activities`);
    if (!response.ok) throw new Error(`Erreur HTTP Liste: ${response.status}`);
    return response.json();
};

const fetchActivityById = async (id: number): Promise<Activity> => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`);
    if (!response.ok) throw new Error(`Erreur HTTP Détail: ${response.status}`);
    return response.json();
};

export const useActivities = () => {
    return useQuery<Activity[], Error>({
        queryKey: ['activities_list'],
        queryFn: fetchActivities,
        staleTime: 5 * 60 * 1000,
    });
};

export const useActivityById = (id: number | null) => {
    return useQuery<Activity, Error>({
        queryKey: ['activity_detail', id],
        queryFn: () => fetchActivityById(id!), // On force car enabled gère la sécurité
        enabled: id !== null, // La requête ne part que si on a un ID
        staleTime: 5 * 60 * 1000,
    });
};