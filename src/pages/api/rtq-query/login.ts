import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiManager } from './api-manager';
import { ILoginResponse, LoginBody } from '@/types/login';
import { ChatMessage } from '@/types/messages';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginBody): Promise<ILoginResponse> => {
      const res = await ApiManager.post<ILoginResponse>('/api/auth/login', data);
      if (res.ok) {
        return res.data;
      } else {
        throw new Error(res.error.error || 'Login failed');
      }
    },
    onSuccess: (data) => {
      const chatId = localStorage.getItem('activeChatId'); 
      

      if (chatId) {
        queryClient.invalidateQueries(['chatMessages', chatId] as any);
      }
    },
  });
};
