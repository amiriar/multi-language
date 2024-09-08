import { Test, TestingModule } from '@nestjs/testing';
import { CatrgoriesController } from './catrgories.controller';
import { CatrgoriesService } from './catrgories.service';

describe('CatrgoriesController', () => {
  let controller: CatrgoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatrgoriesController],
      providers: [CatrgoriesService],
    }).compile();

    controller = module.get<CatrgoriesController>(CatrgoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
