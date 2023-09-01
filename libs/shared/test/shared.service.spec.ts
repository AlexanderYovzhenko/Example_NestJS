import { Test, TestingModule } from '@nestjs/testing';
import { SharedService } from '../src/services/shared.service';

describe('SharedService', () => {
  let sharedService: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedService],
    }).compile();

    sharedService = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(sharedService).toBeDefined();
  });
});
