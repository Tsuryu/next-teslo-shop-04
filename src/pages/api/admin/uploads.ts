/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';
// import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return uploadFile(req, res);
    default:
      res.status(501).json({ message: 'Not implemented yet' });
  }
}

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imagePath = await parseFiles(req);

  res.status(200).json({ message: imagePath });
};

const saveFile = async (file: formidable.File): Promise<string> => {
  // file system
  //   const data = fs.readFileSync(file.filepath);
  //   fs.writeFileSync(`./public/uploads/${file.originalFilename}`, data);
  //   fs.unlinkSync(file.filepath);

  // cloudinary
  const { url } = await cloudinary.uploader.upload((file as formidable.File).filepath);
  return url;
};

const parseFiles = (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      const secureUrl = await saveFile(files.file as formidable.File);
      resolve(secureUrl);
    });
  });
};

export const config = {
  api: {
    bodyParser: false
  }
};
