import { useMutation } from '@tanstack/react-query';
import { ApiManager } from './api-manager';
import { RegisterBody, RegisterResponse } from '@/types/register';
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterBody): Promise<RegisterResponse> => {
      const res = await ApiManager.post<RegisterResponse>('/api/auth/register', data);
      if (res.ok) {
        return res.data; 
      } else {
        throw new Error(res.error.error || 'Register failed');
      }
    },
  });
};
