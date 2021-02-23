import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from '../../libs/schema/movieInput';
import businessLogic from '../../businessLogic/bussinessLogicImp';
import {getLogger} from "@libs/logger";
import {StatusCodes} from "http-status-codes";

const log = getLogger();

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const userId: string = event.requestContext.authorizer.principalId;
  const marketId: string = event.pathParameters.marketId;
  log.info(`Handlers: update ${JSON.stringify({userId, marketId}, null, 4)}`);

  try {
    const result = await businessLogic.update(event.body, userId, marketId);
    return formatJSONResponse(result);
  } catch (e) {
    return formatJSONResponse(e.message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

export const main = middyfy(handler);
