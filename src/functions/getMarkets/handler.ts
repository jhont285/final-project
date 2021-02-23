import 'source-map-support/register';

import businessLogic from "../../businessLogic/bussinessLogicImp";
import {APIGatewayProxyHandler} from "aws-lambda";
import {formatJSONResponse} from '@libs/apiGateway';
import {Market} from "@libs/models/Market";
import {middyfy} from '@libs/lambda';
import {StatusCodes} from "http-status-codes";

const handler: APIGatewayProxyHandler = async (event) => {
  const userId: string = event.requestContext.authorizer.principalId;

  try {
    const movies: Market[] = await businessLogic.getAll(userId);
    return formatJSONResponse(movies);
  } catch (e) {
    return formatJSONResponse(e.message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

export const main = middyfy(handler);
