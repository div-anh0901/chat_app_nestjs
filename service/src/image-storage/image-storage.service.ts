import { S3 } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { Services } from "src/utils/constants";
import { UploadImageParams } from "src/utils/types";
import { IImageStorage } from "./image-storage";

@Injectable()
export class ImageStorageService implements IImageStorage {
    constructor(
        @Inject(Services.SPACES_CLIENT) private readonly spacesClient: S3
    ) { }

    uploadBanner(params: UploadImageParams) {
        return this.spacesClient.putObject({
            Bucket: 'chuachat',
            Key: params.key,
            Body: params.file.buffer,
            ACL: 'public-read',
            ContentType: params.file.mimetype
        });
    }

    getBannerImage() {

    }
    uploadProfilePicture() {
        throw new Error('Method not implementd');
    }
    deleteBanner() {
        throw new Error('Method not implementd');
    }

    deleteProfilePicture() {
        throw new Error('Method not implementd')
    }
}