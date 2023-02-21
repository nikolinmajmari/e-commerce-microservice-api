import { body } from "express-validator";
import validatorMiddleware from "../validate.middleware";
export default ()=>{
    return [
        body("address").isString(),
        body("city").isString(),
        body("postalCode").isNumeric(),
        body("state").isString(),
        body("primary").isBoolean().optional(),
        body("label").isString(),
        validatorMiddleware
    ]
};