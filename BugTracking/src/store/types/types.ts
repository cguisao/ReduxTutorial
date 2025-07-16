export interface ApiCallPayload {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  headers?: Record<string, string>;
  onSuccess?: string;
  onError?: string;
  onStart?: string;
}

export interface bugSlice {
    list: bug[],
    loading: boolean,
    lastFetch: number
}

export interface bug {
    id?: number;
    description?: string;
    resolved?: boolean;
    teamMember?: number;
};