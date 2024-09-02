import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiManager } from './api-manager';
import { ChatMessage, SendChatResponse } from '@/types/messages';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: { chatId: string; query: string; userId: string }) => {
      const result = await ApiManager.post<SendChatResponse>(
        '/api/chat/send',
        messageData,
      );
      if (result.ok) {
        return result.data;
      }
      throw new Error('Sending message failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatMessages']
      });
    },
    mutationKey: ['sendMessage'], 
  });
};

export const useChatMessages = (chatId: string | null) => {
  return useQuery<ChatMessage[], Error>({
    queryKey: ['chatMessages', chatId],
    queryFn: async () => {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }

      const token = localStorage.getItem('token');
      const response = await ApiManager.get<{ chat_history: ChatMessage[] }>(
        `/api/chat/messages/${chatId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }

      return response?.data?.chat_history;
    },
    enabled: !!chatId, 
    staleTime: Infinity,
  });
};




