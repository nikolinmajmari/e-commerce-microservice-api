
import { body } from "express-validator";
import validate from "../validate.middleware";
export default function (){
    return [
        body("firstName").isString(),
        body("lastName").isString(),
        body("gender").isIn(["male","female"]),
        body("email").isEmail(),
        body("permissionLevel").isIn(["Admin","User"]).optional(),
        body("phone").isMobilePhone("any"),
        body("username").isString(),
        body("password").isString(),
        body("birthDate").isDate(),
        body("avatar").isString(),
        body("addresses").isArray(),
        validate
    ]
}