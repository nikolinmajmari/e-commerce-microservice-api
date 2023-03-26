import { Attribute } from "./attribute.entity";
import { Category } from "./category.entity";
import { Product } from "./product.entity";
import { VariantAttribute } from "./product_attribute.entity";
import { ProductType } from "./product_type.entity";
import { Variant } from "./variant.entity";
import { VariantPrice } from "./variant_price.entity";

export {Category} from "./category.entity";
export {ProductType} from "./product_type.entity";
export {Attribute} from "./attribute.entity";
export {Product} from "./product.entity";
export {VariantAttribute} from "./product_attribute.entity";
export {Variant} from "./variant.entity";
export {VariantPrice} from "./variant_price.entity";


export const EntityList = [
    Category,ProductType,Attribute,Product,VariantAttribute,
    Variant,VariantPrice
];