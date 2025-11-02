export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  role?: string;
}

export interface Record {
  id: string;
  name?: string;
  surname?: string;
  passportSeriya: "AD" | "AB" | "KA";
  passportCode: string;
  type: "NasiyaMijoz" | "PulTolamagan";
  userId: string;
  user?: User;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SearchParams {
  passportSeriya: string;
  passportCode: string;
}

export interface CreateRecordData {
  name?: string;
  surname?: string;
  passportSeriya: "AD" | "AB" | "KA";
  passportCode: string;
  type: "NasiyaMijoz" | "PulTolamagan";
}
