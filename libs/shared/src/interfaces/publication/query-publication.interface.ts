interface QueryLimitOffsetCategory {
  limit: number;
  offset: number;
  is_news: boolean;
  is_hidden: boolean;
  is_first_new: boolean;
  categories: string[];
  author: string;
}

interface QuerySearchCategory {
  search: string;
  is_news: boolean;
  is_hidden: boolean;
  is_first_new: boolean;
  categories: string[];
  author: string;
}

export { QueryLimitOffsetCategory, QuerySearchCategory };
