export interface AbstractResponse {
  semantic: string;
  status?: number;
  statusText?: string;
}

export interface RequestResponse extends AbstractResponse {
  ok?: string;
  contentType?: string;
  data?: object;
  headers?: object;
}


