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
        body("birthDate").isDate().optional(),
        getAvatarUrlFromFile,
        body("avatar").isString().optional(),
        validate,
    ]
}