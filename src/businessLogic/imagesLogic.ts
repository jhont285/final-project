import {getLogger} from "@libs/logger";
import {UploadURL} from "@libs/models/UploadURL";
import imagesBucketImp, {ImagesBucket} from "../dataLayer/imagesBucket";

const log = getLogger();

export interface ImagesLogic {
  uploadUrl(todoId: string): UploadURL;
}

class ImagesLogicImp implements ImagesLogic {
  constructor(private readonly imageBucket: ImagesBucket = imagesBucketImp) {}

  uploadUrl(todoId: string): UploadURL {
    log.info(`uploadUrl with input todoId: ${todoId}`);
    return {
      uploadUrl: this.imageBucket.getUploadUrl(todoId),
    }
  }
}

const imagesLogic: ImagesLogic = new ImagesLogicImp();
export default imagesLogic;