export type SortOrder = "asc" | "desc";

export interface QueryOptions {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: SortOrder;
  isActive?: boolean;
}
