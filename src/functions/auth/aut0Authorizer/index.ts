export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['secretsmanager:GetSecretValue'],
      Resource: {Ref: 'Auth0Secret'},
    },
    {
      Effect: 'Allow',
      Action: ['kms:Decrypt'],
      Resource: {'Fn::GetAtt': ['KMSKey', 'Arn']},
    },
  ],
}
