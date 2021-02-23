import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from 'http-status-codes';
import {getLogger} from "@libs/logger";
import businessLogic from "../../businessLogic/bussinessLogicImp";
import {formatJSONResponse} from "@libs/apiGateway";

const log = getLogger();

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId: string = event.requestContext.authorizer.principalId;
  const todoId: string = event.pathParameters.todoId;
  log.info(`Handler: generateUploadURL ${JSON.stringify({userId, todoId}, null, 4)}`);

  try {
    const result = await businessLogic.updateImage(userId, todoId);
    return formatJSONResponse(result);
  } catch (e) {
    return formatJSONResponse(e.message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}
//
// export const main = middy(handler);
  // .use(
  //   cors({
  //     credentials: true,
  //   })
  // );
