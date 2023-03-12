export const replyToPostSchema = {
  tags: ['Comments'],
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['slug'],
    properties: {
      slug: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      comment: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'Reply successfully saved',
    },
    400: {
      type: 'object',
      description: 'Bad Request',
      properties: {
        statusCode: {
          type: 'number',
          const: 400,
        },
        error: {
          type: 'string',
          const: 'Bad Request',
        },
        message: {
          type: 'string',
        },
      },
    },
    401: {
      type: 'object',
      description: 'Unauthorized',
      properties: {
        statusCode: {
          type: 'number',
          const: 401,
        },
        error: {
          type: 'string',
          const: 'Unauthorized',
        },
        message: {
          type: 'string',
          const: 'Unauthorized',
        },
      },
    },
    404: {
      type: 'object',
      description: 'Not found',
      properties: {
        statusCode: {
          type: 'number',
          const: 404,
        },
        error: {
          type: 'string',
          const: 'Not found',
        },
        message: {
          type: 'string',
        },
      },
    },
  },
};
