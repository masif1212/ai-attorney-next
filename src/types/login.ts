export interface DeviceInfo {
  browser: string | undefined;
  version: string | undefined;
  device: string;
  userAgent: string;
}

export interface LoginBody {
  email: string;
  password: string;
  deviceInfo: DeviceInfo;
  isLoggedIn: boolean;
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
