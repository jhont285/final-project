import schema from '../../libs/schema/movieInput';

export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
        path: 'markets/{marketId}',
        cors: true,
        authorizer: 'Auth',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.MARKET_TABLE}',
    },
  ],
};
