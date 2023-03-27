import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Attribute, ProductType } from '../entities';
import { ProductTypeService } from './product_type.service';
import {createAttributeMock,createAttributeMocks, createProductsTypeMocks, createProductTypeDtoMock, createProductTypeMock} from "../__mocks__/entities";
import { Repository } from 'typeorm';

describe("ProductTypeService tests",()=>{
  let service: ProductTypeService;
  let repo : Repository<ProductType>;
  let attrRepo:Repository<Attribute>;
  let attributes;
  let types:ProductType[] ;
  let type;
  let typeDto;
  let attribute;

  const initializeMock=async ()=>{
    attributes = await createAttributeMocks();
    attribute = await createAttributeMock(false);
    types = await createProductsTypeMocks();
    type = await createProductTypeMock(false);
    typeDto = await createProductTypeDtoMock();
  }

  describe('Should perform action without error', () => {
    beforeEach(async () => {
      await initializeMock();
      console.log("attributes");
      console.log(await types[0].attributes);
      console.log(await types[0].attributes);
      console.log("-------------");
      const module: TestingModule = await Test.createTestingModule({
        providers: [ProductTypeService,
          {
            provide:getRepositoryToken(ProductType),
            useValue:{
              find: jest.fn().mockResolvedValue(types),
              findOneOrFail: jest.fn().mockResolvedValue(types[0]),
              create: jest.fn().mockReturnValue(type),
              save: jest.fn().mockReturnValue(types[0]),
              update: jest.fn().mockResolvedValue(true),
              remove: jest.fn().mockResolvedValue(true),
            }
          },
          {
            provide:getRepositoryToken(Attribute),
            useValue:{
              find: jest.fn().mockResolvedValue(attributes),
              findOneOrFail: jest.fn().mockResolvedValue(attributes[0]),
              findOneByOrFail: jest.fn().mockResolvedValue(attributes[0]),
              create: jest.fn().mockReturnValue(attribute),
              save: jest.fn().mockReturnValue(attributes[0]),
              update: jest.fn().mockResolvedValue(true),
              remove: jest.fn().mockResolvedValue(true),
            }
          }
        ],
      }).compile();

      service = module.get<ProductTypeService>(ProductTypeService);
      repo = module.get<Repository<ProductType>>(getRepositoryToken(ProductType));
      attrRepo = module.get<Repository<Attribute>>(getRepositoryToken(Attribute));
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it("should create and save product type",async ()=>{
      expect((service.create(typeDto))).resolves.toBe(types[0]);
    });

    it("should return a list of product types",async ()=>{
      expect((service.findAll({limit:10,offset:0}))).resolves.toBe(types);
    })

    it("should return specified product type by id",async ()=>{
      expect(service.findOne(types[0].id)).resolves.toBe(types[0]);
    });
    
    it("should update product type",async ()=>{
      expect(service.update(types[0].id,{id:type.id,name:"updated"})).resolves.toBe(types[0]);
    })

    it("should delete product type from database ",async ()=>{
      expect(service.remove(type.id)).resolves.toBe(undefined);
    })

    // it("should return a list of attributes for specific product id ",async ()=>{
    //   expect(service.getAttributes(types[0].id))
    //   .resolves.toBe(attributes);
    // });

    it("should return a specific attribute of product id ",async ()=>{
      expect(service.getAttribute(types[0].id,attributes[0].id))
    .resolves.toBe(attributes[0]);
  });

    it("should update attribute of certain product",async ()=>{
      expect(
        service.updateAttribute(types[0].id,attributes[0].id,{id:"",name:"name"})
      ).resolves.toBe(attributes[0]);
    });

    it("should remove certain attribute of product",async ()=>{
      expect(
        service.removeAttribute(types[0].id,attributes[0].id)
      ).resolves.toBe(undefined);
    });
  });

  describe("should reject operation with error",()=>{
    beforeEach(async ()=>{
      await initializeMock();
      const module:TestingModule = await Test.createTestingModule({
        providers:[ProductTypeService,{
          provide:getRepositoryToken(ProductType),
          useValue:{
            find: jest.fn().mockRejectedValue("TYPEORM"),
            findOneOrFail: jest.fn().mockRejectedValue("NOT_FOUND"),
            create: jest.fn().mockReturnValue(type),
            save: jest.fn().mockRejectedValue("CONSTRAINT"),
            update: jest.fn().mockRejectedValue("CONSTRAINT"),
            remove: jest.fn().mockRejectedValue("INTEGRITY")
          }
        },
        {
          provide:getRepositoryToken(Attribute),
          useValue:{
            find: jest.fn().mockRejectedValue("TYPEORM"),
            findOneOrFail: jest.fn().mockRejectedValue("NOT_FOUND"),
            findOneByOrFail: jest.fn().mockRejectedValue("NOT_FOUND"),
            create: jest.fn().mockReturnValue(attribute),
            save: jest.fn().mockRejectedValue("CONSTRAINT"),
            update: jest.fn().mockRejectedValue("CONSTRAINT"),
            remove: jest.fn().mockRejectedValue("INTEGRITY")
          }
        }
        ]
      }).compile();
      service = module.get<ProductTypeService>(ProductTypeService);
      repo = module.get<Repository<ProductType>>(getRepositoryToken(ProductType));
      attrRepo = module.get<Repository<Attribute>>(getRepositoryToken(Attribute));
    });

    it("should fail to list on typeorm error",async ()=>{
      expect(
        service.findAll({limit:1,offset:1})
      ).rejects.toMatch("TYPEORM");
    });

    it("should fail to return a non existing product with a specific id`2",async ()=>{
      expect(
        service.findOne(types[0].id)
      ).rejects.toMatch("NOT_FOUND");
    });

    it("should fail to create when constraint error happens", async ()=>{
      expect(
        service.create(typeDto)
      ).rejects.toMatch("CONSTRAINT");
    });

    it("should fail to update on constraint voilation exception",async ()=>{
      expect(
        service.update(type.id,{id:""})
      ).rejects.toMatch("CONSTRAINT");
    });

    it("should fail to update when product with spec id is not found",async ()=>{
      jest.spyOn(repo,"update").mockResolvedValueOnce({generatedMaps:[],affected:0,raw:{}});
      expect(
        service.update(types[0].id,{name:"name",id:types[0].id})
      ).rejects.toMatch("NOT_FOUND");
    });

    it("should fail to delete when foregin integrity voilation error is thrown",async ()=>{
      jest.spyOn(repo,"findOneOrFail").mockImplementationOnce(async ()=>types[0]);
      expect(service.remove(type.id)).rejects.toMatch("INTEGRITY");
    });

    it("should fail to delete when product is not found",async ()=>{
      expect(service.remove(type.id)).rejects.toMatch("NOT_FOUND");
    });

    it("should throw not found when requesting attributes of a non existing product",async()=>{
      expect(service.getAttributes(type.id)).rejects.toMatch("NOT_FOUND");
    });

    it("should throw not found when requesting non existing attribute",async ()=>{
      expect(
        service.getAttribute(type.id,attribute.id)
      ).rejects.toMatch("NOT_FOUND");
    });


    it("should not update and throw an exception when constraints are voilated",async ()=>{
      expect(
        service.updateAttribute(type.id,attribute.id,{name:"name",id:""})
      ).rejects.toMatch("CONSTRAINT");
    });

    it("should throw not found when updating an non existing attribute",async ()=>{
      jest.spyOn(attrRepo,"update").mockImplementationOnce(async ()=>({generatedMaps:[],raw:{},affected:0}));
      expect(
        service.updateAttribute(types[0].id,attributes[0].id,{"name":"name",id:attributes[0].id})
      ).rejects.toMatch("NOT_FOUND");
    });

    it("should throw not found when deleting an non existing attribute",async()=>{
      expect(
        service.removeAttribute(types[0].id,attributes[0].id)
      ).rejects.toMatch("NOT_FOUND");
    });

    it("should not delete an attribute if integrity constraint voilates",async ()=>{
      jest.spyOn(attrRepo,"findOneByOrFail").mockImplementation(()=>attribute);
      jest.spyOn(attrRepo,"remove").mockRejectedValue("INTEGRITY");
      expect(
        service.removeAttribute(type.id,attribute)
      ).rejects.toMatch("INTEGRITY");

    });
  });

});