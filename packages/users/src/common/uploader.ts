import { unlink } from "fs/promises";
import multer from "multer";
import * as path from 'path';



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,"assets","images") );
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

export default function uploader(opt:multer.Options={}){
    return multer({
       storage: storage,
       ...opt,
    })
}

export  function getUrl(file:Express.Multer.File){
  return path.join(path.sep,"assets","images",file.filename)
}


export async function unlinkUploadedFile(req){
  if(req.file){
    await unlink(req.file.path);
  }
}