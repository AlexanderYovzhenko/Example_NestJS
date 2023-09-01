const categoryDbStub = () => {
  return {
    id: 1,
    value: 'it',
    is_news: false,
  };
};

const publicationDbStub = () => {
  return {
    id: 1,
    title: 'title',
    content: 'content',
    preview: 'link',
    is_hidden: false,
    user_id: 1,
    category_id: 1,
  };
};

const queryLimitOffsetCategoryStub = () => {
  return {
    limit: 50,
    offset: 0,
    is_news: false,
    is_hidden: false,
    is_first_new: false,
    categories: ['it'],
    author: 'nickname',
  };
};

const querySearchCategoryStub = () => {
  return {
    search: 'title',
    is_news: false,
    is_hidden: false,
    is_first_new: false,
    categories: ['it'],
    author: 'nickname',
  };
};

export {
  categoryDbStub,
  publicationDbStub,
  queryLimitOffsetCategoryStub,
  querySearchCategoryStub,
};
