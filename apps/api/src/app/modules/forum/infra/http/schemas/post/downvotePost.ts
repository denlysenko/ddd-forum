export const downvotePostSchema = {
  tags: ['Posts'],
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      slug: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'Post successfully downvoted',
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
    409: {
      type: 'object',
      description: 'Conflict',
      properties: {
        statusCode: {
          type: 'number',
          const: 409,
        },
        error: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
      },
    },
  },
};
