import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from '../src/controllers/api.controller';
import { ApiService } from '../src/api.service';

describe('ApiController', () => {
  let apiController: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService],
    }).compile();

    apiController = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(apiController).toBeDefined();
  });

  describe('Status', () => {
    it('should be defined', () => {
      expect(apiController.health()).toBeDefined();
    });

    it('should return message "Server is running!"', async () => {
      expect((await apiController.health()).message).toBe('api is running');
    });
  });
});
