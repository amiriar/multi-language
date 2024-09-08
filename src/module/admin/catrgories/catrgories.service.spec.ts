import { Test, TestingModule } from '@nestjs/testing';
import { CatrgoriesService } from './catrgories.service';

describe('CatrgoriesService', () => {
  let service: CatrgoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatrgoriesService],
    }).compile();

    service = module.get<CatrgoriesService>(CatrgoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
