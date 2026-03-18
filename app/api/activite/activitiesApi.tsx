import { useQuery } from '@tanstack/react-query';
import { getActivities } from '../../api/activitiesApi'; // Ajustez le chemin


export interface Activity {
    id: number;
    nom: string;
    description: string;
    tarif: number;
    duree: string;
    image_url: string;
    type_id: number;
}


const API_BASE_URL = 'http://webngo.sio.bts:8002';

export default function ActivitiesScreen() {
    const { data: activities, isLoading, isError, error } = useQuery({
        queryKey: ['activities'],
        queryFn: getActivities,
    });

};
