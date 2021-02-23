import type {AWS} from '@serverless/typescript';

import Auth from './src/functions/auth/aut0Authorizer';
import CreateMarket from './src/functions/createMarket';
import DeleteMarket from './src/functions/deleteMarket';
import GenerateUploadUrl from './src/functions/generateUploadUrl';
import GetMarket from './src/functions/getMarket';
import GetMarkets from './src/functions/getMarkets';
import UpdateMarket from './src/functions/updateMarket';

const serverlessConfiguration: AWS = {
  service: 'project-final',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    'serverless-offline': {port: 3003},
    dynamodb: {
      stages: ['dev'],
      start: {
        "port": 8000,
        "inMemory": true,
        "migrate": true
      }
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dynamodb-local',
    'serverless-iam-roles-per-function',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      MARKET_TABLE: 'Market-${self:provider.stage}',
      IMAGES_S3_BUCKET: 'jhon-final-project-images-${self:provider.stage}',
      AUTH_0_SECRET_ID: 'Auth0Secret-${self:provider.stage}',
      AUTH_0_SECRET_FIELD: 'auth0Secret',
      SIGNED_URL_EXPIRATION: '900',
    },
    tracing: {
      lambda: true,
      apiGateway: true,
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      AttachmentsBucket: {
        "Type": "AWS::S3::Bucket",
        "Properties": {
          BucketName: "${self:provider.environment.IMAGES_S3_BUCKET}",
          CorsConfiguration: {
            "CorsRules": [
              {
                "AllowedOrigins": [
                  "*"
                ],
                "AllowedHeaders": [
                  "*"
                ],
                "AllowedMethods": [
                  "GET",
                  "PUT",
                  "POST",
                  "DELETE",
                  "HEAD"
                ],
                "MaxAge": 3000
              }
            ]
          }
        }
      },
      BucketPolicy: {
        "Type": "AWS::S3::BucketPolicy",
        "Properties": {
          "PolicyDocument": {
            "Id": "MyPolicy",
            "Version": "2012-10-17",
            "Statement": [
              {
                "Sid": "PublicReadForGetBucketObjects",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*"
              }
            ]
          },
          "Bucket": {Ref: "AttachmentsBucket"},
        },
      },
      MoviesDynamoDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              'AttributeType': 'S'
            },
            {
              AttributeName: 'id',
              'AttributeType': 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'id',
              KeyType: 'RANGE'
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: '${self:provider.environment.MARKET_TABLE}'
        }
      },
      KMSKey: {
        "Type": "AWS::KMS::Key",
        "Properties": {
          "Description": "KMS key to encrypt Auth0 secret",
          "KeyPolicy": {
            "Version": "2012-10-17",
            "Id": "key-default-1",
            "Statement": [
              {
                "Sid": "Allow administration of the key",
                "Effect": "Allow",
                "Principal": {
                  "AWS": {
                    "Fn::Join": [
                      ":",
                      [
                        "arn:aws:iam:",
                        {
                          "Ref": "AWS::AccountId"
                        },
                        "root"
                      ]
                    ]
                  }
                },
                "Action": [
                  "kms:*"
                ],
                "Resource": "*"
              }
            ]
          }
        }
      },
      KMSKeyAlias: {
        "Type": "AWS::KMS::Alias",
        "Properties": {
          "AliasName": "alias/auth0Key-${self:provider.stage}",
          "TargetKeyId": {Ref: 'KMSKey'},
        }
      },
      "Auth0Secret": {
        "Type": "AWS::SecretsManager::Secret",
        "Properties": {
          "Name": "${self:provider.environment.AUTH_0_SECRET_ID}",
          "Description": "Auth0 secret",
          "KmsKeyId": {Ref: 'KMSKey'}
        }
      }
    }
  },
  functions: {
    Auth,
    CreateMarket,
    DeleteMarket,
    GenerateUploadUrl,
    GetMarket,
    GetMarkets,
    UpdateMarket,
  }
}

module.exports = serverlessConfiguration;
