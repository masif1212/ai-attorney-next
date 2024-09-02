export interface SendChatRequest {
    chatId: string; 
    query: string;
    userId: string; 
  };

 export  interface SendChatResponse  {
    chatId: any;
    success: boolean;
    message?: string;
    data?: {
      chatId: string;
      userId: string;
      responseMessage: string;
      timestamp: string; 
    };
    error?: string;
  };
 export interface ChatMessage  {
    message: string;
    type: string;
    content: string;
    senderType: string;
    id: string;
  };
  export interface ChatItem {
    id: string; 
    latestMessage: string;
    createdAt: string; 
    messages: ChatMessage[]; 
    fullContext: { content: string }[];
  };
  
  
  