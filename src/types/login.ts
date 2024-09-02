export interface LoginBody {
    email: string;
    password: string;
  }
  
  export interface ILoginResponse {
    token: string;
    username: string;
    chatId: string;
    userId: string;
  }
  
  export interface ServerResponse {
    message: string;
    isError: boolean;
  }
