import { body } from "express-validator";
import uploader from "../../common/uploader";
import validate from "../validate.middleware";
import getAvatarUrlFromFile from "./get_avatar_url_from_file";
export default ()=>{
    return [
        uploader().single("avatar"),
        body("firstName").isString().optional(),
        body("lastName").isString().optional(),
        body("gender").isIn(["male","female"]).optional(),
        body("email").isEmail().optional(),
        body("permissionLevel").isIn(["Admin","User"]).optional(),
        body("phone").isMobilePhone("any").optional(),
        body("username").isString().optional(),
        body("password").isString().optional(),
        body("birthDate").isDate().optional(),
        getAvatarUrlFromFile,
        body("avatar").isString().optional(),
        body("status").isIn(["active","closed"]).optional(),
        validate
    ]
}