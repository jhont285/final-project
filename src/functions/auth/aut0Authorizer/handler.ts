import {CustomAuthorizerEvent, CustomAuthorizerResult} from 'aws-lambda';
import {verify} from 'jsonwebtoken';
import {JwtToken} from './JwtToken';
import middy from '@middy/core';
import secretsManager from '@middy/secrets-manager';
import {getLogger} from '@libs/logger';

const secretId = process.env.AUTH_0_SECRET_ID;
const secretField = process.env.AUTH_0_SECRET_FIELD;
const log = getLogger();

export const main = middy(async (event: CustomAuthorizerEvent, context): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = verifyToken(
      event.authorizationToken,
      context.AUTH0_SECRET[secretField],
    );
    log.info('User was authorized');

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  } catch (e) {
    log.info(`User was not authorized: ${e.message}`);

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
});

function verifyToken(authorizationToken: string, secret: string): JwtToken {
  if (!authorizationToken) {
    throw new Error('No authorization header');
  }

  if (!authorizationToken.toLocaleLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authorization header');
  }

  const split = authorizationToken.split(' ');
  const token = split[1];

  return verify(token, secret) as JwtToken
}

main.use(
  secretsManager({
    cache: true,
    cacheExpiryInMillis: 60000,
    throwOnFailedCall: true,
    secrets: {
      AUTH0_SECRET: secretId
    },
  })
)
