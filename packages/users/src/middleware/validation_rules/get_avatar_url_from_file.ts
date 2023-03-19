import { getUrl } from "../../common/uploader";

export default function (req,res,next){
    if(!req.body?.avatar){
        if(req.file){
            const file:Express.Multer.File = req.file;
            req.body.avatar = getUrl(file);
        }
    }
    next();
}