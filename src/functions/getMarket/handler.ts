import 'source-map-support/register';

import {formatJSONResponse} from '@libs/apiGateway';
import businessLogic from '../../businessLogic/bussinessLogicImp';
import {APIGatewayProxyHandler} from "aws-lambda";
import {getLogger} from "@libs/logger";
import {StatusCodes} from "http-status-codes";

const log = getLogger();

export const main: APIGatewayProxyHandler = async (event) => {
  const userId: string = event.requestContext.authorizer.principalId;
  const marketId: string = event.pathParameters.marketId;
  log.info(`deleteHandler: ${JSON.stringify({userId, marketId}, null, 4)}`);

  try {
    const result = await businessLogic.getById(userId, marketId);
    return formatJSONResponse(result);
  } catch (e) {
    return formatJSONResponse(e.message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}
