export const createPostSchema = {
  tags: ['Posts'],
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: { type: 'string' },
      text: { type: 'string' },
      postType: { type: 'string' },
      link: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'Post successfully created',
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
