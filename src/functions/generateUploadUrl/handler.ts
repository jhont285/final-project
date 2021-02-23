import 'source-map-support/register';

import businessLogic from '../../businessLogic/bussinessLogicImp';
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '@libs/apiGateway';
import {getLogger} from '@libs/logger';
import {StatusCodes} from 'http-status-codes';
import {middyfy} from "@libs/lambda";

const log = getLogger();

const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId: string = event.requestContext.authorizer.principalId;
  const marketId: string = event.pathParameters.marketId;
  log.info(`Handler: generateUploadURL ${JSON.stringify({userId, marketId}, null, 4)}`);

  try {
    const result = await businessLogic.updateImage(userId, marketId);
    return formatJSONResponse(result);
  } catch (e) {
    return formatJSONResponse(e.message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

export const main = middyfy(handler);
