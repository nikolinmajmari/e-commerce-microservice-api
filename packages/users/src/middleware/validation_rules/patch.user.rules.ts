import { body } from "express-validator";
import validate from "../validate.middleware";
export default ()=>{
    return [
        body("firstName").isString().optional(),
        body("lastName").isString().optional(),
        body("gender").isIn(["male","female"]).optional(),
        body("email").isEmail().optional(),
        body("permissionLevel").isIn(["Admin","User"]).optional(),
        body("phone").isMobilePhone("any").optional(),
        body("username").isString().optional(),
        body("password").isString().optional(),
        body("birthDate").isDate().optional(),
        body("avatar").isString().optional(),
        body("status").isIn(["active","closed"]).optional(),
        validate
    ]
}