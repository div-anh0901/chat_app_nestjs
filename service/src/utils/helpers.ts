import *  as  bcrypt from 'bcrypt';
import { AuthenticatedRequest } from './types';
import { Response, Request, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export async function hashPassword(rawPassword: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashedPassword: string) {
    return bcrypt.compare(rawPassword, hashedPassword);
}

export function isAuthorized(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user) next();
    else throw new HttpException('Forbiddin', HttpStatus.BAD_REQUEST);

}

export class UploadClass {
    static customFileName(req, file, cb) {
        let customFile = file.originalname.split(".")[0];
        customFile = uuidv4();
        let fileException = "";
        if (file.mimetype.indexOf('jpeg') > -1) {
            fileException = ".jpeg";
        }
        if (file.mimetype.indexOf('png') > -1) {
            fileException = '.png';
        }
        if (file.mimetype.indexOf('webp') > -1) {
            fileException = '.webp';
        }

        customFile = customFile + fileException;
        cb(null, customFile);
    }

    static filePath(req, file, cb) {
        cb(null, "./uploads/")
    }
    static filePathAttachemnt(req, file, cb) {
        cb(null, "./uploads/attachments")
    }
}

export const generateUUIDV4 = () => uuidv4()