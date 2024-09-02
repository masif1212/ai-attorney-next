import axios, { AxiosError, AxiosResponse } from 'axios';

type ErrorData = {
  error: string;
};

type IResponse<R> =
  | {
    json: any; ok: true; data: R 
}
  | { ok: false; error: ErrorData };

export const ApiManager = {
  post: async <R>(
    endpoint: string,
    body: Record<string, any>,
    params: Record<string, any> = {}
  ): Promise<IResponse<R>> => {
    try {
      const response: AxiosResponse<R> = await axios.post<R>(endpoint, body, { params });
      return { ok: true, data: response.data,json:response.data }; 
    } catch (error) {
      return { ok: false, error: (error as AxiosError<ErrorData>).response?.data as ErrorData };
    }
  },

  get: async <R>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<IResponse<R>> => {
    try {
      const response: AxiosResponse<R> = await axios.get<R>(endpoint, { params });
      return { ok: true, data: response.data,json:response.data };
    } catch (error) {
      return { ok: false, error: (error as AxiosError<ErrorData>).response?.data as ErrorData };
    }
  },
};
