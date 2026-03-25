import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://webngo.sio.bts:8002/api';

export interface TypeActivite {
    id: number;
    nom: string;
}

// Fetch type activites
const fetchTypeActivites = async (): Promise<TypeActivite[]> => {
    const response = await fetch(`${API_BASE_URL}/type_activites`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return response.json();
};

// Use type activites
export const useTypeActivites = () => {
    return useQuery<TypeActivite[], Error>({
        queryKey: ['type_activites'],
        queryFn: fetchTypeActivites,
        staleTime: 5 * 60 * 1000,
    });
};


