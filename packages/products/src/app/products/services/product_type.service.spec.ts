import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductTypeService } from './product_type.service';

describe('ProductTypeService', () => {
  let service: ProductTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductTypeService],
    }).compile();

    service = module.get<ProductTypeService>(ProductTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it("should do something",()=>{
    jest.spyOn(service,"create");
  })
});
