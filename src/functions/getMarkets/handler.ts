import 'source-map-support/register';

import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import {APIGatewayProxyHandler} from "aws-lambda";
import businessLogic from "../../businessLogic/bussinessLogicImp";
import {Market} from "@libs/models/Market";
import {StatusCodes} from "http-status-codes";

const hello: APIGatewayProxyHandler = async (event) => {
  const userId: string = event.requestContext.authorizer.principalId;

  try {
    const movies: Market[] = await businessLogic.getAll(userId);
    return formatJSONResponse(movies);
  } catch (e) {
    return formatJSONResponse(e.message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

export const main = middyfy(hello);
