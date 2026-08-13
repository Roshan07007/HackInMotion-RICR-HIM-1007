export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: PaginationMetadata;
}

export const getPagination = <T>(
  data: T,
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const hasMore = page * limit < total;
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      hasMore,
    },
  };
};
