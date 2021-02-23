import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from "aws-lambda";
import type {FromSchema} from "json-schema-to-ts";
import {StatusCodes} from "http-status-codes";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export function formatJSONResponse<T>(response: T, statusCode: number = StatusCodes.OK) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
  };
}