import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import {DataLayer} from "./dataLayer";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {getLogger} from "@libs/logger";
import {Market} from "@libs/models/Market";

class DataLayerImp implements DataLayer {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly marketTable: string = process.env.MARKET_TABLE,
    private readonly log = getLogger()) {
  }

  async getAll(userId: string): Promise<Market[]> {
    this.log.info('Getting all markets...');
    const result = await this.docClient.query({
      TableName: this.marketTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
    }).promise();

    return result.Items as Market[];
  }

  async createOrUpdate(market: Market): Promise<Market> {
    this.log.info('creating a new movie' + market.id);
    await this.docClient.put({
      TableName: this.marketTable,
      Item: market
    }).promise();

    return market;
  }

  async delete(userId: string, marketId: string): Promise<boolean> {
    this.log.info(`dataLayer: delete ${JSON.stringify({userId, marketId}, null, 4)}`);
    await this.docClient.delete({
      TableName: this.marketTable,
      Key: {userId, id: marketId},
    }).promise();

    return true;
  }

  async getById(userId: string, marketId: string): Promise<Market> {
    const result = await this.docClient.get({
      TableName: this.marketTable,
      Key: {userId, id: marketId},
    }).promise();

    return result.Item as Market;
  }
}

function createDynamoDBClient() {
  const XAWS = AWSXRay.captureAWS(AWS);
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}

const dataLayer: DataLayer = new DataLayerImp();
export default dataLayer;