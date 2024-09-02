export interface RegisterBody {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  }
  
  export interface RegisterResponse {
    message: string;
    ok: any;
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    lastActiveAt: Date | null;
    isActive: boolean;
    settings: Record<string, any>;
  }
  
 
