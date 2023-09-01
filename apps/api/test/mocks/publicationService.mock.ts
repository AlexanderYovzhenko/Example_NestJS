import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { categoryDbStub, publicationDbStub } from '../stubs';

export const publicationServiceMock: Partial<ClientProxy> = {
  send: jest.fn().mockImplementation((queue, data) => {
    switch (queue.cmd) {
      case 'add_category':
        return data.category.value === categoryDbStub().value
          ? of('category_exists')
          : of(categoryDbStub());
      case 'get_all_categories':
        return of({ count: 5, rows: [categoryDbStub()] });
      case 'add_publication':
        return data.publication.category_id === publicationDbStub().category_id
          ? of(publicationDbStub())
          : of('category_not_found');
      case 'get_publication':
        return data.id === publicationDbStub().id
          ? of(publicationDbStub())
          : of(null);
      case 'get_all_publications':
        return of({ count: 5, rows: [publicationDbStub()] });
      case 'search_publications':
        return of({ count: 5, rows: [publicationDbStub()] });
      case 'update_publication':
        return data.user_id !== publicationDbStub().user_id
          ? of('forbidden')
          : data.publication.id === publicationDbStub().id
          ? of(publicationDbStub())
          : of(null);
      case 'delete_publication':
        return data.user_id !== publicationDbStub().user_id
          ? of('forbidden')
          : data.publication_id === publicationDbStub().id
          ? of(publicationDbStub())
          : of(null);
      default:
        return of(publicationDbStub());
    }
  }),
};
