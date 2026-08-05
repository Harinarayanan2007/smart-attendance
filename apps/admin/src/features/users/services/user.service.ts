import { userApi } from '../api/user.api';
import { CreateUserFormValues, UserFormValues } from '../schemas/user.schema';
import { UserFilters } from '../types/user.types';

export const userService = {
  getUsers: async (filters?: UserFilters) => {
    const response = await userApi.getAll(filters);
    return response;
  },

  getUserById: async (id: string) => {
    const response = await userApi.getById(id);
    return response.data;
  },

  createUser: async (data: CreateUserFormValues) => {
    const response = await userApi.create(data);
    return response.data;
  },

  updateUser: async (id: string, data: UserFormValues) => {
    const response = await userApi.update(id, data);
    return response.data;
  },

  toggleStatus: async (id: string, isActive: boolean) => {
    const response = await userApi.toggleStatus(id, isActive);
    return response.data;
  },

  updatePassword: async (id: string, password: string) => {
    const response = await userApi.updatePassword(id, password);
    return response.data;
  },

  resetPassword: async (id: string, password?: string) => {
    const response = await userApi.resetPassword(id, password);
    return response.data;
  },

  updateAdmissionId: async (id: string, data: { admissionId: string }) => {
    const response = await userApi.updateAdmissionId(id, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await userApi.delete(id);
    return response.data;
  },

  getStatistics: async () => {
    const response = await userApi.getStatistics();
    return response.data;
  },

  getOptions: async () => {
    const response = await userApi.getOptions();
    return response.data;
  },
};
