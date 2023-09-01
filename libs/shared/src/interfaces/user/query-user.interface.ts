interface QueryLimitOffsetRole {
  limit: number;
  offset: number;
  role: string;
}

interface QuerySearchRole {
  search: string;
  role: string;
}

export { QueryLimitOffsetRole, QuerySearchRole };
