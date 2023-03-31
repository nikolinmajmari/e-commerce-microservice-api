import { ProductsLogGroup } from "@repo/app-event-emitter";
import { createActionLog } from "./base.events";


export function createProductAction(req){
    return createActionLog(
        ProductsLogGroup.PRODUCT_CREATED,
        req,"A product was created!"
    )
}

export function deleteProductAction(req){
    return createActionLog(
        ProductsLogGroup.PRODUCT_DELETED,
        req,"A product was deleted!"
    )
}

export function updateProductAction(req){
    return createActionLog(
        ProductsLogGroup.PRODUCT_UPDATED,
        req,"A product was updated!"
    )
}

export function createProductVariantAction(req){
    return createActionLog(
        ProductsLogGroup.PRODUCT_VARIANT_CREATED,
        req,"A product variant was created!"
    )
}

export function uodateProductVariantAction(req){
    return createActionLog(
        ProductsLogGroup.PRODUCT_VARIANT_UPDATED,
        req,"A product variant was updated!"
    )
}