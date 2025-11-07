import { http } from "./http";

const BASE = "/api/test";

export type User = { id: number; email: string; name: string };
export type UpdateUserRequest = Partial<Pick<User, "name" | "email">>;

export const UserService = {
  updateUser: async (id: number, payload: UpdateUserRequest): Promise<User> => {
    const response = await http.put<User>(`${BASE}/${id}`, payload);
    return response.data;
  },
  getUsers: async (): Promise<User[]> => {
    const response = await http.get<User[]>(`${BASE}/users`);
    return response.data;
  },
};