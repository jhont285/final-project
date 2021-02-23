import 'source-map-support/register';

import businessLogic from '../../businessLogic/bussinessLogicImp';
import schema from '../../libs/schema/movieInput';
import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {getLogger} from "@libs/logger";
import {middyfy} from '@libs/lambda';
import {StatusCodes} from "http-status-codes";

const log = getLogger();

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const userId: string = event.requestContext.authorizer.principalId;
  log.info(`Handler: create userId: ${userId}`);

  try {
    const result = await businessLogic.create(event.body, userId);
    return formatJSONResponse(result, StatusCodes.CREATED);
  } catch (e) {
    return formatJSONResponse(e.message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

export const main = middyfy(handler);
