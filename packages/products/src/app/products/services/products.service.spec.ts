import { EntityManager, Repository } from "typeorm";
import {ProductsService} from "./products.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product, Variant, VariantAttribute, VariantPrice } from "../entities";
import { CreateProductDto, VariantDto } from "../dto/create_product.dto";
import { createProductDto, createProductListMock, createProductMock, createProductVariant, createProductVariants, createVariantDto } from "../__mocks__/entities";

enum TestError{
    TYPEORM="TYPEORM",
    CONSTRAINT="CONSTRAINT",
    INTEGRITY="INTEGRITY",
    NOT_FOUND="NOT_FOUND"
}

describe("Products service tests",()=>{

    let service: ProductsService;
    let manager:EntityManager;
    let productRepository:Repository<Product>;
    let variantRepository:Repository<Variant>;


    let product:Product;
    let products:Product[];
    let productDto:CreateProductDto;

    let variant:Variant;
    let variants:Variant[];
    let variantDto:VariantDto;

    beforeAll(async ()=>{
        product = await createProductMock(false);
        products = await createProductListMock();
        productDto = createProductDto();
        
        variant = await createProductVariant(false);
        variants = await createProductVariants();
        variantDto = createVariantDto();
    })


    beforeEach(async ()=>{
        const module:TestingModule = await Test.createTestingModule({
            providers:[
                ProductsService,
                { provide: EntityManager,
                     useFactory: ()=>({
                        connection:{
                            createQueryRunner(){
                                return {
                                    connect:jest.fn(),
                                    startTransaction:jest.fn(),
                                    commitTransaction:jest.fn(),
                                    rollbackTransaction:jest.fn(),
                                    release:jest.fn(),
                                    manager:{
                                        save:jest.fn()
                                    }
                                }
                            }
                        }
                     })
                },
                {
                    provide: getRepositoryToken(Product),
                    useValue:{
                        find: jest.fn().mockResolvedValue(products),
                        findOneOrFail: jest.fn().mockResolvedValue(products[0]),
                        create: jest.fn().mockResolvedValue(product),
                        save: jest.fn().mockResolvedValue(products[0]),
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
                },
                {
                    provide: getRepositoryToken(VariantPrice),
                    useValue:{
                        remove: jest.fn().mockResolvedValue(true),
                    }
                },
                {
                    provide: getRepositoryToken(VariantAttribute),
                    useValue:{
                        remove: jest.fn().mockResolvedValue(true),
                    }
                }
            ]
        }).compile();
        service = module.get<ProductsService>(ProductsService);
        manager = module.get<EntityManager>(EntityManager);
        productRepository = module.get<Repository<Product>>(
            getRepositoryToken(Product)
        );
        variantRepository = module.get<Repository<Variant>>(
            getRepositoryToken(Variant)
        );

    })


    it("should be defined",()=>{
        expect(service).toBeDefined();
    });

    it("should create a new product",async()=>{
        jest.spyOn(productRepository,"create").mockResolvedValueOnce(
            products[0] as never
        )
        expect(service.create(productDto))
        .resolves.toBe(products[0]);
    });

    it("should return a list of products",async ()=>{
        expect(service.findAll({limit:1,offset:1}))
        .resolves.toBe(products)
    });

    it("should fail to return a list of products when typeorm fails",()=>{
        jest.spyOn(productRepository,"find").mockRejectedValue(
            "ERROR" as never
        );
        expect(service.findAll({limit:1,offset:1}))
        .rejects.toMatch("ERROR")
    });

    it("should find one product by id",()=>{
        expect(service.findOne(
            products[0].id
        )).resolves.toBe(products[0]);
    });

    it("should fail when quering an non existing product",()=>{
        jest.spyOn(productRepository,"findOneOrFail").mockRejectedValue("NOT_FOUND");
        expect(service.findOne(products[0].id))
        .rejects.toMatch("NOT_FOUND");
    });

    it("should fail to update product type on constraint voilation",()=>{
        jest.spyOn(productRepository,"update")
        .mockRejectedValue(TestError.CONSTRAINT);
        expect(
            service.update(products[0].id,{id:"",images:[]})
        ).rejects.toMatch(TestError.CONSTRAINT);
    });

    it("it should fail to update when product is not found",()=>{
        jest.spyOn(productRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.update("",{id:"",images:[]})
        ).rejects.toMatch(TestError.NOT_FOUND);
    });

    it("it should update product and return the updated entity",()=>{
        expect(
            service.update("",{id:"",images:[]})
        ).resolves.toBe(products[0]);
    });

    it("should fail to remove an product that does not exist",()=>{
        jest.spyOn(productRepository,"findOneOrFail").mockRejectedValue(TestError.NOT_FOUND);
        expect(
            service.remove("")
        ).rejects.toMatch(TestError.NOT_FOUND);
    });

    it("should remove an product that exists in database",()=>{
        expect(
            service.remove("")
        ).resolves.toBe(undefined);
    });

    //// variants 

    it("should return variants of a certain product",()=>{
        expect(
            service.getProductVariants("")
        ).resolves.toBe(variants);
    });

    it("should load a specific variant of a certain product",()=>{
        expect(
            service.getProductVariant("","")
        ).resolves.toBe(variants[0]);
    });

    it("add a new variant for a specific product",()=>{
        expect(
            service.addProductVariant(
                "",variantDto
            )
        ).resolves.toBe(variants[0]);
    });

    it("should fail to add a new variant if integrity constraint is voilated",()=>{
        jest.spyOn(variantRepository,"save").mockRejectedValue(
            TestError.CONSTRAINT
        );
        expect(
            service.addProductVariant("",variantDto)
        ).rejects.toMatch(TestError.CONSTRAINT);
    });

    it("should fail to add a new variant to a non existing product",()=>{
        jest.spyOn(productRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.addProductVariant("",variantDto)
        ).rejects.toMatch(TestError.NOT_FOUND);
    });

    it("updates a specific variant of a certain product",()=>{
        expect(
            service.updateProductVariant(
                "","",{id:"",images:[]}
            )
        ).resolves.toBe(variants[0]);
    });


    it("fails to update a specific variant of certain product on constraint voilation",()=>{
        jest.spyOn(variantRepository,"update").mockRejectedValue(TestError.CONSTRAINT);
        expect(
            service.updateProductVariant(
                "","",{id:"",images:[]}
            )
        ).rejects.toMatch(TestError.CONSTRAINT);
    });

    it("fails to update a specific variant of certain product on variant not found",()=>{
        jest.spyOn(variantRepository,"findOneOrFail").mockRejectedValue(TestError.NOT_FOUND);
        expect(
            service.updateProductVariant(
                "","",{id:"",images:[]}
            )
        ).rejects.toMatch(TestError.NOT_FOUND);
    });
    
    it("deletes a specific product variant",()=>{
        expect(
            service.deleteProductVariant("","")
        ).resolves.toBe(undefined);
    });


    it("fails to delete a specific product variant on constraint voilation",()=>{
        jest.spyOn(variantRepository,"remove").mockRejectedValue(TestError.INTEGRITY);
        expect(
            service.deleteProductVariant("","")
        ).rejects.toMatch(TestError.INTEGRITY);
    });

    it("fails to delete an non existing product variant",()=>{
        jest.spyOn(variantRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.deleteProductVariant("","")
        ).rejects.toMatch(TestError.NOT_FOUND);
    });

});