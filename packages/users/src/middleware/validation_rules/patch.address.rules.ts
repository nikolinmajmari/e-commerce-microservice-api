import { body } from "express-validator";
import validate from "../validate.middleware";
export default ()=>{
    return [
        body("address").isString().optional(),
        body("city").isString().optional(),
        body("postalCode").isNumeric().optional(),
        body("state").isString().optional(),
        body("primary").isBoolean().optional(),
        body("label").isString().optional(),
        validate,
    ]
}