import { useQuery } from '@tanstack/react-query';
import { getAvailableModels } from './index';

export const useAvailableModelsQuery = () => {
    return useQuery({
        queryKey: ['availableModels'],
        queryFn: async () => {
            try {
                const data = await getAvailableModels();
                return data;
            } catch (error) {
                console.error('Error fetching available models:', error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};

export default useAvailableModelsQuery;