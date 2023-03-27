import { EntityManager, Repository } from "typeorm";
import {VariantAttributeService} from "./variant_attributes.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Attribute, Product, Variant, VariantAttribute, VariantPrice } from "../entities";
import { CreateProductDto, VariantDto } from "../dto/create_product.dto";
import { createAttributeMock, createProductDto, createProductListMock, createProductMock, createProductVariant, createProductVariants, createVariantAttribute, createVariantAttributeDto, createVariantAttributes, createVariantDto } from "../__mocks__/entities";
import { ProductTypeService } from "./product_type.service";
import { CreateVariantAttribute } from "../dto/variant_attribute.create.dto";

enum TestError{
    TYPEORM="TYPEORM",
    CONSTRAINT="CONSTRAINT",
    INTEGRITY="INTEGRITY",
    NOT_FOUND="NOT_FOUND"
}

describe("Products service tests",()=>{

    let service: VariantAttributeService;
    let manager:EntityManager;
    let variantRepository:Repository<Variant>;
    let variantAttributeRepository:Repository<VariantAttribute>;
    let productTypeService: ProductTypeService;


    let variant:Variant;
    let variants:Variant[];
    let variantDto:VariantDto;

    let queryRunner;


    let variantAttribute:VariantAttribute;
    let variantAttributes:VariantAttribute[];
    let variantAttributeDto: CreateVariantAttribute;

    let attribute:Attribute;

    beforeAll(async ()=>{
        variants = await createProductVariants();
        variantDto = createVariantDto();
        attribute = await createAttributeMock(true);

        variantAttribute = await createVariantAttribute(false);
        variantAttributes = await createVariantAttributes();
        variantAttributeDto = createVariantAttributeDto();
    })


    beforeEach(async ()=>{
        queryRunner = {
            connect:jest.fn(),
            startTransaction:jest.fn(),
            commitTransaction:jest.fn(),
            rollbackTransaction:jest.fn(),
            release:jest.fn(),
            manager:{
                save:jest.fn()
            }
        };
        const module:TestingModule = await Test.createTestingModule({
            providers:[
                VariantAttributeService,
                { provide: EntityManager,
                     useFactory: ()=>({
                        connection:{
                            createQueryRunner(){
                                return queryRunner;
                            }
                        }
                     })
                },
                {
                    provide: ProductTypeService,
                    useValue:{
                        getAttribute:jest.fn().mockResolvedValue(attribute)
                    }
                },
                {
                    provide: getRepositoryToken(VariantAttribute),
                    useValue:{
                        find: jest.fn().mockResolvedValue(variantAttributes),
                        findOneOrFail: jest.fn().mockResolvedValue(variantAttributes[0]),
                        create: jest.fn().mockResolvedValue(variantAttribute),
                        save: jest.fn().mockResolvedValue(variantAttributes[0]),
                        update: jest.fn().mockResolvedValue(true),
                        remove: jest.fn().mockResolvedValue(true),
                    }
                },
                {
                    provide: getRepositoryToken(Variant),
                    useValue:{
                        find: jest.fn().mockResolvedValue(variants),
                        findOneOrFail: jest.fn().mockResolvedValue(variants[0]),
                        create: jest.fn().mockResolvedValue(variant),
                        save: jest.fn().mockResolvedValue(variants[0]),
                        update: jest.fn().mockResolvedValue(true),
                        remove: jest.fn().mockResolvedValue(true),
                    }
                }
        
            ]
        }).compile();
        service = module.get<VariantAttributeService>(VariantAttributeService);
        manager = module.get<EntityManager>(EntityManager);
        variantRepository = module.get<Repository<Variant>>(
            getRepositoryToken(Variant)
        );
        variantAttributeRepository = module.get<Repository<VariantAttribute>>(
            getRepositoryToken(VariantAttribute)
        );
        productTypeService = module.get<ProductTypeService>(ProductTypeService);

    })


    it("should be defined",()=>{
        expect(service).toBeDefined();
    });


    it("should return attributes of specified variant",()=>{
        expect(
            service.getVariantAttributes("")
        ).resolves.toBe(variantAttributes);
    });


    it("should add an attribute to a specified variant",()=>{
        expect(
            service.addVariantAttribute(
                "",variantAttributeDto
            )
        ).resolves.toBe(variantAttributes[0]);
    });

    it("should fail to add an attribute to a specified variant on constraint voilation exception",()=>{
        jest.spyOn(variantAttributeRepository,"save").mockRejectedValue(
            TestError.CONSTRAINT
        );
        expect(
            service.addVariantAttribute("",variantAttributeDto)
        ).rejects.toMatch(TestError.CONSTRAINT);
    });


    it("should fail to add an atribute is transaction can not be committed",()=>{
        jest.spyOn(queryRunner,"commitTransaction").mockRejectedValue(
            TestError.CONSTRAINT
        );
        expect(
            service.addVariantAttribute("",variantAttributeDto)
        ).rejects.toMatch(TestError.CONSTRAINT);
    });

    it("should fail to add an attribute if variant is not found",()=>{
        jest.spyOn(variantRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.addVariantAttribute("",variantAttributeDto)
        ).rejects.toMatch(TestError.NOT_FOUND);
    });


    it("should update variant attributes",()=>{
        expect(
            service.updateVariantAttribute("","",{id:"",unit:""})
        ).resolves.toBe(variantAttributes[0])
    });


    it("should fail to update an non existing variant attribute",()=>{
        jest.spyOn(variantAttributeRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.updateVariantAttribute("","",{id:"",unit:""})
        ).rejects.toMatch(TestError.NOT_FOUND);
    })

    it("should fail to update an non existing variant attribute",()=>{
        jest.spyOn(variantAttributeRepository,"update").mockRejectedValue(
            TestError.CONSTRAINT
        );
        expect(
            service.updateVariantAttribute("","",{id:"",unit:""})
        ).rejects.toMatch(TestError.CONSTRAINT);
    });

    it("should delete an existing attribute of a variant",()=>{
        expect(
            service.deleteVariantAttribute("","")
        ).resolves.toBe(undefined);
    });

    it("should fail to delete an non existing variant attribute",()=>{
        jest.spyOn(variantAttributeRepository,"findOneOrFail")
        .mockRejectedValue(TestError.NOT_FOUND);
        expect(
            service.deleteVariantAttribute("","")
        ).rejects.toMatch(TestError.NOT_FOUND);
    })

});