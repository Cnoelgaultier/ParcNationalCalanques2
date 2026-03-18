import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://webngo.sio.bts:8002/api';

// Types
export interface Activite {
    id: number;
    nom: string;
    description: string;
    tarif: number;
    duree: string;
    type_id: number;
    image_url: string;
}

//chercher une activité
const fetchActivites = async (): Promise<Activite[]> => {
    const response = await fetch(`${API_BASE_URL}/activities/`);
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
};

export const useActivites = () => {
    return useQuery<Activite[], Error>({
        queryKey: ['activites'],
        queryFn: fetchActivites,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const formatDuree = (duree: string): string => {
    const [h, m] = duree.split(':');
    const heures = parseInt(h);
    const minutes = parseInt(m);
    if (minutes === 0) return `${heures}h00`;
    return `${heures}h${minutes}`;
};