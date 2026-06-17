import { axiosInstance } from '../api/interceptors/axiosInstance';
import { ENDPOINTS } from '../constants/endponint';
import type { LoginResponse, User, UserProfile } from '../types';

export class AuthService {
  static async login(username: string, password: string): Promise<LoginResponse> {
    const { data } = await axiosInstance.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    });
    return data;
  }

  static async getCurrentUser(): Promise<User> {
    const { data } = await axiosInstance.get<User>(ENDPOINTS.AUTH.ME);
    return data;
  }

  static async getUserProfile(): Promise<UserProfile> {
    const { data } = await axiosInstance.get<UserProfile>(ENDPOINTS.AUTH.ME);
    return data;
  }
}
