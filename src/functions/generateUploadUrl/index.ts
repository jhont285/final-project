export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'markets/{marketId}/attachment',
        cors: true,
        authorizer: 'Auth',
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['s3:PutObject'],
      Resource: 'arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'
    },
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:GetItem',
        'dynamodb:UpdateItem'
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.MARKET_TABLE}',
    },
  ],
};
