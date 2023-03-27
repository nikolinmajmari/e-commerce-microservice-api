import { EntityManager, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import {Variant, VariantPrice } from "../entities";
import { VariantDto, VariantPriceDto } from "../dto/create_product.dto";
import {  createProductVariants, createVariantDto, createVariantPrice, createVariantPriceDto, createVariantPrices } from "../__mocks__/entities";
import { VariantPriceService } from "./variant_prices.service";

enum TestError{
    TYPEORM="TYPEORM",
    CONSTRAINT="CONSTRAINT",
    INTEGRITY="INTEGRITY",
    NOT_FOUND="NOT_FOUND"
}

describe("Products service tests",()=>{

    let service: VariantPriceService;
    let variantRepository:Repository<Variant>;
    let variantPriceRepository:Repository<VariantPrice>;


    let variant:Variant;
    let variants:Variant[];
    let variantDto:VariantDto;



    let variantPrice:VariantPrice;
    let variantPrices:VariantPrice[];
    let variantPriceDto: VariantPriceDto;

    beforeAll(async ()=>{
        variants = await createProductVariants();
        variantDto = createVariantDto();

        variantPrice = await createVariantPrice(false);
        variantPrices = await createVariantPrices();
        variantPriceDto = createVariantPriceDto();
    })


    beforeEach(async ()=>{
        const module:TestingModule = await Test.createTestingModule({
            providers:[
                VariantPriceService,
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
                        find: jest.fn().mockResolvedValue(variantPrices),
                        findOneOrFail: jest.fn().mockResolvedValue(variantPrices[0]),
                        create: jest.fn().mockResolvedValue(variantPrice),
                        save: jest.fn().mockResolvedValue(variantPrices[0]),
                        update: jest.fn().mockResolvedValue(true),
                        remove: jest.fn().mockResolvedValue(true),
                    }
                }
        
            ]
        }).compile();
        service = module.get<VariantPriceService>(VariantPriceService);
        variantRepository = module.get<Repository<Variant>>(
            getRepositoryToken(Variant)
        );
        variantPriceRepository = module.get<Repository<VariantPrice>>(
            getRepositoryToken(VariantPrice)
        );

    })


    it("should be defined",()=>{
        expect(service).toBeDefined();
    });


    it("should query prices of a certain variant",async ()=>{
        expect(
            service.getVariantPrices("")
        ).resolves.toBe(await variants[0].prices)
    });


    it("should return not found if variant does not exists",()=>{
        jest.spyOn(variantRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.getVariantPrices("")
        ).rejects.toMatch(TestError.NOT_FOUND);
    });

    it("should add a price for a specific variant",()=>{
        expect(
            service.addVariantPrice("",variantPriceDto)
        ).resolves.toBe(variantPrices[0]);
    });

    it("should fail to add variant price on db error",()=>{
        jest.spyOn(variantPriceRepository,"save").mockRejectedValue(
            TestError.TYPEORM
        );
        expect(
            service.addVariantPrice("",variantPriceDto)
        ).rejects.toMatch(TestError.TYPEORM);
    });

    it("should fail to add variant price on non existing variant",()=>{
        jest.spyOn(variantRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.addVariantPrice("",variantPriceDto)
        ).rejects.toMatch(TestError.NOT_FOUND);
    })

    it("should update a specific price of a certain variant",()=>{
        expect(
            service.updateVariantPrice(
                "","",{id: "",active: true}
            )
        ).resolves.toBe(variantPrices[0]);
    });

    it("should fail to update a non existing variant price",()=>{
        jest.spyOn(variantPriceRepository,"findOneOrFail").mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(
            service.updateVariantPrice(
                "","",{id: "",active: true}
            )
        ).rejects.toMatch(TestError.NOT_FOUND);
    });


    it("should fail to update via wrong format data",()=>{
        jest.spyOn(variantPriceRepository,"update").mockRejectedValue(
            TestError.TYPEORM
        );
        expect(
            service.updateVariantPrice(
                "","",{id: "",active: true}
            )
        ).rejects.toMatch(TestError.TYPEORM);
    });


    it("should delete a specific variant price",()=>{
        expect(
            service.deleteVariantPrice("","")
        ).resolves.toBe(undefined);
    });


    it("should fail to delete a non existing variant price",()=>{
        jest.spyOn(variantPriceRepository,'findOneOrFail').mockRejectedValue(
            TestError.NOT_FOUND
        );
        expect(service.deleteVariantPrice("",""))
        .rejects.toMatch(TestError.NOT_FOUND);
    })


});