
import  debug  from "debug";
import { body } from "express-validator";
import path from "path";
import uploader, { getUrl, unlinkUploadedFile } from "../../common/uploader";
import validate from "../validate.middleware";
import getAvatarUrlFromFile from "./get_avatar_url_from_file";
const log = debug("app:validator");
export default function (){
    return [
        uploader().single("avatar"),
        body("firstName").isString(),
        body("lastName").isString(),
        body("gender").isIn(["male","female"]),
        body("email").isEmail(),
        body("permissionLevel").isIn(["Admin","User"]).optional(),
        body("phone").isMobilePhone("any"),
        body("username").isString(),
        body("password").isString(),
        body("birthDate").isDate(),
        body("addresses").isArray().optional(),
        getAvatarUrlFromFile,
        body("avatar").isString().withMessage("please add an avatar, as url or as file"),
        validate,
    ]
}
