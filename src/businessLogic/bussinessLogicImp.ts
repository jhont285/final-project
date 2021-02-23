import dataLayerImp from "../dataLayer/dataLayerImp";
import imagesLogicImp, {ImagesLogic} from "./imagesLogic";
import {BusinessLogic} from "./businessLogic";
import {DataLayer} from "../dataLayer/dataLayer";
import {getLogger} from "@libs/logger";
import {getReasonPhrase, StatusCodes} from "http-status-codes";
import {Market, MarketInput} from "@libs/models/Market";
import {UploadURL} from "@libs/models/UploadURL";
import {v4 as uuidv4} from 'uuid';

class BusinessLogicImp implements BusinessLogic {
  constructor(
    private readonly dataLayer: DataLayer = dataLayerImp,
    private readonly imagesLogic: ImagesLogic = imagesLogicImp,
    private readonly bucketName: string = process.env.IMAGES_S3_BUCKET,
    private readonly log = getLogger()) {
  }

  async create(market: MarketInput, userId: string): Promise<Market> {
    this.log.info(`BusinessLogicImp: creating new logic ${JSON.stringify({market, userId}, null, 4)}`);
    const timestamp = new Date().toISOString();

    return this.dataLayer.createOrUpdate({
      id: uuidv4(),
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      done: false,
      ...market,
    });
  }

  getAll(userId: string): Promise<Market[]> {
    this.log.info(`BusinessLogicImp: getAll with user ${userId}`);
    return this.dataLayer.getAll(userId);
  }

  async update(market: MarketInput, userId: string, marketId: string): Promise<Market> {
    this.log.info(`BusinessLogicImp: update with ${JSON.stringify({userId, marketId}, null, 4)}`);
    const marketItem = await this.validate(userId, marketId);
    marketItem.updatedAt = new Date().toISOString();

    return this.dataLayer.createOrUpdate({
      ...marketItem,
      ...market,
    });
  }

  async delete(userId: string, marketId: string): Promise<boolean> {
    this.log.info(`BusinessLogicImp: delete ${JSON.stringify({userId, marketId}, null, 4)}`);
    await this.validate(userId, marketId);
    return this.dataLayer.delete(userId, marketId);
  }

  async getById(userId: string, marketId: string): Promise<Market> {
    this.log.info(`BusinessLogicImp: getById ${JSON.stringify({userId, marketId}, null, 4)}`);
    const marketItem = await this.dataLayer.getById(userId, marketId);
    if (!marketItem) {
      throw new Error(getReasonPhrase(StatusCodes.NO_CONTENT));
    }
    return marketItem;
  }

  async updateImage(userId: string, marketId: string): Promise<UploadURL> {
    const marketItem = await this.validate(userId, marketId);
    const result = this.imagesLogic.uploadUrl(marketId);
    marketItem.invoice = `https://${this.bucketName}.s3.amazonaws.com/${marketId}`;
    await this.update(marketItem, userId, marketId);
    return result;
  }

  private async validate(userId: string, marketId: string): Promise<Market> {
    const marketItem = await this.getById(userId, marketId);
    if (marketItem.userId !== userId) {
      throw new Error(getReasonPhrase(StatusCodes.FORBIDDEN));
    }
    return marketItem;
  }
}

const businessLogic: BusinessLogic = new BusinessLogicImp();
export default businessLogic;