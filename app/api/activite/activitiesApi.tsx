import { useQuery } from '@tanstack/react-query';

// On garde la même base que votre exemple qui marche
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
    const response = await fetch(`${API_BASE_URL}/activities`); // Adaptez si besoin (/activities/)
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
};

export const useActivities = () => {
    return useQuery<Activity[], Error>({
        queryKey: ['activities_list'],
        queryFn: fetchActivities,
        staleTime: 5 * 60 * 1000,
    });
};