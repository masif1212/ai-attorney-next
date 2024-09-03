import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiManager } from './api-manager';
import { LogoutRequestBody } from '@/types/logout';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogoutRequestBody): Promise<void> => {
      const res = await ApiManager.post<void>('/api/auth/logout', data);
      if (res.ok) {
        console.log('Logout successful');
      } else {
        throw new Error(res.error.error || 'Logout failed');
      }
    },
    onSuccess: () => {
      // Optionally invalidate queries or update state here if needed
    },
    onError: (error: Error) => {
      console.error('Logout error:', error.message);
    }
  });
};
