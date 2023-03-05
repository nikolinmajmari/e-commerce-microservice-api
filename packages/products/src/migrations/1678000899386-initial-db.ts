import { MigrationInterface, QueryRunner } from "typeorm";

export class initialDb1678000899386 implements MigrationInterface {
    name = 'initialDb1678000899386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."attribute_type_enum" AS ENUM('FLOAT', 'INT', 'TEXT')`);
        await queryRunner.query(`CREATE TABLE "attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."attribute_type_enum" NOT NULL, "searchable" boolean NOT NULL DEFAULT true, "required" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productTypeId" uuid, CONSTRAINT "UQ_350fb4f7eb87e4c7d35c97a9828" UNIQUE ("name"), CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8978484a9cee7a0c780cd259b88" UNIQUE ("name"), CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "variant_price" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL DEFAULT '0', "currency" "public"."variant_price_currency_enum" NOT NULL, "active" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "variantId" uuid, CONSTRAINT "PK_5c298d82c010a5e80528f0ee9d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "title" character varying NOT NULL, "images" text array NOT NULL, "stock" integer NOT NULL DEFAULT '0', "weight" integer NOT NULL, "weight_unit" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('active', 'inActive')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" "public"."product_status_enum" NOT NULL, "tags" text array, "images" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "typeId" uuid, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(256) NOT NULL, "unit" character varying(256) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributeId" uuid, "productId" uuid, CONSTRAINT "PK_f9b91f38df3dbbe481d9e056e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_categories_category" ("productId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_17f2a361443184000ee8d79f240" PRIMARY KEY ("productId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_342d06dd0583aafc156e076379" ON "product_categories_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_15520e638eb4c46c4fb2c61c4b" ON "product_categories_category" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "category_products_product" ("categoryId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_0b4e34a45516284987c6dbe91cd" PRIMARY KEY ("categoryId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_90d521137ff8c3e927187bcd27" ON "category_products_product" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ee240b247f9f23e5d35854c186" ON "category_products_product" ("productId") `);
        await queryRunner.query(`ALTER TABLE "attribute" ADD CONSTRAINT "FK_985e92fcc5b8c7f4e44e52f5ecc" FOREIGN KEY ("productTypeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant_price" ADD CONSTRAINT "FK_17248de95c09950bef67550e36f" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_53bafe3ecc25867776c07c9e666" FOREIGN KEY ("typeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_c0d597555330c0a972122bf4673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_342d06dd0583aafc156e0763790" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_products_product" ADD CONSTRAINT "FK_90d521137ff8c3e927187bcd27d" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_products_product" ADD CONSTRAINT "FK_ee240b247f9f23e5d35854c186b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_products_product" DROP CONSTRAINT "FK_ee240b247f9f23e5d35854c186b"`);
        await queryRunner.query(`ALTER TABLE "category_products_product" DROP CONSTRAINT "FK_90d521137ff8c3e927187bcd27d"`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4"`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_342d06dd0583aafc156e0763790"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_c0d597555330c0a972122bf4673"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_53bafe3ecc25867776c07c9e666"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`);
        await queryRunner.query(`ALTER TABLE "variant_price" DROP CONSTRAINT "FK_17248de95c09950bef67550e36f"`);
        await queryRunner.query(`ALTER TABLE "attribute" DROP CONSTRAINT "FK_985e92fcc5b8c7f4e44e52f5ecc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee240b247f9f23e5d35854c186"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90d521137ff8c3e927187bcd27"`);
        await queryRunner.query(`DROP TABLE "category_products_product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15520e638eb4c46c4fb2c61c4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_342d06dd0583aafc156e076379"`);
        await queryRunner.query(`DROP TABLE "product_categories_category"`);
        await queryRunner.query(`DROP TABLE "product_attribute"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
        await queryRunner.query(`DROP TABLE "variant"`);
        await queryRunner.query(`DROP TABLE "variant_price"`);
        await queryRunner.query(`DROP TABLE "product_type"`);
        await queryRunner.query(`DROP TABLE "attribute"`);
        await queryRunner.query(`DROP TYPE "public"."attribute_type_enum"`);
    }

}
