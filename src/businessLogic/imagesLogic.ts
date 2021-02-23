import {getLogger} from "@libs/logger";
import {UploadURL} from "@libs/models/UploadURL";
import imagesBucketImp, {ImagesBucket} from "../dataLayer/imagesBucket";

const log = getLogger();

export interface ImagesLogic {
  uploadUrl(todoId: string): UploadURL;
}

class ImagesLogicImp implements ImagesLogic {
  constructor(private readonly imageBucket: ImagesBucket = imagesBucketImp) {}

  uploadUrl(marketId: string): UploadURL {
    log.info(`uploadUrl with input todoId: ${marketId}`);
    return {
      uploadUrl: this.imageBucket.getUploadUrl(marketId),
    }
  }
}

const imagesLogic: ImagesLogic = new ImagesLogicImp();
export default imagesLogic;