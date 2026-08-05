import { request } from '@/services/api';
import { Option } from '@/types/index';
import { CreateUserFormValues, UserFormValues } from '../schemas/user.schema';
import { User, UserFilters, UserStatistics, SingleResponse, PaginatedResponse } from '../types/user.types';

export const userApi = {
  getAll: async (params?: UserFilters) => {
    const { data } = await request<PaginatedResponse<User>>({
      url: '/users',
      method: 'GET',
      params,
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await request<SingleResponse<User>>({
      url: `/users/${id}`,
      method: 'GET',
    });
    return data;
  },

  create: async (payload: CreateUserFormValues) => {
    const { data } = await request<SingleResponse<User>>({
      url: '/users',
      method: 'POST',
      data: payload,
    });
    return data;
  },

  update: async (id: string, payload: UserFormValues) => {
    const { data } = await request<SingleResponse<User>>({
      url: `/users/${id}`,
      method: 'PATCH',
      data: payload,
    });
    return data;
  },

  toggleStatus: async (id: string, isActive: boolean) => {
    const { data } = await request<SingleResponse<User>>({
      url: `/users/${id}/status`,
      method: 'PATCH',
      data: { isActive },
    });
    return data;
  },

  updatePassword: async (id: string, password: string) => {
    const { data } = await request<SingleResponse<User>>({
      url: `/users/${id}/password`,
      method: 'PATCH',
      data: { password },
    });
    return data;
  },

  resetPassword: async (id: string, password?: string) => {
    const { data } = await request<SingleResponse<User>>({
      url: `/users/${id}/reset-password`,
      method: 'PATCH',
      data: { password },
    });
    return data;
  },

  updateAdmissionId: async (id: string, payload: { admissionId: string }) => {
    const { data } = await request<SingleResponse<User>>({
      url: `/users/${id}/admission-id`,
      method: 'PATCH',
      data: payload,
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await request<SingleResponse<User>>({
      url: `/users/${id}`,
      method: 'DELETE',
    });
    return data;
  },

  getStatistics: async () => {
    const { data } = await request<SingleResponse<{ statistics: UserStatistics }>>({
      url: '/users/statistics',
      method: 'GET',
    });
    return data;
  },

  getOptions: async () => {
    const { data } = await request<SingleResponse<Option[]>>({
      url: '/users/options',
      method: 'GET',
    });
    return data;
  },
};
