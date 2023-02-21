import { body } from "express-validator";
import validate from "../validate.middleware";
export default ()=>{
    return [
        body("firstName").isString().optional(),
        body("lastName").isString().optional(),
        body("gender").isIn(["male","female"]).optional(),
        body("birthDate").isDate().optional(),
        body("avatar").isString().optional(),
        validate,
    ]
}